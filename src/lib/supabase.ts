import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder';

// createClient requires non-empty strings; placeholder values are safe because
// all Supabase calls gate on auth session checks first.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
