import { createClient } from '@supabase/supabase-js';
import { secureAuthStorage } from '@/lib/secureAuthStorage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const isTestEnv = typeof import.meta.env.VITEST !== 'undefined';
const isMissingConfig = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder');

if (isMissingConfig && !isTestEnv) {
  throw new Error(
    'Supabase configuration missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY environment variables.'
  );
}

const AUTH_FETCH_TIMEOUT_MS = 15_000;

/**
 * Fetch wrapper with a 15-second timeout. Prevents infinite spinners when the
 * Supabase server is unreachable or hangs (wrong URL, DNS blackhole, proxy
 * timeout, etc.). Without this, window.fetch has NO timeout and will hang
 * forever, causing the login spinner to spin indefinitely.
 */
function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  // If the caller already set a signal, don't override it — just add ours.
  if (init?.signal) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AUTH_FETCH_TIMEOUT_MS);
    const onExternalAbort = () => controller.abort();
    init.signal.addEventListener('abort', onExternalAbort);
    return fetch(input, { ...init, signal: controller.signal }).finally(() => {
      clearTimeout(timeout);
      init.signal!.removeEventListener('abort', onExternalAbort);
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AUTH_FETCH_TIMEOUT_MS);
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timeout),
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
      storage: secureAuthStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: fetchWithTimeout,
    },
  },
);
