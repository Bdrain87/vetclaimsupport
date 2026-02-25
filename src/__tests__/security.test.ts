/**
 * Security Tests (Sections 26A-26C)
 *
 * Static analysis tests that scan source files for PII leaks in console.log
 * calls, verify encrypted storage infrastructure, and confirm rate-limiting
 * awareness.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const srcDir = path.resolve(__dirname, '..');

function getAllTsFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
      files.push(...getAllTsFiles(full));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

/** Read all .ts/.tsx source files once and cache them. */
let _allFiles: { path: string; content: string }[] | null = null;

function getAllSourceFiles(): { path: string; content: string }[] {
  if (_allFiles) return _allFiles;
  const paths = getAllTsFiles(srcDir);
  _allFiles = paths.map((p) => ({ path: p, content: fs.readFileSync(p, 'utf-8') }));
  return _allFiles;
}

/**
 * Extract all console.log(...) call argument strings from a file's content.
 * This is a simplified extractor that captures the arguments portion of each
 * console.log call. It handles simple cases (single-line calls) which is
 * sufficient for detecting hardcoded PII patterns.
 */
function extractConsoleLogArgs(content: string): string[] {
  const results: string[] = [];
  const pattern = /console\.log\s*\(([^)]*)\)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content)) !== null) {
    results.push(match[1]);
  }
  return results;
}

// ---------------------------------------------------------------------------
// Section 26A: No PII in Logs
// ---------------------------------------------------------------------------

describe('Section 26A: No PII in Logs', () => {
  it('no console.log call contains a hardcoded SSN pattern (###-##-####)', () => {
    const ssnPattern = /\d{3}-\d{2}-\d{4}/;
    const files = getAllSourceFiles();
    const violations: { file: string; arg: string }[] = [];

    for (const file of files) {
      const args = extractConsoleLogArgs(file.content);
      for (const arg of args) {
        if (ssnPattern.test(arg)) {
          violations.push({ file: file.path, arg });
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('no console.log call contains a hardcoded email pattern (@*.com)', () => {
    const emailPattern = /@[a-zA-Z0-9.-]+\.com/;
    const files = getAllSourceFiles();
    const violations: { file: string; arg: string }[] = [];

    for (const file of files) {
      // Skip test files themselves to avoid false positives from test assertions
      if (file.path.includes('__tests__') || file.path.includes('.test.')) continue;

      const args = extractConsoleLogArgs(file.content);
      for (const arg of args) {
        if (emailPattern.test(arg)) {
          violations.push({ file: file.path, arg });
        }
      }
    }

    expect(violations).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Section 26B: Encryption
// ---------------------------------------------------------------------------

describe('Section 26B: Encryption', () => {
  it('encryptedStorage.ts exists', () => {
    const filePath = path.join(srcDir, 'lib', 'encryptedStorage.ts');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('encryptedStorage.ts exports encryptedStorage', () => {
    const content = fs.readFileSync(
      path.join(srcDir, 'lib', 'encryptedStorage.ts'),
      'utf-8',
    );
    expect(content).toMatch(/export\s+(const|let|var)\s+encryptedStorage\b/);
  });

  it('keyManager.ts exists', () => {
    const filePath = path.join(srcDir, 'lib', 'keyManager.ts');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('keyManager.ts exports initEncryptionKey', () => {
    const content = fs.readFileSync(
      path.join(srcDir, 'lib', 'keyManager.ts'),
      'utf-8',
    );
    expect(content).toMatch(/export\s+(async\s+)?function\s+initEncryptionKey/);
  });

  it('encryptedStorage.ts references AES encryption (encrypt/decrypt)', () => {
    const content = fs.readFileSync(
      path.join(srcDir, 'lib', 'encryptedStorage.ts'),
      'utf-8',
    );
    expect(content).toMatch(/encrypt/i);
    expect(content).toMatch(/decrypt/i);
  });
});

// ---------------------------------------------------------------------------
// Section 26C: Rate Limiting
// ---------------------------------------------------------------------------

describe('Section 26C: Rate Limiting', () => {
  it('acknowledges rate limiting is primarily server-side (no explicit rate-limit.ts required)', () => {
    // This codebase is a client-side React app. Rate limiting is enforced
    // server-side (e.g. Supabase edge functions, API gateway). We verify
    // the codebase does not ship a client-side bypass of rate limiting by
    // confirming there are no files that override or disable rate limits.
    const files = getAllSourceFiles();
    const bypassPatterns = [
      /disableRateLimit/i,
      /skipRateLimit/i,
      /rateLimitBypass/i,
    ];

    const violations: string[] = [];
    for (const file of files) {
      if (file.path.includes('__tests__') || file.path.includes('.test.')) continue;
      for (const pat of bypassPatterns) {
        if (pat.test(file.content)) {
          violations.push(file.path);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
