import React from 'react';
import { Copy, Palette, Type, Image, Layers } from 'lucide-react';
import { MoodboardData } from '../types';

interface MoodboardPanelProps {
  moodboard: MoodboardData | null;
  darkMode: boolean;
}

export const MoodboardPanel: React.FC<MoodboardPanelProps> = ({ moodboard, darkMode }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!moodboard) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full glass-morphism flex items-center justify-center">
            <Palette className="w-12 h-12 text-primary-500" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Your Moodboard Awaits</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Start a conversation with AuraGen AI to generate your personalized design inspiration moodboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto conversation-scroll">
      <div className="p-6 space-y-8">
        {/* Vibe Summary */}
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
            {moodboard.vibeSummary}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Your personalized UI vibe
          </p>
        </div>

        {/* Color Palette */}
        <div className="glass-morphism rounded-3xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Color Palette
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {moodboard.colorPalette.colors.map((color, index) => (
              <div key={index} className="group">
                <div 
                  className={`
                    w-full h-20 rounded-xl mb-2 cursor-pointer transition-transform duration-200 hover:scale-105
                    ${darkMode ? 'shadow-[4px_4px_8px_#000000,_-4px_-4px_8px_#1a1a1a]' : 'shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#ffffff]'}
                  `}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.hex)}
                />
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 mb-1">
                    {color.name}
                  </p>
                  <button
                    onClick={() => copyToClipboard(color.hex)}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500 flex items-center space-x-1 mx-auto group-hover:text-primary-500 transition-colors"
                  >
                    <span>{color.hex}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Font Pairing */}
        <div className="glass-morphism rounded-3xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Type className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Font Pairing
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Heading Font</p>
              <div className={`p-4 rounded-xl ${darkMode ? 'neu-morphism-inset-dark' : 'neu-morphism-inset-light'}`}>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">
                  {moodboard.fontPairing.heading.name}
                </p>
                <button
                  onClick={() => copyToClipboard(moodboard.fontPairing.heading.googleFont)}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500 flex items-center space-x-1"
                >
                  <span>{moodboard.fontPairing.heading.googleFont}</span>
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Body Font</p>
              <div className={`p-4 rounded-xl ${darkMode ? 'neu-morphism-inset-dark' : 'neu-morphism-inset-light'}`}>
                <p className="text-base text-gray-800 dark:text-gray-200 mb-1">
                  {moodboard.fontPairing.body.name}
                </p>
                <button
                  onClick={() => copyToClipboard(moodboard.fontPairing.body.googleFont)}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500 flex items-center space-x-1"
                >
                  <span>{moodboard.fontPairing.body.googleFont}</span>
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inspirational Image */}
        <div className="glass-morphism rounded-3xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Image className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Visual Inspiration
            </h3>
          </div>
          <div className={`p-6 rounded-xl ${darkMode ? 'neu-morphism-inset-dark' : 'neu-morphism-inset-light'} text-center`}>
            <div className="w-full h-40 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 flex items-center justify-center mb-4">
              <Image className="w-16 h-16 text-primary-400 opacity-50" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              {moodboard.inspirationalImage.description}
            </p>
            <button
              onClick={() => copyToClipboard(moodboard.inspirationalImage.prompt)}
              className="text-xs text-primary-500 hover:text-primary-600 flex items-center space-x-1 mx-auto"
            >
              <span>Copy AI Image Prompt</span>
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Component Suggestions */}
        <div className="glass-morphism rounded-3xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Layers className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Component Ideas
            </h3>
          </div>
          <div className="space-y-3">
            {moodboard.componentSuggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl ${darkMode ? 'neu-morphism-inset-dark' : 'neu-morphism-inset-light'}`}
              >
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  {suggestion.component}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {suggestion.description}
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-mono">
                  {suggestion.styling}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};