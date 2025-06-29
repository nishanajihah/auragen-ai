import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

const positions = {
  'bottom-left': 'top-full left-0 mt-2',
  'bottom-right': 'top-full right-0 mt-2',
  'top-left': 'bottom-full left-0 mb-2',
  'top-right': 'bottom-full right-0 mb-2'
};

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  placeholder = 'Select an option',
  value,
  onChange,
  disabled = false,
  className = '',
  position = 'bottom-left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find(item => item.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      onChange?.(item.value);
      item.onClick?.();
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 
          bg-dark-200/50 border border-dark-300/50 rounded-xl 
          text-dark-900 transition-all duration-300 
          focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen ? 'border-primary-400 ring-4 ring-primary-900/30' : ''}
        `}
      >
        <div className="flex items-center space-x-2">
          {selectedItem?.icon}
          <span className={selectedItem ? 'text-dark-900' : 'text-dark-500'}>
            {selectedItem?.label || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-dark-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`
          absolute ${positions[position]} w-full z-50
          bg-dark-100/95 backdrop-blur-2xl rounded-xl border border-dark-200/40 
          shadow-2xl py-2 max-h-60 overflow-y-auto
        `}>
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={`
                w-full flex items-center space-x-2 px-4 py-2 text-left
                transition-colors duration-200
                ${item.disabled 
                  ? 'text-dark-400 cursor-not-allowed' 
                  : 'text-dark-700 hover:bg-dark-200/50 hover:text-dark-900'
                }
                ${value === item.value ? 'bg-primary-500/20 text-primary-600' : ''}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};