import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, Mic, MicOff, Volume2, VolumeX, 
  Settings, BarChart3, Download, Trash2, RefreshCw,
  Zap, DollarSign, Clock, TrendingUp
} from 'lucide-react';
import { aiConversationSystem, ConversationMode, UsageMetrics } from '../services/aiConversationSystem';
import { Button } from './ComponentLibrary/Button';
import { Card } from './ComponentLibrary/Card';
import { Modal } from './ComponentLibrary/Modal';
import { Badge } from './ComponentLibrary/Badge';
import { Alert } from './ComponentLibrary/Alert';

interface AIConversationInterfaceProps {
  user: any;
  isPremium: boolean;
  onResponse: (response: any) => void;
  className?: string;
}

export const AIConversationInterface: React.FC<AIConversationInterfaceProps> = ({
  user,
  isPremium,
  onResponse,
  className = ''
}) => {
  const [mode, setMode] = useState<ConversationMode>({ type: 'text', voiceEnabled: false, autoSpeak: false });
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics>({ geminiCharacters: 0, elevenlabsCharacters: 0, totalCost: 0, requestCount: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [showUsageStats, setShowUsageStats] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (user) {
      aiConversationSystem.initialize(user.id, isPremium);
      setMode(aiConversationSystem.getConversationMode());
      setUsageMetrics(aiConversationSystem.getUsageMetrics());
    }
  }, [user, isPremium]);

  const handleModeChange = (newMode: Partial<ConversationMode>) => {
    const updatedMode = { ...mode, ...newMode };
    setMode(updatedMode);
    aiConversationSystem.setMode(updatedMode);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await aiConversationSystem.processMessage(inputValue, {
        includeVoice: mode.voiceEnabled && mode.autoSpeak
      });
      
      onResponse(response);
      setInputValue('');
      setUsageMetrics(aiConversationSystem.getUsageMetrics());
    } catch (error) {
      console.error('Message processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    aiConversationSystem.clearConversation();
    setUsageMetrics(aiConversationSystem.getUsageMetrics());
  };

  const exportConversation = () => {
    const data = aiConversationSystem.exportConversation();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCostColor = (cost: number) => {
    const limit = isPremium ? 100 : 10;
    const percentage = (cost / limit) * 100;
    if (percentage >= 90) return 'error';
    if (percentage >= 70) return 'warning';
    return 'success';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-dark-900 flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-primary-500" />
            <span>AI Conversation</span>
          </h3>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUsageStats(true)}
              icon={<BarChart3 className="w-4 h-4" />}
            >
              Usage
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              icon={<Settings className="w-4 h-4" />}
            >
              Settings
            </Button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center bg-dark-200/50 rounded-xl p-1">
            <button
              onClick={() => handleModeChange({ type: 'text' })}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                mode.type === 'text'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-dark-600 hover:text-dark-800'
              }`}
            >
              Text
            </button>
            <button
              onClick={() => handleModeChange({ type: 'voice' })}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                mode.type === 'voice'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-dark-600 hover:text-dark-800'
              }`}
            >
              Voice
            </button>
            <button
              onClick={() => handleModeChange({ type: 'hybrid' })}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                mode.type === 'hybrid'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-dark-600 hover:text-dark-800'
              }`}
            >
              Hybrid
            </button>
          </div>

          <button
            onClick={() => handleModeChange({ voiceEnabled: !mode.voiceEnabled })}
            className={`p-2 rounded-xl transition-all ${
              mode.voiceEnabled
                ? 'bg-primary-500/20 text-primary-600'
                : 'bg-dark-200/50 text-dark-500 hover:bg-dark-300/50'
            }`}
            title={mode.voiceEnabled ? 'Disable voice' : 'Enable voice'}
          >
            {mode.voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={() => handleModeChange({ autoSpeak: !mode.autoSpeak })}
            className={`p-2 rounded-xl transition-all ${
              mode.autoSpeak
                ? 'bg-green-500/20 text-green-600'
                : 'bg-dark-200/50 text-dark-500 hover:bg-dark-300/50'
            }`}
            title={mode.autoSpeak ? 'Disable auto-speak' : 'Enable auto-speak'}
            disabled={!mode.voiceEnabled}
          >
            {mode.autoSpeak ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        </div>

        {/* Usage Indicator */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <Badge variant={getCostColor(usageMetrics.totalCost)} size="sm">
              ${usageMetrics.totalCost.toFixed(4)} used
            </Badge>
            <span className="text-dark-600">
              {usageMetrics.requestCount} requests today
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="info" size="sm">
              {mode.type}
            </Badge>
            {mode.voiceEnabled && (
              <Badge variant="success" size="sm" dot>
                Voice
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Input Area */}
      <Card className="p-4">
        <div className="flex space-x-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Type your message... (${mode.type} mode)`}
            rows={3}
            className="flex-1 bg-dark-200/50 border border-dark-300/50 rounded-xl px-4 py-3 text-dark-900 placeholder-dark-500 outline-none transition-all duration-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 resize-none"
            disabled={isProcessing}
          />
          
          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              loading={isProcessing}
              className="h-full"
            >
              Send
            </Button>
          </div>
        </div>
      </Card>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="AI Conversation Settings"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-dark-900 mb-3">Conversation Mode</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="mode"
                  checked={mode.type === 'text'}
                  onChange={() => handleModeChange({ type: 'text' })}
                  className="text-primary-500"
                />
                <div>
                  <span className="font-medium">Text Only</span>
                  <p className="text-sm text-dark-600">Fastest and most cost-effective</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="mode"
                  checked={mode.type === 'voice'}
                  onChange={() => handleModeChange({ type: 'voice' })}
                  className="text-primary-500"
                />
                <div>
                  <span className="font-medium">Voice Only</span>
                  <p className="text-sm text-dark-600">Audio responses for hands-free interaction</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="mode"
                  checked={mode.type === 'hybrid'}
                  onChange={() => handleModeChange({ type: 'hybrid' })}
                  className="text-primary-500"
                />
                <div>
                  <span className="font-medium">Hybrid</span>
                  <p className="text-sm text-dark-600">Text with optional voice responses</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-dark-900 mb-3">Voice Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span>Enable Voice Responses</span>
                <input
                  type="checkbox"
                  checked={mode.voiceEnabled}
                  onChange={(e) => handleModeChange({ voiceEnabled: e.target.checked })}
                  className="text-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span>Auto-speak Responses</span>
                <input
                  type="checkbox"
                  checked={mode.autoSpeak}
                  onChange={(e) => handleModeChange({ autoSpeak: e.target.checked })}
                  disabled={!mode.voiceEnabled}
                  className="text-primary-500"
                />
              </label>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="danger"
              onClick={clearConversation}
              icon={<Trash2 className="w-4 h-4" />}
              className="flex-1"
            >
              Clear Conversation
            </Button>
            
            <Button
              variant="secondary"
              onClick={exportConversation}
              icon={<Download className="w-4 h-4" />}
              className="flex-1"
            >
              Export
            </Button>
          </div>
        </div>
      </Modal>

      {/* Usage Stats Modal */}
      <Modal
        isOpen={showUsageStats}
        onClose={() => setShowUsageStats(false)}
        title="Usage Statistics"
        size="lg"
      >
        <div className="space-y-6">
          {/* Cost Overview */}
          <Card className="p-6">
            <h4 className="font-semibold text-dark-900 mb-4 flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span>Cost Breakdown</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  ${usageMetrics.totalCost.toFixed(4)}
                </div>
                <div className="text-sm text-dark-600">Total Cost Today</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {usageMetrics.geminiCharacters.toLocaleString()}
                </div>
                <div className="text-sm text-dark-600">Gemini Characters</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {usageMetrics.elevenlabsCharacters.toLocaleString()}
                </div>
                <div className="text-sm text-dark-600">Voice Characters</div>
              </div>
            </div>
          </Card>

          {/* Usage Limits */}
          <Card className="p-6">
            <h4 className="font-semibold text-dark-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span>Usage Limits</span>
            </h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Daily Limit</span>
                  <span>${isPremium ? '100.00' : '10.00'}</span>
                </div>
                <div className="w-full bg-dark-300/30 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getCostColor(usageMetrics.totalCost) === 'error' ? 'bg-red-500' :
                      getCostColor(usageMetrics.totalCost) === 'warning' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min((usageMetrics.totalCost / (isPremium ? 100 : 10)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
              
              <div className="text-sm text-dark-600">
                <p>Requests today: {usageMetrics.requestCount}</p>
                <p>Account type: {isPremium ? 'Premium' : 'Free'}</p>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Alert
            type="info"
            title="Cost Optimization Tips"
            message="Use text mode for quick interactions and voice mode for detailed explanations. Enable caching to reduce repeated API calls."
          />
        </div>
      </Modal>
    </div>
  );
};