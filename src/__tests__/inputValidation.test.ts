/**
 * Input Validation Tests
 *
 * Tests email validation, textarea maxLength enforcement, empty/whitespace
 * handling, and XSS safety for text inputs across the app.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

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

describe('Input Validation', () => {
  describe('Email Validation', () => {
    // The regex used in AuthPage.tsx
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    it('accepts valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.name@domain.co',
        'first+last@company.org',
        'user123@test.io',
        'a@b.co',
      ];
      for (const email of validEmails) {
        expect(emailRegex.test(email), `Should accept: ${email}`).toBe(true);
      }
    });

    it('rejects invalid email addresses', () => {
      const invalidEmails = [
        '',
        'notanemail',
        '@domain.com',
        'user@',
        'user@.com',
        'user @domain.com',
        'user@ domain.com',
        'user@domain',
        '@',
        'user@@domain.com',
      ];
      for (const email of invalidEmails) {
        expect(emailRegex.test(email), `Should reject: "${email}"`).toBe(false);
      }
    });

    it('AuthPage includes email format validation', () => {
      const authPagePath = path.join(srcDir, 'pages', 'AuthPage.tsx');
      const content = fs.readFileSync(authPagePath, 'utf-8');
      expect(content).toContain('emailRegex');
      expect(content).toContain('Invalid email');
    });
  });

  describe('Textarea maxLength enforcement', () => {
    const PAGES_NEEDING_MAXLENGTH = [
      'pages/PersonalStatement.tsx',
      'pages/StressorStatement.tsx',
      'pages/BuddyStatements.tsx',
      'pages/FamilyStatement.tsx',
      'pages/VASpeakTranslator.tsx',
      'pages/PostExamDebrief.tsx',
    ];

    it.each(PAGES_NEEDING_MAXLENGTH)('%s has maxLength on user-facing textareas', (pagePath) => {
      const filePath = path.join(srcDir, pagePath);
      if (!fs.existsSync(filePath)) return;
      const content = fs.readFileSync(filePath, 'utf-8');

      // Count Textarea usages and maxLength props
      const textareaCount = (content.match(/<Textarea\b/g) || []).length;
      const maxLengthCount = (content.match(/maxLength=\{/g) || []).length;

      // At least some textareas should have maxLength
      if (textareaCount > 0) {
        expect(
          maxLengthCount,
          `${pagePath}: has ${textareaCount} Textareas but only ${maxLengthCount} have maxLength`
        ).toBeGreaterThan(0);
      }
    });
  });

  describe('Textarea component has character counter', () => {
    it('Textarea component shows counter when maxLength is set', () => {
      const textareaPath = path.join(srcDir, 'components', 'ui', 'textarea.tsx');
      const content = fs.readFileSync(textareaPath, 'utf-8');
      expect(content).toContain('maxLength');
      expect(content).toContain('showCounter');
    });
  });

  describe('Forms handle empty/whitespace input', () => {
    it('AuthPage checks for empty fields before submission', () => {
      const authPath = path.join(srcDir, 'pages', 'AuthPage.tsx');
      const content = fs.readFileSync(authPath, 'utf-8');
      expect(content).toContain('.trim()');
      expect(content).toContain('Missing fields');
    });

    it('PersonalStatement validates non-empty before proceeding', () => {
      const psPath = path.join(srcDir, 'pages', 'PersonalStatement.tsx');
      const content = fs.readFileSync(psPath, 'utf-8');
      // canProceed checks .trim().length
      expect(content).toContain('.trim().length');
    });
  });

  describe('XSS safety', () => {
    it('no dangerouslySetInnerHTML in page files', () => {
      const paths = getAllTsFiles(path.join(srcDir, 'pages'));
      const violations: string[] = [];
      for (const filePath of paths) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes('dangerouslySetInnerHTML')) {
          violations.push(path.relative(srcDir, filePath));
        }
      }
      expect(
        violations,
        `Pages using dangerouslySetInnerHTML (XSS risk):\n${violations.join('\n')}`
      ).toHaveLength(0);
    });

    it('no eval() usage in source files', () => {
      const paths = getAllTsFiles(srcDir);
      const violations: string[] = [];
      for (const filePath of paths) {
        const content = fs.readFileSync(filePath, 'utf-8');
        // Match eval( but not .evaluate or evaluate(
        if (/\beval\s*\(/.test(content) && !content.includes('// eslint-disable')) {
          violations.push(path.relative(srcDir, filePath));
        }
      }
      expect(
        violations,
        `Files using eval() (security risk):\n${violations.join('\n')}`
      ).toHaveLength(0);
    });
  });
});
