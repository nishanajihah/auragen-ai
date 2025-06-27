import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, RefreshCw, Download, Save, Palette, Type, 
  Image, Layers, Copy, Check, Eye, Grid, List, Sparkles,
  Monitor, Smartphone, Tablet, Zap, Heart, Star, Crown,
  Settings, Edit, ChevronDown, ChevronUp, Filter, X
} from 'lucide-react';
import { MoodboardData } from '../types';
import { FontSelector } from './FontSelector';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Palette className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-900 mb-2">No Design System Yet</h2>
          <p className="text-dark-600 mb-6">Start a conversation to generate your moodboard</p>
          <button
            onClick={onBackToChat}
            className="btn-primary"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200">
      {/* Header */}
      <div className="bg-dark-100/80 backdrop-blur-2xl border-b border-dark-200/30 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToChat}
                className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors border border-dark-300/30"
              >
                <ArrowLeft className="w-5 h-5 text-dark-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-dark-900">{projectName}</h1>
                <p className="text-sm text-dark-600">{moodboard.vibeSummary}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Device Preview Toggle */}
              <div className="flex items-center bg-dark-200/50 rounded-xl p-1 border border-dark-300/30">
                {[
                  { id: 'desktop', icon: Monitor },
                  { id: 'tablet', icon: Tablet },
                  { id: 'mobile', icon: Smartphone }
                ].map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedDevice(id as any)}
                    className={`p-2 rounded-lg transition-all ${
                      selectedDevice === id
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-dark-600 hover:bg-dark-300/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <button
                onClick={onOpenProjectManager}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 rounded-xl transition-all border border-purple-500/30"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Projects</span>
              </button>

              <button
                onClick={onExport}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-xl transition-all border border-emerald-500/30"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Color Palettes Section */}
            <div className="bg-dark-200/40 backdrop-blur-xl rounded-3xl border border-dark-300/30 overflow-hidden">
              <div className="p-6 border-b border-dark-300/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleSection('colors')}
                      className="flex items-center space-x-3"
                    >
                      <Palette className="w-6 h-6 text-primary-500" />
                      <h2 className="text-2xl font-bold text-dark-900">Color Palettes</h2>
                      {expandedSections.has('colors') ? 
                        <ChevronUp className="w-5 h-5 text-dark-600" /> : 
                        <ChevronDown className="w-5 h-5 text-dark-600" />
                      }
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* Color Format Toggle */}
                    <div className="flex items-center bg-dark-100/50 rounded-lg p-1">
                      {['hex', 'rgb', 'hsl'].map((format) => (
                        <button
                          key={format}
                          onClick={() => setSelectedColorFormat(format as any)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
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
                      className="p-2 rounded-xl hover:bg-orange-500/20 text-orange-600 transition-all border border-orange-500/30 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {expandedSections.has('colors') && (
                <div className="p-6">
                  <div className="space-y-8">
                    {moodboard.colorPalettes.map((palette, paletteIndex) => (
                      <div key={paletteIndex}>
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-dark-900 mb-1">{palette.name}</h3>
                          <p className="text-dark-600 text-sm">{palette.purpose}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                          {palette.colors.map((color, colorIndex) => (
                            <div key={colorIndex} className="group">
                              <div 
                                className="w-full h-24 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-4 border-dark-200 shadow-lg hover:rotate-1"
                                style={{ backgroundColor: color.hex }}
                                onClick={() => copyToClipboard(getColorValue(color), color.name)}
                              />
                              <div className="mt-3 text-center">
                                <p className="text-sm font-semibold text-dark-900 mb-1">{color.name}</p>
                                <button
                                  onClick={() => copyToClipboard(getColorValue(color), color.name)}
                                  className="flex items-center space-x-1 mx-auto text-xs text-dark-500 hover:text-primary-500 transition-colors group-hover:text-primary-500"
                                >
                                  <span className="font-mono">{getColorValue(color)}</span>
                                  {copiedColor === color.name ? (
                                    <Check className="w-3 h-3 text-green-500" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
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
            <div className="bg-dark-200/40 backdrop-blur-xl rounded-3xl border border-dark-300/30 overflow-hidden">
              <div className="p-6 border-b border-dark-300/30">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleSection('typography')}
                    className="flex items-center space-x-3"
                  >
                    <Type className="w-6 h-6 text-primary-500" />
                    <h2 className="text-2xl font-bold text-dark-900">Typography</h2>
                    {expandedSections.has('typography') ? 
                      <ChevronUp className="w-5 h-5 text-dark-600" /> : 
                      <ChevronDown className="w-5 h-5 text-dark-600" />
                    }
                  </button>
                  <button
                    onClick={() => onRegenerateSection('typography')}
                    disabled={isLoading}
                    className="p-2 rounded-xl hover:bg-orange-500/20 text-orange-600 transition-all border border-orange-500/30 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {expandedSections.has('typography') && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Heading Font */}
                    <div className="bg-dark-100/50 rounded-2xl p-6 border border-dark-300/30">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-dark-900">Heading Font</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowFontSelector({ type: 'heading' })}
                            className="p-2 rounded-lg hover:bg-primary-500/20 text-primary-600 transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onFontSelection('heading', moodboard.fontPairing.heading.name)}
                            className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-600 transition-all"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-dark-700 mb-2">{moodboard.fontPairing.heading.name}</p>
                          <p className="text-xs text-dark-500 mb-4">{moodboard.fontPairing.heading.category}</p>
                        </div>
                        <div className="space-y-3" style={{ fontFamily: moodboard.fontPairing.heading.name }}>
                          <h1 className="text-4xl font-bold text-dark-900">Heading 1</h1>
                          <h2 className="text-3xl font-bold text-dark-800">Heading 2</h2>
                          <h3 className="text-2xl font-semibold text-dark-700">Heading 3</h3>
                          <h4 className="text-xl font-semibold text-dark-700">Heading 4</h4>
                        </div>
                      </div>
                    </div>

                    {/* Body Font */}
                    <div className="bg-dark-100/50 rounded-2xl p-6 border border-dark-300/30">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-dark-900">Body Font</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowFontSelector({ type: 'body' })}
                            className="p-2 rounded-lg hover:bg-primary-500/20 text-primary-600 transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onFontSelection('body', moodboard.fontPairing.body.name)}
                            className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-600 transition-all"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-dark-700 mb-2">{moodboard.fontPairing.body.name}</p>
                          <p className="text-xs text-dark-500 mb-4">{moodboard.fontPairing.body.category}</p>
                        </div>
                        <div className="space-y-3" style={{ fontFamily: moodboard.fontPairing.body.name }}>
                          <p className="text-lg text-dark-800">Large body text for introductions and important content.</p>
                          <p className="text-base text-dark-700">Regular body text for paragraphs and descriptions. The quick brown fox jumps over the lazy dog.</p>
                          <p className="text-sm text-dark-600">Small text for captions and metadata.</p>
                          <p className="text-xs text-dark-500">Extra small text for fine print and labels.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Visual Inspiration Section */}
            <div className="bg-dark-200/40 backdrop-blur-xl rounded-3xl border border-dark-300/30 overflow-hidden">
              <div className="p-6 border-b border-dark-300/30">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleSection('inspiration')}
                    className="flex items-center space-x-3"
                  >
                    <Image className="w-6 h-6 text-primary-500" />
                    <h2 className="text-2xl font-bold text-dark-900">Visual Inspiration</h2>
                    {expandedSections.has('inspiration') ? 
                      <ChevronUp className="w-5 h-5 text-dark-600" /> : 
                      <ChevronDown className="w-5 h-5 text-dark-600" />
                    }
                  </button>
                  <button
                    onClick={() => onRegenerateSection('inspiration')}
                    disabled={isLoading}
                    className="p-2 rounded-xl hover:bg-orange-500/20 text-orange-600 transition-all border border-orange-500/30 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {expandedSections.has('inspiration') && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {moodboard.visualInspiration.map((inspiration, index) => (
                      <div key={index} className="bg-dark-100/50 rounded-2xl p-6 border border-dark-300/30 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-dark-900">{inspiration.title}</h3>
                        </div>
                        
                        <p className="text-dark-700 mb-4 leading-relaxed">{inspiration.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-dark-800 mb-2">Mood</h4>
                            <p className="text-sm text-dark-600">{inspiration.mood}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-dark-800 mb-2">Key Colors</h4>
                            <div className="flex space-x-2">
                              {inspiration.colors.map((color, colorIndex) => (
                                <div
                                  key={colorIndex}
                                  className="w-8 h-8 rounded-lg border-2 border-dark-300 shadow-sm"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-dark-800 mb-2">Elements</h4>
                            <div className="flex flex-wrap gap-2">
                              {inspiration.elements.map((element, elementIndex) => (
                                <span
                                  key={elementIndex}
                                  className="px-2 py-1 bg-primary-500/20 text-primary-600 rounded-lg text-xs font-medium"
                                >
                                  {element}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-dark-800 mb-2">Use Cases</h4>
                            <ul className="text-sm text-dark-600 space-y-1">
                              {inspiration.useCases.map((useCase, useCaseIndex) => (
                                <li key={useCaseIndex} className="flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                  <span>{useCase}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Component Suggestions Section */}
            <div className="bg-dark-200/40 backdrop-blur-xl rounded-3xl border border-dark-300/30 overflow-hidden">
              <div className="p-6 border-b border-dark-300/30">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleSection('components')}
                    className="flex items-center space-x-3"
                  >
                    <Layers className="w-6 h-6 text-primary-500" />
                    <h2 className="text-2xl font-bold text-dark-900">Component Library</h2>
                    {expandedSections.has('components') ? 
                      <ChevronUp className="w-5 h-5 text-dark-600" /> : 
                      <ChevronDown className="w-5 h-5 text-dark-600" />
                    }
                  </button>
                  <button
                    onClick={() => onRegenerateSection('components')}
                    disabled={isLoading}
                    className="p-2 rounded-xl hover:bg-orange-500/20 text-orange-600 transition-all border border-orange-500/30 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {expandedSections.has('components') && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {moodboard.componentSuggestions.map((component, index) => (
                      <div key={index} className="bg-dark-100/50 rounded-2xl p-6 border border-dark-300/30 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-dark-900">{component.component}</h3>
                          <span className="px-3 py-1 bg-primary-500/20 text-primary-600 rounded-full text-xs font-medium">
                            {component.category}
                          </span>
                        </div>
                        
                        <p className="text-dark-700 mb-4">{component.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-dark-800 mb-2">Styling</h4>
                            <code className="text-xs bg-dark-300/50 text-dark-700 p-2 rounded-lg block font-mono">
                              {component.styling}
                            </code>
                          </div>
                          
                          {component.states && (
                            <div>
                              <h4 className="text-sm font-semibold text-dark-800 mb-2">States</h4>
                              <div className="space-y-2">
                                {Object.entries(component.states).map(([state, styling]) => (
                                  <div key={state} className="flex items-center space-x-3">
                                    <span className="text-xs font-medium text-dark-600 w-16 capitalize">{state}:</span>
                                    <code className="text-xs bg-dark-300/50 text-dark-700 px-2 py-1 rounded font-mono flex-1">
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              
              {/* Design Principles */}
              <div className="bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-6">
                <h3 className="text-lg font-bold text-dark-900 mb-4 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-primary-500" />
                  <span>Design Principles</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-dark-800 mb-1">Spacing</h4>
                    <p className="text-sm text-dark-600">{moodboard.designPrinciples.spacing}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-dark-800 mb-1">Border Radius</h4>
                    <p className="text-sm text-dark-600">{moodboard.designPrinciples.borderRadius}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-dark-800 mb-1">Shadows</h4>
                    <p className="text-sm text-dark-600">{moodboard.designPrinciples.shadows}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-dark-800 mb-1">Animations</h4>
                    <p className="text-sm text-dark-600">{moodboard.designPrinciples.animations}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-dark-200/40 backdrop-blur-xl rounded-2xl border border-dark-300/30 p-6">
                <h3 className="text-lg font-bold text-dark-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => onRegenerateSection('all')}
                    disabled={isLoading}
                    className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Regenerate All</span>
                  </button>
                  
                  <button
                    onClick={onExport}
                    className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Design</span>
                  </button>
                  
                  <button
                    onClick={onOpenProjectManager}
                    className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Project</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Font Selector Modal */}
      {showFontSelector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-100/95 backdrop-blur-2xl rounded-3xl border-2 border-dark-200/40 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-dark-200/30 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-dark-900">Select {showFontSelector.type} Font</h2>
              <button
                onClick={() => setShowFontSelector(null)}
                className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors"
              >
                <X className="w-6 h-6 text-dark-600" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <FontSelector
                selectedFont={showFontSelector.type === 'heading' ? moodboard.fontPairing.heading.name : moodboard.fontPairing.body.name}
                onFontChange={(font) => {
                  // TODO: Update font in moodboard
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