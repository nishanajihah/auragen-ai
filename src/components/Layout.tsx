import React from 'react';
import { Header } from './Header';
import { NotificationContainer } from './NotificationContainer';

interface LayoutProps {
  children: React.ReactNode;
  user?: any;
  isPremium?: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
  viewMode?: 'conversation' | 'moodboard';
  setViewMode?: (mode: 'conversation' | 'moodboard') => void;
  hasMoodboard?: boolean;
  onAuthClick?: (mode: 'signin' | 'signup') => void;
  onOpenSettings?: () => void;
  onOpenProjectManager?: () => void;
  voiceControls?: React.ReactNode;
  showHeader?: boolean;
  onShowUsageDashboard?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  isPremium = false,
  darkMode,
  toggleDarkMode,
  viewMode,
  setViewMode,
  hasMoodboard = false,
  onAuthClick,
  onOpenSettings,
  onOpenProjectManager,
  voiceControls,
  showHeader = true,
  onShowUsageDashboard
}) => {
  return (
    <div className={`min-h-screen welcome-gradient ${!darkMode ? 'light' : ''} transition-all duration-700`}>
      {showHeader && (
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          viewMode={viewMode}
          setViewMode={setViewMode}
          hasMoodboard={hasMoodboard}
          user={user}
          onAuthClick={onAuthClick}
          onOpenSettings={onOpenSettings}
          onOpenProjectManager={onOpenProjectManager}
          isPremium={isPremium}
          voiceControls={voiceControls}
          onShowUsageDashboard={onShowUsageDashboard}
        />
      )}
      
      {/* Main Content Container */}
      <main className="relative">
        <div className="container-responsive">
          {children}
        </div>
      </main>

      <NotificationContainer />
    </div>
  );
};