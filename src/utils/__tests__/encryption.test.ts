import { describe, it, expect, beforeEach } from 'vitest';
import {
  isEncryptionSupported,
  generateSecurePassword,
  validatePasswordStrength,
  isEncryptionEnabled,
  disableEncryption,
} from '../encryption';

describe('encryption utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // --- isEncryptionSupported ---
  describe('isEncryptionSupported', () => {
    it('returns a boolean', () => {
      const result = isEncryptionSupported();
      expect(typeof result).toBe('boolean');
    });
  });

  // --- generateSecurePassword ---
  describe('generateSecurePassword', () => {
    it('returns a string of the requested length', () => {
      const password = generateSecurePassword(24);
      expect(password).toHaveLength(24);
    });

    it('defaults to length 16 when no argument is provided', () => {
      const password = generateSecurePassword();
      expect(password).toHaveLength(16);
    });

    it('produces different passwords on successive calls', () => {
      const a = generateSecurePassword();
      const b = generateSecurePassword();
      expect(a).not.toBe(b);
    });
  });

  // --- validatePasswordStrength ---
  describe('validatePasswordStrength', () => {
    it('marks a short password as invalid and mentions length in feedback', () => {
      const result = validatePasswordStrength('abc');
      expect(result.isValid).toBe(false);
      expect(result.feedback.some((f) => /12 characters/i.test(f))).toBe(true);
    });

    it('mentions uppercase when no uppercase letters are present', () => {
      const result = validatePasswordStrength('abcdefgh1!');
      expect(result.feedback.some((f) => /uppercase/i.test(f))).toBe(true);
    });

    it('mentions numbers when no digits are present', () => {
      const result = validatePasswordStrength('Abcdefgh!');
      expect(result.feedback.some((f) => /number/i.test(f))).toBe(true);
    });

    it('mentions special characters when none are present', () => {
      const result = validatePasswordStrength('Abcdefgh1');
      expect(result.feedback.some((f) => /special/i.test(f))).toBe(true);
    });

    it('returns isValid true and score >= 4 for a strong password', () => {
      const result = validatePasswordStrength('MyStr0ng!Pass99');
      expect(result.isValid).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(4);
    });

    it('marks an empty string as invalid', () => {
      const result = validatePasswordStrength('');
      expect(result.isValid).toBe(false);
      expect(result.feedback.length).toBeGreaterThan(0);
    });
  });

  // --- isEncryptionEnabled ---
  describe('isEncryptionEnabled', () => {
    it('returns false when localStorage has no encryption key', () => {
      expect(isEncryptionEnabled()).toBe(false);
    });

    it('returns true when localStorage contains "true" for the encryption key', () => {
      localStorage.setItem('vet-claim-encryption-enabled', 'true');
      expect(isEncryptionEnabled()).toBe(true);
    });
  });

  // --- disableEncryption ---
  describe('disableEncryption', () => {
    it('removes encryption keys from localStorage', () => {
      localStorage.setItem('vet-claim-encryption-enabled', 'true');
      localStorage.setItem('vet-claim-password-hash', 'somehash');

      disableEncryption();

      expect(localStorage.getItem('vet-claim-encryption-enabled')).toBeNull();
      expect(localStorage.getItem('vet-claim-password-hash')).toBeNull();
    });
  });
});
