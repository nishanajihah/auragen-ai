import React, { useState } from 'react';
import { Menu, X, MessageCircle, Palette, Settings, FolderOpen } from 'lucide-react';

interface MobileNavigationProps {
  viewMode?: 'conversation' | 'moodboard';
  setViewMode?: (mode: 'conversation' | 'moodboard') => void;
  hasMoodboard: boolean;
  onOpenSettings?: () => void;
  onOpenProjectManager?: () => void;
  user?: any;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  viewMode,
  setViewMode,
  hasMoodboard,
  onOpenSettings,
  onOpenProjectManager,
  user
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden fixed bottom-4 right-4 z-40 p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-xl"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
          <div className="absolute bottom-0 left-0 right-0 bg-dark-100/95 backdrop-blur-2xl rounded-t-3xl border-t-2 border-dark-200/40 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark-900">Navigation</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors"
              >
                <X className="w-6 h-6 text-dark-600" />
              </button>
            </div>

            <div className="space-y-4">
              {/* View Toggle */}
              {hasMoodboard && viewMode && setViewMode && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setViewMode('conversation');
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-center space-x-2 p-4 rounded-xl transition-all ${
                      viewMode === 'conversation'
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                        : 'bg-dark-200/50 text-dark-700 hover:bg-dark-300/50'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">Chat</span>
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('moodboard');
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-center space-x-2 p-4 rounded-xl transition-all ${
                      viewMode === 'moodboard'
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                        : 'bg-dark-200/50 text-dark-700 hover:bg-dark-300/50'
                    }`}
                  >
                    <Palette className="w-5 h-5" />
                    <span className="font-medium">Design</span>
                  </button>
                </div>
              )}

              {/* Menu Items */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onOpenProjectManager?.();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-4 bg-dark-200/50 hover:bg-dark-300/50 rounded-xl transition-colors text-left"
                >
                  <FolderOpen className="w-5 h-5 text-dark-600" />
                  <span className="text-dark-700 font-medium">Manage Projects</span>
                </button>

                <button
                  onClick={() => {
                    onOpenSettings?.();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-4 bg-dark-200/50 hover:bg-dark-300/50 rounded-xl transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-dark-600" />
                  <span className="text-dark-700 font-medium">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};