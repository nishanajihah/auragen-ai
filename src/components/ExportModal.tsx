import React, { useState } from 'react';
import { X, Download, FileText, Code, Palette, Image } from 'lucide-react';
import { MoodboardData } from '../types';
import { downloadAsJSON, copyToClipboard } from '../utils/helpers';
import { notifications } from '../services/notifications';
import { analytics } from '../services/analytics';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  moodboard: MoodboardData | null;
  projectName: string;
  onExport: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  moodboard,
  projectName,
  onExport
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'css' | 'figma' | 'pdf'>('json');
  const [exporting, setExporting] = useState(false);

  const exportFormats = [
    {
      id: 'json',
      name: 'JSON',
      description: 'Complete design system data',
      icon: FileText,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'css',
      name: 'CSS Variables',
      description: 'CSS custom properties',
      icon: Code,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'figma',
      name: 'Figma Tokens',
      description: 'Design tokens for Figma',
      icon: Palette,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'pdf',
      name: 'Style Guide PDF',
      description: 'Visual style guide',
      icon: Image,
      color: 'from-red-500 to-red-600'
    }
  ];

  const handleExport = async () => {
    if (!moodboard) return;

    setExporting(true);
    
    try {
      switch (selectedFormat) {
        case 'json':
          downloadAsJSON(moodboard, `${projectName}-design-system`);
          break;
        case 'css':
          exportCSS();
          break;
        case 'figma':
          exportFigmaTokens();
          break;
        case 'pdf':
          exportPDF();
          break;
      }

      onExport(); // Increment usage
      analytics.trackExport(selectedFormat, projectName);
      notifications.exportSuccess(selectedFormat.toUpperCase());
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      notifications.error('Export Failed', 'Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportCSS = () => {
    if (!moodboard) return;

    let css = ':root {\n';
    
    // Colors
    moodboard.colorPalettes.forEach((palette, paletteIndex) => {
      css += `  /* ${palette.name} */\n`;
      palette.colors.forEach((color, colorIndex) => {
        const varName = `--color-${palette.name.toLowerCase().replace(/\s+/g, '-')}-${color.name.toLowerCase().replace(/\s+/g, '-')}`;
        css += `  ${varName}: ${color.hex};\n`;
      });
      css += '\n';
    });

    // Typography
    css += '  /* Typography */\n';
    css += `  --font-heading: "${moodboard.fontPairing.heading.name}", ${moodboard.fontPairing.heading.fallback};\n`;
    css += `  --font-body: "${moodboard.fontPairing.body.name}", ${moodboard.fontPairing.body.fallback};\n`;
    
    Object.entries(moodboard.fontPairing.heading.sizes).forEach(([key, value]) => {
      css += `  --font-size-${key}: ${value};\n`;
    });

    Object.entries(moodboard.fontPairing.body.sizes).forEach(([key, value]) => {
      css += `  --font-size-${key}: ${value};\n`;
    });

    css += '}';

    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}-variables.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportFigmaTokens = () => {
    if (!moodboard) return;

    const tokens = {
      color: {},
      typography: {},
      spacing: {}
    };

    // Colors
    moodboard.colorPalettes.forEach(palette => {
      palette.colors.forEach(color => {
        const tokenName = `${palette.name.toLowerCase().replace(/\s+/g, '-')}.${color.name.toLowerCase().replace(/\s+/g, '-')}`;
        (tokens.color as any)[tokenName] = {
          value: color.hex,
          type: 'color',
          description: color.description
        };
      });
    });

    // Typography
    Object.entries(moodboard.fontPairing.heading.sizes).forEach(([key, value]) => {
      (tokens.typography as any)[`heading-${key}`] = {
        value: {
          fontFamily: moodboard.fontPairing.heading.name,
          fontSize: value,
          fontWeight: 600
        },
        type: 'typography'
      };
    });

    downloadAsJSON(tokens, `${projectName}-figma-tokens`);
  };

  const exportPDF = () => {
    // For now, just show a message that PDF export is coming soon
    notifications.info('PDF Export', 'PDF export is coming soon! Use JSON export for now.');
  };

  if (!isOpen || !moodboard) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-100/95 backdrop-blur-2xl rounded-3xl border-2 border-dark-200/40 shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="p-6 border-b border-dark-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark-900">Export Design System</h2>
                <p className="text-dark-600">Choose your preferred export format</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors"
            >
              <X className="w-6 h-6 text-dark-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id as any)}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  selectedFormat === format.id
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-300/30 bg-dark-200/30 hover:border-primary-400/50 hover:bg-primary-500/5'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${format.color} shadow-lg`}>
                    <format.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-dark-900">{format.name}</h4>
                </div>
                <p className="text-sm text-dark-600">{format.description}</p>
              </button>
            ))}
          </div>

          {/* Export Preview */}
          <div className="bg-dark-200/30 rounded-2xl p-4 border border-dark-300/30 mb-6">
            <h4 className="font-semibold text-dark-900 mb-2">Export Preview</h4>
            <p className="text-sm text-dark-600 mb-3">
              {selectedFormat === 'json' && 'Complete design system data including colors, typography, and components.'}
              {selectedFormat === 'css' && 'CSS custom properties for easy integration into your project.'}
              {selectedFormat === 'figma' && 'Design tokens compatible with Figma design systems.'}
              {selectedFormat === 'pdf' && 'Visual style guide document for sharing with your team.'}
            </p>
            <div className="text-xs text-dark-500 font-mono bg-dark-300/30 p-2 rounded">
              {projectName}-{selectedFormat === 'css' ? 'variables.css' : selectedFormat === 'figma' ? 'figma-tokens.json' : selectedFormat === 'pdf' ? 'style-guide.pdf' : 'design-system.json'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-dark-200/90 hover:bg-dark-300/90 text-dark-900 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 border-dark-300/50 hover:border-dark-400/50 shadow-lg hover:shadow-xl backdrop-blur-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {exporting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Exporting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export {selectedFormat.toUpperCase()}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};