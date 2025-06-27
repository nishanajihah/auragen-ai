import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Sparkles, Crown } from 'lucide-react';
import { signUp, signIn } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  mode: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode: initialMode
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setEmail('');
      setPassword('');
      setError('');
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (mode === 'signup') {
        result = await signUp(email, password);
      } else {
        result = await signIn(email, password);
      }

      const { data, error } = result;

      if (error) {
        setError(error.message);
      } else if (data.user) {
        // FIXED: Create a proper user object and call onSuccess
        const userData = {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at || new Date().toISOString()
        };
        
        // Close modal first
        onClose();
        
        // Then trigger success callback which will redirect to app
        onSuccess(userData);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-100/95 backdrop-blur-2xl rounded-3xl border-2 border-dark-200/40 shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-dark-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                <Sparkles className="w-6 h-6 text-dark-50" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark-900">
                  {mode === 'signup' ? 'Join AuraGen AI' : 'Welcome Back'}
                </h2>
                <p className="text-dark-600">
                  {mode === 'signup' ? 'Create your account' : 'Sign in to continue'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors"
            >
              <X className="w-5 h-5 text-dark-600" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {mode === 'signup' && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/30">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-5 h-5 text-primary-500" />
                <span className="font-semibold text-primary-600">Free Account Includes:</span>
              </div>
              <ul className="text-sm text-dark-700 space-y-1">
                <li>• 3 AI generations per day</li>
                <li>• 2 saved projects</li>
                <li>• 1 export per day</li>
                <li>• Basic color palettes</li>
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-200/50 border border-dark-300/50 rounded-xl text-dark-900 placeholder-dark-500 outline-none transition-all focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-200/50 border border-dark-300/50 rounded-xl text-dark-900 placeholder-dark-500 outline-none transition-all focus:border-primary-400 focus:ring-4 focus:ring-primary-900/30"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                mode === 'signup' ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-dark-600">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                className="ml-2 text-primary-600 hover:text-primary-700 font-semibold"
              >
                {mode === 'signup' ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};