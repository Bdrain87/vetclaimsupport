/**
 * Security regression tests — verify fixes from security audit remain in place.
 *
 * Tests:
 * 1. Password minimum is 12 characters (not 8)
 * 2. Encrypted storage fails closed (no plaintext fallback)
 * 3. Premium guard defaults to 'loading' (no platform bypass)
 * 4. JWT verification enabled on AI edge function
 */

import { describe, it, expect } from 'vitest';
import { validatePasswordStrength } from '@/utils/encryption';
import * as fs from 'fs';
import * as path from 'path';

describe('security regression tests', () => {
  // -----------------------------------------------------------------------
  // Password minimum: 12 characters (raised from 8)
  // -----------------------------------------------------------------------
  describe('password minimum length', () => {
    it('flags passwords under 12 characters with feedback', () => {
      const result = validatePasswordStrength('Abcd!fg1');
      expect(result.feedback.some((f) => /12 characters/i.test(f))).toBe(true);
    });

    it('does not flag 12+ character passwords for length', () => {
      const result = validatePasswordStrength('Abcdefg!1234');
      expect(result.feedback.some((f) => /12 characters/i.test(f))).toBe(false);
    });

    it('accepts 12-character passwords with all requirements', () => {
      const result = validatePasswordStrength('Abcdefg!1234');
      expect(result.isValid).toBe(true);
    });

    it('the length threshold is 12, not 8 (regression check)', () => {
      // Verify the source code uses 12 as the minimum, not the old value of 8
      const source = fs.readFileSync(
        path.resolve(__dirname, '../utils/encryption.ts'),
        'utf-8',
      );
      expect(source).toContain('password.length >= 12');
      expect(source).not.toMatch(/password\.length\s*>=\s*8\)/);
    });
  });

  // -----------------------------------------------------------------------
  // Encrypted storage: fail-closed (no plaintext fallback)
  // -----------------------------------------------------------------------
  describe('encrypted storage fail-closed behavior', () => {
    it('encryptedStorage.ts does not write plaintext when no key is available', async () => {
      const filePath = path.resolve(__dirname, '../lib/encryptedStorage.ts');
      const source = fs.readFileSync(filePath, 'utf-8');

      // The old code stored plaintext via localStorage.setItem as a fallback.
      // After the fix, it should log an error and return (drop the write).
      expect(source).toContain('dropping write to prevent plaintext data exposure');
      expect(source).not.toMatch(/localStorage\.setItem\s*\(\s*key\s*,\s*JSON\.stringify/);
    });
  });

  // -----------------------------------------------------------------------
  // Premium guard: no iOS/native bypass
  // -----------------------------------------------------------------------
  describe('premium guard — no platform bypass', () => {
    it('PremiumGuard.tsx does not bypass entitlement check for native app', async () => {
      const filePath = path.resolve(__dirname, '../components/PremiumGuard.tsx');
      const source = fs.readFileSync(filePath, 'utf-8');

      // The old code had: isNativeApp ? 'granted' : 'loading'
      // After fix: always starts as 'loading' and goes through server verification
      expect(source).not.toContain("isNativeApp ? 'granted'");
      expect(source).not.toContain('isNativeApp');
    });
  });

  // -----------------------------------------------------------------------
  // JWT verification on AI endpoint
  // -----------------------------------------------------------------------
  describe('JWT verification on AI endpoint', () => {
    it('analyze-disabilities has verify_jwt = true in supabase config', () => {
      const configPath = path.resolve(__dirname, '../../supabase/config.toml');
      const config = fs.readFileSync(configPath, 'utf-8');

      // Find the analyze-disabilities section and verify JWT is enabled
      const section = config.match(/\[functions\.analyze-disabilities\][\s\S]*?(?=\[|$)/);
      expect(section).not.toBeNull();
      expect(section![0]).toContain('verify_jwt = true');
      expect(section![0]).not.toContain('verify_jwt = false');
    });
  });
});
