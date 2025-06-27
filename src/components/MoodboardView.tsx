import React, { useState } from 'react';
import { 
  ArrowLeft, RefreshCw, Copy, Palette, Type, Image, 
  Layers, Eye, Maximize2, X, Monitor, Tablet, Smartphone,
  Code, ChevronDown, ChevronUp, Download, Zap, Settings,
  Sun, Moon, RotateCcw, Check, AlertTriangle, AlertCircle,
  Home, User, Bell, FolderOpen, Save
} from 'lucide-react';
import { MoodboardData } from '../types';

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
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());
  const [selectedColorFormat, setSelectedColorFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [showPaletteMode, setShowPaletteMode] = useState<'light' | 'dark' | 'compare'>('light');
  const [expandedUsage, setExpandedUsage] = useState<Set<string>>(new Set());

  if (!moodboard) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Palette className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-dark-900 mb-2">No Moodboard Yet</h3>
          <p className="text-dark-600 mb-6">Start a conversation to generate your design inspiration</p>
          <button
            onClick={onBackToChat}
            className="btn-primary"
          >
            Start Conversation
          </button>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleComponent = (componentName: string) => {
    const newExpanded = new Set(expandedComponents);
    if (newExpanded.has(componentName)) {
      newExpanded.delete(componentName);
    } else {
      newExpanded.add(componentName);
    }
    setExpandedComponents(newExpanded);
  };

  const toggleUsage = (colorName: string) => {
    const newExpanded = new Set(expandedUsage);
    if (newExpanded.has(colorName)) {
      newExpanded.delete(colorName);
    } else {
      newExpanded.add(colorName);
    }
    setExpandedUsage(newExpanded);
  };

  const getColorValue = (color: any) => {
    switch (selectedColorFormat) {
      case 'rgb': return color.rgb;
      case 'hsl': return color.hsl;
      default: return color.hex;
    }
  };

  const hasMultiplePalettes = moodboard.colorPalettes && moodboard.colorPalettes.length > 1;

  // Get primary colors for component styling
  const primaryColors = moodboard.colorPalettes[0]?.colors || [];
  const primaryBlue = primaryColors.find(c => c.name.toLowerCase().includes('blue'))?.hex || '#3B82F6';
  const successGreen = primaryColors.find(c => c.name.toLowerCase().includes('green'))?.hex || '#10B981';
  const warningOrange = primaryColors.find(c => c.name.toLowerCase().includes('orange'))?.hex || '#F59E0B';
  const errorRed = primaryColors.find(c => c.name.toLowerCase().includes('red'))?.hex || '#EF4444';

  // Component preview renderer
  const renderComponentPreview = (component: any) => {
    const baseStyle = "transition-all duration-200";
    
    switch (component.component) {
      case 'Primary Button':
        return (
          <div className="flex flex-wrap gap-3">
            <button 
              className={`${baseStyle} px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
              style={{ backgroundColor: primaryBlue }}
            >
              Click Me
            </button>
            <button 
              className={`${baseStyle} px-6 py-3 rounded-lg font-semibold text-white shadow-lg opacity-75 cursor-not-allowed`}
              style={{ backgroundColor: primaryBlue }}
              disabled
            >
              Disabled
            </button>
          </div>
        );
      
      case 'Input Field':
        return (
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Enter text..." 
              className="w-full border-2 border-dark-300 bg-dark-200/50 rounded-lg px-4 py-3 text-dark-900 placeholder-dark-500 focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30 transition-all"
            />
            <input 
              type="text" 
              value="Focused state" 
              className="w-full border-2 border-primary-400 bg-dark-100 rounded-lg px-4 py-3 text-dark-900 ring-4 ring-primary-900/30"
              readOnly
            />
          </div>
        );
      
      case 'Success Alert':
        return (
          <div 
            className="p-4 rounded-lg border-2 flex items-center space-x-3"
            style={{ 
              backgroundColor: `${successGreen}20`, 
              borderColor: `${successGreen}50`,
              color: successGreen 
            }}
          >
            <Check className="w-5 h-5" />
            <span className="font-medium">Success! Your action was completed.</span>
          </div>
        );
      
      case 'Warning Alert':
        return (
          <div 
            className="p-4 rounded-lg border-2 flex items-center space-x-3"
            style={{ 
              backgroundColor: `${warningOrange}20`, 
              borderColor: `${warningOrange}50`,
              color: warningOrange 
            }}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Warning: Please review your input.</span>
          </div>
        );
      
      case 'Error Alert':
        return (
          <div 
            className="p-4 rounded-lg border-2 flex items-center space-x-3"
            style={{ 
              backgroundColor: `${errorRed}20`, 
              borderColor: `${errorRed}50`,
              color: errorRed 
            }}
          >
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error: Something went wrong.</span>
          </div>
        );
      
      case 'Card Container':
        return (
          <div className="bg-dark-200/50 rounded-xl p-6 shadow-lg border border-dark-300/50 hover:shadow-xl transition-all">
            <h5 className="font-semibold mb-2 text-dark-900">Card Title</h5>
            <p className="text-sm text-dark-600">This is a card container with some example content to show how it looks.</p>
            <button 
              className="mt-3 px-4 py-2 rounded-lg font-medium text-white"
              style={{ backgroundColor: primaryBlue }}
            >
              Action
            </button>
          </div>
        );
      
      case 'Navigation Item':
        return (
          <nav className="flex space-x-1 bg-dark-200/30 p-2 rounded-lg">
            <a 
              href="#" 
              className="px-4 py-2 rounded-lg font-medium text-white transition-all"
              style={{ backgroundColor: primaryBlue }}
            >
              Home
            </a>
            <a href="#" className="px-4 py-2 rounded-lg font-medium text-dark-600 hover:bg-dark-300/50 transition-all">
              About
            </a>
            <a href="#" className="px-4 py-2 rounded-lg font-medium text-dark-600 hover:bg-dark-300/50 transition-all">
              Contact
            </a>
          </nav>
        );
      
      case 'Modal Dialog':
        return (
          <div className="relative bg-dark-200/50 rounded-lg p-4 border border-dark-300/50">
            <div className="bg-dark-100 rounded-lg p-6 shadow-xl border border-dark-300/50">
              <h4 className="font-semibold text-dark-900 mb-2">Modal Title</h4>
              <p className="text-sm text-dark-600 mb-4">This is a modal dialog example.</p>
              <div className="flex space-x-3">
                <button 
                  className="px-4 py-2 rounded-lg font-medium text-white"
                  style={{ backgroundColor: primaryBlue }}
                >
                  Confirm
                </button>
                <button className="px-4 py-2 rounded-lg font-medium text-dark-600 bg-dark-300/50 hover:bg-dark-400/50 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-dark-200/50 rounded-lg p-4 border border-dark-300/50 text-center">
            <span className="text-dark-600">Component Preview</span>
          </div>
        );
    }
  };

  // State preview renderer
  const renderStatePreview = (component: any, state: string, styling: string) => {
    const baseClasses = "px-3 py-2 rounded text-sm font-medium transition-all";
    
    switch (component.component) {
      case 'Primary Button':
        let buttonStyle = { backgroundColor: primaryBlue, color: 'white' };
        let buttonClasses = baseClasses;
        
        if (state === 'hover') {
          buttonStyle.backgroundColor = '#2563EB'; // Darker blue
          buttonClasses += ' shadow-lg transform scale-105';
        } else if (state === 'active') {
          buttonStyle.backgroundColor = '#1D4ED8'; // Even darker
          buttonClasses += ' transform scale-95';
        } else if (state === 'disabled') {
          buttonStyle.backgroundColor = '#9CA3AF';
          buttonClasses += ' cursor-not-allowed opacity-75';
        } else if (state === 'focus') {
          buttonClasses += ' ring-4 ring-blue-200';
        }
        
        return (
          <button className={buttonClasses} style={buttonStyle}>
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </button>
        );
      
      default:
        return (
          <div className="px-3 py-2 bg-dark-200/50 rounded text-sm text-dark-600 border border-dark-300/50">
            {state}
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Project Name and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToChat}
            className="p-3 rounded-xl bg-dark-200/50 hover:bg-dark-300/50 border border-dark-300/50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5 text-dark-700" />
          </button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
              {moodboard.vibeSummary}
            </h1>
            <p className="text-lg text-dark-600 mt-1">Project: {projectName}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Project Manager Button */}
          <button
            onClick={onOpenProjectManager}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-2">
              <FolderOpen className="w-5 h-5" />
              <span>Manage Projects</span>
            </div>
          </button>

          {/* Export Button */}
          <button
            onClick={onExport}
            className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Export</span>
            </div>
          </button>

          <button
            onClick={() => onRegenerateSection('entire moodboard')}
            disabled={isLoading}
            className="btn-regenerate flex items-center space-x-2 px-6 py-3"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Regenerate All</span>
          </button>
        </div>
      </div>

      {/* Color Palettes */}
      <div className="card">
        <div className="section-header">
          <div className="flex items-center space-x-3">
            <Palette className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-dark-900">Color Palettes</h2>
          </div>
          <div className="flex items-center space-x-3">
            {/* Color Format Toggle */}
            <div className="flex items-center bg-dark-200/50 rounded-xl p-1">
              {(['hex', 'rgb', 'hsl'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedColorFormat(format)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedColorFormat === format
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-dark-600 hover:bg-dark-300/50'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Show Compare Mode only if multiple palettes */}
            {hasMultiplePalettes && (
              <div className="flex items-center bg-dark-200/50 rounded-xl p-1">
                <span className="text-sm font-medium text-dark-600 px-3">Compare Mode:</span>
                <button
                  onClick={() => setShowPaletteMode('compare')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
                    showPaletteMode === 'compare'
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-dark-600 hover:bg-dark-300/50'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Compare</span>
                </button>
              </div>
            )}

            {/* Add Dark Palette Button */}
            {!hasMultiplePalettes && (
              <button
                onClick={() => onRegenerateSection('dark palette')}
                disabled={isLoading}
                className="btn-regenerate flex items-center space-x-2 px-6 py-3"
              >
                <Moon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Create Dark Palette</span>
              </button>
            )}

            <button
              onClick={() => onRegenerateSection('colors')}
              disabled={isLoading}
              className="btn-regenerate flex items-center space-x-2 px-6 py-3"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Display palettes side by side when in compare mode */}
        {showPaletteMode === 'compare' && hasMultiplePalettes ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {moodboard.colorPalettes.map((palette, paletteIndex) => (
              <div key={paletteIndex} className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-dark-900">{palette.name}</h3>
                  <p className="text-dark-600">{palette.purpose}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {palette.colors.map((color, colorIndex) => (
                    <div key={colorIndex} className="group">
                      <div 
                        className="color-swatch"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyToClipboard(getColorValue(color))}
                      />
                      <div className="mt-3 text-center">
                        <h4 className="font-semibold text-dark-900 mb-1 text-sm">{color.name}</h4>
                        <button
                          onClick={() => copyToClipboard(getColorValue(color))}
                          className="text-xs text-primary-600 hover:text-primary-700 font-mono flex items-center space-x-1 mx-auto"
                        >
                          <span>{getColorValue(color)}</span>
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => toggleUsage(`${palette.name}-${color.name}`)}
                          className="text-xs text-dark-500 hover:text-primary-500 mt-1 flex items-center space-x-1 mx-auto"
                        >
                          <span>Usage</span>
                          {expandedUsage.has(`${palette.name}-${color.name}`) ? 
                            <ChevronUp className="w-3 h-3" /> : 
                            <ChevronDown className="w-3 h-3" />
                          }
                        </button>
                        {expandedUsage.has(`${palette.name}-${color.name}`) && (
                          <div className="mt-2 p-3 bg-dark-200/30 rounded-lg text-xs text-left">
                            <div className="space-y-2">
                              <div>
                                <span className="font-semibold text-dark-800">Description:</span>
                                <p className="text-dark-600 mt-1">{color.description}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-dark-800">Usage:</span>
                                <p className="text-dark-600 mt-1">{color.usage}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Regular palette display */
          <div className="space-y-8">
            {moodboard.colorPalettes.map((palette, paletteIndex) => (
              <div key={paletteIndex} className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-dark-900">{palette.name}</h3>
                  <p className="text-lg text-dark-600">{palette.purpose}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                  {palette.colors.map((color, colorIndex) => (
                    <div key={colorIndex} className="group">
                      <div 
                        className="color-swatch"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyToClipboard(getColorValue(color))}
                      />
                      <div className="mt-4 text-center">
                        <h4 className="font-semibold text-dark-900 mb-2">{color.name}</h4>
                        <button
                          onClick={() => copyToClipboard(getColorValue(color))}
                          className="text-sm text-primary-600 hover:text-primary-700 font-mono flex items-center space-x-1 mx-auto mb-2"
                        >
                          <span>{getColorValue(color)}</span>
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => toggleUsage(color.name)}
                          className="text-xs text-dark-500 hover:text-primary-500 flex items-center space-x-1 mx-auto"
                        >
                          <span>Usage Details</span>
                          {expandedUsage.has(color.name) ? 
                            <ChevronUp className="w-3 h-3" /> : 
                            <ChevronDown className="w-3 h-3" />
                          }
                        </button>
                        {expandedUsage.has(color.name) && (
                          <div className="mt-3 p-4 bg-dark-200/30 rounded-lg text-xs text-left">
                            <div className="space-y-3">
                              <div>
                                <span className="font-semibold text-dark-800 block mb-1">Description:</span>
                                <p className="text-dark-600">{color.description}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-dark-800 block mb-1">Best Used For:</span>
                                <p className="text-dark-600">{color.usage}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Typography System */}
      <div className="card">
        <div className="section-header">
          <div className="flex items-center space-x-3">
            <Type className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-dark-900">Typography System</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onFontSelection('heading', moodboard.fontPairing.heading.name)}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Change Fonts</span>
            </button>
            <button
              onClick={() => onRegenerateSection('fonts')}
              disabled={isLoading}
              className="btn-regenerate flex items-center space-x-2 px-6 py-3"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Heading Font */}
          <div className="font-preview">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark-900">Heading Font</h3>
              <button
                onClick={() => copyToClipboard(moodboard.fontPairing.heading.googleFont)}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                <span>Copy Google Font</span>
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-6" style={{ fontFamily: moodboard.fontPairing.heading.name }}>
              <div className="border-b border-dark-300/30 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-600 bg-dark-300/30 px-3 py-1 rounded-lg">H1</span>
                  <span className="text-xs text-dark-500 bg-dark-200/50 px-2 py-1 rounded font-mono">{moodboard.fontPairing.heading.sizes.h1}</span>
                </div>
                <h1 className="font-bold text-dark-900" style={{ fontSize: moodboard.fontPairing.heading.sizes.h1 }}>
                  Main Page Title
                </h1>
              </div>
              <div className="border-b border-dark-300/30 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-600 bg-dark-300/30 px-3 py-1 rounded-lg">H2</span>
                  <span className="text-xs text-dark-500 bg-dark-200/50 px-2 py-1 rounded font-mono">{moodboard.fontPairing.heading.sizes.h2}</span>
                </div>
                <h2 className="font-bold text-dark-900" style={{ fontSize: moodboard.fontPairing.heading.sizes.h2 }}>
                  Section Header
                </h2>
              </div>
              <div className="border-b border-dark-300/30 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-600 bg-dark-300/30 px-3 py-1 rounded-lg">H3</span>
                  <span className="text-xs text-dark-500 bg-dark-200/50 px-2 py-1 rounded font-mono">{moodboard.fontPairing.heading.sizes.h3}</span>
                </div>
                <h3 className="font-semibold text-dark-900" style={{ fontSize: moodboard.fontPairing.heading.sizes.h3 }}>
                  Subsection Title
                </h3>
              </div>
              <div className="border-b border-dark-300/30 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-600 bg-dark-300/30 px-3 py-1 rounded-lg">H4</span>
                  <span className="text-xs text-dark-500 bg-dark-200/50 px-2 py-1 rounded font-mono">{moodboard.fontPairing.heading.sizes.h4}</span>
                </div>
                <h4 className="font-semibold text-dark-900" style={{ fontSize: moodboard.fontPairing.heading.sizes.h4 }}>
                  Component Title
                </h4>
              </div>
              <div className="border-b border-dark-300/30 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-600 bg-dark-300/30 px-3 py-1 rounded-lg">H5</span>
                  <span className="text-xs text-dark-500 bg-dark-200/50 px-2 py-1 rounded font-mono">{moodboard.fontPairing.heading.sizes.h5}</span>
                </div>
                <h5 className="font-medium text-dark-900" style={{ fontSize: moodboard.fontPairing.heading.sizes.h5 }}>
                  Small Header
                </h5>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-600 bg-dark-300/30 px-3 py-1 rounded-lg">H6</span>
                  <span className="text-xs text-dark-500 bg-dark-200/50 px-2 py-1 rounded font-mono">{moodboard.fontPairing.heading.sizes.h6}</span>
                </div>
                <h6 className="font-medium text-dark-900" style={{ fontSize: moodboard.fontPairing.heading.sizes.h6 }}>
                  Smallest Header
                </h6>
              </div>
            </div>
          </div>

          {/* Body Font */}
          <div className="font-preview">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark-900">Body Font</h3>
              <button
                onClick={() => copyToClipboard(moodboard.fontPairing.body.googleFont)}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                <span>Copy Google Font</span>
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-6" style={{ fontFamily: moodboard.fontPairing.body.name }}>
              <div className="border-b border-dark-300/30 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-600 bg-dark-300/30 px-3 py-1 rounded-lg">Large</span>
                  <span className="text-xs text-dark-500 bg-dark-200/50 px-2 py-1 rounded font-mono">{moodboard.fontPairing.body.sizes.large}</span>
                </div>
                <p className="text-dark-900" style={{ fontSize: moodboard.fontPairing.body.sizes.large }}>
                  Large body text for introductions and important content that needs emphasis.
                </p>
              </div>
              <div className="border-b border-dark-300/30 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-600 bg-dark-300/30 px-3 py-1 rounded-lg">Regular</span>
                  <span className="text-xs text-dark-500 bg-dark-200/50 px-2 py-1 rounded font-mono">{moodboard.fontPairing.body.sizes.regular}</span>
                </div>
                <p className="text-dark-900" style={{ fontSize: moodboard.fontPairing.body.sizes.regular }}>
                  Regular body text for paragraphs, descriptions, and general content reading.
                </p>
              </div>
              <div className="border-b border-dark-300/30 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-600 bg-dark-300/30 px-3 py-1 rounded-lg">Small</span>
                  <span className="text-xs text-dark-500 bg-dark-200/50 px-2 py-1 rounded font-mono">{moodboard.fontPairing.body.sizes.small}</span>
                </div>
                <p className="text-dark-900" style={{ fontSize: moodboard.fontPairing.body.sizes.small }}>
                  Small text for captions, metadata, and secondary information.
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-600 bg-dark-300/30 px-3 py-1 rounded-lg">Caption</span>
                  <span className="text-xs text-dark-500 bg-dark-200/50 px-2 py-1 rounded font-mono">{moodboard.fontPairing.body.sizes.caption}</span>
                </div>
                <p className="text-dark-900" style={{ fontSize: moodboard.fontPairing.body.sizes.caption }}>
                  Caption text for fine print and minimal details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Inspiration */}
      <div className="card">
        <div className="section-header">
          <div className="flex items-center space-x-3">
            <Image className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-dark-900">Visual Inspiration</h2>
          </div>
          <button
            onClick={() => onRegenerateSection('visual inspiration')}
            disabled={isLoading}
            className="btn-regenerate flex items-center space-x-2 px-6 py-3"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moodboard.visualInspiration.map((inspiration, index) => (
            <div key={index} className="visual-example">
              <div 
                className="w-full h-48 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 flex items-center justify-center mb-4 cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => setFullscreenImage(inspiration.prompt)}
              >
                <Image className="w-16 h-16 text-primary-400 opacity-50" />
              </div>
              <h4 className="text-lg font-bold text-dark-900 mb-2">{inspiration.title}</h4>
              <p className="text-sm text-dark-600 mb-3">{inspiration.description}</p>
              <p className="text-xs text-primary-600 font-semibold mb-3">{inspiration.mood}</p>
              
              <div className="flex items-center space-x-2 mb-4">
                {inspiration.colors.slice(0, 3).map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setFullscreenImage(inspiration.prompt)}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => copyToClipboard(inspiration.prompt)}
                  className="flex-1 bg-dark-200 hover:bg-dark-300 text-dark-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy AI Prompt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Component Showcase & Mockups */}
      <div className="card">
        <div className="section-header">
          <div className="flex items-center space-x-3">
            <Layers className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-dark-900">Interactive Components</h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-dark-200/50 rounded-xl p-1">
              <button
                onClick={() => setSelectedDevice('desktop')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
                  selectedDevice === 'desktop'
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-dark-600 hover:bg-dark-300/50'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setSelectedDevice('tablet')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
                  selectedDevice === 'tablet'
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-dark-600 hover:bg-dark-300/50'
                }`}
              >
                <Tablet className="w-4 h-4" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setSelectedDevice('mobile')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
                  selectedDevice === 'mobile'
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-dark-600 hover:bg-dark-300/50'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
              </button>
            </div>
            <button
              onClick={() => onRegenerateSection('components')}
              disabled={isLoading}
              className="btn-regenerate flex items-center space-x-2 px-6 py-3"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Interactive Components */}
        <div className="space-y-6">
          {moodboard.componentSuggestions.map((component, index) => (
            <div key={index} className="component-example">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-dark-900">{component.component}</h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(component.styling)}
                    className="p-2 rounded-lg hover:bg-dark-300/50 transition-colors"
                    title="Copy CSS Classes"
                  >
                    <Copy className="w-4 h-4 text-dark-500" />
                  </button>
                  <button
                    onClick={() => toggleComponent(component.component)}
                    className="p-2 rounded-lg hover:bg-dark-300/50 transition-colors"
                  >
                    {expandedComponents.has(component.component) ? 
                      <ChevronUp className="w-4 h-4 text-dark-500" /> : 
                      <ChevronDown className="w-4 h-4 text-dark-500" />
                    }
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-dark-600 mb-6">{component.description}</p>
              
              {/* Component Preview - Centered */}
              <div className="mb-6">
                <h5 className="font-semibold text-dark-800 mb-4 flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Live Preview</span>
                </h5>
                <div className="flex justify-center p-6 bg-dark-200/30 rounded-xl border border-dark-300/30">
                  {renderComponentPreview(component)}
                </div>
              </div>

              {expandedComponents.has(component.component) && (
                <div className="space-y-6">
                  {/* Component States with Visual Previews */}
                  {component.states && (
                    <div>
                      <h5 className="font-semibold text-dark-800 mb-4 flex items-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span>Component States</span>
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(component.states).map(([state, styling]) => (
                          <div key={state} className="bg-dark-200/30 rounded-lg p-4 border border-dark-300/30">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-dark-700 capitalize">{state}</span>
                            </div>
                            <div className="flex justify-center mb-3 p-3 bg-dark-100/50 rounded-lg">
                              {renderStatePreview(component, state, styling)}
                            </div>
                            <code className="text-xs text-primary-600 bg-dark-900 text-green-400 p-2 rounded block overflow-x-auto">
                              {styling}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CSS Classes */}
                  <div>
                    <h5 className="font-semibold text-dark-800 mb-3 flex items-center space-x-2">
                      <Code className="w-4 h-4" />
                      <span>CSS Classes</span>
                    </h5>
                    <div className="bg-dark-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      {component.styling}
                    </div>
                  </div>

                  {/* Color Palette Quick Access */}
                  <div>
                    <h5 className="font-semibold text-dark-800 mb-3 flex items-center space-x-2">
                      <Palette className="w-4 h-4" />
                      <span>Quick Color Access</span>
                    </h5>
                    <div className="flex flex-wrap gap-3">
                      {moodboard.colorPalettes[0]?.colors.slice(0, 5).map((color, colorIndex) => (
                        <button
                          key={colorIndex}
                          onClick={() => copyToClipboard(color.hex)}
                          className="flex items-center space-x-2 bg-dark-200/50 border border-dark-300/50 rounded-lg px-3 py-2 hover:shadow-lg transition-all hover:bg-dark-300/50"
                          title={`Copy ${color.name}`}
                        >
                          <div 
                            className="w-4 h-4 rounded-full border border-dark-400"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-sm font-mono text-dark-700">{color.hex}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Device Mockup */}
        <div className="mt-8 pt-8 border-t border-dark-300/30">
          <h3 className="text-xl font-bold text-dark-900 mb-6 text-center">Landing Page Mockup</h3>
          <div className="flex justify-center">
            <div className={`device-mockup ${selectedDevice} relative`}>
              <div className="device-screen bg-dark-100 p-4 overflow-hidden">
                {selectedDevice === 'desktop' && (
                  <div className="space-y-4 text-xs">
                    <div 
                      className="h-8 rounded flex items-center px-3 text-white font-semibold"
                      style={{ backgroundColor: primaryBlue }}
                    >
                      Navigation Bar
                    </div>
                    <div 
                      className="h-24 rounded flex items-center justify-center"
                      style={{ backgroundColor: `${primaryBlue}20`, color: primaryBlue }}
                    >
                      <span className="font-bold">Hero Section</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-dark-200/50 rounded flex items-center justify-center">
                          <span className="text-dark-600 text-xs">Feature {i}</span>
                        </div>
                      ))}
                    </div>
                    <div className="h-12 bg-dark-300/50 rounded flex items-center justify-center">
                      <span className="text-dark-600 text-xs">Footer</span>
                    </div>
                  </div>
                )}
                {selectedDevice === 'tablet' && (
                  <div className="space-y-3 text-xs">
                    <div 
                      className="h-6 rounded flex items-center px-2 text-white font-semibold"
                      style={{ backgroundColor: primaryBlue }}
                    >
                      Nav
                    </div>
                    <div 
                      className="h-20 rounded flex items-center justify-center"
                      style={{ backgroundColor: `${primaryBlue}20`, color: primaryBlue }}
                    >
                      <span className="font-bold text-sm">Hero</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map(i => (
                        <div key={i} className="h-12 bg-dark-200/50 rounded flex items-center justify-center">
                          <span className="text-dark-600 text-xs">Feature {i}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedDevice === 'mobile' && (
                  <div className="space-y-2 text-xs">
                    <div 
                      className="h-4 rounded flex items-center px-2 text-white font-semibold text-xs"
                      style={{ backgroundColor: primaryBlue }}
                    >
                      Nav
                    </div>
                    <div 
                      className="h-16 rounded flex items-center justify-center"
                      style={{ backgroundColor: `${primaryBlue}20`, color: primaryBlue }}
                    >
                      <span className="font-bold text-xs">Hero</span>
                    </div>
                    <div className="space-y-1">
                      {[1, 2].map(i => (
                        <div key={i} className="h-8 bg-dark-200/50 rounded flex items-center justify-center">
                          <span className="text-dark-600 text-xs">Feature {i}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setFullscreenImage('mockup')}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            {fullscreenImage === 'mockup' ? (
              <div className="bg-dark-100 rounded-2xl p-8 max-h-[80vh] overflow-auto">
                <h3 className="text-2xl font-bold mb-6 text-dark-900">Landing Page Mockup - {selectedDevice}</h3>
                <div className="flex justify-center">
                  <div className={`device-mockup ${selectedDevice} scale-150`}>
                    <div className="device-screen bg-dark-100 p-4 overflow-hidden">
                      {selectedDevice === 'desktop' && (
                        <div className="space-y-4 text-sm">
                          <div 
                            className="h-12 rounded flex items-center px-4 text-white font-semibold"
                            style={{ backgroundColor: primaryBlue }}
                          >
                            Navigation Bar
                          </div>
                          <div 
                            className="h-32 rounded flex items-center justify-center"
                            style={{ backgroundColor: `${primaryBlue}20`, color: primaryBlue }}
                          >
                            <span className="font-bold text-lg">Hero Section</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="h-24 bg-dark-200/50 rounded flex items-center justify-center">
                                <span className="text-dark-600">Feature {i}</span>
                              </div>
                            ))}
                          </div>
                          <div className="h-16 bg-dark-300/50 rounded flex items-center justify-center">
                            <span className="text-dark-600">Footer</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-dark-100 rounded-2xl p-8 max-h-[80vh] overflow-auto">
                <h3 className="text-2xl font-bold mb-4 text-dark-900">Visual Inspiration</h3>
                <div 
                  className="rounded-xl p-8 mb-6 text-center"
                  style={{ backgroundColor: `${primaryBlue}10` }}
                >
                  <Image className="w-24 h-24 text-primary-400 mx-auto mb-4" />
                  <p className="text-lg text-dark-700 leading-relaxed">{fullscreenImage}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => copyToClipboard(fullscreenImage)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy AI Prompt</span>
                  </button>
                  <button
                    onClick={() => setFullscreenImage(null)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};