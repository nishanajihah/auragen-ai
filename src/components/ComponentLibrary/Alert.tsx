import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const types = {
  success: {
    classes: 'bg-green-500/10 border-green-500/30 text-green-400',
    icon: CheckCircle
  },
  error: {
    classes: 'bg-red-500/10 border-red-500/30 text-red-400',
    icon: AlertCircle
  },
  warning: {
    classes: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    icon: AlertTriangle
  },
  info: {
    classes: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    icon: Info
  }
};

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  dismissible = false,
  onDismiss,
  className = '',
  icon
}) => {
  const typeConfig = types[type];
  const IconComponent = icon || typeConfig.icon;

  return (
    <div className={`
      p-4 rounded-xl border-2 backdrop-blur-xl
      ${typeConfig.classes}
      ${className}
    `}>
      <div className="flex items-start space-x-3">
        <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          <p className="text-sm opacity-90">{message}</p>
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg hover:bg-black/10 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};