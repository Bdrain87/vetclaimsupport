/**
 * Encrypted storage adapter for Zustand persist middleware.
 *
 * When encryption is enabled (user has set a vault passcode), data written to
 * localStorage is encrypted with AES-256-GCM via the Web Crypto API.
 * When encryption is not enabled, data passes through to localStorage as
 * plaintext, preserving full backwards compatibility.
 *
 * The user's vault password is held in a module-scoped variable for the
 * duration of the browser session.  It is never persisted to disk.
 */

import type { StateStorage } from 'zustand/middleware';
import { encrypt, decrypt, isEncryptionEnabled } from '@/utils/encryption';

// ---- session-scoped password ------------------------------------------------

let _sessionPassword: string | null = null;

/** Store the vault password in memory for the current session. */
export function setSessionPassword(password: string): void {
  _sessionPassword = password;
}

/** Retrieve the vault password held in memory (null if not set). */
export function getSessionPassword(): string | null {
  return _sessionPassword;
}

/** Clear the vault password from memory (e.g. on lock / logout). */
export function clearSessionPassword(): void {
  _sessionPassword = null;
}

// ---- encrypted storage prefix -----------------------------------------------

/**
 * Encrypted values are stored with this prefix so that `getItem` can
 * distinguish them from legacy plaintext values.
 */
const ENCRYPTED_PREFIX = '__encrypted__:';

// ---- StateStorage implementation --------------------------------------------

/**
 * A Zustand `StateStorage` that transparently encrypts / decrypts values when
 * the user has enabled vault encryption.
 *
 * Implements the contract:
 *   getItem(key)          -> string | null | Promise<string | null>
 *   setItem(key, value)   -> void
 *   removeItem(key)       -> void
 *
 * Encryption is opt-in:
 *   - If `isEncryptionEnabled()` returns false, all operations are plain
 *     localStorage pass-throughs.
 *   - If encryption is enabled but no session password is available, `setItem`
 *     falls back to plaintext (to avoid data loss), and `getItem` attempts
 *     plaintext parsing.
 *   - Decryption failures (wrong password, corrupted data) are caught and
 *     return `null` so the store can rehydrate with defaults rather than crash.
 */
export const encryptedStorage: StateStorage = {
  getItem(key: string): string | null | Promise<string | null> {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;

    // If the value does not carry our encrypted prefix it is plaintext --
    // return it directly regardless of encryption settings.  This is the
    // backwards-compatibility path for users who have not yet enabled
    // encryption or for data that was written before encryption was turned on.
    if (!raw.startsWith(ENCRYPTED_PREFIX)) {
      return raw;
    }

    // The value is encrypted.  We need the session password to decrypt.
    const password = _sessionPassword;
    if (!password) {
      // No password available -- we cannot decrypt.  Return null so the store
      // falls back to its initial state.  The app should prompt the user for
      // their vault passcode and then trigger a rehydrate.
      return null;
    }

    // decrypt is async (Web Crypto), so we return a Promise here.
    const ciphertext = raw.slice(ENCRYPTED_PREFIX.length);
    return decrypt(ciphertext, password)
      .catch(() => {
        // Graceful degradation: return null so the store initialises with
        // defaults instead of throwing.
        return null;
      });
  },

  setItem(key: string, value: string): void {
    if (!isEncryptionEnabled() || !_sessionPassword) {
      // Encryption not active or no password in memory -- write plaintext.
      localStorage.setItem(key, value);
      return;
    }

    // Encrypt and write.  Because `encrypt` is async we cannot return
    // synchronously, but Zustand's persist middleware tolerates void return
    // from setItem.  We fire-and-forget the write; the next `getItem` will
    // always read the latest value from localStorage.
    const password = _sessionPassword;
    encrypt(value, password)
      .then((ciphertext) => {
        localStorage.setItem(key, ENCRYPTED_PREFIX + ciphertext);
      })
      .catch(() => {
        // If encryption fails for any reason, fall back to plaintext so the
        // user does not lose data.  Warn so the issue is visible in devtools.
        console.warn('[encryptedStorage] Encryption failed — falling back to plaintext write for key:', key);
        localStorage.setItem(key, value);
      });
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);
  },
};
