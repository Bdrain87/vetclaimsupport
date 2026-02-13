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
    let raw: string | null;
    try {
      raw = localStorage.getItem(key);
    } catch (error) {
      console.warn('[encryptedStorage] localStorage.getItem failed:', error);
      return null;
    }
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
        // SECURITY NOTE: Decryption failed (wrong password, corrupted data, or
        // crypto API error).  We return null so the store initialises with its
        // defaults rather than crashing.  The app should prompt the user for
        // their vault passcode and trigger a rehydrate.
        console.warn(
          '[encryptedStorage] Decryption failed for key:',
          key,
          '— returning null so the store falls back to defaults.',
        );
        return null;
      });
  },

  setItem(key: string, value: string): void {
    if (!isEncryptionEnabled()) {
      // Encryption not active -- write plaintext.  This is the expected path
      // for users who have not opted in to vault encryption.
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('[encryptedStorage] localStorage.setItem failed:', error);
      }
      return;
    }

    if (!_sessionPassword) {
      // SECURITY NOTE – INTENTIONAL PLAINTEXT FALLBACK
      // Encryption is enabled but the session password is not available (e.g.
      // the user has not yet unlocked the vault this session, or the password
      // was cleared on lock/logout).  We still write plaintext here to avoid
      // data loss — the alternative is dropping the write entirely, which would
      // silently discard user data and is arguably worse.
      //
      // This means sensitive data MAY be stored unencrypted in localStorage
      // until the store is next written with a password available.  Callers
      // that require confidentiality guarantees should check
      // `getSessionPassword()` before persisting sensitive payloads.
      console.warn(
        '[encryptedStorage] Encryption is enabled but no session password is available. ' +
        'Data for key "' + key + '" will be stored as PLAINTEXT. ' +
        'Ensure the vault is unlocked before persisting sensitive data.',
      );
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('[encryptedStorage] localStorage.setItem failed:', error);
      }
      return;
    }

    // Encrypt and write.  Because `encrypt` is async we cannot return
    // synchronously, but Zustand's persist middleware tolerates void return
    // from setItem.  We fire-and-forget the write; the next `getItem` will
    // always read the latest value from localStorage.
    const password = _sessionPassword;
    encrypt(value, password)
      .then((ciphertext) => {
        try {
          localStorage.setItem(key, ENCRYPTED_PREFIX + ciphertext);
        } catch (error) {
          console.warn('[encryptedStorage] localStorage.setItem failed:', error);
        }
      })
      .catch(() => {
        // SECURITY NOTE – INTENTIONAL PLAINTEXT FALLBACK
        // If encryption fails for any reason (Web Crypto error, invalid key
        // material, etc.) we fall back to plaintext so the user does not lose
        // data.  This means the value will be readable in localStorage without
        // decryption.  The console.warn below ensures the issue is visible in
        // devtools so developers / QA can investigate.
        console.warn(
          '[encryptedStorage] Encryption failed for key "' + key + '" — ' +
          'falling back to PLAINTEXT storage.  Sensitive data may be unencrypted.',
        );
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.warn('[encryptedStorage] localStorage.setItem failed:', error);
        }
      });
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('[encryptedStorage] localStorage.removeItem failed:', error);
    }
  },
};
