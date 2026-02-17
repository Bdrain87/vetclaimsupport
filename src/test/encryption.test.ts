/**
 * Encryption utilities — unit tests
 *
 * Tests hashPassword, verifyPasswordHash (new PBKDF2 and legacy SHA-256),
 * encrypt/decrypt round-trips, encryptObject/decryptObject, and edge cases.
 *
 * jsdom provides a stub for `window.crypto` but NOT `crypto.subtle`.
 * Node 18+ has a built-in Web Crypto API on `globalThis.crypto`, and vitest
 * runs on Node so `crypto.subtle` is available through the Node runtime.
 * The jsdom environment wires `window.crypto` to Node's crypto.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  hashPassword,
  verifyPasswordHash,
  encrypt,
  decrypt,
  encryptObject,
  decryptObject,
  isEncryptionSupported,
  enableEncryption,
  verifyPassword,
  disableEncryption,
} from '@/utils/encryption';

describe('encryption utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // -------------------------------------------------------------------------
  // hashPassword
  // -------------------------------------------------------------------------
  describe('hashPassword', () => {
    it('produces a string in "salt:hash" format', async () => {
      const hash = await hashPassword('test-password');
      expect(hash).toContain(':');

      const parts = hash.split(':');
      expect(parts).toHaveLength(2);
      expect(parts[0].length).toBeGreaterThan(0); // salt
      expect(parts[1].length).toBeGreaterThan(0); // hash
    });

    it('produces different hashes for the same password (due to random salt)', async () => {
      const h1 = await hashPassword('same-password');
      const h2 = await hashPassword('same-password');
      expect(h1).not.toBe(h2);
    });

    it('handles an empty string password', async () => {
      const hash = await hashPassword('');
      expect(hash).toContain(':');
      expect(hash.length).toBeGreaterThan(5);
    });

    it('handles special characters in the password', async () => {
      const hash = await hashPassword('p@$$w0rd!#%^&*()_+{}|:<>?');
      expect(hash).toContain(':');
    });

    it('handles unicode characters', async () => {
      const hash = await hashPassword('\u00e9\u00e0\u00fc\u00f1\u4f60\u597d');
      expect(hash).toContain(':');
    });
  });

  // -------------------------------------------------------------------------
  // verifyPasswordHash — new PBKDF2 hashes
  // -------------------------------------------------------------------------
  describe('verifyPasswordHash (PBKDF2 hashes)', () => {
    it('returns true for the correct password', async () => {
      const hash = await hashPassword('my-secret');
      const result = await verifyPasswordHash('my-secret', hash);
      expect(result).toBe(true);
    });

    it('returns false for an incorrect password', async () => {
      const hash = await hashPassword('my-secret');
      const result = await verifyPasswordHash('wrong-password', hash);
      expect(result).toBe(false);
    });

    it('round-trips with empty string', async () => {
      const hash = await hashPassword('');
      expect(await verifyPasswordHash('', hash)).toBe(true);
      expect(await verifyPasswordHash('not-empty', hash)).toBe(false);
    });

    it('round-trips with special characters', async () => {
      const pw = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      const hash = await hashPassword(pw);
      expect(await verifyPasswordHash(pw, hash)).toBe(true);
    });

    it('round-trips with very long password', async () => {
      const pw = 'a'.repeat(1000);
      const hash = await hashPassword(pw);
      expect(await verifyPasswordHash(pw, hash)).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // verifyPasswordHash — legacy SHA-256 hashes
  // -------------------------------------------------------------------------
  describe('verifyPasswordHash (legacy SHA-256)', () => {
    /**
     * Legacy hashes are plain base64 SHA-256 digests (no colon separator).
     * We can compute one using the Web Crypto API directly.
     */
    async function legacySHA256(password: string): Promise<string> {
      const data = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const bytes = new Uint8Array(hashBuffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }

    it('verifies a correct password against a legacy SHA-256 hash', async () => {
      const legacyHash = await legacySHA256('legacy-pass');
      const result = await verifyPasswordHash('legacy-pass', legacyHash);
      expect(result).toBe(true);
    });

    it('rejects an incorrect password against a legacy SHA-256 hash', async () => {
      const legacyHash = await legacySHA256('legacy-pass');
      const result = await verifyPasswordHash('wrong', legacyHash);
      expect(result).toBe(false);
    });

    it('verifies empty string against legacy hash', async () => {
      const legacyHash = await legacySHA256('');
      expect(await verifyPasswordHash('', legacyHash)).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // encrypt / decrypt round-trip
  // -------------------------------------------------------------------------
  describe('encrypt / decrypt', () => {
    it('decrypts to the original plaintext', async () => {
      const plaintext = 'Hello, veteran data!';
      const encrypted = await encrypt(plaintext, 'secret');
      const decrypted = await decrypt(encrypted, 'secret');
      expect(decrypted).toBe(plaintext);
    });

    it('encrypted output is base64 and differs from plaintext', async () => {
      const plaintext = 'sensitive data';
      const encrypted = await encrypt(plaintext, 'password');
      expect(encrypted).not.toBe(plaintext);
      // Should be valid base64 (no error on atob)
      expect(() => atob(encrypted)).not.toThrow();
    });

    it('decrypt with wrong password throws', async () => {
      const encrypted = await encrypt('secret data', 'correct-password');
      await expect(decrypt(encrypted, 'wrong-password')).rejects.toThrow();
    });

    it('handles empty string plaintext', async () => {
      const encrypted = await encrypt('', 'password');
      const decrypted = await decrypt(encrypted, 'password');
      expect(decrypted).toBe('');
    });

    it('handles special characters in plaintext', async () => {
      const text = 'PTSD stressor: \u00e9v\u00e8nement traumatisant \u2014 100%!';
      const encrypted = await encrypt(text, 'pw');
      expect(await decrypt(encrypted, 'pw')).toBe(text);
    });

    it('produces different ciphertexts for the same input (random IV/salt)', async () => {
      const e1 = await encrypt('same', 'pw');
      const e2 = await encrypt('same', 'pw');
      expect(e1).not.toBe(e2);
    });
  });

  // -------------------------------------------------------------------------
  // encryptObject / decryptObject
  // -------------------------------------------------------------------------
  describe('encryptObject / decryptObject', () => {
    it('round-trips a simple object', async () => {
      const obj = { name: 'PTSD', rating: 70, serviceConnected: true };
      const encrypted = await encryptObject(obj, 'pw');
      const decrypted = await decryptObject<typeof obj>(encrypted, 'pw');
      expect(decrypted).toEqual(obj);
    });

    it('round-trips an array', async () => {
      const arr = [1, 'two', { three: 3 }];
      const encrypted = await encryptObject(arr, 'pw');
      const decrypted = await decryptObject<typeof arr>(encrypted, 'pw');
      expect(decrypted).toEqual(arr);
    });
  });

  // -------------------------------------------------------------------------
  // isEncryptionSupported
  // -------------------------------------------------------------------------
  describe('isEncryptionSupported', () => {
    it('returns true in the test environment (Node Web Crypto available)', () => {
      expect(isEncryptionSupported()).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // enableEncryption / verifyPassword / disableEncryption integration
  // -------------------------------------------------------------------------
  describe('enableEncryption / verifyPassword / disableEncryption', () => {
    it('enableEncryption stores hash and flag in localStorage', async () => {
      await enableEncryption('vault-pass');

      expect(localStorage.getItem('vet-claim-encryption-enabled')).toBe('true');
      const storedHash = localStorage.getItem('vet-claim-password-hash');
      expect(storedHash).toBeTruthy();
      expect(storedHash).toContain(':');
    });

    it('verifyPassword returns true for the correct password after enableEncryption', { timeout: 15000 }, async () => {
      await enableEncryption('vault-pass');
      expect(await verifyPassword('vault-pass')).toBe(true);
    });

    it('verifyPassword returns false for an incorrect password', async () => {
      await enableEncryption('vault-pass');
      expect(await verifyPassword('wrong')).toBe(false);
    });

    it('verifyPassword returns false if no hash is stored', async () => {
      expect(await verifyPassword('anything')).toBe(false);
    });

    it('disableEncryption removes the encryption flag and hash', async () => {
      await enableEncryption('vault-pass');
      disableEncryption();

      expect(localStorage.getItem('vet-claim-encryption-enabled')).toBeNull();
      expect(localStorage.getItem('vet-claim-password-hash')).toBeNull();
    });
  });
});
