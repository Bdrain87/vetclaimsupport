import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const isTestEnv = typeof import.meta.env.VITEST !== 'undefined';
const isMissingConfig = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder');

if (isMissingConfig && !isTestEnv) {
  throw new Error(
    'Supabase configuration missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY environment variables.'
  );
}

// In production the throw above guarantees real values.
// In test mode, placeholder values allow tests to import this module
// without requiring real Supabase credentials.
export const supabase = createClient(
  isTestEnv && !supabaseUrl ? 'https://placeholder.supabase.co' : supabaseUrl,
  isTestEnv && !supabaseAnonKey ? 'placeholder-key' : supabaseAnonKey,
  {
    auth: {
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
