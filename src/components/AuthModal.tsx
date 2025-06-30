import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User, Sparkles, Crown, Eye, EyeOff, AlertTriangle, Check, Info, Loader2 } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import zxcvbn from 'zxcvbn';
import { signUp, signIn, resetPassword } from '../services/supabase';
import { analytics } from '../services/analytics';
import { debounce } from '../utils/helpers';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  mode: 'signin' | 'signup';
}

// Password strength component
const PasswordStrengthMeter = ({ password }: { password: string }) => {
  if (!password) return null;
  
  const result = zxcvbn(password);
  const score = result.score; // 0-4 (0 = very weak, 4 = very strong)
  
  const getColor = () => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      case 4: return 'bg-green-600';
      default: return 'bg-gray-300';
    }
  };
  
  const getLabel = () => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };
  
  const getFeedback = () => {
    if (score >= 3) return null;
    
    const feedback = result.feedback.suggestions.length > 0 
      ? result.feedback.suggestions[0] 
      : result.feedback.warning;
      
    return feedback ? (
      <p className="text-xs text-dark-600 mt-1">{feedback}</p>
    ) : null;
  };
  
  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2 mb-1">
        <div className="flex-1 h-2 bg-dark-300/30 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getColor()} transition-all duration-300`} 
            style={{ width: `${(score + 1) * 20}%` }}
          />
        </div>
        <span className="text-xs font-medium text-dark-600">{getLabel()}</span>
      </div>
      {getFeedback()}
    </div>
  );
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode: initialMode
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot-password'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [step, setStep] = useState<'credentials' | 'mfa' | 'complete'>('credentials');
  const [mfaCode, setMfaCode] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setResetSent(false);
      setStep('credentials');
      setMfaCode('');
    }
  }, [isOpen, initialMode]);

  // Trap focus within modal for accessibility
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, mode, resetSent]);

  // Validation schemas
  const SignInSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  const SignUpSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password')
  });

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
  });

  // Check if email is already in use
  const checkEmailExists = debounce(async (email: string, setFieldError: any) => {
    try {
      // This is a mock implementation - in a real app, you would call an API endpoint
      // that checks if the email exists without revealing too much information
      const mockResponse = { exists: false };
      
      if (mockResponse.exists) {
        setFieldError('email', 'This email is already in use');
      }
    } catch (err) {
      console.error('Error checking email:', err);
    }
  }, 500);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (mode === 'signup') {
        // Check password strength
        const passwordStrength = zxcvbn(values.password);
        if (passwordStrength.score < 3) {
          setError('Please choose a stronger password');
          setLoading(false);
          return;
        }
        
        // Sign up
        result = await signUp(values.email, values.password);
        analytics.trackSignUp('email');
      } else if (mode === 'signin') {
        // Sign in
        result = await signIn(values.email, values.password);
        analytics.trackSignIn('email');
      } else if (mode === 'forgot-password') {
        // Reset password
        result = await resetPassword(values.email);
        if (!result.error) {
          setResetSent(true);
        } else {
          throw result.error;
        }
      }

      if (result?.error) {
        throw result.error;
      } else if (result?.data?.user) {
        // Create a proper user object and call onSuccess
        const userData = {
          id: result.data.user.id,
          email: result.data.user.email,
          created_at: result.data.user.created_at || new Date().toISOString()
        };
        
        // Close modal first
        onClose();
        
        // Then trigger success callback which will redirect to app
        onSuccess(userData);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      
      // Provide user-friendly error messages
      if (err.message.includes('rate limit')) {
        setError('Too many attempts. Please try again later.');
      } else if (err.message.includes('credentials')) {
        setError('Invalid email or password');
      } else if (err.message.includes('already registered')) {
        setError('This email is already registered. Please sign in instead.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-dark-100/95 backdrop-blur-2xl rounded-3xl border-2 border-dark-200/40 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-dark-200/30 sticky top-0 z-10 bg-dark-100/95 backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                <Sparkles className="w-6 h-6 text-dark-50" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark-900">
                  {mode === 'signup' ? 'Join AuraGen AI' : 
                   mode === 'signin' ? 'Welcome Back' : 
                   'Reset Password'}
                </h2>
                <p className="text-dark-600">
                  {mode === 'signup' ? 'Create your account' : 
                   mode === 'signin' ? 'Sign in to continue' :
                   'We\'ll send you a reset link'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-dark-200/50 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-dark-600" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 pb-8">
          {mode === 'signup' && step === 'credentials' && (
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

          {mode === 'forgot-password' && resetSent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Check Your Email</h3>
              <p className="text-dark-600 mb-6">
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </p>
              <button
                onClick={() => setMode('signin')}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <Formik
              initialValues={{
                email: '',
                password: '',
                confirmPassword: ''
              }}
              validationSchema={
                mode === 'signup' ? SignUpSchema : 
                mode === 'signin' ? SignInSchema : 
                ForgotPasswordSchema
              }
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldError, setFieldValue, isValid, dirty }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                      <Field
                        type="email"
                        name="email"
                        className={`w-full pl-10 pr-4 py-3 bg-dark-200/50 border ${
                          errors.email && touched.email 
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' 
                            : 'border-dark-300/50 focus:border-primary-400 focus:ring-primary-900/30'
                        } rounded-xl text-dark-900 placeholder-dark-500 outline-none transition-all duration-300 focus:ring-4`}
                        placeholder="Enter your email"
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                          if (mode === 'signup' && e.target.value) {
                            checkEmailExists(e.target.value, setFieldError);
                          }
                        }}
                      />
                    </div>
                    <ErrorMessage 
                      name="email" 
                      component="div" 
                      className="mt-1 text-sm text-red-500" 
                    />
                  </div>

                  {(mode === 'signin' || mode === 'signup') && (
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-2">
                        Password
                        {mode === 'signup' && <span className="text-dark-500 ml-1 text-xs">(min. 8 characters)</span>}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className={`w-full pl-10 pr-10 py-3 bg-dark-200/50 border ${
                            errors.password && touched.password 
                              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' 
                              : 'border-dark-300/50 focus:border-primary-400 focus:ring-primary-900/30'
                          } rounded-xl text-dark-900 placeholder-dark-500 outline-none transition-all duration-300 focus:ring-4`}
                          placeholder={mode === 'signup' ? "Create a strong password" : "Enter your password"}
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-500 hover:text-dark-700"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <ErrorMessage 
                        name="password" 
                        component="div" 
                        className="mt-1 text-sm text-red-500" 
                      />
                      
                      {mode === 'signup' && values.password && (
                        <PasswordStrengthMeter password={values.password} />
                      )}
                    </div>
                  )}

                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          className={`w-full pl-10 pr-4 py-3 bg-dark-200/50 border ${
                            errors.confirmPassword && touched.confirmPassword 
                              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' 
                              : 'border-dark-300/50 focus:border-primary-400 focus:ring-primary-900/30'
                          } rounded-xl text-dark-900 placeholder-dark-500 outline-none transition-all duration-300 focus:ring-4`}
                          placeholder="Confirm your password"
                        />
                      </div>
                      <ErrorMessage 
                        name="confirmPassword" 
                        component="div" 
                        className="mt-1 text-sm text-red-500" 
                      />
                    </div>
                  )}

                  {mode === 'signin' && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setMode('forgot-password')}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || (mode !== 'forgot-password' && (!isValid || !dirty))}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>
                          {mode === 'signup' ? 'Creating Account...' : 
                           mode === 'signin' ? 'Signing In...' : 
                           'Sending Reset Link...'}
                        </span>
                      </div>
                    ) : (
                      mode === 'signup' ? 'Create Account' : 
                      mode === 'signin' ? 'Sign In' : 
                      'Send Reset Link'
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          {/* Switch Mode */}
          {!resetSent && (
            <div className="mt-6 text-center">
              <p className="text-dark-600">
                {mode === 'signup' ? 'Already have an account?' : 
                 mode === 'signin' ? "Don't have an account?" :
                 'Remember your password?'}
                <button
                  onClick={() => setMode(mode === 'signup' ? 'signin' : mode === 'signin' ? 'signup' : 'signin')}
                  className="ml-2 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  {mode === 'signup' ? 'Sign In' : 
                   mode === 'signin' ? 'Sign Up' : 
                   'Sign In'}
                </button>
              </p>
            </div>
          )}

          {/* Security Info */}
          {mode === 'signup' && (
            <div className="mt-6 pt-6 border-t border-dark-200/30">
              <div className="flex items-start space-x-2 text-xs text-dark-500">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  By creating an account, you agree to our Terms of Service and Privacy Policy. 
                  We use industry-standard security practices to keep your data safe.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};