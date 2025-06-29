import React from 'react';

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const variants = {
  default: 'bg-dark-100/95 backdrop-blur-xl border-2 border-dark-200/30 shadow-xl',
  elevated: 'bg-dark-100/95 backdrop-blur-xl border-2 border-dark-200/30 shadow-2xl hover:shadow-3xl',
  outlined: 'bg-transparent border-2 border-dark-300/50 hover:border-primary-500/50',
  glass: 'bg-dark-100/80 backdrop-blur-2xl border border-dark-200/40 shadow-xl'
};

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
  xl: 'p-8 sm:p-10'
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  onClick,
  hoverable = false
}) => {
  const baseClasses = 'rounded-2xl sm:rounded-3xl transition-all duration-500';
  const hoverClasses = hoverable || onClick ? 'hover:shadow-2xl hover:scale-105 cursor-pointer' : '';
  
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${paddings[padding]}
    ${hoverClasses}
    ${className}
  `.trim();

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};