import { isNativeApp } from './platform';
import { supabase } from './supabase';

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
 * When the OAuth provider redirects to `com.vetclaimsupport://auth-callback#access_token=...`,
 * iOS fires the `appUrlOpen` event. We parse the tokens from the URL fragment
 * and set the Supabase session.
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

    // Extract tokens from the URL fragment (after #)
    // Supabase appends: #access_token=...&refresh_token=...&token_type=bearer&...
    const hashIndex = url.indexOf('#');
    if (hashIndex === -1) return;

    const fragment = url.substring(hashIndex + 1);
    const params = new URLSearchParams(fragment);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  });
}

/** The redirect URL to pass to Supabase signInWithOAuth on native */
export function getNativeRedirectUrl(): string {
  return CALLBACK_URL;
}
