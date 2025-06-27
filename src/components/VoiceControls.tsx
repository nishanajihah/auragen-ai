import React, { useState } from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { VOICE_SETTINGS } from '../utils/constants';

interface VoiceControlsProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  currentVoice: string;
  onVoiceChange: (voiceId: string) => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isEnabled,
  onToggle,
  currentVoice,
  onVoiceChange
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onToggle(!isEnabled)}
          className={`p-2 rounded-xl transition-all ${
            isEnabled 
              ? 'bg-primary-500/20 text-primary-600 hover:bg-primary-500/30' 
              : 'bg-dark-200/50 text-dark-500 hover:bg-dark-300/50'
          }`}
          title={isEnabled ? 'Disable voice responses' : 'Enable voice responses'}
        >
          {isEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-xl bg-dark-200/50 text-dark-500 hover:bg-dark-300/50 transition-all"
          title="Voice settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {showSettings && (
        <div className="absolute top-full right-0 mt-2 bg-dark-100/95 backdrop-blur-2xl rounded-2xl border border-dark-200/40 shadow-2xl p-4 min-w-[200px] z-50">
          <h4 className="font-semibold text-dark-900 mb-3">Voice Settings</h4>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-700">Voice</label>
            <select
              value={currentVoice}
              onChange={(e) => onVoiceChange(e.target.value)}
              className="w-full bg-dark-200/50 border border-dark-300/50 rounded-lg px-3 py-2 text-dark-900 text-sm"
            >
              <option value={VOICE_SETTINGS.DEFAULT_VOICE_ID}>Rachel (Default)</option>
              {VOICE_SETTINGS.ALTERNATIVE_VOICES.map(voice => (
                <option key={voice.id} value={voice.id}>{voice.name}</option>
              ))}
            </select>
          </div>

          <div className="mt-3 pt-3 border-t border-dark-300/30">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => onToggle(e.target.checked)}
                className="rounded border-dark-300"
              />
              <span className="text-sm text-dark-700">Enable voice responses</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};