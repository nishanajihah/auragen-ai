import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = ''
}) => {
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }
    
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis');
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className={`flex items-center justify-center space-x-1 ${className}`}>
      {showFirstLast && currentPage > 1 && (
        <button
          onClick={() => onPageChange(1)}
          className="px-3 py-2 text-sm font-medium text-dark-600 hover:text-primary-600 hover:bg-primary-500/10 rounded-lg transition-colors"
        >
          First
        </button>
      )}
      
      {showPrevNext && currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 text-dark-600 hover:text-primary-600 hover:bg-primary-500/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === 'ellipsis' ? (
            <span className="px-3 py-2 text-dark-500">
              <MoreHorizontal className="w-4 h-4" />
            </span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${page === currentPage
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-dark-600 hover:text-primary-600 hover:bg-primary-500/10'
                }
              `}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      
      {showPrevNext && currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 text-dark-600 hover:text-primary-600 hover:bg-primary-500/10 rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
      
      {showFirstLast && currentPage < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-2 text-sm font-medium text-dark-600 hover:text-primary-600 hover:bg-primary-500/10 rounded-lg transition-colors"
        >
          Last
        </button>
      )}
    </nav>
  );
};