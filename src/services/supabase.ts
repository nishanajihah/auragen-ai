import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Developer account email for special privileges
const DEVELOPER_EMAIL = 'developer@auragen.ai';

// Auth helpers
export const signUp = async (email: string, password: string, metadata?: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...metadata,
          subscription_tier: email === DEVELOPER_EMAIL ? 'developer' : 'free',
          is_developer: email === DEVELOPER_EMAIL,
          created_at: new Date().toISOString()
        }
      }
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Update user metadata if developer
    if (email === DEVELOPER_EMAIL && data.user) {
      await supabase.auth.updateUser({
        data: {
          subscription_tier: 'developer',
          is_developer: true
        }
      });
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
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
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
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
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
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
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Update password error:', error);
    return { error };
  }
};

export const updateProfile = async (updates: any) => {
  try {
    const { error } = await supabase.auth.updateUser({
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

// Database helpers
export const saveProject = async (projectData: any) => {
  try {
    const { data, error } = await supabase
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
  try {
    const { data, error } = await supabase
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
  try {
    const { data, error } = await supabase
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
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
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