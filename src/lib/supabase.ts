
import { createClient } from '@supabase/supabase-js';
import { Scenario, Settings } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if we're connected to Supabase
export const isSupabaseConfigured = () => {
  return supabaseUrl !== '' && supabaseAnonKey !== '';
};

// Check if user is logged in
export const isLoggedIn = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Get current user ID
export const getCurrentUserId = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id;
};
