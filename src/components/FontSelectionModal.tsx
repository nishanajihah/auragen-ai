import React, { useState } from 'react';
import { X, Type, Search, Star, Sparkles, Eye, Download, Palette, Check, Filter } from 'lucide-react';
import { FontSelectionRequest } from '../types';

interface FontSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (request: FontSelectionRequest) => void;
  currentFont: string;
  fontType: 'heading' | 'body';
}

const GOOGLE_FONTS = {
  serif: [
    { name: 'Playfair Display', category: 'Elegant serif for luxury brands', preview: 'Elegant & Sophisticated' },
    { name: 'Merriweather', category: 'Readable serif for content', preview: 'Clear & Professional' },
    { name: 'Crimson Text', category: 'Classic book-style serif', preview: 'Traditional & Timeless' },
    { name: 'Libre Baskerville', category: 'Modern Baskerville revival', preview: 'Modern Classic' },
    { name: 'Lora', category: 'Contemporary serif with calligraphic roots', preview: 'Contemporary & Warm' },
    { name: 'Cormorant Garamond', category: 'Display serif with character', preview: 'Distinctive & Bold' }
  ],
  'sans-serif': [
    { name: 'Inter', category: 'Modern interface font', preview: 'Clean & Modern' },
    { name: 'Poppins', category: 'Geometric sans-serif', preview: 'Friendly & Approachable' },
    { name: 'Montserrat', category: 'Urban-inspired sans-serif', preview: 'Urban & Contemporary' },
    { name: 'Source Sans Pro', category: 'Clean and readable', preview: 'Professional & Clear' },
    { name: 'Nunito', category: 'Rounded sans-serif', preview: 'Soft & Welcoming' },
    { name: 'Work Sans', category: 'Optimized for screens', preview: 'Digital & Functional' }
  ],
  display: [
    { name: 'Oswald', category: 'Bold condensed display', preview: 'Strong & Impactful' },
    { name: 'Bebas Neue', category: 'Strong display font', preview: 'Bold & Commanding' },
    { name: 'Righteous', category: 'Friendly display font', preview: 'Fun & Energetic' },
    { name: 'Fredoka One', category: 'Playful rounded display', preview: 'Playful & Creative' },
    { name: 'Orbitron', category: 'Futuristic sci-fi font', preview: 'Futuristic & Tech' },
    { name: 'Bungee', category: 'Urban display font', preview: 'Street & Urban' }
  ],
  monospace: [
    { name: 'JetBrains Mono', category: 'Developer-focused monospace', preview: 'Code & Technical' },
    { name: 'Fira Code', category: 'Programming ligatures', preview: 'Developer Friendly' },
    { name: 'Source Code Pro', category: 'Clean monospace', preview: 'Clean & Readable' },
    { name: 'Space Mono', category: 'Retro monospace', preview: 'Retro & Distinctive' }
  ]
};

const FONT_STYLES = [
  { id: 'modern', label: 'Modern', description: 'Clean, contemporary design', color: 'from-blue-500 to-cyan-500' },
  { id: 'classic', label: 'Classic', description: 'Timeless, traditional feel', color: 'from-gray-600 to-gray-800' },
  { id: 'playful', label: 'Playful', description: 'Fun, approachable vibe', color: 'from-pink-500 to-purple-500' },
  { id: 'elegant', label: 'Elegant', description: 'Sophisticated, refined', color: 'from-purple-600 to-indigo-600' },
  { id: 'bold', label: 'Bold', description: 'Strong, impactful presence', color: 'from-red-500 to-orange-500' },
  { id: 'minimal', label: 'Minimal', description: 'Simple, understated', color: 'from-green-500 to-teal-500' }
];

const POPULAR_COMBINATIONS = [
  { heading: 'Playfair Display', body: 'Source Sans Pro', style: 'Elegant & Professional' },
  { heading: 'Montserrat', body: 'Open Sans', style: 'Modern & Clean' },
  { heading: 'Oswald', body: 'Nunito', style: 'Bold & Friendly' },
  { heading: 'Merriweather', body: 'Inter', style: 'Classic & Readable' }
];

