import React, { useState } from 'react';
import { 
  ArrowLeft, User, CreditCard, Bell, Palette, Type, 
  Save, Edit, Crown, Shield, Globe, Moon, Sun,
  Check, X, AlertCircle, Settings as SettingsIcon
} from 'lucide-react';

interface SettingsPageProps {
  user: any;
  isPremium: boolean;
  onBack: () => void;
  onSave: (settings: any) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  isPremium,
  onBack,
  onSave,
  darkMode,
  toggleDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'preferences' | 'fonts'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || user?.email?.split('@')[0] || '',
    email: user?.email || '',
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'fonts', label: 'Typography', icon: Type }
  ];

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200">
      {/* Header */}
      <div className="bg-dark-100/80 backdrop-blur-2xl border-b border-dark-200/30 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors border border-dark-300/30"
              >
                <ArrowLeft className="w-5 h-5 text-dark-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-dark-900">Settings</h1>
                <p className="text-sm text-dark-600">Manage your account and preferences</p>
              </div>
            </div>
            
            {isEditing && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-dark-200/50 hover:bg-dark-300/50 text-dark-700 rounded-lg font-medium transition-all border border-dark-300/30"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-4 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                        : 'text-dark-700 hover:bg-dark-300/50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-8">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-dark-900">Profile Information</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 rounded-lg transition-all border border-primary-500/30"
                    >
                      <Edit className="w-4 h-4" />
                      <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-dark-800 mb-2">Display Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.displayName}
                          onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                          className="w-full bg-dark-100/80 border border-dark-300/50 rounded-xl px-4 py-3 text-dark-900 focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 outline-none transition-all"
                        />
                      ) : (
                        <div className="bg-dark-100/50 border border-dark-300/30 rounded-xl px-4 py-3 text-dark-700">
                          {formData.displayName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-dark-800 mb-2">Email Address</label>
                      <div className="bg-dark-100/50 border border-dark-300/30 rounded-xl px-4 py-3 text-dark-700">
                        {formData.email}
                        <span className="ml-2 text-xs text-dark-500">(Cannot be changed)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/30 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      {isPremium ? (
                        <Crown className="w-6 h-6 text-yellow-500" />
                      ) : (
                        <Shield className="w-6 h-6 text-blue-500" />
                      )}
                      <div>
                        <h3 className="font-semibold text-dark-900">
                          {isPremium ? 'Premium Account' : 'Free Account'}
                        </h3>
                        <p className="text-sm text-dark-600">
                          {isPremium 
                            ? 'You have unlimited access to all features'
                            : 'Upgrade to unlock unlimited generations and advanced features'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-dark-900">Billing & Subscription</h2>
                  
                  {isPremium ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <Crown className="w-8 h-8 text-yellow-500" />
                          <div>
                            <h3 className="text-xl font-bold text-dark-900">Premium Plan</h3>
                            <p className="text-dark-600">Active subscription</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-dark-600">Next billing:</span>
                            <p className="font-semibold text-dark-900">January 15, 2024</p>
                          </div>
                          <div>
                            <span className="text-dark-600">Amount:</span>
                            <p className="font-semibold text-dark-900">$29.99/month</p>
                          </div>
                          <div>
                            <span className="text-dark-600">Status:</span>
                            <p className="font-semibold text-green-600">Active</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button className="px-6 py-3 bg-dark-200/50 hover:bg-dark-300/50 text-dark-700 rounded-xl font-medium transition-all border border-dark-300/30">
                          Update Payment Method
                        </button>
                        <button className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-xl font-medium transition-all border border-red-500/30">
                          Cancel Subscription
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Crown className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-dark-900 mb-2">Upgrade to Premium</h3>
                      <p className="text-dark-600 mb-6">Unlock unlimited generations and advanced features</p>
                      <button className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-bold transition-all shadow-lg">
                        View Plans
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-dark-900">Preferences</h2>
                  
                  <div className="space-y-6">
                    {/* Theme */}
                    <div className="flex items-center justify-between p-4 bg-dark-100/50 rounded-xl border border-dark-300/30">
                      <div className="flex items-center space-x-3">
                        {darkMode ? <Moon className="w-5 h-5 text-primary-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                        <div>
                          <h4 className="font-semibold text-dark-900">Theme</h4>
                          <p className="text-sm text-dark-600">Choose your preferred theme</p>
                        </div>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className={`relative w-12 h-6 rounded-full transition-all ${
                          darkMode ? 'bg-primary-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${
                          darkMode ? 'left-6' : 'left-0.5'
                        }`} />
                      </button>
                    </div>

                    {/* Auto Save */}
                    <div className="flex items-center justify-between p-4 bg-dark-100/50 rounded-xl border border-dark-300/30">
                      <div className="flex items-center space-x-3">
                        <Save className="w-5 h-5 text-green-500" />
                        <div>
                          <h4 className="font-semibold text-dark-900">Auto Save</h4>
                          <p className="text-sm text-dark-600">Automatically save your work</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInputChange('preferences', 'autoSave', !formData.preferences.autoSave)}
                        className={`relative w-12 h-6 rounded-full transition-all ${
                          formData.preferences.autoSave ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${
                          formData.preferences.autoSave ? 'left-6' : 'left-0.5'
                        }`} />
                      </button>
                    </div>

                    {/* Voice Responses */}
                    <div className="flex items-center justify-between p-4 bg-dark-100/50 rounded-xl border border-dark-300/30">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <div>
                          <h4 className="font-semibold text-dark-900">Voice Responses</h4>
                          <p className="text-sm text-dark-600">Enable AI voice responses</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInputChange('preferences', 'voiceResponses', !formData.preferences.voiceResponses)}
                        className={`relative w-12 h-6 rounded-full transition-all ${
                          formData.preferences.voiceResponses ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${
                          formData.preferences.voiceResponses ? 'left-6' : 'left-0.5'
                        }`} />
                      </button>
                    </div>

                    {/* Notifications */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-dark-900">Notifications</h3>
                      
                      <div className="flex items-center justify-between p-4 bg-dark-100/50 rounded-xl border border-dark-300/30">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5 text-purple-500" />
                          <div>
                            <h4 className="font-semibold text-dark-900">Email Notifications</h4>
                            <p className="text-sm text-dark-600">Receive updates via email</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleInputChange('notifications', 'email', !formData.notifications.email)}
                          className={`relative w-12 h-6 rounded-full transition-all ${
                            formData.notifications.email ? 'bg-purple-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${
                            formData.notifications.email ? 'left-6' : 'left-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Typography Tab */}
              {activeTab === 'fonts' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-dark-900">Typography Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-dark-800 mb-3">Heading Font</label>
                      <select
                        value={formData.fonts.heading}
                        onChange={(e) => handleInputChange('fonts', 'heading', e.target.value)}
                        className="w-full bg-dark-100/80 border border-dark-300/50 rounded-xl px-4 py-3 text-dark-900 focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 outline-none transition-all"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Oswald">Oswald</option>
                      </select>
                      <div className="mt-3 p-4 bg-dark-100/50 rounded-xl border border-dark-300/30">
                        <h3 className="text-2xl font-bold text-dark-900" style={{ fontFamily: formData.fonts.heading }}>
                          Preview Heading Text
                        </h3>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-dark-800 mb-3">Body Font</label>
                      <select
                        value={formData.fonts.body}
                        onChange={(e) => handleInputChange('fonts', 'body', e.target.value)}
                        className="w-full bg-dark-100/80 border border-dark-300/50 rounded-xl px-4 py-3 text-dark-900 focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 outline-none transition-all"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Source Sans Pro">Source Sans Pro</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Nunito">Nunito</option>
                      </select>
                      <div className="mt-3 p-4 bg-dark-100/50 rounded-xl border border-dark-300/30">
                        <p className="text-dark-700 leading-relaxed" style={{ fontFamily: formData.fonts.body }}>
                          This is preview body text to show how your selected font will look in paragraphs and longer content. 
                          The quick brown fox jumps over the lazy dog.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-dark-800 mb-3">Font Size</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['small', 'medium', 'large'].map((size) => (
                          <button
                            key={size}
                            onClick={() => handleInputChange('fonts', 'size', size)}
                            className={`p-3 rounded-xl border transition-all ${
                              formData.fonts.size === size
                                ? 'bg-primary-500/20 border-primary-500/50 text-primary-600'
                                : 'bg-dark-100/50 border-dark-300/30 text-dark-700 hover:bg-dark-200/50'
                            }`}
                          >
                            <span className="capitalize font-medium">{size}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};