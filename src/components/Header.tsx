import React, { useState } from 'react';
import { Moon, Sun, Sparkles, MessageCircle, Palette, User, LogOut, Settings, Crown, BarChart3, FolderOpen, ChevronDown, Zap, Download, Shield, Lock } from 'lucide-react';
import { signOut, isDeveloper, getUserTier } from '../services/supabase';
import { getUserPlanLimits, checkUsageLimit, getPlanDisplayName } from '../utils/planRestrictions';
import { analytics } from '../services/analytics';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  viewMode?: 'conversation' | 'moodboard';
  setViewMode?: (mode: 'conversation' | 'moodboard') => void;
  hasMoodboard: boolean;
  user?: any;
  onAuthClick?: (mode: 'signin' | 'signup') => void;
  voiceControls?: React.ReactNode;
  onOpenSettings?: () => void;
  onOpenProjectManager?: () => void;
  isPremium?: boolean;
  onShowUsageDashboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  darkMode, 
  toggleDarkMode, 
  viewMode, 
  setViewMode, 
  hasMoodboard,
  user,
  onAuthClick,
  voiceControls,
  onOpenSettings,
  onOpenProjectManager,
  isPremium = false,
  onShowUsageDashboard
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSignOut = async () => {
    analytics.track('user_sign_out_initiated');
    await signOut();
    setShowProfileMenu(false);
    analytics.track('user_signed_out_success');
  };

  // Get user plan info
  const userTier = getUserTier(user);
  const planName = getPlanDisplayName(userTier);
  const isUserDeveloper = isDeveloper(user);

  // Mock usage data - in real app, this would come from props or context
  const mockUsageData = {
    generations: 3,
    projects: 1,
    exports: 1,
    voiceCharacters: 500
  };

  const planLimits = getUserPlanLimits(user);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-dark-50/95 border-b border-primary-500/20 shadow-2xl">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg blur-lg opacity-75 animate-pulse"></div>
              <div className="relative p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-xl">
                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-dark-50 animate-pulse" />
              </div>
            </div>
            <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
              AuraGen AI
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Voice Controls */}
            {voiceControls}

            {/* View Toggle - Mobile Responsive */}
            {user && hasMoodboard && viewMode && setViewMode && (
              <div className="hidden sm:flex items-center bg-dark-100/80 backdrop-blur-xl rounded-lg p-1 border border-primary-500/30 shadow-lg">
                <button
                  onClick={() => setViewMode('conversation')}
                  className={`
                    flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded transition-all duration-300 font-medium text-xs sm:text-sm
                    ${viewMode === 'conversation' 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-dark-50 shadow-md' 
                      : 'text-dark-600 hover:text-dark-800 hover:bg-dark-200/50'
                    }
                  `}
                >
                  <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden md:inline">Chat</span>
                </button>
                <button
                  onClick={() => setViewMode('moodboard')}
                  className={`
                    flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded transition-all duration-300 font-medium text-xs sm:text-sm
                    ${viewMode === 'moodboard' 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-dark-50 shadow-md' 
                      : 'text-dark-600 hover:text-dark-800 hover:bg-dark-200/50'
                    }
                  `}
                >
                  <Palette className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden md:inline">Design</span>
                </button>
              </div>
            )}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative p-1.5 sm:p-2 rounded-lg bg-dark-100/80 hover:bg-dark-200/80 border border-primary-500/30 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-xl group"
            >
              <div className="relative w-3 sm:w-4 h-3 sm:h-4">
                <Sun className={`
                  absolute inset-0 w-3 sm:w-4 h-3 sm:h-4 text-amber-500 transition-all duration-500 ease-in-out
                  ${darkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
                `} />
                <Moon className={`
                  absolute inset-0 w-3 sm:w-4 h-3 sm:h-4 text-primary-400 transition-all duration-500 ease-in-out
                  ${darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
                `} />
              </div>
            </button>

            {/* User Profile with Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    analytics.track('profile_menu_toggled', { state: !showProfileMenu ? 'opened' : 'closed' });
                  }}
                  className="flex items-center space-x-1 sm:space-x-2 bg-dark-200/50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {isUserDeveloper ? (
                      <Crown className="w-3 sm:w-4 h-3 sm:h-4 text-orange-500" />
                    ) : isPremium ? (
                      <Crown className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-500" />
                    ) : (
                      <User className="w-3 sm:w-4 h-3 sm:h-4 text-primary-500" />
                    )}
                    <span className="text-xs sm:text-sm font-medium text-dark-700 max-w-16 sm:max-w-24 truncate hidden sm:inline">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  <ChevronDown className={`w-2 sm:w-3 h-2 sm:h-3 text-dark-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Enhanced Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-dark-100/95 backdrop-blur-2xl rounded-xl border border-dark-200/40 shadow-2xl p-2 z-50">
                    {/* Account Info */}
                    <div className="p-3 sm:p-4 border-b border-dark-300/30 mb-2">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg ${
                          isUserDeveloper ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                          isPremium ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                          'bg-gradient-to-r from-blue-500 to-indigo-600'
                        }`}>
                          {isUserDeveloper ? (
                            <Crown className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                          ) : isPremium ? (
                            <Crown className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                          ) : (
                            <User className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-dark-900 text-sm">{user.email}</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-xs text-dark-600">{planName} Plan</p>
                            {isUserDeveloper && (
                              <span className="text-xs bg-orange-500/20 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
                                Developer
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Usage Stats in Profile */}
                      <div className="bg-dark-200/30 rounded-lg p-2 sm:p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-dark-800">Today's Usage</h4>
                          {onShowUsageDashboard && (
                            <button
                              onClick={() => {
                                onShowUsageDashboard();
                                setShowProfileMenu(false);
                                analytics.track('usage_dashboard_opened_from_profile');
                              }}
                              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                            >
                              View Details
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-sm font-bold text-primary-600">
                              {planLimits.generations.daily === -1 ? '∞' : `${mockUsageData.generations}/${planLimits.generations.daily}`}
                            </div>
                            <div className="text-dark-600 flex items-center justify-center space-x-1">
                              <Zap className="w-2 h-2" />
                              <span>Gens</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold text-blue-600">
                              {planLimits.projects.total === -1 ? '∞' : `${mockUsageData.projects}/${planLimits.projects.total}`}
                            </div>
                            <div className="text-dark-600 flex items-center justify-center space-x-1">
                              <FolderOpen className="w-2 h-2" />
                              <span>Projects</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold text-green-600">
                              {planLimits.exports.daily === -1 ? '∞' : `${mockUsageData.exports}/${planLimits.exports.daily}`}
                            </div>
                            <div className="text-dark-600 flex items-center justify-center space-x-1">
                              <Download className="w-2 h-2" />
                              <span>Exports</span>
                            </div>
                          </div>
                        </div>

                        {!isUserDeveloper && !isPremium && (
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              // Navigate to pricing page instead of showing modal
                              window.location.href = '/pricing';
                              analytics.track('upgrade_button_clicked', { location: 'profile_menu' });
                            }}
                            className="w-full mt-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-xs"
                          >
                            Upgrade to Premium
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          onOpenProjectManager?.();
                          setShowProfileMenu(false);
                          analytics.track('project_manager_opened_from_profile');
                        }}
                        className="w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-dark-200/50 transition-colors text-left"
                      >
                        <FolderOpen className="w-3 sm:w-4 h-3 sm:h-4 text-dark-600" />
                        <span className="text-xs sm:text-sm text-dark-700">Manage Projects</span>
                      </button>

                      {onShowUsageDashboard && (
                        <button
                          onClick={() => {
                            onShowUsageDashboard();
                            setShowProfileMenu(false);
                            analytics.track('usage_dashboard_opened_from_profile');
                          }}
                          className="w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-dark-200/50 transition-colors text-left"
                        >
                          <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4 text-dark-600" />
                          <span className="text-xs sm:text-sm text-dark-700">Usage Statistics</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onOpenSettings?.();
                          setShowProfileMenu(false);
                          analytics.track('settings_opened_from_profile');
                        }}
                        className="w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-dark-200/50 transition-colors text-left"
                      >
                        <Settings className="w-3 sm:w-4 h-3 sm:h-4 text-dark-600" />
                        <span className="text-xs sm:text-sm text-dark-700">Settings</span>
                      </button>

                      {/* Security Settings */}
                      <button
                        onClick={() => {
                          onOpenSettings?.(); // We'll navigate to settings with security tab active
                          setShowProfileMenu(false);
                          analytics.track('security_settings_opened_from_profile');
                        }}
                        className="w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-dark-200/50 transition-colors text-left"
                      >
                        <Shield className="w-3 sm:w-4 h-3 sm:h-4 text-dark-600" />
                        <span className="text-xs sm:text-sm text-dark-700">Security</span>
                        {user.mfa_enabled && (
                          <span className="ml-auto text-xs bg-green-500/20 text-green-600 px-1.5 py-0.5 rounded-full">
                            MFA On
                          </span>
                        )}
                      </button>

                      <div className="border-t border-dark-300/30 pt-1 mt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut className="w-3 sm:w-4 h-3 sm:h-4 text-red-500" />
                          <span className="text-xs sm:text-sm text-red-500">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    onAuthClick?.('signin');
                    analytics.track('sign_in_button_clicked', { location: 'header' });
                  }}
                  className="bg-dark-200/50 hover:bg-dark-300/50 text-dark-700 px-3 py-1.5 rounded-lg font-medium transition-all border border-dark-300/30 hover:border-primary-500/50 text-xs"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onAuthClick?.('signup');
                    analytics.track('sign_up_button_clicked', { location: 'header' });
                  }}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl text-xs"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};