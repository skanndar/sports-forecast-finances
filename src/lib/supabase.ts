
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock response object with eq method
const createMockQueryResponse = () => ({
  data: null,
  error: { message: 'Supabase not configured' },
  eq: () => createMockQueryResponse()
});

// Create Supabase client with better error handling for missing config
export const supabase = (() => {
  // Log warning if environment variables are missing
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are missing. Using fallback to localStorage only.');
    console.warn('To enable Supabase, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
    
    // Return a dummy client that won't throw errors but won't do anything
    // This allows the app to work without Supabase configuration
    return {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
        signInWithOtp: async () => ({ error: null }),
      },
      from: () => ({
        select: () => createMockQueryResponse(),
        insert: () => createMockQueryResponse(),
        update: () => createMockQueryResponse(),
        delete: () => createMockQueryResponse(),
        eq: () => createMockQueryResponse(),
      }),
    };
  }
  
  // If we have valid credentials, create a real client
  return createClient(supabaseUrl, supabaseAnonKey);
})();

// Helper to check if we're connected to Supabase
export const isSupabaseConfigured = () => {
  return supabaseUrl !== '' && supabaseAnonKey !== '';
};

// Check if user is logged in
export const isLoggedIn = async () => {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

// Get current user ID
export const getCurrentUserId = async () => {
  if (!isSupabaseConfigured()) return null;
  
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
};
