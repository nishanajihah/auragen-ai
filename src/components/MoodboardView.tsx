import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, RefreshCw, Download, Save, Palette, Type, 
  Image, Layers, Copy, Check, Eye, Grid, List, Sparkles,
  Monitor, Smartphone, Tablet, Zap, Heart, Star, Crown,
  Settings, Edit, ChevronDown, ChevronUp, Filter, X
} from 'lucide-react';
import { MoodboardData } from '../types';
import { EnhancedFontSelector } from './EnhancedFontSelector';
import { ResponsiveContainer } from './ResponsiveContainer';
import { PersistentComponentLibrary } from './PersistentComponentLibrary';

interface MoodboardViewProps {
  moodboard: MoodboardData | null;
  darkMode: boolean;
  onRegenerateSection: (section: string) => void;
  isLoading: boolean;
  onBackToChat: () => void;
  projectName: string;
  onFontSelection: (fontType: 'heading' | 'body', currentFont: string) => void;
  onOpenProjectManager: () => void;
  onExport: () => void;
}

export const MoodboardView: React.FC<MoodboardViewProps> = ({
  moodboard,
  darkMode,
  onRegenerateSection,
  isLoading,
  onBackToChat,
  projectName,
  onFontSelection,
  onOpenProjectManager,
  onExport
}) => {
  const [copiedColor, setCopiedColor] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['colors', 'typography', 'inspiration', 'components']));
  const [selectedColorFormat, setSelectedColorFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [showFontSelector, setShowFontSelector] = useState<{ type: 'heading' | 'body' } | null>(null);
  const [showComponentLibrary, setShowComponentLibrary] = useState(true);

  const copyToClipboard = async (text: string, colorName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(colorName);
      setTimeout(() => setCopiedColor(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getColorValue = (color: any) => {
    switch (selectedColorFormat) {
      case 'rgb': return color.rgb;
      case 'hsl': return color.hsl;
      default: return color.hex;
    }
  };

  if (!moodboard) {
    return (
      <ResponsiveContainer className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Palette className="w-12 sm:w-16 h-12 sm:h-16 text-primary-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-dark-900 mb-2">No Design System Yet</h2>
          <p className="text-dark-600 mb-6 text-sm sm:text-base">Start a conversation to generate your moodboard</p>
          <button
            onClick={onBackToChat}
            className="btn-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </button>
        </div>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Mobile Header */}
      <div className="sm:hidden bg-dark-100/80 backdrop-blur-2xl border-b border-dark-200/30 sticky top-16 z-30 p-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToChat}
            className="p-2 rounded-lg hover:bg-dark-200/50 transition-colors border border-dark-300/30"
          >
            <ArrowLeft className="w-4 h-4 text-dark-600" />
          </button>
          <div className="text-center flex-1 mx-3">
            <h1 className="text-base font-bold text-dark-900 truncate">{projectName}</h1>
            <p className="text-xs text-dark-600 truncate">{moodboard.vibeSummary}</p>
          </div>
          <button
            onClick={onExport}
            className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 transition-colors border border-emerald-500/30"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden sm:block bg-dark-100/80 backdrop-blur-2xl border-b border-dark-200/30 sticky top-16 z-30">
        <ResponsiveContainer>
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBackToChat}
                className="p-2 rounded-lg hover:bg-dark-200/50 transition-colors border border-dark-300/30"
              >
                <ArrowLeft className="w-4 h-4 text-dark-600" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-dark-900">{projectName}</h1>
                <p className="text-xs text-dark-600">{moodboard.vibeSummary}</p>
              </div>
            </div>
            
            {/* Quick Actions Row */}
            <div className="flex items-center space-x-2">
              {/* Device Preview Toggle */}
              <div className="flex items-center bg-dark-200/50 rounded-lg p-1 border border-dark-300/30">
                {[
                  { id: 'desktop', icon: Monitor },
                  { id: 'tablet', icon: Tablet },
                  { id: 'mobile', icon: Smartphone }
                ].map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedDevice(id as any)}
                    className={`p-1.5 rounded transition-all ${
                      selectedDevice === id
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-dark-600 hover:bg-dark-300/50'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                  </button>
                ))}
              </div>

              <button
                onClick={onOpenProjectManager}
                className="flex items-center space-x-1 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 rounded-lg transition-all border border-purple-500/30 text-sm"
              >
                <Save className="w-3 h-3" />
                <span className="hidden lg:inline">Projects</span>
              </button>

              <button
                onClick={onExport}
                className="flex items-center space-x-1 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-lg transition-all border border-emerald-500/30 text-sm"
              >
                <Download className="w-3 h-3" />
                <span className="hidden lg:inline">Export</span>
              </button>
            </div>
          </div>
        </ResponsiveContainer>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 ${showComponentLibrary ? 'mr-80' : ''} transition-all duration-300`}>
          <ResponsiveContainer className="py-4 sm:py-6">
            <div className="space-y-4 sm:space-y-6">
              
              {/* Color Palettes Section */}
              <div className="bg-dark-200/40 backdrop-blur-xl rounded-xl border border-dark-300/30 overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-dark-300/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleSection('colors')}
                        className="flex items-center space-x-2"
                      >
                        <Palette className="w-4 sm:w-5 h-4 sm:h-5 text-primary-500" />
                        <h2 className="text-lg sm:text-xl font-bold text-dark-900">Color Palettes</h2>
                        {expandedSections.has('colors') ? 
                          <ChevronUp className="w-4 h-4 text-dark-600" /> : 
                          <ChevronDown className="w-4 h-4 text-dark-600" />
                        }
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Color Format Toggle */}
                      <div className="flex items-center bg-dark-100/50 rounded p-1">
                        {['hex', 'rgb', 'hsl'].map((format) => (
                          <button
                            key={format}
                            onClick={() => setSelectedColorFormat(format as any)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                              selectedColorFormat === format
                                ? 'bg-primary-500 text-white'
                                : 'text-dark-600 hover:text-dark-800'
                            }`}
                          >
                            {format.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => onRegenerateSection('colors')}
                        disabled={isLoading}
                        className="p-1.5 rounded-lg hover:bg-orange-500/20 text-orange-600 transition-all border border-orange-500/30 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {expandedSections.has('colors') && (
                  <div className="p-3 sm:p-4">
                    <div className="space-y-4 sm:space-y-6">
                      {moodboard.colorPalettes.map((palette, paletteIndex) => (
                        <div key={paletteIndex}>
                          <div className="mb-3">
                            <h3 className="text-base font-bold text-dark-900 mb-1">{palette.name}</h3>
                            <p className="text-dark-600 text-sm">{palette.purpose}</p>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                            {palette.colors.map((color, colorIndex) => (
                              <div key={colorIndex} className="group">
                                <div 
                                  className="w-full h-16 sm:h-20 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-dark-200 shadow-md hover:rotate-1"
                                  style={{ backgroundColor: color.hex }}
                                  onClick={() => copyToClipboard(getColorValue(color), color.name)}
                                />
                                <div className="mt-2 text-center">
                                  <p className="text-xs font-semibold text-dark-900 mb-1 truncate">{color.name}</p>
                                  <button
                                    onClick={() => copyToClipboard(getColorValue(color), color.name)}
                                    className="flex items-center space-x-1 mx-auto text-xs text-dark-500 hover:text-primary-500 transition-colors group-hover:text-primary-500"
                                  >
                                    <span className="font-mono truncate">{getColorValue(color)}</span>
                                    {copiedColor === color.name ? (
                                      <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                                    ) : (
                                      <Copy className="w-3 h-3 flex-shrink-0" />
                                    )}
                                  </button>
                                  <p className="text-xs text-dark-500 mt-1 line-clamp-2">{color.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Typography Section */}
              <div className="bg-dark-200/40 backdrop-blur-xl rounded-xl border border-dark-300/30 overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-dark-300/30">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleSection('typography')}
                      className="flex items-center space-x-2"
                    >
                      <Type className="w-4 sm:w-5 h-4 sm:h-5 text-primary-500" />
                      <h2 className="text-lg sm:text-xl font-bold text-dark-900">Typography</h2>
                      {expandedSections.has('typography') ? 
                        <ChevronUp className="w-4 h-4 text-dark-600" /> : 
                        <ChevronDown className="w-4 h-4 text-dark-600" />
                      }
                    </button>
                    <button
                      onClick={() => onRegenerateSection('typography')}
                      disabled={isLoading}
                      className="p-1.5 rounded-lg hover:bg-orange-500/20 text-orange-600 transition-all border border-orange-500/30 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {expandedSections.has('typography') && (
                  <div className="p-3 sm:p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Heading Font */}
                      <div className="bg-dark-100/50 rounded-xl p-3 sm:p-4 border border-dark-300/30">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-base font-bold text-dark-900">Heading Font</h3>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setShowFontSelector({ type: 'heading' })}
                              className="p-1.5 rounded hover:bg-primary-500/20 text-primary-600 transition-all"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onFontSelection('heading', moodboard.fontPairing.heading.name)}
                              className="p-1.5 rounded hover:bg-blue-500/20 text-blue-600 transition-all"
                            >
                              <Settings className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-semibold text-dark-700 mb-1">{moodboard.fontPairing.heading.name}</p>
                            <p className="text-xs text-dark-500 mb-3">{moodboard.fontPairing.heading.category}</p>
                          </div>
                          <div className="space-y-2" style={{ fontFamily: moodboard.fontPairing.heading.name }}>
                            <h1 className="text-xl sm:text-2xl font-bold text-dark-900">Heading 1</h1>
                            <h2 className="text-lg sm:text-xl font-bold text-dark-800">Heading 2</h2>
                            <h3 className="text-base sm:text-lg font-semibold text-dark-700">Heading 3</h3>
                            <h4 className="text-sm sm:text-base font-semibold text-dark-700">Heading 4</h4>
                          </div>
                        </div>
                      </div>

                      {/* Body Font */}
                      <div className="bg-dark-100/50 rounded-xl p-3 sm:p-4 border border-dark-300/30">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-base font-bold text-dark-900">Body Font</h3>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setShowFontSelector({ type: 'body' })}
                              className="p-1.5 rounded hover:bg-primary-500/20 text-primary-600 transition-all"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onFontSelection('body', moodboard.fontPairing.body.name)}
                              className="p-1.5 rounded hover:bg-blue-500/20 text-blue-600 transition-all"
                            >
                              <Settings className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-semibold text-dark-700 mb-1">{moodboard.fontPairing.body.name}</p>
                            <p className="text-xs text-dark-500 mb-3">{moodboard.fontPairing.body.category}</p>
                          </div>
                          <div className="space-y-2" style={{ fontFamily: moodboard.fontPairing.body.name }}>
                            <p className="text-sm sm:text-base text-dark-800">Large body text for introductions and important content.</p>
                            <p className="text-xs sm:text-sm text-dark-700">Regular body text for paragraphs and descriptions. The quick brown fox jumps over the lazy dog.</p>
                            <p className="text-xs text-dark-600">Small text for captions and metadata.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Visual Inspiration Section */}
              <div className="bg-dark-200/40 backdrop-blur-xl rounded-xl border border-dark-300/30 overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-dark-300/30">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleSection('inspiration')}
                      className="flex items-center space-x-2"
                    >
                      <Image className="w-4 sm:w-5 h-4 sm:h-5 text-primary-500" />
                      <h2 className="text-lg sm:text-xl font-bold text-dark-900">Visual Inspiration</h2>
                      {expandedSections.has('inspiration') ? 
                        <ChevronUp className="w-4 h-4 text-dark-600" /> : 
                        <ChevronDown className="w-4 h-4 text-dark-600" />
                      }
                    </button>
                    <button
                      onClick={() => onRegenerateSection('inspiration')}
                      disabled={isLoading}
                      className="p-1.5 rounded-lg hover:bg-orange-500/20 text-orange-600 transition-all border border-orange-500/30 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {expandedSections.has('inspiration') && (
                  <div className="p-3 sm:p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                      {moodboard.visualInspiration.map((inspiration, index) => (
                        <div key={index} className="bg-dark-100/50 rounded-xl p-3 sm:p-4 border border-dark-300/30 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="p-1.5 rounded bg-gradient-to-r from-primary-500 to-primary-600">
                              <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-dark-900 truncate">{inspiration.title}</h3>
                          </div>
                          
                          <p className="text-dark-700 mb-3 leading-relaxed text-xs sm:text-sm">{inspiration.description}</p>
                          
                          <div className="space-y-2">
                            <div>
                              <h4 className="text-xs font-semibold text-dark-800 mb-1">Mood</h4>
                              <p className="text-xs text-dark-600">{inspiration.mood}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-xs font-semibold text-dark-800 mb-1">Key Colors</h4>
                              <div className="flex space-x-1">
                                {inspiration.colors.map((color, colorIndex) => (
                                  <div
                                    key={colorIndex}
                                    className="w-5 h-5 sm:w-6 sm:h-6 rounded border border-dark-300 shadow-sm"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-xs font-semibold text-dark-800 mb-1">Elements</h4>
                              <div className="flex flex-wrap gap-1">
                                {inspiration.elements.map((element, elementIndex) => (
                                  <span
                                    key={elementIndex}
                                    className="px-1.5 py-0.5 bg-primary-500/20 text-primary-600 rounded text-xs font-medium"
                                  >
                                    {element}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Component Suggestions Section */}
              <div className="bg-dark-200/40 backdrop-blur-xl rounded-xl border border-dark-300/30 overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-dark-300/30">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleSection('components')}
                      className="flex items-center space-x-2"
                    >
                      <Layers className="w-4 sm:w-5 h-4 sm:h-5 text-primary-500" />
                      <h2 className="text-lg sm:text-xl font-bold text-dark-900">Component Library</h2>
                      {expandedSections.has('components') ? 
                        <ChevronUp className="w-4 h-4 text-dark-600" /> : 
                        <ChevronDown className="w-4 h-4 text-dark-600" />
                      }
                    </button>
                    <button
                      onClick={() => onRegenerateSection('components')}
                      disabled={isLoading}
                      className="p-1.5 rounded-lg hover:bg-orange-500/20 text-orange-600 transition-all border border-orange-500/30 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {expandedSections.has('components') && (
                  <div className="p-3 sm:p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                      {moodboard.componentSuggestions.map((component, index) => (
                        <div key={index} className="bg-dark-100/50 rounded-xl p-3 sm:p-4 border border-dark-300/30 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm sm:text-base font-bold text-dark-900 truncate">{component.component}</h3>
                            <span className="px-2 py-0.5 bg-primary-500/20 text-primary-600 rounded-full text-xs font-medium">
                              {component.category}
                            </span>
                          </div>
                          
                          <p className="text-dark-700 mb-3 text-xs sm:text-sm">{component.description}</p>
                          
                          <div className="space-y-2">
                            <div>
                              <h4 className="text-xs font-semibold text-dark-800 mb-1">Styling</h4>
                              <code className="text-xs bg-dark-300/50 text-dark-700 p-2 rounded block font-mono break-all">
                                {component.styling}
                              </code>
                            </div>
                            
                            {component.states && (
                              <div>
                                <h4 className="text-xs font-semibold text-dark-800 mb-1">States</h4>
                                <div className="space-y-1">
                                  {Object.entries(component.states).map(([state, styling]) => (
                                    <div key={state} className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                      <span className="text-xs font-medium text-dark-600 w-12 capitalize">{state}:</span>
                                      <code className="text-xs bg-dark-300/50 text-dark-700 px-1.5 py-0.5 rounded font-mono flex-1 break-all">
                                        {styling}
                                      </code>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResponsiveContainer>
        </div>

        {/* Persistent Component Library */}
        <PersistentComponentLibrary
          moodboard={moodboard}
          isVisible={showComponentLibrary}
          onToggle={() => setShowComponentLibrary(!showComponentLibrary)}
        />
      </div>

      {/* Font Selector Modal */}
      {showFontSelector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-dark-100/95 backdrop-blur-2xl rounded-2xl border-2 border-dark-200/40 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-dark-200/30 flex items-center justify-between">
              <h2 className="text-xl font-bold text-dark-900">Select {showFontSelector.type} Font</h2>
              <button
                onClick={() => setShowFontSelector(null)}
                className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors"
              >
                <X className="w-5 h-5 text-dark-600" />
              </button>
            </div>
            <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
              <EnhancedFontSelector
                selectedFont={showFontSelector.type === 'heading' ? moodboard.fontPairing.heading.name : moodboard.fontPairing.body.name}
                onFontChange={(font) => {
                  console.log('Font changed:', font);
                  setShowFontSelector(null);
                }}
                fontType={showFontSelector.type}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};