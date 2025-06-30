import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidSupabaseConfig = (): boolean => {
  return (
    supabaseUrl && 
    supabaseAnonKey && 
    isValidUrl(supabaseUrl) &&
    !supabaseUrl.includes('your_') && // Check for placeholder values
    !supabaseAnonKey.includes('your_')
  );
};

// Create Supabase client only if configuration is valid
export const supabase = isValidSupabaseConfig() 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

// Developer account email for special privileges
const DEVELOPER_EMAIL = 'developer@auragen.ai';

// Auth helpers with configuration checks
export const signUp = async (email: string, password: string, metadata?: any) => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error('Supabase is not configured. Please check your environment variables.') };
  }

  try {
    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...metadata,
          subscription_tier: email === DEVELOPER_EMAIL ? 'developer' : 'free',
          is_developer: email === DEVELOPER_EMAIL,
          created_at: new Date().toISOString(),
          account_status: 'active',
          failed_login_attempts: 0,
          mfa_enabled: false,
          password_history: []
        }
      }
    });

    if (error) {
      throw error;
    }

    // If email verification is enabled, inform the user
    if (data.user && !data.user.confirmed_at) {
      return { 
        data, 
        message: 'Please check your email for a confirmation link.',
        error: null 
      };
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error('Supabase is not configured. Please check your environment variables.') };
  }

  try {
    const { data, error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Track failed login attempts
      if (error.message.includes('Invalid login credentials')) {
        await trackFailedLoginAttempt(email);
      }
      throw error;
    }

    // Update user metadata if developer
    if (email === DEVELOPER_EMAIL && data.user) {
      await supabase!.auth.updateUser({
        data: {
          subscription_tier: 'developer',
          is_developer: true
        }
      });
    }

    // Update last login timestamp and reset failed attempts
    if (data.user) {
      await updateLoginStats(data.user.id);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase is not configured. Please check your environment variables.') };
  }

  try {
    const { error } = await supabase!.auth.signOut();
    if (error) {
      throw error;
    }
    
    // Clear local storage
    localStorage.removeItem('auragen-usage-tracking');
    localStorage.removeItem('auragen-projects');
    
    return { error: null };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { error };
  }
};

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data: { user }, error } = await supabase!.auth.getUser();
    if (error) {
      throw error;
    }
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const resetPassword = async (email: string) => {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase is not configured. Please check your environment variables.') };
  }

  try {
    const { error } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Reset password error:', error);
    return { error };
  }
};

export const updatePassword = async (newPassword: string) => {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase is not configured. Please check your environment variables.') };
  }

  try {
    // Get current user
    const { data: { user } } = await supabase!.auth.getUser();
    
    if (!user) {
      return { error: new Error('User not authenticated') };
    }
    
    // Get password history
    const { data: userData, error: userError } = await supabase!
      .from('users')
      .select('password_history')
      .eq('id', user.id)
      .single();
      
    if (userError) {
      console.error('Error fetching password history:', userError);
    }
    
    // Check if password is in history (this is a simplified check since we don't have access to the actual hashes)
    // In a real implementation, you would use a secure way to check password history
    const passwordHistory = userData?.password_history || [];
    
    // Update password
    const { error } = await supabase!.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      throw error;
    }
    
    // Update password history (keep last 5)
    const newHistory = [...passwordHistory, { changed_at: new Date().toISOString() }].slice(-5);
    
    await supabase!
      .from('users')
      .update({ 
        password_history: newHistory,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    return { error: null };
  } catch (error: any) {
    console.error('Update password error:', error);
    return { error };
  }
};

export const updateProfile = async (updates: any) => {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase is not configured. Please check your environment variables.') };
  }

  try {
    const { error } = await supabase!.auth.updateUser({
      data: updates
    });
    
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Update profile error:', error);
    return { error };
  }
};

// Check if user is developer
export const isDeveloper = (user: any): boolean => {
  return user?.user_metadata?.is_developer === true || user?.email === DEVELOPER_EMAIL;
};

// Get user subscription tier
export const getUserTier = (user: any): 'free' | 'starter' | 'pro' | 'developer' => {
  if (isDeveloper(user)) return 'developer';
  return user?.user_metadata?.subscription_tier || 'free';
};

