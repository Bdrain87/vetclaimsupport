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

async function getNativePlugin() {
  const { SecureStoragePlugin } = await import('capacitor-secure-storage-plugin');
  return SecureStoragePlugin;
}

export const secureAuthStorage = {
  async getItem(key: string): Promise<string | null> {
    if (!isNativeApp) {
      return localStorage.getItem(key);
    }
    try {
      const plugin = await getNativePlugin();
      const { value } = await plugin.get({ key: AUTH_PREFIX + key });
      return value ?? null;
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
