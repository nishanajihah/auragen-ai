import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

export interface NavigationItem {
  label: string;
  href?: string;
  onClick?: () => void;
  children?: NavigationItem[];
  active?: boolean;
}

export interface NavigationProps {
  items: NavigationItem[];
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  items,
  logo,
  actions,
  variant = 'horizontal',
  className = ''
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<number>>(new Set());

  const toggleDropdown = (index: number) => {
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(index)) {
      newOpenDropdowns.delete(index);
    } else {
      newOpenDropdowns.add(index);
    }
    setOpenDropdowns(newOpenDropdowns);
  };

  const renderNavigationItem = (item: NavigationItem, index: number, isMobile = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = openDropdowns.has(index);

    return (
      <div key={index} className="relative">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleDropdown(index);
            } else {
              item.onClick?.();
              if (isMobile) setMobileMenuOpen(false);
            }
          }}
          className={`
            flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-colors
            ${item.active 
              ? 'bg-primary-500 text-white' 
              : 'text-dark-700 hover:text-primary-600 hover:bg-primary-500/10'
            }
            ${isMobile ? 'w-full text-left' : ''}
          `}
        >
          <span>{item.label}</span>
          {hasChildren && (
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          )}
        </button>

        {hasChildren && isDropdownOpen && (
          <div className={`
            ${isMobile 
              ? 'mt-2 ml-4 space-y-1' 
              : 'absolute top-full left-0 mt-2 w-48 bg-dark-100/95 backdrop-blur-2xl rounded-xl border border-dark-200/40 shadow-2xl py-2 z-50'
            }
          `}>
            {item.children!.map((child, childIndex) => (
              <button
                key={childIndex}
                onClick={() => {
                  child.onClick?.();
                  if (isMobile) setMobileMenuOpen(false);
                }}
                className={`
                  block w-full text-left px-4 py-2 text-dark-700 hover:text-primary-600 hover:bg-primary-500/10 transition-colors
                  ${isMobile ? 'rounded-lg' : ''}
                `}
              >
                {child.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (variant === 'vertical') {
    return (
      <nav className={`space-y-2 ${className}`}>
        {items.map((item, index) => renderNavigationItem(item, index))}
      </nav>
    );
  }

  return (
    <nav className={`bg-dark-100/80 backdrop-blur-2xl border-b border-dark-200/30 ${className}`}>
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {logo && (
            <div className="flex-shrink-0">
              {logo}
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {items.map((item, index) => renderNavigationItem(item, index))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {actions}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-dark-200/50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-dark-200/30 py-4">
            <div className="space-y-2">
              {items.map((item, index) => renderNavigationItem(item, index, true))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};