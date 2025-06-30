import React, { useState, useEffect } from 'react';
import { Shield, X, AlertTriangle, Lock, RefreshCw } from 'lucide-react';
import { isAccountLocked, unlockAccount } from '../services/supabase';

interface SecurityBannerProps {
  user?: any;
  accountStatus?: string | null;
  onClose?: () => void;
}

export const SecurityBanner: React.FC<SecurityBannerProps> = ({
  user,
  accountStatus,
  onClose
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [bannerType, setBannerType] = useState<'warning' | 'error' | 'info'>('info');
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    if (accountStatus === 'locked') {
      setMessage('Your account has been locked due to too many failed login attempts. Please reset your password or contact support.');
      setBannerType('error');
      setVisible(true);
    } else if (accountStatus === 'suspended') {
      setMessage('Your account has been suspended. Please contact support for assistance.');
      setBannerType('error');
      setVisible(true);
    } else if (accountStatus === 'pending') {
      setMessage('Please verify your email address to activate your account.');
      setBannerType('warning');
      setVisible(true);
    }
  }, [user, accountStatus]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const handleUnlockAccount = async () => {
    if (!user) return;
    
    setIsUnlocking(true);
    try {
      await unlockAccount(user.id);
      setMessage('Your account has been unlocked. Please try logging in again.');
      setBannerType('info');
      setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 5000);
    } catch (error) {
      console.error('Error unlocking account:', error);
      setMessage('Failed to unlock your account. Please contact support.');
    } finally {
      setIsUnlocking(false);
    }
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-16 inset-x-0 z-40 ${
      bannerType === 'error' ? 'bg-red-500/10 border-b border-red-500/30' :
      bannerType === 'warning' ? 'bg-yellow-500/10 border-b border-yellow-500/30' :
      'bg-blue-500/10 border-b border-blue-500/30'
    } backdrop-blur-xl py-3 px-4 sm:px-6`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {bannerType === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : bannerType === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          ) : (
            <Shield className="w-5 h-5 text-blue-500" />
          )}
          
          <p className={`text-sm ${
            bannerType === 'error' ? 'text-red-500' :
            bannerType === 'warning' ? 'text-yellow-500' :
            'text-blue-500'
          }`}>
            {message}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {accountStatus === 'locked' && (
            <button
              onClick={handleUnlockAccount}
              disabled={isUnlocking}
              className="text-sm px-3 py-1 rounded-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-colors flex items-center space-x-1"
            >
              {isUnlocking ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Unlocking...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  <span>Unlock Account</span>
                </>
              )}
            </button>
          )}
          
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4 text-dark-500" />
          </button>
        </div>
      </div>
    </div>
  );
};