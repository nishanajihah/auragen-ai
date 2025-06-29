import React, { useState, useEffect } from 'react';
import { 
  Layers, Search, ChevronDown, ChevronUp, Eye, Code, 
  Copy, ExternalLink, Filter, Grid, List, Bookmark,
  Palette, Type, Layout, Navigation, MousePointer
} from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  code: string;
  props: string[];
  examples: string[];
}

interface PersistentComponentLibraryProps {
  moodboard?: any;
  isVisible: boolean;
  onToggle: () => void;
}

export const PersistentComponentLibrary: React.FC<PersistentComponentLibraryProps> = ({
  moodboard,
  isVisible,
  onToggle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['buttons', 'forms']));
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);

  const categories = [
    { id: 'all', name: 'All Components', icon: Grid },
    { id: 'buttons', name: 'Buttons', icon: MousePointer },
    { id: 'forms', name: 'Form Elements', icon: Layout },
    { id: 'navigation', name: 'Navigation', icon: Navigation },
    { id: 'feedback', name: 'Feedback', icon: Palette },
    { id: 'layout', name: 'Layout', icon: Layers },
    { id: 'typography', name: 'Typography', icon: Type }
  ];

  // Generate components based on moodboard data
  const generateComponents = (): ComponentItem[] => {
    const baseComponents: ComponentItem[] = [
      {
        id: 'primary-button',
        name: 'Primary Button',
        category: 'buttons',
        description: 'Main action button with primary styling',
        preview: 'bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl',
        code: `<button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
  Primary Action
</button>`,
        props: ['variant', 'size', 'disabled', 'loading', 'icon'],
        examples: ['Submit Form', 'Call to Action', 'Primary Navigation']
      },
      {
        id: 'input-field',
        name: 'Input Field',
        category: 'forms',
        description: 'Styled input field with validation states',
        preview: 'bg-dark-200/50 border border-dark-300/50 rounded-xl px-4 py-3',
        code: `<input 
  type="text" 
  className="w-full bg-dark-200/50 border border-dark-300/50 rounded-xl px-4 py-3 text-dark-900 placeholder-dark-500 outline-none transition-all focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30"
  placeholder="Enter text..."
/>`,
        props: ['type', 'placeholder', 'disabled', 'error', 'icon'],
        examples: ['Contact Forms', 'Search Bars', 'User Input']
      },
      {
        id: 'card-component',
        name: 'Card',
        category: 'layout',
        description: 'Flexible card container with glass morphism',
        preview: 'bg-dark-100/95 backdrop-blur-xl rounded-2xl border border-dark-200/30 p-6',
        code: `<div className="bg-dark-100/95 backdrop-blur-xl rounded-2xl border border-dark-200/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
  <h3 className="text-xl font-bold text-dark-900 mb-4">Card Title</h3>
  <p className="text-dark-600">Card content goes here...</p>
</div>`,
        props: ['variant', 'padding', 'hoverable', 'onClick'],
        examples: ['Content Cards', 'Feature Highlights', 'Product Displays']
      }
    ];

    // Add moodboard-specific components
    if (moodboard?.componentSuggestions) {
      const moodboardComponents = moodboard.componentSuggestions.map((comp: any, index: number) => ({
        id: `moodboard-${index}`,
        name: comp.component,
        category: comp.category || 'layout',
        description: comp.description,
        preview: comp.styling,
        code: `<div className="${comp.styling}">
  ${comp.component}
</div>`,
        props: Object.keys(comp.states || {}),
        examples: [comp.description]
      }));
      
      return [...baseComponents, ...moodboardComponents];
    }

    return baseComponents;
  };

  const components = generateComponents();

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSection = (categoryId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-l-xl shadow-xl transition-all duration-300"
        title="Show Component Library"
      >
        <Layers className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-dark-100/95 backdrop-blur-2xl border-l border-dark-200/40 shadow-2xl z-30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-dark-200/30 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-primary-500" />
            <h3 className="font-bold text-dark-900">Components</h3>
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-dark-200/50 transition-colors"
          >
            <ChevronUp className="w-4 h-4 text-dark-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-9 pr-4 py-2 bg-dark-200/50 border border-dark-300/50 rounded-lg text-sm text-dark-900 placeholder-dark-500 outline-none focus:border-primary-400"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 bg-dark-200/50 border border-dark-300/50 rounded-lg px-3 py-2 text-sm text-dark-900 mr-2"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          
          <div className="flex items-center bg-dark-200/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-dark-600'}`}
            >
              <Grid className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-dark-600'}`}
            >
              <List className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        {viewMode === 'grid' ? (
          <div className="space-y-4">
            {categories.filter(cat => cat.id !== 'all').map(category => {
              const categoryComponents = filteredComponents.filter(comp => comp.category === category.id);
              if (categoryComponents.length === 0) return null;

              return (
                <div key={category.id} className="space-y-2">
                  <button
                    onClick={() => toggleSection(category.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-dark-200/50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <category.icon className="w-4 h-4 text-primary-500" />
                      <span className="font-medium text-dark-900 text-sm">{category.name}</span>
                      <span className="text-xs text-dark-500">({categoryComponents.length})</span>
                    </div>
                    {expandedSections.has(category.id) ? 
                      <ChevronUp className="w-4 h-4 text-dark-600" /> : 
                      <ChevronDown className="w-4 h-4 text-dark-600" />
                    }
                  </button>

                  {expandedSections.has(category.id) && (
                    <div className="space-y-2 ml-2">
                      {categoryComponents.map(component => (
                        <div
                          key={component.id}
                          className="p-3 rounded-lg border border-dark-300/30 bg-dark-200/20 hover:bg-dark-200/40 transition-all cursor-pointer group"
                          onClick={() => setSelectedComponent(component)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-dark-900 text-sm">{component.name}</h4>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(component.code);
                                }}
                                className="p-1 rounded hover:bg-dark-300/50 transition-colors"
                                title="Copy Code"
                              >
                                <Copy className="w-3 h-3 text-dark-500" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedComponent(component);
                                }}
                                className="p-1 rounded hover:bg-dark-300/50 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-3 h-3 text-dark-500" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-xs text-dark-600 mb-2">{component.description}</p>
                          
                          {/* Preview */}
                          <div className="bg-dark-300/30 rounded p-2 text-xs font-mono text-dark-700 overflow-hidden">
                            {component.preview.length > 50 ? 
                              `${component.preview.substring(0, 50)}...` : 
                              component.preview
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredComponents.map(component => (
              <div
                key={component.id}
                className="p-3 rounded-lg border border-dark-300/30 bg-dark-200/20 hover:bg-dark-200/40 transition-all cursor-pointer"
                onClick={() => setSelectedComponent(component)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-dark-900 text-sm">{component.name}</h4>
                    <p className="text-xs text-dark-600">{component.category}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(component.code);
                      }}
                      className="p-1 rounded hover:bg-dark-300/50 transition-colors"
                    >
                      <Copy className="w-3 h-3 text-dark-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredComponents.length === 0 && (
          <div className="text-center py-8">
            <Layers className="w-12 h-12 text-dark-400 mx-auto mb-3" />
            <p className="text-dark-600 text-sm">No components found</p>
          </div>
        )}
      </div>

      {/* Component Detail Modal */}
      {selectedComponent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-100/95 backdrop-blur-2xl rounded-2xl border border-dark-200/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-dark-200/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-dark-900">{selectedComponent.name}</h3>
                  <p className="text-dark-600">{selectedComponent.description}</p>
                </div>
                <button
                  onClick={() => setSelectedComponent(null)}
                  className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors"
                >
                  <ChevronUp className="w-5 h-5 text-dark-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-dark-900 mb-2">Code</h4>
                  <div className="bg-dark-300/30 rounded-lg p-4 font-mono text-sm text-dark-700 overflow-x-auto">
                    <pre>{selectedComponent.code}</pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedComponent.code)}
                    className="mt-2 flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Code</span>
                  </button>
                </div>
                
                {selectedComponent.props.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-dark-900 mb-2">Available Props</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedComponent.props.map(prop => (
                        <span key={prop} className="px-2 py-1 bg-primary-500/20 text-primary-600 rounded text-xs">
                          {prop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedComponent.examples.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-dark-900 mb-2">Use Cases</h4>
                    <ul className="space-y-1">
                      {selectedComponent.examples.map((example, index) => (
                        <li key={index} className="text-sm text-dark-600 flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};