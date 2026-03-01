import { isNativeApp } from './platform';
import { supabase } from './supabase';
import { logger } from '@/utils/logger';

/** URL scheme registered in Info.plist for OAuth callbacks */
const CALLBACK_URL = 'com.vetclaimsupport://auth-callback';

let listenerRegistered = false;

/**
 * Open an OAuth URL in the native in-app browser (SFSafariViewController)
 * and return the callback URL scheme for Supabase to redirect to.
 */
export async function openNativeOAuth(url: string): Promise<void> {
  const { Browser } = await import('@capacitor/browser');
  await Browser.open({ url, presentationStyle: 'popover' });
}

/**
 * Register a one-time listener for the OAuth deep link callback.
 *
 * Supabase JS v2 defaults to PKCE flow, which redirects back with a
 * query-param `?code=...` (not a hash fragment). We must handle both:
 *
 *   PKCE:     com.vetclaimsupport://auth-callback?code=<authorization_code>
 *   Implicit: com.vetclaimsupport://auth-callback#access_token=...&refresh_token=...
 *
 * For PKCE we call `exchangeCodeForSession(code)` which completes the
 * handshake and fires onAuthStateChange with SIGNED_IN.
 */
export async function initNativeOAuthListener(): Promise<void> {
  if (!isNativeApp || listenerRegistered) return;
  listenerRegistered = true;

  const { App } = await import('@capacitor/app');

  App.addListener('appUrlOpen', async ({ url }) => {
    // Only handle our auth callback scheme
    if (!url.startsWith(CALLBACK_URL)) return;

    // Close the in-app browser
    try {
      const { Browser } = await import('@capacitor/browser');
      await Browser.close();
    } catch {
      // Browser may already be closed
    }

    try {
      // --- PKCE flow (Supabase v2 default) ---
      // Extract ?code= from query params. Custom URL schemes may not
      // parse reliably with `new URL()` on all platforms, so we use
      // manual string parsing for safety.
      const queryStart = url.indexOf('?');
      if (queryStart !== -1) {
        let queryString = url.substring(queryStart + 1);
        // Strip any trailing hash fragment from the query string
        const hashInQuery = queryString.indexOf('#');
        if (hashInQuery !== -1) {
          queryString = queryString.substring(0, hashInQuery);
        }
        const queryParams = new URLSearchParams(queryString);
        const code = queryParams.get('code');

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            logger.error('[nativeOAuth] PKCE code exchange failed:', error.message);
          }
          return;
        }
      }

      // --- Implicit flow fallback (hash fragment) ---
      // Supabase appends: #access_token=...&refresh_token=...&token_type=bearer&...
      const hashIndex = url.indexOf('#');
      if (hashIndex !== -1) {
        const fragment = url.substring(hashIndex + 1);
        const params = new URLSearchParams(fragment);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            logger.error('[nativeOAuth] setSession failed:', error.message);
          }
        }
      }
    } catch (err) {
      logger.error('[nativeOAuth] callback handling failed:', err);
    }
  });
}

/** The redirect URL to pass to Supabase signInWithOAuth on native */
export function getNativeRedirectUrl(): string {
  return CALLBACK_URL;
}
