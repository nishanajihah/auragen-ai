import React, { useState } from 'react';
import { Moon, Sun, Sparkles, MessageCircle, Palette, User, LogOut, Settings, Crown, BarChart3, FolderOpen, ChevronDown, Zap, Download } from 'lucide-react';
import { signOut } from '../services/supabase';
import { checkFeatureAccess } from '../utils/helpers';

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
  isPremium = false
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowProfileMenu(false);
  };

  // Get usage stats for display in profile menu
  const generationAccess = user ? checkFeatureAccess('generation', isPremium, user.id) : null;
  const projectAccess = user ? checkFeatureAccess('project', isPremium, user.id) : null;
  const exportAccess = user ? checkFeatureAccess('export', isPremium, user.id) : null;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-dark-50/95 border-b border-primary-500/20 shadow-2xl">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-xl">
                <Sparkles className="w-6 h-6 text-dark-50 animate-pulse" />
              </div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
              AuraGen AI
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Voice Controls */}
            {voiceControls}

            {/* View Toggle - Mobile Responsive */}
            {user && hasMoodboard && viewMode && setViewMode && (
              <div className="hidden sm:flex items-center bg-dark-100/80 backdrop-blur-xl rounded-xl p-1 border border-primary-500/30 shadow-lg">
                <button
                  onClick={() => setViewMode('conversation')}
                  className={`
                    flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-xs
                    ${viewMode === 'conversation' 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-dark-50 shadow-md' 
                      : 'text-dark-600 hover:text-dark-800 hover:bg-dark-200/50'
                    }
                  `}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden md:inline">Chat</span>
                </button>
                <button
                  onClick={() => setViewMode('moodboard')}
                  className={`
                    flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-xs
                    ${viewMode === 'moodboard' 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-dark-50 shadow-md' 
                      : 'text-dark-600 hover:text-dark-800 hover:bg-dark-200/50'
                    }
                  `}
                >
                  <Palette className="w-4 h-4" />
                  <span className="hidden md:inline">Design</span>
                </button>
              </div>
            )}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative p-2 rounded-xl bg-dark-100/80 hover:bg-dark-200/80 border border-primary-500/30 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-xl group"
            >
              <div className="relative w-4 h-4">
                <Sun className={`
                  absolute inset-0 w-4 h-4 text-amber-500 transition-all duration-500 ease-in-out
                  ${darkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
                `} />
                <Moon className={`
                  absolute inset-0 w-4 h-4 text-primary-400 transition-all duration-500 ease-in-out
                  ${darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
                `} />
              </div>
            </button>

            {/* User Profile with Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 bg-dark-200/50 rounded-xl px-3 py-2 border border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-2">
                    {isPremium ? (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <User className="w-4 h-4 text-primary-500" />
                    )}
                    <span className="text-sm font-medium text-dark-700 max-w-24 truncate hidden sm:inline">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  <ChevronDown className={`w-3 h-3 text-dark-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Enhanced Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-dark-100/95 backdrop-blur-2xl rounded-2xl border border-dark-200/40 shadow-2xl p-2 z-50">
                    {/* Account Info */}
                    <div className="p-4 border-b border-dark-300/30 mb-2">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-lg ${isPremium ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}>
                          {isPremium ? <Crown className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <p className="font-semibold text-dark-900">{user.email}</p>
                          <p className="text-sm text-dark-600">
                            {isPremium ? 'Premium Account' : 'Free Account'}
                          </p>
                        </div>
                      </div>

                      {/* Usage Stats in Profile */}
                      <div className="bg-dark-200/30 rounded-xl p-3 space-y-2">
                        <h4 className="text-sm font-semibold text-dark-800 mb-2">Today's Usage</h4>
                        
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary-600">
                              {generationAccess?.limit === -1 ? '∞' : `${generationAccess?.used || 0}/${generationAccess?.limit || 0}`}
                            </div>
                            <div className="text-dark-600 flex items-center justify-center space-x-1">
                              <Zap className="w-3 h-3" />
                              <span>Gens</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {projectAccess?.limit === -1 ? '∞' : `${projectAccess?.used || 0}/${projectAccess?.limit || 0}`}
                            </div>
                            <div className="text-dark-600 flex items-center justify-center space-x-1">
                              <FolderOpen className="w-3 h-3" />
                              <span>Projects</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {exportAccess?.limit === -1 ? '∞' : `${exportAccess?.used || 0}/${exportAccess?.limit || 0}`}
                            </div>
                            <div className="text-dark-600 flex items-center justify-center space-x-1">
                              <Download className="w-3 h-3" />
                              <span>Exports</span>
                            </div>
                          </div>
                        </div>

                        {!isPremium && (
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              // Trigger premium modal
                              window.dispatchEvent(new CustomEvent('show-premium-modal'));
                            }}
                            className="w-full mt-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
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
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-dark-200/50 transition-colors text-left"
                      >
                        <FolderOpen className="w-4 h-4 text-dark-600" />
                        <span className="text-sm text-dark-700">Manage Projects</span>
                      </button>

                      <button
                        onClick={() => {
                          // TODO: Open usage stats
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-dark-200/50 transition-colors text-left"
                      >
                        <BarChart3 className="w-4 h-4 text-dark-600" />
                        <span className="text-sm text-dark-700">Usage Statistics</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenSettings?.();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-dark-200/50 transition-colors text-left"
                      >
                        <Settings className="w-4 h-4 text-dark-600" />
                        <span className="text-sm text-dark-700">Settings</span>
                      </button>

                      <div className="border-t border-dark-300/30 pt-2 mt-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-500">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onAuthClick?.('signin')}
                  className="bg-dark-200/50 hover:bg-dark-300/50 text-dark-700 px-4 py-2 rounded-lg font-medium transition-all border border-dark-300/30 hover:border-primary-500/50 text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onAuthClick?.('signup')}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl text-sm"
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