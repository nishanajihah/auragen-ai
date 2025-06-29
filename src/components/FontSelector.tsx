import React, { useState, useEffect } from 'react';
import { Type, Search, Star, Download } from 'lucide-react';

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
  fontType: 'heading' | 'body';
  className?: string;
}

const GOOGLE_FONTS = [
  { name: 'Inter', category: 'Sans Serif', popularity: 'high' },
  { name: 'Poppins', category: 'Sans Serif', popularity: 'high' },
  { name: 'Montserrat', category: 'Sans Serif', popularity: 'high' },
  { name: 'Source Sans Pro', category: 'Sans Serif', popularity: 'medium' },
  { name: 'Open Sans', category: 'Sans Serif', popularity: 'high' },
  { name: 'Lato', category: 'Sans Serif', popularity: 'medium' },
  { name: 'Nunito', category: 'Sans Serif', popularity: 'medium' },
  { name: 'Roboto', category: 'Sans Serif', popularity: 'high' },
  { name: 'Playfair Display', category: 'Serif', popularity: 'medium' },
  { name: 'Merriweather', category: 'Serif', popularity: 'medium' },
  { name: 'Crimson Text', category: 'Serif', popularity: 'low' },
  { name: 'Libre Baskerville', category: 'Serif', popularity: 'low' },
  { name: 'Oswald', category: 'Display', popularity: 'medium' },
  { name: 'Bebas Neue', category: 'Display', popularity: 'medium' },
  { name: 'Righteous', category: 'Display', popularity: 'low' },
  { name: 'JetBrains Mono', category: 'Monospace', popularity: 'low' },
  { name: 'Fira Code', category: 'Monospace', popularity: 'low' },
  { name: 'Source Code Pro', category: 'Monospace', popularity: 'low' }
];

export const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFont,
  onFontChange,
  fontType,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  const categories = ['all', 'Sans Serif', 'Serif', 'Display', 'Monospace'];

  const filteredFonts = GOOGLE_FONTS.filter(font => {
    const matchesSearch = font.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || font.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const loadFont = (fontName: string) => {
    if (loadedFonts.has(fontName)) return;

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    setLoadedFonts(prev => new Set([...prev, fontName]));
  };

  useEffect(() => {
    // Load the selected font
    loadFont(selectedFont);
  }, [selectedFont]);

  const handleFontSelect = (fontName: string) => {
    loadFont(fontName);
    onFontChange(fontName);
  };

  const getPreviewText = () => {
    return fontType === 'heading' 
      ? 'The Quick Brown Fox'
      : 'The quick brown fox jumps over the lazy dog. 1234567890';
  };

  return (
    <div className={`bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <Type className="w-6 h-6 text-primary-500" />
        <h3 className="text-xl font-bold text-dark-900">
          {fontType === 'heading' ? 'Heading' : 'Body'} Font
        </h3>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fonts..."
            className="w-full pl-10 pr-4 py-3 bg-dark-100/80 border border-dark-300/50 rounded-xl text-dark-900 placeholder-dark-500 outline-none transition-all focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-dark-100/50 text-dark-700 hover:bg-dark-200/50 border border-dark-300/30'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Font List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredFonts.map((font) => (
          <div
            key={font.name}
            onClick={() => handleFontSelect(font.name)}
            className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${
              selectedFont === font.name
                ? 'bg-primary-500/20 border-primary-500/50 shadow-lg'
                : 'bg-dark-100/50 border-dark-300/30 hover:border-primary-400/50 hover:bg-primary-500/5'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h4 className="font-semibold text-dark-900">{font.name}</h4>
                <span className="text-xs px-2 py-1 bg-dark-300/50 text-dark-600 rounded-full">
                  {font.category}
                </span>
                {font.popularity === 'high' && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
              </div>
              {selectedFont === font.name && (
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              )}
            </div>
            
            <div 
              className={`text-lg text-dark-800 ${fontType === 'heading' ? 'font-bold' : 'font-normal'}`}
              style={{ fontFamily: font.name }}
            >
              {getPreviewText()}
            </div>
          </div>
        ))}
      </div>

      {filteredFonts.length === 0 && (
        <div className="text-center py-8">
          <Type className="w-12 h-12 text-dark-400 mx-auto mb-3" />
          <p className="text-dark-600">No fonts found matching your criteria</p>
        </div>
      )}
    </div>
  );
};