export const FontSelectionModal: React.FC<FontSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentFont,
  fontType
}) => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof GOOGLE_FONTS>('sans-serif');
  const [selectedStyle, setSelectedStyle] = useState<string>('modern');
  const [selectedFont, setSelectedFont] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showPreview, setShowPreview] = useState<string>('');

  const filteredFonts = GOOGLE_FONTS[selectedCategory].filter(font =>
    font.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    font.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedFont && reason.trim()) {
      onSelect({
        currentFont,
        reason: reason.trim(),
        preferences: {
          style: selectedStyle as any,
          category: selectedCategory,
          mood: mood.trim() || `${selectedStyle} ${selectedCategory} font`
        }
      });
      onClose();
    }
  };

  const handleQuickSelect = (fontName: string, quickReason: string) => {
    setSelectedFont(fontName);
    setReason(quickReason);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-100/95 backdrop-blur-2xl rounded-3xl border-2 border-dark-200/40 shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Sticky Header */}
        <div className="bg-dark-100/95 backdrop-blur-2xl border-b border-dark-200/30 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-lg opacity-75"></div>
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                  <Type className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-dark-900">
                  Choose {fontType === 'heading' ? 'Heading' : 'Body'} Font
                </h2>
                <p className="text-lg text-dark-600">
                  Current: <span className="font-semibold">{currentFont}</span> • Find the perfect replacement
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-xl hover:bg-dark-200/50 transition-colors"
            >
              <X className="w-6 h-6 text-dark-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Quick Selection Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Popular Combinations */}
              <div className="lg:col-span-2">
                <h4 className="text-xl font-bold mb-4 text-dark-900 flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Popular Combinations</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {POPULAR_COMBINATIONS.map((combo, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSelect(
                        fontType === 'heading' ? combo.heading : combo.body,
                        `Using popular combination: ${combo.heading} + ${combo.body} for ${combo.style.toLowerCase()} design`
                      )}
                      className="p-4 rounded-2xl border-2 border-dark-300/30 bg-dark-200/30 hover:border-primary-400/50 hover:bg-primary-500/10 transition-all text-left group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-primary-600">{combo.style}</span>
                        <Star className="w-4 h-4 text-yellow-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-dark-900" style={{ fontFamily: combo.heading }}>
                          {combo.heading}
                        </p>
                        <p className="text-dark-700" style={{ fontFamily: combo.body }}>
                          {combo.body}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Suggestion */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-3xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <span className="text-lg font-bold text-purple-400">AI Suggestion</span>
                </div>
                <p className="text-base text-dark-700 mb-4 leading-relaxed">
                  Let AI analyze your project and choose the perfect font based on your design system and brand personality.
                </p>
                <button
                  onClick={() => {
                    setSelectedFont('AI Choice');
                    setReason('Let AI select the optimal font based on my project requirements and design system');
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Let AI Choose</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search fonts by name or style..."
                  className="w-full pl-12 pr-4 py-4 bg-dark-200/80 border-2 border-dark-300/50 rounded-2xl text-dark-900 placeholder-dark-500 outline-none transition-all duration-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 text-lg"
                />
              </div>

              {/* Font Categories */}
              <div className="flex flex-wrap gap-3 mb-6">
                {Object.keys(GOOGLE_FONTS).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category as keyof typeof GOOGLE_FONTS)}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all transform hover:scale-105 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-dark-50 shadow-xl'
                        : 'bg-dark-200/50 text-dark-700 hover:bg-dark-300/50 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {category.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* Style Preferences */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-dark-800 mb-4 flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Style Preference</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {FONT_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`text-center p-4 rounded-2xl transition-all transform hover:scale-105 ${
                        selectedStyle === style.id
                          ? 'bg-primary-500/20 border-2 border-primary-500/50 text-primary-400 shadow-lg'
                          : 'bg-dark-200/30 border-2 border-dark-300/30 text-dark-700 hover:bg-dark-300/30 hover:shadow-lg'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${style.color} mx-auto mb-2`}></div>
                      <div className="font-bold text-sm">{style.label}</div>
                      <div className="text-xs opacity-80">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Font List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredFonts.map((font) => (
                <div
                  key={font.name}
                  className={`p-6 rounded-3xl border-2 cursor-pointer transition-all hover:shadow-2xl group ${
                    selectedFont === font.name
                      ? 'border-primary-500 bg-primary-500/10 shadow-xl'
                      : 'border-dark-300/30 bg-dark-200/30 hover:border-primary-400/50 hover:bg-primary-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setSelectedFont(font.name)}
                      className="flex-1 text-left"
                    >
                      <h4 className="text-2xl font-bold text-dark-900 mb-1" style={{ fontFamily: font.name }}>
                        {font.name}
                      </h4>
                      <p className="text-sm text-dark-600">{font.category}</p>
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowPreview(showPreview === font.name ? '' : font.name)}
                        className="p-2 rounded-xl hover:bg-primary-500/20 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-5 h-5 text-primary-500" />
                      </button>
                      {selectedFont === font.name && (
                        <div className="p-2 rounded-xl bg-primary-500/20">
                          <Check className="w-5 h-5 text-primary-600" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-dark-800" style={{ fontFamily: font.name }}>
                    <p className="text-3xl font-bold">{font.preview}</p>
                    <p className="text-lg">The quick brown fox jumps over the lazy dog</p>
                    <p className="text-base">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                    <p className="text-base">abcdefghijklmnopqrstuvwxyz 1234567890</p>
                  </div>

                  {showPreview === font.name && (
                    <div className="mt-6 p-4 rounded-2xl bg-dark-100/50 border border-dark-300/30">
                      <h6 className="text-sm font-semibold mb-3 text-dark-700">Usage Examples:</h6>
                      <div className="space-y-2" style={{ fontFamily: font.name }}>
                        {fontType === 'heading' ? (
                          <>
                            <p className="text-2xl font-bold text-dark-900">Main Page Title</p>
                            <p className="text-xl font-semibold text-dark-800">Section Header</p>
                            <p className="text-lg font-medium text-dark-700">Component Title</p>
                          </>
                        ) : (
                          <>
                            <p className="text-lg text-dark-800">Large body text for introductions and important content.</p>
                            <p className="text-base text-dark-700">Regular body text for paragraphs and descriptions.</p>
                            <p className="text-sm text-dark-600">Small text for captions and metadata.</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reason and Mood Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-dark-800 mb-4">
                  Why change the current font? *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Too formal for our brand, hard to read on mobile, doesn't match our modern aesthetic..."
                  rows={4}
                  className="w-full bg-dark-200/80 border-2 border-dark-300/50 rounded-2xl px-6 py-4 text-dark-900 placeholder-dark-500 outline-none transition-all duration-300 backdrop-blur-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-dark-800 mb-4">
                  Desired Mood (Optional)
                </label>
                <input
                  type="text"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  placeholder="e.g., Professional, friendly, creative, trustworthy..."
                  className="w-full bg-dark-200/80 border-2 border-dark-300/50 rounded-2xl px-6 py-4 text-dark-900 placeholder-dark-500 outline-none transition-all duration-300 backdrop-blur-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 mb-4"
                />
                
                {/* Selection Summary */}
                <div className="bg-dark-200/30 rounded-2xl p-4 border border-dark-300/30">
                  <h6 className="font-bold text-dark-900 mb-2">Selection Summary</h6>
                  {selectedFont ? (
                    <div className="space-y-1 text-sm">
                      <p><span className="font-semibold">Font:</span> {selectedFont}</p>
                      <p><span className="font-semibold">Style:</span> {selectedStyle}</p>
                      <p><span className="font-semibold">Category:</span> {selectedCategory}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-dark-600">Please select a font above</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="bg-dark-100/95 backdrop-blur-2xl border-t border-dark-200/30 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-dark-600">
              {selectedFont ? (
                <span>Selected: <strong>{selectedFont}</strong></span>
              ) : (
                <span>Please select a font and provide a reason</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="bg-dark-200/90 hover:bg-dark-300/90 text-dark-900 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 border-2 border-dark-300/50 hover:border-dark-400/50 shadow-lg hover:shadow-xl backdrop-blur-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedFont || !reason.trim()}
                className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-dark-50 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Update Font</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};