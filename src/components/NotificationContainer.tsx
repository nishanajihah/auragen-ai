import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { notifications } from '../services/notifications';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const NotificationContainer: React.FC = () => {
  const [notificationList, setNotificationList] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notifications.subscribe(setNotificationList);
    return unsubscribe;
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return AlertCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  if (notificationList.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notificationList.map((notification) => {
        const Icon = getIcon(notification.type);
        const styles = getStyles(notification.type);

        return (
          <div
            key={notification.id}
            className={`p-4 rounded-2xl border-2 backdrop-blur-xl shadow-xl animate-in slide-in-from-right duration-300 ${styles}`}
          >
            <div className="flex items-start space-x-3">
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm opacity-90 mt-1">{notification.message}</p>
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="text-sm font-medium underline mt-2 hover:no-underline transition-all"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => notifications.remove(notification.id)}
                className="p-1 rounded-lg hover:bg-black/10 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};