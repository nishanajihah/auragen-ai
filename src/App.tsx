import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ConversationView } from './components/ConversationView';
import { MoodboardView } from './components/MoodboardView';
import { ProjectManager } from './components/ProjectManager';
import { FontSelectionModal } from './components/FontSelectionModal';
import { SaveProjectModal } from './components/SaveProjectModal';
import { AuthModal } from './components/AuthModal';
import { ExportModal } from './components/ExportModal';
import { SettingsPage } from './components/SettingsPage';
import { VoiceControls } from './components/VoiceControls';
import { LandingPage } from './components/LandingPage';
import { PricingPage } from './components/PricingPage';
import { ErrorPage, NotFoundPage, ServerErrorPage } from './components/ErrorPage';
import { ProjectIndicator } from './components/ProjectIndicator';
import { MobileNavigation } from './components/MobileNavigation';
import { GoogleFontsProvider } from './components/GoogleFontsProvider';
import { RevenueCatProvider, useRevenueCat } from './components/RevenueCatProvider';
import { UsageDashboard } from './components/UsageDashboard';
import { Message, MoodboardData, ProjectData, FontSelectionRequest } from './types';
import { generateAuraResponse, handleRegenerateSection, resetConversation } from './services/mockApi';
import { speakAuraResponse } from './services/elevenlabs';
import { useAuth } from './hooks/useAuth';
import { analytics } from './services/analytics';
import { notifications } from './services/notifications';
import { getUserPlanLimits, checkUsageLimit, getGeminiModel, canUseVoice } from './utils/planRestrictions';
import { VOICE_SETTINGS } from './utils/constants';
import { getEnvironmentInfo } from './services/gemini';

