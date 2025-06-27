// import { createClient } from '@supabase/supabase-js';

// Commented out until dependency is installed manually
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// FIXED: Better mock implementation with proper user simulation
const mockUsers = new Map();
let currentUser: any = null;

const mockSupabase = {
  auth: {
    signUp: async (credentials: any) => {
      console.log('Mock signUp:', credentials);
      
      // Simulate user creation
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const user = { 
        id: userId, 
        email: credentials.email,
        created_at: new Date().toISOString()
      };
      
      // Store user in mock database
      mockUsers.set(credentials.email, { ...user, password: credentials.password });
      currentUser = user;
      
      // Store in localStorage for persistence
      localStorage.setItem('auragen_current_user', JSON.stringify(user));
      
      return { 
        data: { user }, 
        error: null 
      };
    },
    
    signInWithPassword: async (credentials: any) => {
      console.log('Mock signIn:', credentials);
      
      // Check if user exists
      const storedUser = mockUsers.get(credentials.email);
      if (!storedUser || storedUser.password !== credentials.password) {
        return {
          data: { user: null },
          error: { message: 'Invalid email or password' }
        };
      }
      
      const user = {
        id: storedUser.id,
        email: storedUser.email,
        created_at: storedUser.created_at
      };
      
      currentUser = user;
      
      // Store in localStorage for persistence
      localStorage.setItem('auragen_current_user', JSON.stringify(user));
      
      return { 
        data: { user }, 
        error: null 
      };
    },
    
    signOut: async () => {
      console.log('Mock signOut');
      currentUser = null;
      localStorage.removeItem('auragen_current_user');
      return { error: null };
    },
    
    getUser: async () => {
      // Check localStorage for persisted user
      const storedUser = localStorage.getItem('auragen_current_user');
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
      }
      return { data: { user: currentUser } };
    },
    
    onAuthStateChange: (callback: any) => {
      // Simulate auth state changes
      setTimeout(() => {
        const storedUser = localStorage.getItem('auragen_current_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          callback('SIGNED_IN', { user });
        } else {
          callback('SIGNED_OUT', null);
        }
      }, 100);
      
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};

export const supabase = mockSupabase;

// Auth helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Database helpers (mock for now)
export const saveProject = async (projectData: any) => {
  console.log('Mock saveProject:', projectData);
  return { data: projectData, error: null };
};

export const getUserProjects = async (userId: string) => {
  console.log('Mock getUserProjects:', userId);
  return { data: [], error: null };
};