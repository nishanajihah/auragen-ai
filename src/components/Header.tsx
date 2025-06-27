import React from 'react';
import { Moon, Sun, Sparkles, MessageCircle, Palette, User, LogOut } from 'lucide-react';
import { signOut } from '../services/supabase';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  viewMode: 'conversation' | 'moodboard';
  setViewMode: (mode: 'conversation' | 'moodboard') => void;
  hasMoodboard: boolean;
  user?: any;
  onAuthClick: (mode: 'signin' | 'signup') => void;
  voiceControls?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ 
  darkMode, 
  toggleDarkMode, 
  viewMode, 
  setViewMode, 
  hasMoodboard,
  user,
  onAuthClick,
  voiceControls
}) => {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-dark-50/95 border-b border-primary-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-2xl">
                <Sparkles className="w-8 h-8 text-dark-50 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                AuraGen AI
              </h1>
              <p className="text-sm font-medium text-dark-600">
                Conversational UI Design Assistant
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Voice Controls */}
            {voiceControls}

            {/* View Toggle - Only show if user is logged in and has moodboard */}
            {user && hasMoodboard && (
              <div className="flex items-center bg-dark-100/80 backdrop-blur-xl rounded-2xl p-2 border border-primary-500/30 shadow-lg">
                <button
                  onClick={() => setViewMode('conversation')}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 font-semibold text-sm relative overflow-hidden
                    ${viewMode === 'conversation' 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-dark-50 shadow-lg transform scale-105' 
                      : 'text-dark-600 hover:text-dark-800 hover:bg-dark-200/50'
                    }
                  `}
                >
                  {viewMode === 'conversation' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  <div className="relative flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat</span>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('moodboard')}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 font-semibold text-sm relative overflow-hidden
                    ${viewMode === 'moodboard' 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-dark-50 shadow-lg transform scale-105' 
                      : 'text-dark-600 hover:text-dark-800 hover:bg-dark-200/50'
                    }
                  `}
                >
                  {viewMode === 'moodboard' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  <div className="relative flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>Moodboard</span>
                  </div>
                </button>
              </div>
            )}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative p-4 rounded-2xl bg-dark-100/80 hover:bg-dark-200/80 border border-primary-500/30 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-xl group"
            >
              <div className="relative w-6 h-6">
                <Sun className={`
                  absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-500 ease-in-out
                  ${darkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
                `} />
                <Moon className={`
                  absolute inset-0 w-6 h-6 text-primary-400 transition-all duration-500 ease-in-out
                  ${darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
                `} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* User Authentication */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-dark-200/50 rounded-xl px-4 py-3 border border-primary-500/20">
                  <User className="w-5 h-5 text-primary-500" />
                  <span className="text-sm font-medium text-dark-700">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-3 rounded-xl hover:bg-dark-200/50 transition-colors border border-dark-300/30 hover:border-red-500/50 group"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5 text-dark-600 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onAuthClick('signin')}
                  className="bg-dark-200/50 hover:bg-dark-300/50 text-dark-700 px-6 py-3 rounded-xl font-medium transition-all border border-dark-300/30 hover:border-primary-500/50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onAuthClick('signup')}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
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