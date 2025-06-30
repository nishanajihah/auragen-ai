// Security utilities for authentication and authorization

import zxcvbn from 'zxcvbn';
import { analytics } from '../services/analytics';

// Password strength evaluation
export const evaluatePasswordStrength = (password: string): {
  score: number;
  feedback: string;
  isStrong: boolean;
  color: string;
} => {
  const result = zxcvbn(password);
  const score = result.score; // 0-4 (0 = very weak, 4 = very strong)
  
  let feedback = '';
  if (result.feedback.warning) {
    feedback = result.feedback.warning;
  } else if (result.feedback.suggestions.length > 0) {
    feedback = result.feedback.suggestions[0];
  }
  
  // Determine if password is strong enough (score >= 3)
  const isStrong = score >= 3;
  
  // Get color based on score
  let color = '';
  switch (score) {
    case 0: color = 'red'; break;
    case 1: color = 'red'; break;
    case 2: color = 'yellow'; break;
    case 3: color = 'green'; break;
    case 4: color = 'green'; break;
    default: color = 'gray';
  }
  
  return { score, feedback, isStrong, color };
};

// Check if password meets complexity requirements
export const meetsPasswordRequirements = (password: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors = [];
  
  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  // Check for number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Check for special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Check if email is valid
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if email is from a disposable domain
export const isDisposableEmail = async (email: string): Promise<boolean> => {
  // This is a simplified check - in a real app, you would use a service or API
  const disposableDomains = [
    'mailinator.com',
    'tempmail.com',
    'throwawaymail.com',
    'guerrillamail.com',
    'yopmail.com',
    'temp-mail.org'
  ];
  
  const domain = email.split('@')[1].toLowerCase();
  return disposableDomains.includes(domain);
};

// Rate limiting check (simplified client-side implementation)
export const checkRateLimit = (
  action: 'login' | 'signup' | 'password_reset',
  identifier: string
): boolean => {
  const now = Date.now();
  const storageKey = `rate_limit_${action}_${identifier}`;
  
  // Get stored attempts
  const storedData = localStorage.getItem(storageKey);
  let attempts: { timestamp: number; count: number } = storedData 
    ? JSON.parse(storedData)
    : { timestamp: now, count: 0 };
  
  // Check if we should reset the counter (different time windows for different actions)
  const resetThreshold = action === 'password_reset' 
    ? 60 * 60 * 1000 // 1 hour for password reset
    : 60 * 1000; // 1 minute for login/signup
  
  if (now - attempts.timestamp > resetThreshold) {
    attempts = { timestamp: now, count: 0 };
  }
  
  // Check if rate limit is exceeded
  const limits = {
    login: 5, // 5 attempts per minute
    signup: 3, // 3 attempts per minute
    password_reset: 3 // 3 attempts per hour
  };
  
  const isLimitExceeded = attempts.count >= limits[action];
  
  // If not exceeded, increment the counter
  if (!isLimitExceeded) {
    attempts.count++;
    localStorage.setItem(storageKey, JSON.stringify(attempts));
  } else {
    // Log rate limit exceeded
    analytics.track('rate_limit_exceeded', {
      action,
      attempts: attempts.count,
      reset_in: Math.ceil((attempts.timestamp + resetThreshold - now) / 1000) // seconds until reset
    });
  }
  
  return !isLimitExceeded;
};

// Generate a CSRF token
export const generateCsrfToken = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate a CSRF token
export const validateCsrfToken = (token: string): boolean => {
  const storedToken = localStorage.getItem('csrf_token');
  return token === storedToken;
};

// Set a CSRF token in storage
export const setCsrfToken = (token: string): void => {
  localStorage.setItem('csrf_token', token);
};

// Clear a CSRF token from storage
export const clearCsrfToken = (): void => {
  localStorage.removeItem('csrf_token');
};

// Log security events
export const logSecurityEvent = (
  eventType: string,
  details: Record<string, any> = {}
): void => {
  analytics.track(`security_${eventType}`, details);
  
  // In a real app, you might also want to send this to your backend
  console.log(`Security event: ${eventType}`, details);
};