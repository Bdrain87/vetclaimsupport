/**
 * Encryption key manager.
 *
 * Generates (or retrieves) a 256-bit AES key used for mandatory at-rest
 * encryption.  On iOS the key is stored in the Keychain via the Capacitor
 * Secure Storage plugin.  On web it is stored in localStorage (browser
 * sandboxing is the defence layer there).
 *
 * The key is cached in memory after first retrieval so that `getCachedKey()`
 * can be called synchronously on the hot path.
 */

import { isNativeApp } from '@/lib/platform';

const WEB_KEY_STORAGE_KEY = '_vcs_web_enc_key';
const NATIVE_KEY_ALIAS = 'vcs_encryption_key';

let _cachedKey: string | null = null;

/** Generate a cryptographically random 256-bit key, returned as base64. */
function generateKeyBase64(): string {
  const keyBytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = '';
  for (let i = 0; i < keyBytes.length; i++) {
    binary += String.fromCharCode(keyBytes[i]);
  }
  return btoa(binary);
}

/**
 * Initialise the encryption key.  Must be called (and awaited) once at app
 * startup before any store rehydration.
 *
 * - Generates a new 256-bit key on first launch.
 * - On subsequent launches, retrieves the existing key.
 * - Caches the key in memory for synchronous access via `getCachedKey()`.
 */
export async function initEncryptionKey(): Promise<string> {
  if (_cachedKey) return _cachedKey;

  if (isNativeApp) {
    // Dynamic import so the plugin is not bundled on web builds that don't
    // include it.
    const { SecureStoragePlugin } = await import('capacitor-secure-storage-plugin');

    try {
      const { value } = await SecureStoragePlugin.get({ key: NATIVE_KEY_ALIAS });
      _cachedKey = value;
      return _cachedKey;
    } catch {
      // Key doesn't exist yet — generate and store.
      const newKey = generateKeyBase64();
      await SecureStoragePlugin.set({ key: NATIVE_KEY_ALIAS, value: newKey });
      _cachedKey = newKey;
      return _cachedKey;
    }
  }

  // Web path — localStorage
  const existing = localStorage.getItem(WEB_KEY_STORAGE_KEY);
  if (existing) {
    _cachedKey = existing;
    return _cachedKey;
  }

  const newKey = generateKeyBase64();
  localStorage.setItem(WEB_KEY_STORAGE_KEY, newKey);
  _cachedKey = newKey;
  return _cachedKey;
}

/**
 * Return the encryption key synchronously.
 * Returns `null` if `initEncryptionKey()` has not completed yet.
 */
export function getCachedKey(): string | null {
  return _cachedKey;
}
