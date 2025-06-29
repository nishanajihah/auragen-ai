import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface CallToActionProps {
  variant?: 'primary' | 'secondary' | 'gradient' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title: string;
  description?: string;
  primaryAction: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  backgroundImage?: string;
  className?: string;
}

const variants = {
  primary: 'bg-dark-200/40 backdrop-blur-xl border border-dark-300/30',
  secondary: 'bg-gradient-to-r from-dark-100/80 to-dark-200/80 backdrop-blur-xl border border-dark-300/30',
  gradient: 'bg-gradient-to-r from-primary-500/10 via-primary-600/15 to-primary-700/10 backdrop-blur-2xl border-2 border-primary-500/30',
  minimal: 'bg-transparent'
};

const sizes = {
  sm: 'p-6 rounded-2xl',
  md: 'p-8 rounded-2xl',
  lg: 'p-12 rounded-3xl',
  xl: 'p-16 rounded-3xl'
};

export const CallToAction: React.FC<CallToActionProps> = ({
  variant = 'primary',
  size = 'lg',
  title,
  description,
  primaryAction,
  secondaryAction,
  backgroundImage,
  className = ''
}) => {
  return (
    <div 
      className={`
        relative overflow-hidden text-center
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : undefined}
    >
      {/* Background Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        <h2 className={`
          font-bold text-dark-900 mb-4
          ${size === 'xl' ? 'text-4xl md:text-5xl' : 
            size === 'lg' ? 'text-3xl md:text-4xl' : 
            size === 'md' ? 'text-2xl md:text-3xl' : 
            'text-xl md:text-2xl'}
          ${backgroundImage ? 'text-white' : ''}
        `}>
          {title}
        </h2>
        
        {description && (
          <p className={`
            text-dark-600 mb-8 max-w-2xl mx-auto leading-relaxed
            ${size === 'xl' ? 'text-xl' : 
              size === 'lg' ? 'text-lg' : 
              'text-base'}
            ${backgroundImage ? 'text-gray-200' : ''}
          `}>
            {description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            onClick={primaryAction.onClick}
            className={`
              group relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 
              hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white 
              px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 
              shadow-xl hover:shadow-2xl flex items-center space-x-3
              ${size === 'xl' ? 'text-xl px-12 py-6' : 
                size === 'lg' ? 'text-lg px-10 py-5' : 
                'text-base'}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center space-x-3">
              {primaryAction.icon}
              <span>{primaryAction.label}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
          
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={`
                bg-dark-200/90 hover:bg-dark-300/90 text-dark-900 px-8 py-4 rounded-2xl 
                font-bold transition-all duration-300 border-2 border-dark-300/50 
                hover:border-dark-400/50 shadow-lg hover:shadow-xl backdrop-blur-xl
                ${size === 'xl' ? 'text-xl px-12 py-6' : 
                  size === 'lg' ? 'text-lg px-10 py-5' : 
                  'text-base'}
                ${backgroundImage ? 'bg-white/90 hover:bg-white text-dark-900' : ''}
              `}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};