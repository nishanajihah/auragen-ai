import React from 'react';
import { X } from 'lucide-react';

export interface BannerProps {
  type?: 'info' | 'success' | 'warning' | 'error' | 'promotional';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const types = {
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  success: 'bg-green-500/10 border-green-500/30 text-green-400',
  warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
  promotional: 'bg-gradient-to-r from-primary-500/10 to-purple-500/10 border-primary-500/30 text-primary-400'
};

export const Banner: React.FC<BannerProps> = ({
  type = 'info',
  message,
  action,
  dismissible = false,
  onDismiss,
  className = '',
  icon
}) => {
  return (
    <div className={`
      p-4 border-2 backdrop-blur-xl rounded-xl
      ${types[type]}
      ${className}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <span className="font-medium">{message}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {action && (
            <button
              onClick={action.onClick}
              className="px-4 py-2 bg-current/20 hover:bg-current/30 rounded-lg font-semibold transition-colors"
            >
              {action.label}
            </button>
          )}
          
          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 rounded-lg hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};