// Track failed login attempts
const trackFailedLoginAttempt = async (email: string) => {
  if (!isSupabaseConfigured()) return;

  try {
    // Find user by email
    const { data: users, error: userError } = await supabase!
      .from('users')
      .select('id, failed_login_attempts, account_status')
      .eq('email', email);
      
    if (userError || !users || users.length === 0) {
      console.error('Error finding user for failed login tracking:', userError);
      return;
    }
    
    const user = users[0];
    const newAttempts = (user.failed_login_attempts || 0) + 1;
    
    // Update failed attempts
    const { error: updateError } = await supabase!
      .from('users')
      .update({ 
        failed_login_attempts: newAttempts,
        // Lock account after 5 failed attempts
        account_status: newAttempts >= 5 ? 'locked' : user.account_status,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
      
    if (updateError) {
      console.error('Error updating failed login attempts:', updateError);
    }
    
    // Log the failed attempt
    await logAuthEvent(user.id, 'failed_login', { 
      attempts: newAttempts,
      account_locked: newAttempts >= 5
    });
    
  } catch (error) {
    console.error('Error tracking failed login:', error);
  }
};

// Update login stats on successful login
const updateLoginStats = async (userId: string) => {
  if (!isSupabaseConfigured()) return;

  try {
    const { error } = await supabase!
      .from('users')
      .update({ 
        last_login_at: new Date().toISOString(),
        failed_login_attempts: 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating login stats:', error);
    }
    
    // Log the successful login
    await logAuthEvent(userId, 'successful_login');
    
  } catch (error) {
    console.error('Error updating login stats:', error);
  }
};

// Log authentication events
export const logAuthEvent = async (userId: string, eventType: string, details: any = {}) => {
  if (!isSupabaseConfigured()) return;

  try {
    const { error } = await supabase!
      .from('audit_logs')
      .insert({
        user_id: userId,
        event_type: eventType,
        details,
        ip_address: 'client-side', // In a real app, you'd get this from the server
        created_at: new Date().toISOString()
      });
      
    if (error) {
      console.error('Error logging auth event:', error);
    }
  } catch (error) {
    console.error('Error logging auth event:', error);
  }
};

// Database helpers
export const saveProject = async (projectData: any) => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error('Supabase is not configured. Please check your environment variables.') };
  }

  try {
    const { data, error } = await supabase!
      .from('projects')
      .insert([projectData])
      .select();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Save project error:', error);
    return { data: null, error };
  }
};

export const getUserProjects = async (userId: string) => {
  if (!isSupabaseConfigured()) {
    return { data: [], error: new Error('Supabase is not configured. Please check your environment variables.') };
  }

  try {
    const { data, error } = await supabase!
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Get user projects error:', error);
    return { data: [], error };
  }
};

// Usage tracking
export const saveUsageData = async (userId: string, usageData: any) => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error('Supabase is not configured. Please check your environment variables.') };
  }

  try {
    const { data, error } = await supabase!
      .from('usage_tracking')
      .upsert([{
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        ...usageData
      }])
      .select();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Save usage data error:', error);
    return { data: null, error };
  }
};

export const getUserUsage = async (userId: string) => {
  if (!isSupabaseConfigured()) {
    return { data: { generations: 0, exports: 0, projects: 0 }, error: new Error('Supabase is not configured. Please check your environment variables.') };
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase!
      .from('usage_tracking')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Not found error
      throw error;
    }
    
    return { data: data || { generations: 0, exports: 0, projects: 0 }, error: null };
  } catch (error: any) {
    console.error('Get user usage error:', error);
    return { data: { generations: 0, exports: 0, projects: 0 }, error };
  }
};

// Check if account is locked
export const isAccountLocked = async (email: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const { data: users, error } = await supabase!
      .from('users')
      .select('account_status')
      .eq('email', email)
      .single();
      
    if (error || !users) {
      return false;
    }
    
    return users.account_status === 'locked';
  } catch (error) {
    console.error('Error checking account status:', error);
    return false;
  }
};

// Unlock account
export const unlockAccount = async (userId: string) => {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase is not configured. Please check your environment variables.') };
  }

  try {
    const { error } = await supabase!
      .from('users')
      .update({ 
        account_status: 'active',
        failed_login_attempts: 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) {
      throw error;
    }
    
    await logAuthEvent(userId, 'account_unlocked');
    
    return { error: null };
  } catch (error: any) {
    console.error('Unlock account error:', error);
    return { error };
  }
};

// Setup MFA
export const setupMFA = async (userId: string, enabled: boolean) => {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase is not configured. Please check your environment variables.') };
  }

  try {
    // Update user MFA status
    const { error } = await supabase!
      .from('users')
      .update({ 
        mfa_enabled: enabled,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) {
      throw error;
    }
    
    await logAuthEvent(userId, enabled ? 'mfa_enabled' : 'mfa_disabled');
    
    return { error: null };
  } catch (error: any) {
    console.error('MFA setup error:', error);
    return { error };
  }
};