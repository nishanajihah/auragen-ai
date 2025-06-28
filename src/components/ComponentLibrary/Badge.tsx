import React from 'react';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variants = {
  primary: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
  secondary: 'bg-dark-300/20 text-dark-600 border-dark-400/30',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2 py-1 text-xs',
  lg: 'px-3 py-1 text-sm'
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  dot = false
}) => {
  const classes = `
    inline-flex items-center rounded-full border font-semibold
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();

  return (
    <span className={classes}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1 ${variant === 'primary' ? 'bg-primary-500' : 'bg-current'}`} />
      )}
      {children}
    </span>
  );
};