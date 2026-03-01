/**
 * Secure auth storage adapter for Supabase.
 *
 * On native (iOS) auth tokens are stored in the Keychain via
 * capacitor-secure-storage-plugin. On web, falls back to localStorage
 * (browser sandboxing is the defence layer).
 *
 * Supabase's `auth.storage` interface accepts async getItem/setItem/removeItem.
 */

import { isNativeApp } from '@/lib/platform';

const AUTH_PREFIX = 'sb-auth-';
const KEYCHAIN_TIMEOUT_MS = 5_000;

async function getNativePlugin() {
  const { SecureStoragePlugin } = await import('capacitor-secure-storage-plugin');
  return SecureStoragePlugin;
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export const secureAuthStorage = {
  async getItem(key: string): Promise<string | null> {
    if (!isNativeApp) {
      return localStorage.getItem(key);
    }
    try {
      const plugin = await getNativePlugin();
      return await withTimeout(
        plugin.get({ key: AUTH_PREFIX + key }).then(({ value }) => value ?? null),
        KEYCHAIN_TIMEOUT_MS,
        null,
      );
    } catch {
      // Key doesn't exist in Keychain
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (!isNativeApp) {
      localStorage.setItem(key, value);
      return;
    }
    const plugin = await getNativePlugin();
    await plugin.set({ key: AUTH_PREFIX + key, value });
  },

  async removeItem(key: string): Promise<void> {
    if (!isNativeApp) {
      localStorage.removeItem(key);
      return;
    }
    try {
      const plugin = await getNativePlugin();
      await plugin.remove({ key: AUTH_PREFIX + key });
    } catch {
      // Key may not exist — ignore
    }
  },
};
