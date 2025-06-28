import React, { useState, useEffect } from 'react';
import { Type, Search, Star, Download, Eye, ExternalLink } from 'lucide-react';
import { useGoogleFonts, generateGoogleFontUrl, getFontFallback } from './GoogleFontsProvider';

interface EnhancedFontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
  fontType: 'heading' | 'body';
  className?: string;
}

export const EnhancedFontSelector: React.FC<EnhancedFontSelectorProps> = ({
  selectedFont,
  onFontChange,
  fontType,
  className = ''
}) => {
  const { fonts, loadedFonts, loadFont, searchFonts, isLoading } = useGoogleFonts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewFont, setPreviewFont] = useState<string>('');
  const [showFontUrl, setShowFontUrl] = useState<string>('');

  const categories = ['all', 'sans-serif', 'serif', 'display', 'monospace'];
  const filteredFonts = searchFonts(searchTerm, selectedCategory);

  useEffect(() => {
    // Load the selected font
    if (selectedFont) {
      loadFont(selectedFont);
    }
  }, [selectedFont, loadFont]);

  const handleFontSelect = async (fontFamily: string) => {
    await loadFont(fontFamily, ['300', '400', '500', '600', '700']);
    onFontChange(fontFamily);
    setPreviewFont('');
  };

  const handleFontPreview = async (fontFamily: string) => {
    if (previewFont === fontFamily) {
      setPreviewFont('');
      return;
    }
    
    await loadFont(fontFamily, ['400', '600']);
    setPreviewFont(fontFamily);
  };

  const getPreviewText = () => {
    return fontType === 'heading' 
      ? 'The Quick Brown Fox Jumps'
      : 'The quick brown fox jumps over the lazy dog. 1234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  };

  const copyFontUrl = (fontFamily: string) => {
    const url = generateGoogleFontUrl(fontFamily, ['300', '400', '500', '600', '700']);
    navigator.clipboard.writeText(url);
    setShowFontUrl(fontFamily);
    setTimeout(() => setShowFontUrl(''), 2000);
  };

  return (
    <div className={`bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <Type className="w-6 h-6 text-primary-500" />
        <h3 className="text-xl font-bold text-dark-900">
          {fontType === 'heading' ? 'Heading' : 'Body'} Font
        </h3>
        {isLoading && (
          <div className="w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
        )}
      </div>

      {/* Current Selection Display */}
      <div className="mb-6 p-4 bg-dark-100/50 rounded-xl border border-dark-300/30">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-dark-900">{selectedFont}</h4>
            <p className="text-sm text-dark-600">
              {fonts.find(f => f.family === selectedFont)?.category || 'Unknown category'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => copyFontUrl(selectedFont)}
              className="p-2 rounded-lg hover:bg-dark-300/50 transition-colors"
              title="Copy Google Fonts URL"
            >
              {showFontUrl === selectedFont ? (
                <Download className="w-4 h-4 text-green-500" />
              ) : (
                <ExternalLink className="w-4 h-4 text-dark-500" />
              )}
            </button>
          </div>
        </div>
        
        <div 
          className={`text-lg ${fontType === 'heading' ? 'font-bold' : 'font-normal'} text-dark-800`}
          style={{ fontFamily: loadedFonts.has(selectedFont) ? selectedFont : 'inherit' }}
        >
          {getPreviewText()}
        </div>
        
        {showFontUrl === selectedFont && (
          <div className="mt-3 p-2 bg-dark-300/30 rounded-lg">
            <p className="text-xs text-dark-600 font-mono break-all">
              {generateGoogleFontUrl(selectedFont, ['300', '400', '500', '600', '700'])}
            </p>
          </div>
        )}
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
              {category === 'all' ? 'All' : category.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Font List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredFonts.map((font) => (
          <div
            key={font.family}
            className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${
              selectedFont === font.family
                ? 'bg-primary-500/20 border-primary-500/50 shadow-lg'
                : 'bg-dark-100/50 border-dark-300/30 hover:border-primary-400/50 hover:bg-primary-500/5'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleFontSelect(font.family)}
                  className="flex-1 text-left"
                >
                  <h4 className="font-semibold text-dark-900">{font.family}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-dark-300/50 text-dark-600 rounded-full">
                      {font.category}
                    </span>
                    {font.popularity && font.popularity > 70 && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleFontPreview(font.family)}
                  className={`p-2 rounded-lg transition-colors ${
                    previewFont === font.family 
                      ? 'bg-primary-500/20 text-primary-600' 
                      : 'hover:bg-dark-300/50 text-dark-500'
                  }`}
                  title="Preview Font"
                >
                  <Eye className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => copyFontUrl(font.family)}
                  className="p-2 rounded-lg hover:bg-dark-300/50 transition-colors"
                  title="Copy Google Fonts URL"
                >
                  {showFontUrl === font.family ? (
                    <Download className="w-4 h-4 text-green-500" />
                  ) : (
                    <ExternalLink className="w-4 h-4 text-dark-500" />
                  )}
                </button>
                
                {selectedFont === font.family && (
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                )}
              </div>
            </div>
            
            <div 
              className={`text-lg text-dark-800 ${fontType === 'heading' ? 'font-bold' : 'font-normal'}`}
              style={{ 
                fontFamily: loadedFonts.has(font.family) ? `${font.family}, ${getFontFallback(font.category)}` : 'inherit' 
              }}
            >
              {getPreviewText()}
            </div>

            {/* Font URL Display */}
            {showFontUrl === font.family && (
              <div className="mt-3 p-3 bg-dark-300/30 rounded-lg">
                <p className="text-xs text-dark-600 font-mono break-all">
                  {generateGoogleFontUrl(font.family, font.variants)}
                </p>
              </div>
            )}

            {/* Extended Preview */}
            {previewFont === font.family && (
              <div className="mt-4 p-4 bg-dark-200/30 rounded-lg border border-dark-300/30">
                <h6 className="text-sm font-semibold mb-3 text-dark-700">Extended Preview:</h6>
                <div 
                  className="space-y-2" 
                  style={{ 
                    fontFamily: loadedFonts.has(font.family) ? `${font.family}, ${getFontFallback(font.category)}` : 'inherit' 
                  }}
                >
                  {fontType === 'heading' ? (
                    <>
                      <p className="text-3xl font-bold text-dark-900">Main Page Title</p>
                      <p className="text-2xl font-semibold text-dark-800">Section Header</p>
                      <p className="text-xl font-medium text-dark-700">Component Title</p>
                      <p className="text-lg font-medium text-dark-600">Subheading</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg text-dark-800">Large body text for introductions and important content that needs emphasis.</p>
                      <p className="text-base text-dark-700">Regular body text for paragraphs and descriptions. The quick brown fox jumps over the lazy dog.</p>
                      <p className="text-sm text-dark-600">Small text for captions and metadata information.</p>
                      <p className="text-xs text-dark-500">Extra small text for fine print and labels.</p>
                    </>
                  )}
                </div>
              </div>
            )}
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