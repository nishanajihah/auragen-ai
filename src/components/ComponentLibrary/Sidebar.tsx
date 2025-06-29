import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: string | number;
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  position?: 'left' | 'right';
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  collapsible = false,
  defaultCollapsed = false,
  header,
  footer,
  className = '',
  position = 'left'
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`
      relative bg-dark-100/95 backdrop-blur-2xl border-r border-dark-200/30 
      transition-all duration-300 flex flex-col
      ${isCollapsed ? 'w-16' : 'w-64'}
      ${position === 'right' ? 'border-r-0 border-l' : ''}
      ${className}
    `}>
      {/* Header */}
      {header && (
        <div className={`p-4 border-b border-dark-200/30 ${isCollapsed ? 'px-2' : ''}`}>
          {isCollapsed ? (
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
          ) : (
            header
          )}
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`
              w-full flex items-center space-x-3 px-3 py-2 rounded-lg
              font-medium transition-all duration-200 group
              ${item.active 
                ? 'bg-primary-500 text-white shadow-lg' 
                : 'text-dark-700 hover:text-primary-600 hover:bg-primary-500/10'
              }
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            {item.icon && (
              <span className="flex-shrink-0">
                {item.icon}
              </span>
            )}
            
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge && (
                  <span className={`
                    px-2 py-0.5 text-xs font-semibold rounded-full
                    ${item.active 
                      ? 'bg-white/20 text-white' 
                      : 'bg-primary-500/20 text-primary-600'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {footer && !isCollapsed && (
        <div className="p-4 border-t border-dark-200/30">
          {footer}
        </div>
      )}

      {/* Collapse Toggle */}
      {collapsible && (
        <button
          onClick={toggleCollapse}
          className={`
            absolute top-1/2 transform -translate-y-1/2 
            w-6 h-6 bg-dark-100 border border-dark-200/40 rounded-full
            flex items-center justify-center text-dark-600 hover:text-primary-600
            transition-all duration-200 hover:scale-110
            ${position === 'left' ? '-right-3' : '-left-3'}
          `}
        >
          {position === 'left' ? (
            isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />
          ) : (
            isCollapsed ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
          )}
        </button>
      )}
    </div>
  );
};