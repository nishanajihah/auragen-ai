import React, { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';

// Input Component
export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  label,
  required = false,
  className = '',
  icon
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-dark-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-500">
            {icon}
          </div>
        )}
        
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 bg-dark-200/50 border border-dark-300/50 rounded-xl 
            text-dark-900 placeholder-dark-500 outline-none transition-all duration-300
            focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}
          `}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-500 hover:text-dark-700"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// Textarea Component
export interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  label,
  required = false,
  rows = 4,
  className = ''
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-dark-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-4 py-3 bg-dark-200/50 border border-dark-300/50 rounded-xl 
          text-dark-900 placeholder-dark-500 outline-none transition-all duration-300
          focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30
          disabled:opacity-50 disabled:cursor-not-allowed resize-none
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}
        `}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// Checkbox Component
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = ''
}) => {
  return (
    <label className={`flex items-center space-x-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`
          w-5 h-5 rounded border-2 transition-all duration-200
          ${checked 
            ? 'bg-primary-500 border-primary-500' 
            : 'bg-dark-200/50 border-dark-300/50 hover:border-primary-400'
          }
        `}>
          {checked && (
            <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
          )}
        </div>
      </div>
      {label && (
        <span className="text-dark-700 select-none">{label}</span>
      )}
    </label>
  );
};

// Radio Component
export interface RadioProps {
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const Radio: React.FC<RadioProps> = ({
  name,
  value,
  checked = false,
  onChange,
  disabled = false,
  label,
  className = ''
}) => {
  return (
    <label className={`flex items-center space-x-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`
          w-5 h-5 rounded-full border-2 transition-all duration-200
          ${checked 
            ? 'bg-primary-500 border-primary-500' 
            : 'bg-dark-200/50 border-dark-300/50 hover:border-primary-400'
          }
        `}>
          {checked && (
            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
      {label && (
        <span className="text-dark-700 select-none">{label}</span>
      )}
    </label>
  );
};

export const FormElements = {
  Input,
  Textarea,
  Checkbox,
  Radio
};