type ViewMode = 'conversation' | 'moodboard';
type AppMode = 'landing' | 'pricing' | 'app' | 'settings' | 'usage' | 'error';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { isPremium, initializeRevenueCat } = useRevenueCat();
  const [appMode, setAppMode] = useState<AppMode>('landing');
  const [errorType, setErrorType] = useState<'404' | '500' | '403' | 'maintenance'>('404');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('auragen-theme');
    return saved ? saved === 'dark' : true;
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [moodboard, setMoodboard] = useState<MoodboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('conversation');
  const [currentProject, setCurrentProject] = useState<string>('Nebula Bloom');
  
  // Modal states
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Modal data
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [fontModalData, setFontModalData] = useState<{
    currentFont: string;
    fontType: 'heading' | 'body';
  } | null>(null);

  // Voice settings
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentVoice, setCurrentVoice] = useState(VOICE_SETTINGS.DEFAULT_VOICE_ID);

  // Settings
  const [userSettings, setUserSettings] = useState({
    displayName: '',
    notifications: {
      email: true,
      browser: true,
      marketing: false
    },
    preferences: {
      autoSave: true,
      voiceResponses: true,
      animationsEnabled: true,
      compactMode: false
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      size: 'medium'
    }
  });

  // Theme persistence
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.add('light');
    }
    
    localStorage.setItem('auragen-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    // Log environment info on startup
    const envInfo = getEnvironmentInfo();
    console.log('AuraGen AI Environment:', envInfo);
    
    if (!envInfo.hasApiKey) {
      notifications.warning(
        'API Configuration',
        'Gemini AI key not configured. Please add your API key to the environment variables.'
      );
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log('User logged in:', user);
      analytics.setUserId(user.id);
      initializeRevenueCat(user.id);
      
      // Load user settings
      const savedSettings = localStorage.getItem(`auragen-settings-${user.id}`);
      if (savedSettings) {
        setUserSettings(JSON.parse(savedSettings));
      }
      
      if (appMode === 'landing' || appMode === 'pricing') {
        console.log('Redirecting to app...');
        setAppMode('app');
        notifications.success('Welcome!', 'You\'re now signed in to AuraGen AI.');
      }
    } else {
      console.log('User logged out');
      if (appMode === 'app' || appMode === 'settings' || appMode === 'usage') {
        setAppMode('landing');
      }
    }
  }, [user, appMode, initializeRevenueCat]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    analytics.trackFeatureUsage('dark_mode_toggle', darkMode ? 'light' : 'dark');
  };

  const handleGetStarted = () => {
    console.log('Get started clicked, user:', user);
    if (user) {
      setAppMode('app');
    } else {
      setAuthMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleSignInClick = () => {
    console.log('Sign in clicked');
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleViewPricing = () => {
    setAppMode('pricing');
  };

  const handleSelectPlan = (plan: 'free' | 'starter' | 'pro') => {
    if (plan === 'free') {
      if (user) {
        setAppMode('app');
      } else {
        setAuthMode('signup');
        setShowAuthModal(true);
      }
    } else {
      // Navigate to pricing page instead of showing modal
      setAppMode('pricing');
    }
  };

  const showErrorPage = (type: '404' | '500' | '403' | 'maintenance') => {
    setErrorType(type);
    setAppMode('error');
  };

  const handleSendMessage = async (content: string) => {
    if (!user) {
      setAuthMode('signup');
      setShowAuthModal(true);
      notifications.warning('Authentication Required', 'Please sign in to start creating with AuraGen AI.');
      return;
    }

    // Check usage limits based on plan
    const planLimits = getUserPlanLimits(user);
    const mockUsageData = { generations: 3 }; // In real app, get from API
    const usageCheck = checkUsageLimit('generations', mockUsageData.generations, user);
    
    if (!usageCheck.allowed) {
      notifications.warning(
        'Usage Limit Reached', 
        `You've reached your daily limit of ${usageCheck.limit} generations. Upgrade to Premium for unlimited access.`
      );
      setAppMode('pricing');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Use appropriate Gemini model based on plan
      const model = getGeminiModel(user);
      const response = await generateAuraResponse(content, user.id, isPremium);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      analytics.trackGeneration(content, true);
      
      // Check if voice is enabled for user's plan
      if (voiceEnabled && userSettings.preferences.voiceResponses && canUseVoice(user)) {
        await speakAuraResponse(response.message, currentVoice);
      }
      
      if (response.moodboard) {
        setMoodboard(response.moodboard);
        notifications.success('Design Generated!', 'Your AI-powered design system is ready to explore.');
        setTimeout(() => setViewMode('moodboard'), 1000);
        
        // Auto-save if enabled
        if (userSettings.preferences.autoSave) {
          // TODO: Implement auto-save
        }
      }
    } catch (error) {
      console.error('Error generating response:', error);
      analytics.trackError('generation_failed', error instanceof Error ? error.message : 'Unknown error');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please check your internet connection and try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      notifications.error('Generation Failed', 'Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setMoodboard(null);
    setViewMode('conversation');
    setCurrentProject('Nebula Bloom');
    resetConversation();
    analytics.trackFeatureUsage('new_conversation');
  };

  const handleRegenerateSection = async (section: string) => {
    if (!user) {
      setAuthMode('signin');
      setShowAuthModal(true);
      notifications.warning('Authentication Required', 'Please sign in to regenerate sections.');
      return;
    }

    // Check usage limits based on plan
    const planLimits = getUserPlanLimits(user);
    const mockUsageData = { generations: 3 }; // In real app, get from API
    const usageCheck = checkUsageLimit('generations', mockUsageData.generations, user);
    
    if (!usageCheck.allowed) {
      notifications.warning(
        'Usage Limit Reached', 
        `You've reached your daily limit of ${usageCheck.limit} generations. Upgrade to Premium for unlimited access.`
      );
      setAppMode('pricing');
      return;
    }

    if (!moodboard) return;
    
    setIsLoading(true);
    try {
      const response = await handleRegenerateSection(section, moodboard, `Regenerate the ${section} section`, user.id, isPremium);
      if (response.moodboard) {
        setMoodboard(response.moodboard);
      }
      
      analytics.trackFeatureUsage('regenerate_section', section);
      
      if (voiceEnabled && userSettings.preferences.voiceResponses && canUseVoice(user)) {
        await speakAuraResponse(response.message, currentVoice);
      }
    } catch (error) {
      console.error('Error regenerating section:', error);
      analytics.trackError('regeneration_failed', section);
      notifications.error('Regeneration Failed', 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = async (projectData: {
    name: string;
    description: string;
    tags: string[];
  }) => {
    if (!user) {
      setAuthMode('signin');
      setShowAuthModal(true);
      notifications.warning('Authentication Required', 'Please sign in to save projects.');
      return;
    }

    // Check usage limits based on plan
    const planLimits = getUserPlanLimits(user);
    const mockUsageData = { projects: 1 }; // In real app, get from API
    const usageCheck = checkUsageLimit('projects', mockUsageData.projects, user);
    
    if (!usageCheck.allowed) {
      notifications.warning(
        'Project Limit Reached', 
        `You've reached your limit of ${usageCheck.limit} saved projects. Upgrade to Premium for unlimited projects.`
      );
      setAppMode('pricing');
      return;
    }

    if (!moodboard) return;
    
    const project: ProjectData = {
      id: Date.now().toString(),
      name: projectData.name,
      description: projectData.description,
      moodboard,
      messages,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: projectData.tags,
      userId: user.id
    };
    
    const savedProjects = JSON.parse(localStorage.getItem('auragen-projects') || '[]');
    savedProjects.push(project);
    localStorage.setItem('auragen-projects', JSON.stringify(savedProjects));
    
    analytics.trackProjectSave(projectData.name, projectData.tags);
    
    setCurrentProject(projectData.name);
    notifications.success('Project Saved', `"${projectData.name}" has been saved successfully.`);
  };

  const handleLoadProject = (project: ProjectData) => {
    const messagesWithDateObjects = (project.messages || []).map((message: any) => ({
      ...message,
      timestamp: new Date(message.timestamp)
    }));
    
    setCurrentProject(project.name);
    setMoodboard(project.moodboard);
    setMessages(messagesWithDateObjects);
    setViewMode('moodboard');
    
    analytics.trackProjectLoad(project.id);
  };

  const handleNewProject = () => {
    if (moodboard || messages.length > 0) {
      const confirm = window.confirm('Are you sure you want to start a new project? Any unsaved changes will be lost.');
      if (!confirm) return;
    }
    startNewConversation();
  };

  const handleFontSelection = (fontType: 'heading' | 'body', currentFont: string) => {
    if (!user) {
      setAuthMode('signin');
      setShowAuthModal(true);
      notifications.warning('Authentication Required', 'Please sign in to change fonts.');
      return;
    }

    setFontModalData({ currentFont, fontType });
    setShowFontModal(true);
  };

  const handleFontSelectionSubmit = async (request: FontSelectionRequest) => {
    setIsLoading(true);
    try {
      const response = await handleRegenerateSection(
        'fonts',
        moodboard!,
        `Change the ${fontModalData?.fontType} font from "${request.currentFont}" because: ${request.reason}. 
         User preferences: ${request.preferences.style} ${request.preferences.category} font with ${request.preferences.mood} mood.`,
        user?.id,
        isPremium
      );
      if (response.moodboard) {
        setMoodboard(response.moodboard);
      }
      
      analytics.trackFeatureUsage('font_change', fontModalData?.fontType);
      
      if (voiceEnabled && userSettings.preferences.voiceResponses && canUseVoice(user)) {
        await speakAuraResponse(response.message, currentVoice);
      }
    } catch (error) {
      console.error('Error updating font:', error);
      analytics.trackError('font_update_failed');
      notifications.error('Font Update Failed', 'Please try again.');
    } finally {
      setIsLoading(false);
      setShowFontModal(false);
      setFontModalData(null);
    }
  };

  const handleExport = () => {
    if (!user) {
      setAuthMode('signin');
      setShowAuthModal(true);
      notifications.warning('Authentication Required', 'Please sign in to export designs.');
      return;
    }

    // Check usage limits based on plan
    const planLimits = getUserPlanLimits(user);
    const mockUsageData = { exports: 1 }; // In real app, get from API
    const usageCheck = checkUsageLimit('exports', mockUsageData.exports, user);
    
    if (!usageCheck.allowed) {
      notifications.warning(
        'Export Limit Reached', 
        `You've reached your daily limit of ${usageCheck.limit} exports. Upgrade to Premium for unlimited exports.`
      );
      setAppMode('pricing');
      return;
    }

    setShowExportModal(true);
  };

  const handleExportComplete = () => {
    analytics.trackFeatureUsage('export_completed');
  };

  const handleAuthSuccess = (userData: any) => {
    console.log('Auth success, user data:', userData);
    analytics.trackSignIn('email');
    
    setShowAuthModal(false);
    
    setTimeout(() => {
      setAppMode('app');
      notifications.success('Welcome!', 'You\'re now signed in to AuraGen AI.');
    }, 100);
  };

  const handlePremiumSuccess = () => {
    analytics.trackPremiumUpgrade('monthly');
    notifications.success('Premium Activated!', 'You now have unlimited access to all features.');
  };

  const handleOpenSettings = () => {
    setAppMode('settings');
  };

  const handleOpenUsageDashboard = () => {
    setAppMode('usage');
  };

  const handleSaveSettings = (settings: any) => {
    setUserSettings(settings);
    if (user) {
      localStorage.setItem(`auragen-settings-${user.id}`, JSON.stringify(settings));
    }
    notifications.success('Settings Saved', 'Your preferences have been updated.');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen welcome-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-600 text-sm sm:text-base">Loading AuraGen AI...</p>
        </div>
      </div>
    );
  }

  if (appMode === 'error') {
    const errorProps = {
      onGoHome: () => setAppMode('landing')
    };

    switch (errorType) {
      case '404':
        return <NotFoundPage {...errorProps} />;
      case '500':
        return <ServerErrorPage {...errorProps} />;
      case '403':
        return (
          <ErrorPage
            errorCode="403"
            title="Access Forbidden"
            message="You don't have permission to access this resource."
            {...errorProps}
          />
        );
      case 'maintenance':
        return (
          <ErrorPage
            errorCode="503"
            title="Under Maintenance"
            message="We're currently performing scheduled maintenance. We'll be back shortly!"
            {...errorProps}
          />
        );
      default:
        return <NotFoundPage {...errorProps} />;
    }
  }

  if (appMode === 'landing') {
    return (
      <>
        <LandingPage 
          onGetStarted={handleGetStarted}
          onSignIn={handleSignInClick}
          onViewPricing={handleViewPricing}
        />
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          mode={authMode}
        />
      </>
    );
  }

  if (appMode === 'pricing') {
    return (
      <>
        <PricingPage 
          onSelectPlan={handleSelectPlan}
          onBack={() => setAppMode('landing')}
        />
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          mode={authMode}
        />
      </>
    );
  }

  if (appMode === 'settings') {
    return (
      <Layout
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        user={user}
        isPremium={isPremium}
        showHeader={false}
      >
        <SettingsPage
          user={user}
          isPremium={isPremium}
          onBack={() => setAppMode('app')}
          onSave={handleSaveSettings}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </Layout>
    );
  }

  if (appMode === 'usage') {
    return (
      <Layout
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        user={user}
        isPremium={isPremium}
        showHeader={true}
        onOpenSettings={handleOpenSettings}
        onAuthClick={(mode) => {
          setAuthMode(mode);
          setShowAuthModal(true);
        }}
      >
        <div className="py-8">
          <ResponsiveContainer>
            <div className="flex items-center space-x-3 mb-6">
              <button
                onClick={() => setAppMode('app')}
                className="p-2 rounded-lg hover:bg-dark-200/50 transition-colors border border-dark-300/30"
              >
                <ArrowLeft className="w-5 h-5 text-dark-600" />
              </button>
              <h1 className="text-2xl font-bold text-dark-900">Usage Dashboard</h1>
            </div>
            
            <UsageDashboard 
              user={user} 
              onUpgradeClick={() => setAppMode('pricing')} 
            />
          </ResponsiveContainer>
        </div>
      </Layout>
    );
  }

  if (!user) {
    console.log('No user, redirecting to landing...');
    if (appMode === 'app') {
      setAppMode('landing');
    }
    return (
      <>
        <LandingPage 
          onGetStarted={handleGetStarted}
          onSignIn={handleSignInClick}
          onViewPricing={handleViewPricing}
        />
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          mode={authMode}
        />
      </>
    );
  }

  console.log('Showing main app for user:', user);
  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      viewMode={viewMode}
      setViewMode={setViewMode}
      hasMoodboard={!!moodboard}
      user={user}
      onAuthClick={(mode) => {
        setAuthMode(mode);
        setShowAuthModal(true);
      }}
      onOpenSettings={handleOpenSettings}
      onOpenProjectManager={() => setShowProjectManager(true)}
      isPremium={isPremium}
      onShowUsageDashboard={handleOpenUsageDashboard}
      voiceControls={
        <VoiceControls
          isEnabled={voiceEnabled}
          onToggle={setVoiceEnabled}
          currentVoice={currentVoice}
          onVoiceChange={setCurrentVoice}
        />
      }
    >
      <div className="py-4 sm:py-6">
        {/* Project Indicator - Mobile Responsive */}
        {moodboard && (
          <div className="mb-4 sm:mb-6">
            <ProjectIndicator
              projectName={currentProject || 'Untitled Project'}
              vibeSummary={moodboard.vibeSummary}
              onOpenProjectManager={() => setShowProjectManager(true)}
              className="sm:max-w-md"
            />
          </div>
        )}

        {/* Main Content */}
        {viewMode === 'conversation' ? (
          <ConversationView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            darkMode={darkMode}
            hasMoodboard={!!moodboard}
            onViewMoodboard={() => setViewMode('moodboard')}
            user={user}
          />
        ) : (
          <MoodboardView
            moodboard={moodboard}
            darkMode={darkMode}
            onRegenerateSection={handleRegenerateSection}
            isLoading={isLoading}
            onBackToChat={() => setViewMode('conversation')}
            projectName={currentProject || 'Untitled Project'}
            onFontSelection={handleFontSelection}
            onOpenProjectManager={() => setShowProjectManager(true)}
            onExport={handleExport}
          />
        )}

        {/* Mobile Navigation */}
        <MobileNavigation
          viewMode={viewMode}
          setViewMode={setViewMode}
          hasMoodboard={!!moodboard}
          onOpenSettings={handleOpenSettings}
          onOpenProjectManager={() => setShowProjectManager(true)}
          user={user}
        />

        {/* Footer */}
        <footer className={`text-center py-6 text-xs sm:text-sm mt-12 ${darkMode ? 'text-dark-500' : 'text-gray-500'}`}>
          <p>
            AuraGen AI - Transform your design vision into reality •{' '}
            <button 
              onClick={startNewConversation}
              className="text-primary-500 hover:text-primary-600 underline transition-colors font-semibold"
            >
              Start New Conversation
            </button>
          </p>
        </footer>
      </div>

      {/* Modals */}
      <ProjectManager
        isOpen={showProjectManager}
        onClose={() => setShowProjectManager(false)}
        currentProject={currentProject}
        currentMoodboard={moodboard}
        currentMessages={messages}
        onSaveProject={handleSaveProject}
        onLoadProject={handleLoadProject}
        onNewProject={handleNewProject}
        onExport={handleExport}
        user={user}
      />

      <SaveProjectModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={(projectData) => {
          handleSaveProject(projectData);
          setShowSaveModal(false);
        }}
        currentProject={currentProject}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        mode={authMode}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        moodboard={moodboard}
        projectName={currentProject || 'Untitled Project'}
        onExport={handleExportComplete}
      />

      {fontModalData && (
        <FontSelectionModal
          isOpen={showFontModal}
          onClose={() => {
            setShowFontModal(false);
            setFontModalData(null);
          }}
          onSelect={handleFontSelectionSubmit}
          currentFont={fontModalData.currentFont}
          fontType={fontModalData.fontType}
        />
      )}
    </Layout>
  );
}

function App() {
  return (
    <GoogleFontsProvider>
      <RevenueCatProvider>
        <AppContent />
      </RevenueCatProvider>
    </GoogleFontsProvider>
  );
}

export default App;