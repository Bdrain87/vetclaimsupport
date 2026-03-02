import { createClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';
import { secureAuthStorage } from '@/lib/secureAuthStorage';
import { isNativeApp } from '@/lib/platform';

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

// On native iOS WKWebView, navigator.locks can deadlock — the Supabase Auth SDK
// uses navigator.locks.request() to serialize auth ops, but WKWebView's
// implementation can hang on cold boot / suspend-resume / memory pressure.
// Single-tab native app doesn't need cross-tab lock serialization.
const noopLock = async (
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<any>,
) => await fn();

if (isNativeApp) {
  console.log('[supabase] native mode: lock=noop, detectSessionInUrl=false, broadcastChannel=suppressed');

  // Suppress BroadcastChannel on native — the SDK creates one for cross-tab
  // session sync which is useless in a single-tab WKWebView and could cause issues.
  if (typeof globalThis.BroadcastChannel !== 'undefined') {
    (globalThis as any).BroadcastChannel = undefined;
  }
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
      ...(isNativeApp && {
        lock: noopLock,
        // Native uses deep links for OAuth (nativeOAuth.ts), not URL params.
        // Skips URL parsing in _initialize() — prevents stale PKCE params or
        // capacitor:// URL from confusing the SDK.
        detectSessionInUrl: false,
        // Temporary: verbose logging for Safari Web Inspector debugging.
        // Remove after confirming login works on device.
        debug: true,
      }),
    },
    global: {
      fetch: fetchWithTimeout,
    },
  },
);

// Deduplicate concurrent getSession() calls at startup.
// Without this, 4+ parallel calls each go through the SDK's internal lock queue,
// each reading storage and potentially triggering a token refresh.
let _sharedSessionPromise: Promise<Session | null> | null = null;

export function getSharedSession(): Promise<Session | null> {
  if (!_sharedSessionPromise) {
    _sharedSessionPromise = supabase.auth
      .getSession()
      .then(({ data: { session } }) => session)
      .catch(() => null);
    _sharedSessionPromise.finally(() => {
      _sharedSessionPromise = null;
    });
  }
  return _sharedSessionPromise;
}
