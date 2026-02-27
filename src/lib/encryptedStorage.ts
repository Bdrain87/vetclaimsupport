/**
 * Encrypted storage adapter for Zustand persist middleware.
 *
 * Layer 1 (mandatory, zero-friction): All store data is encrypted at rest
 * using a device-generated 256-bit AES key (raw-key path, ~5ms per write).
 * The key is auto-generated on first launch and stored in the iOS Keychain
 * (native) or localStorage (web).
 *
 * Layer 2 (opt-in VaultPasscode): Users can additionally set a vault passcode
 * which uses PBKDF2-derived keys (600k iterations) for extra protection.
 *
 * The session password is held in a module-scoped variable for the duration of
 * the browser session.  It is never persisted to disk.
 */

import type { StateStorage } from 'zustand/middleware';
import {
  encrypt,
  decrypt,
  encryptWithRawKey,
  decryptWithRawKey,
} from '@/utils/encryption';
import { logger } from '@/utils/logger';

// ---- session-scoped password ------------------------------------------------

let _sessionPassword: string | null = null;
let _encryptionMode: 'raw' | 'pbkdf2' = 'raw';

/**
 * Store the encryption password/key in memory for the current session.
 * @param password  The raw key (base64) or vault passcode.
 * @param mode      'raw' for device key (Layer 1), 'pbkdf2' for vault passcode (Layer 2).
 */
export function setSessionPassword(
  password: string,
  mode: 'raw' | 'pbkdf2' = 'pbkdf2',
): void {
  _sessionPassword = password;
  _encryptionMode = mode;
}

/** Retrieve the session password/key held in memory (null if not set). */
export function getSessionPassword(): string | null {
  return _sessionPassword;
}

/** Clear the session password/key from memory (e.g. on lock / logout). */
export function clearSessionPassword(): void {
  _sessionPassword = null;
  _encryptionMode = 'raw';
}

// ---- encrypted storage prefixes ---------------------------------------------

/** Legacy PBKDF2-encrypted values (VaultPasscode / Layer 2). */
const ENCRYPTED_PREFIX = '__encrypted__:';

/** Raw-key encrypted values (Layer 1 — mandatory). */
const ENCRYPTED_V2_PREFIX = '__encrypted_v2__:';

// ---- write lock for serializing encrypted writes ----------------------------

const _writeLocks = new Map<string, Promise<void>>();

function serializedWrite(key: string, fn: () => Promise<void>): void {
  const prev = _writeLocks.get(key) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  _writeLocks.set(key, next);
  next.finally(() => {
    if (_writeLocks.get(key) === next) _writeLocks.delete(key);
  });
}

// ---- StateStorage implementation --------------------------------------------

/**
 * A Zustand `StateStorage` that transparently encrypts / decrypts all values.
 *
 * Encryption is mandatory — all writes are encrypted.  Reads handle three
 * formats for backwards compatibility:
 *   1. `__encrypted_v2__:` — raw-key AES-256-GCM (Layer 1)
 *   2. `__encrypted__:`    — PBKDF2 AES-256-GCM (Layer 2 / legacy)
 *   3. No prefix           — plaintext (legacy migration path, read as-is)
 */
export const encryptedStorage: StateStorage = {
  getItem(key: string): string | null | Promise<string | null> {
    let raw: string | null;
    try {
      raw = localStorage.getItem(key);
    } catch (error) {
      logger.warn('[encryptedStorage] localStorage.getItem failed:', error);
      return null;
    }
    if (raw === null) return null;

    // --- Format 1: raw-key encrypted (v2) ---
    if (raw.startsWith(ENCRYPTED_V2_PREFIX)) {
      const password = _sessionPassword;
      if (!password) {
        logger.error(
          '[encryptedStorage] No encryption key available for key:',
          key,
          '— this should not happen after init.',
        );
        return null;
      }

      const ciphertext = raw.slice(ENCRYPTED_V2_PREFIX.length);
      return decryptWithRawKey(ciphertext, password).catch(() => {
        logger.warn(
          '[encryptedStorage] v2 decryption failed for key:',
          key,
          '— returning null.',
        );
        return null;
      });
    }

    // --- Format 2: PBKDF2 encrypted (legacy / Layer 2) ---
    if (raw.startsWith(ENCRYPTED_PREFIX)) {
      const password = _sessionPassword;
      if (!password) {
        return null;
      }

      const ciphertext = raw.slice(ENCRYPTED_PREFIX.length);
      return decrypt(ciphertext, password).catch(() => {
        logger.warn(
          '[encryptedStorage] PBKDF2 decryption failed for key:',
          key,
          '— returning null.',
        );
        return null;
      });
    }

    // --- Format 3: plaintext (legacy — read as-is for migration) ---
    return raw;
  },

  setItem(key: string, value: string): void {
    if (!_sessionPassword) {
      // Fail closed — never write sensitive data as plaintext.
      // This should not happen after boot; if it does, the data is
      // silently dropped rather than stored unencrypted.
      logger.error(
        '[encryptedStorage] No encryption key available during write for key:',
        key,
        '— dropping write to prevent plaintext data exposure.',
      );
      return;
    }

    // Always encrypt.  Use the active encryption mode.
    const password = _sessionPassword;
    const mode = _encryptionMode;

    serializedWrite(key, async () => {
      try {
        if (mode === 'raw') {
          const ciphertext = await encryptWithRawKey(value, password);
          localStorage.setItem(key, ENCRYPTED_V2_PREFIX + ciphertext);
        } else {
          const ciphertext = await encrypt(value, password);
          localStorage.setItem(key, ENCRYPTED_PREFIX + ciphertext);
        }
      } catch (error) {
        logger.error(
          '[encryptedStorage] Encryption/write failed for key "' + key + '":',
          error,
        );
      }
    });
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.warn('[encryptedStorage] localStorage.removeItem failed:', error);
    }
  },
};
