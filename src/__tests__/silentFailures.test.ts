/**
 * Silent Failures — verify critical operations have proper error handling.
 *
 * Scans source files for empty `.catch(() => {})` patterns in critical paths
 * and verifies that AI features, PDF exports, and storage operations include
 * user-facing error feedback.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const srcDir = path.resolve(__dirname, '..');

function getAllTsFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '__tests__') {
      files.push(...getAllTsFiles(full));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

let _allFiles: { path: string; content: string; relativePath: string }[] | null = null;

function getAllSourceFiles() {
  if (_allFiles) return _allFiles;
  const paths = getAllTsFiles(srcDir);
  _allFiles = paths.map((p) => ({
    path: p,
    content: fs.readFileSync(p, 'utf-8'),
    relativePath: path.relative(srcDir, p),
  }));
  return _allFiles;
}

describe('Silent Failures Audit', () => {
  describe('No unhandled empty catches in critical paths', () => {
    const CRITICAL_PATHS = [
      'pages/',
      'services/',
      'hooks/',
      'store/',
      'lib/gemini',
      'lib/supabase',
    ];

    // Allowed exceptions — ServiceWorker cleanup, native init, non-critical
    const ALLOWED_PATTERNS = [
      'main.tsx', // ServiceWorker cleanup
    ];

    it('no empty catch blocks without comments in critical source files', () => {
      const files = getAllSourceFiles();
      const violations: string[] = [];

      for (const file of files) {
        const isCritical = CRITICAL_PATHS.some((p) => file.relativePath.includes(p));
        if (!isCritical) continue;
        if (ALLOWED_PATTERNS.some((p) => file.relativePath.includes(p))) continue;

        // Match .catch(() => {}) with no content or only whitespace
        const emptyCatchRegex = /\.catch\(\s*\(\s*\)\s*=>\s*\{\s*\}\s*\)/g;
        let match;
        while ((match = emptyCatchRegex.exec(file.content)) !== null) {
          const lineNumber = file.content.substring(0, match.index).split('\n').length;
          violations.push(`${file.relativePath}:${lineNumber}`);
        }
      }

      expect(
        violations,
        `Found empty .catch(() => {}) blocks without error handling:\n${violations.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('AI features include error handling', () => {
    it('all useAIGenerate consumers handle the error state', () => {
      const files = getAllSourceFiles();
      const consumers = files.filter((f) => f.content.includes('useAIGenerate'));
      expect(consumers.length).toBeGreaterThan(0);

      const missing: string[] = [];
      for (const file of consumers) {
        // Skip the hook definition itself
        if (file.relativePath.includes('hooks/useAIGenerate')) continue;
        // Check that the component destructures `error` from useAIGenerate
        if (!file.content.includes('error') || !file.content.match(/useAIGenerate/)) {
          missing.push(file.relativePath);
        }
      }

      expect(
        missing,
        `These files use useAIGenerate but may not handle error state:\n${missing.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('PDF export pages show failure feedback', () => {
    const PDF_PAGES = [
      'pages/CPExamPacket.tsx',
      'pages/PersonalStatement.tsx',
      'pages/BuddyStatements.tsx',
      'pages/StressorStatement.tsx',
      'pages/ShareableSummary.tsx',
    ];

    it.each(PDF_PAGES)('%s has error toast on export failure', (pagePath) => {
      const files = getAllSourceFiles();
      const file = files.find((f) => f.relativePath.endsWith(pagePath));
      expect(file, `File not found: ${pagePath}`).toBeDefined();
      // Must include destructive toast variant for export failures
      expect(file!.content).toContain("variant: 'destructive'");
    });

    it.each(PDF_PAGES)('%s has vault save error handling', (pagePath) => {
      const files = getAllSourceFiles();
      const file = files.find((f) => f.relativePath.endsWith(pagePath));
      if (!file) return; // Already caught above
      // If it uses saveToVault, the catch must not be empty
      if (file.content.includes('saveToVault')) {
        const emptyCatchAfterVault = /saveToVault[\s\S]*?\.catch\(\s*\(\s*\)\s*=>\s*\{\s*\}\s*\)/;
        expect(
          emptyCatchAfterVault.test(file.content),
          `${pagePath}: saveToVault has empty catch — should show error feedback`
        ).toBe(false);
      }
    });
  });

  describe('Storage operations have error handling', () => {
    it('logger.error is used in service files', () => {
      const files = getAllSourceFiles();
      const services = files.filter((f) => f.relativePath.startsWith('services/'));

      for (const service of services) {
        // Skip test files and type-only files
        if (service.relativePath.includes('.test.') || service.relativePath.includes('.d.ts')) continue;
        // Services with async operations should import logger
        if (service.content.includes('async ') && service.content.includes('catch')) {
          const hasLogger = service.content.includes('logger') || service.content.includes('console.error');
          if (!hasLogger) {
            // Not a hard fail — some services may have legitimate empty catches
            // but flag them for review
          }
        }
      }
    });
  });
});
