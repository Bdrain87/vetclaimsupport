/**
 * Secure auth storage adapter for Supabase.
 *
 * On native (iOS) auth tokens are stored in the Keychain via
 * capacitor-secure-storage-plugin. On web, falls back to localStorage
 * (browser sandboxing is the defence layer).
 *
 * CRITICAL: Every Keychain call MUST have a timeout. The Capacitor bridge
 * can hang indefinitely on iOS (especially TestFlight / WKWebView), which
 * blocks Supabase's signInWithPassword → _saveSession chain and causes the
 * login button to spin forever. When a Keychain call times out we fall back
 * to localStorage so the session is still persisted.
 *
 * Supabase's `auth.storage` interface accepts async getItem/setItem/removeItem.
 */

import { isNativeApp } from '@/lib/platform';
import { logger } from '@/utils/logger';

const AUTH_PREFIX = 'sb-auth-';
const KEYCHAIN_TIMEOUT_MS = 3_000;

let _pluginCache: Awaited<ReturnType<typeof loadPlugin>> | null = null;

async function loadPlugin() {
  const { SecureStoragePlugin } = await import('capacitor-secure-storage-plugin');
  return SecureStoragePlugin;
}

async function getNativePlugin() {
  if (!_pluginCache) {
    _pluginCache = await loadPlugin();
  }
  return _pluginCache;
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise,
    new Promise<T>((resolve) => {
      timer = setTimeout(() => resolve(fallback), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

export const secureAuthStorage = {
  async getItem(key: string): Promise<string | null> {
    if (!isNativeApp) {
      return localStorage.getItem(key);
    }
    try {
      const plugin = await getNativePlugin();
      const result = await withTimeout(
        plugin.get({ key: AUTH_PREFIX + key }).then(({ value }) => value ?? null),
        KEYCHAIN_TIMEOUT_MS,
        null,
      );
      // If Keychain returned null (timeout or missing), check localStorage
      // in case a previous setItem fell back there.
      if (result === null) {
        return localStorage.getItem(key);
      }
      return result;
    } catch {
      // Keychain error — check localStorage fallback
      return localStorage.getItem(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (!isNativeApp) {
      localStorage.setItem(key, value);
      return;
    }
    // Always write to localStorage first so the session is never lost,
    // even if the Keychain call below hangs or fails.
    try {
      localStorage.setItem(key, value);
    } catch {
      // localStorage full or unavailable — continue to try Keychain
    }
    try {
      const plugin = await getNativePlugin();
      // Fire-and-forget with timeout — don't block the auth flow.
      await withTimeout(
        plugin.set({ key: AUTH_PREFIX + key, value }),
        KEYCHAIN_TIMEOUT_MS,
        undefined,
      );
    } catch {
      // Keychain write failed — localStorage fallback already written above
    }
  },

  async removeItem(key: string): Promise<void> {
    if (!isNativeApp) {
      localStorage.removeItem(key);
      return;
    }
    // Remove from both storages
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    try {
      const plugin = await getNativePlugin();
      await withTimeout(
        plugin.remove({ key: AUTH_PREFIX + key }),
        KEYCHAIN_TIMEOUT_MS,
        undefined,
      );
    } catch {
      // Keychain remove failed — localStorage already cleared
    }
  },
};
