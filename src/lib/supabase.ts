import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const isMissingConfig = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder');

if (isMissingConfig && typeof import.meta.env.VITEST === 'undefined') {
  throw new Error(
    'Supabase configuration missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY environment variables.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
