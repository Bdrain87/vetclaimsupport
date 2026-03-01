/**
 * Encryption key manager.
 *
 * Generates (or retrieves) a 256-bit AES key used for mandatory at-rest
 * encryption.  On iOS the key is stored in the Keychain via the Capacitor
 * Secure Storage plugin.  On web it is stored in localStorage (browser
 * sandboxing is the defence layer there).
 *
 * CRITICAL: All Keychain calls have a timeout + localStorage fallback.
 * The Capacitor bridge can hang on iOS (TestFlight / WKWebView), which
 * would block store hydration and leave the app on a black screen forever.
 *
 * The key is cached in memory after first retrieval so that `getCachedKey()`
 * can be called synchronously on the hot path.
 */

import { isNativeApp } from '@/lib/platform';
import { logger } from '@/utils/logger';

const WEB_KEY_STORAGE_KEY = '_vcs_web_enc_key';
const NATIVE_KEY_ALIAS = 'vcs_encryption_key';
const KEYCHAIN_TIMEOUT_MS = 3_000;

let _cachedKey: string | null = null;

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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise,
    new Promise<T>((_resolve, reject) => {
      timer = setTimeout(() => reject(new Error('Keychain timeout')), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

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
 *
 * If Keychain is slow/broken, falls back to localStorage automatically.
 */
export async function initEncryptionKey(): Promise<string> {
  if (_cachedKey) return _cachedKey;

  if (isNativeApp) {
    try {
      const plugin = await getNativePlugin();

      // Try Keychain first (with timeout)
      try {
        const { value } = await withTimeout(
          plugin.get({ key: NATIVE_KEY_ALIAS }),
          KEYCHAIN_TIMEOUT_MS,
        );
        if (value) {
          _cachedKey = value;
          return _cachedKey;
        }
      } catch {
        logger.warn('[keyManager] Keychain read timed out or failed, checking localStorage');
      }

      // Keychain failed/timed out — check localStorage fallback
      const lsFallback = localStorage.getItem(WEB_KEY_STORAGE_KEY);
      if (lsFallback) {
        _cachedKey = lsFallback;
        // Try to write it back to Keychain in background (best-effort)
        plugin.set({ key: NATIVE_KEY_ALIAS, value: lsFallback }).catch(() => {});
        return _cachedKey;
      }

      // No key anywhere — generate new one
      const newKey = generateKeyBase64();
      // Write to localStorage first (guaranteed fast)
      localStorage.setItem(WEB_KEY_STORAGE_KEY, newKey);
      // Try Keychain in background (best-effort)
      plugin.set({ key: NATIVE_KEY_ALIAS, value: newKey }).catch(() => {});
      _cachedKey = newKey;
      return _cachedKey;
    } catch (err) {
      logger.error('[keyManager] Native plugin init failed:', err);
      // Fall through to web path
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
