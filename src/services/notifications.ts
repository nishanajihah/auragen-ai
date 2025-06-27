// Notification service for user feedback
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  show(notification: Omit<Notification, 'id'>) {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification
    };

    this.notifications.push(newNotification);
    this.notify();

    // Auto-remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newNotification.duration);
    }

    return id;
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  clear() {
    this.notifications = [];
    this.notify();
  }

  // Convenience methods
  success(title: string, message: string, action?: Notification['action']) {
    return this.show({ type: 'success', title, message, action });
  }

  error(title: string, message: string, action?: Notification['action']) {
    return this.show({ type: 'error', title, message, duration: 8000, action });
  }

  warning(title: string, message: string, action?: Notification['action']) {
    return this.show({ type: 'warning', title, message, action });
  }

  info(title: string, message: string, action?: Notification['action']) {
    return this.show({ type: 'info', title, message, action });
  }

  // Specific app notifications
  limitReached(feature: string, limit: number) {
    return this.warning(
      'Usage Limit Reached',
      `You've reached your daily limit of ${limit} ${feature}s. Upgrade to Premium for unlimited access.`,
      {
        label: 'Upgrade',
        onClick: () => {
          // This will be handled by the component
          window.dispatchEvent(new CustomEvent('show-premium-modal'));
        }
      }
    );
  }

  generationSuccess() {
    return this.success(
      'Design Generated!',
      'Your AI-powered design system is ready to explore.'
    );
  }

  projectSaved(name: string) {
    return this.success(
      'Project Saved',
      `"${name}" has been saved successfully.`
    );
  }

  exportSuccess(format: string) {
    return this.success(
      'Export Complete',
      `Your design has been exported as ${format}.`
    );
  }

  authError(message: string) {
    return this.error(
      'Authentication Error',
      message
    );
  }

  networkError() {
    return this.error(
      'Network Error',
      'Please check your internet connection and try again.'
    );
  }
}

export const notifications = new NotificationService();