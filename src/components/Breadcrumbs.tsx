import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <button
        onClick={() => window.location.href = '/'}
        className="flex items-center text-dark-500 hover:text-primary-500 transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-dark-400" />
          {item.current ? (
            <span className="text-dark-900 font-medium truncate max-w-[200px]">
              {item.label}
            </span>
          ) : (
            <button
              onClick={item.onClick || (() => item.href && (window.location.href = item.href))}
              className="text-dark-600 hover:text-primary-500 transition-colors truncate max-w-[200px]"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};