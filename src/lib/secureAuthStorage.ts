/**
 * Auth storage adapter for Supabase.
 *
 * Uses localStorage on all platforms. WKWebView localStorage is
 * app-sandboxed by iOS — sufficient security for short-lived,
 * auto-refreshing auth tokens.
 */

export const secureAuthStorage = {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  },
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  },
  removeItem(key: string): void {
    try { localStorage.removeItem(key); } catch { /* storage error — ignore */ }
  },
};
