import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { analytics } from '../services/analytics';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<string | null>(null);

  useEffect(() => {
    // If Supabase is not configured, set loading to false and return
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Get account status
          const { data } = await supabase!
            .from('users')
            .select('account_status')
            .eq('id', session.user.id)
            .single();
            
          setAccountStatus(data?.account_status || 'active');
          
          // Track session start
          analytics.track('session_started', {
            user_id: session.user.id,
            auth_provider: 'email'
          });
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setAuthError('Failed to retrieve authentication session');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Get account status on auth change
          const { data } = await supabase!
            .from('users')
            .select('account_status')
            .eq('id', session.user.id)
            .single();
            
          setAccountStatus(data?.account_status || 'active');
          
          // Track auth events
          if (event === 'SIGNED_IN') {
            analytics.track('user_signed_in', {
              user_id: session.user.id,
              auth_provider: 'email'
            });
          } else if (event === 'SIGNED_OUT') {
            analytics.track('user_signed_out', {
              auth_provider: 'email'
            });
          }
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Check if account is locked
  const isAccountLocked = accountStatus === 'locked';
  
  // Check if account is suspended
  const isAccountSuspended = accountStatus === 'suspended';
  
  // Check if account is pending activation
  const isAccountPending = accountStatus === 'pending';
  
  // Check if account is active
  const isAccountActive = accountStatus === 'active';

  return {
    user,
    loading,
    authError,
    isAuthenticated: !!user && isAccountActive,
    isAccountLocked,
    isAccountSuspended,
    isAccountPending,
    accountStatus,
    isSupabaseConfigured: isSupabaseConfigured()
  };
};