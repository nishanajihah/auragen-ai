import { FEATURE_LIMITS } from './constants';

// Date and time utilities
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Usage tracking utilities
export const getUsageKey = (feature: string, userId?: string): string => {
  const today = new Date().toDateString();
  return `usage_${feature}_${userId || 'anonymous'}_${today}`;
};

export const getCurrentUsage = (feature: string, userId?: string): number => {
  const key = getUsageKey(feature, userId);
  return parseInt(localStorage.getItem(key) || '0');
};

export const incrementUsage = (feature: string, userId?: string): number => {
  const key = getUsageKey(feature, userId);
  const current = getCurrentUsage(feature, userId);
  const newUsage = current + 1;
  localStorage.setItem(key, newUsage.toString());
  return newUsage;
};

export const resetDailyUsage = (userId?: string): void => {
  const features = ['generation', 'export'];
  features.forEach(feature => {
    const key = getUsageKey(feature, userId);
    localStorage.removeItem(key);
  });
};

// Feature access utilities
export const checkFeatureAccess = (
  feature: 'generation' | 'project' | 'export',
  isPremium: boolean,
  userId?: string
): { allowed: boolean; reason: string; limit?: number; used?: number } => {
  const limits = isPremium ? FEATURE_LIMITS.PREMIUM : FEATURE_LIMITS.FREE;
  
  let limit: number;
  let currentUsage: number;

  switch (feature) {
    case 'generation':
      limit = limits.GENERATIONS_PER_DAY;
      currentUsage = getCurrentUsage('generation', userId);
      break;
    case 'project':
      limit = limits.PROJECTS_TOTAL;
      // For projects, we need to count total projects, not daily
      const projects = JSON.parse(localStorage.getItem('auragen-projects') || '[]');
      currentUsage = projects.filter((p: any) => !userId || p.userId === userId).length;
      break;
    case 'export':
      limit = limits.EXPORTS_PER_DAY;
      currentUsage = getCurrentUsage('export', userId);
      break;
    default:
      return { allowed: false, reason: 'unknown_feature' };
  }

  if (limit === -1) {
    return { allowed: true, reason: 'premium_unlimited' };
  }

  if (currentUsage >= limit) {
    return {
      allowed: false,
      reason: 'limit_reached',
      limit,
      used: currentUsage
    };
  }

  return {
    allowed: true,
    reason: 'within_limit',
    limit,
    used: currentUsage
  };
};

// Color utilities
export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgb(${r}, ${g}, ${b})`;
};

export const hexToHsl = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Local storage utilities
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key: string, defaultValue: any = null): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Project utilities
export const generateProjectId = (): string => {
  return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const sanitizeProjectName = (name: string): string => {
  return name.trim().replace(/[^a-zA-Z0-9\s-_]/g, '').substring(0, 50);
};

// Export utilities
export const downloadAsJSON = (data: any, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Audio utilities
export const playNotificationSound = (): void => {
  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
  audio.volume = 0.1;
  audio.play().catch(() => {
    // Ignore errors if audio can't play
  });
};