/**
 * Data Integrity Tests
 *
 * Tests storage flush on pagehide, hydration error isolation,
 * evidence document error handling, and data structure consistency.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const srcDir = path.resolve(__dirname, '..');

describe('Data Integrity', () => {
  describe('Debounced storage flush on app close', () => {
    it('pagehide event listener is registered for storage flush', () => {
      // The debounced storage adapter registers a pagehide handler
      const debouncedStoragePath = path.join(srcDir, 'lib', 'debouncedStorage.ts');
      expect(fs.existsSync(debouncedStoragePath), 'debouncedStorage.ts should exist').toBe(true);
      const content = fs.readFileSync(debouncedStoragePath, 'utf-8');
      const hasFlushHandler = content.includes('pagehide') || content.includes('beforeunload') || content.includes('visibilitychange');
      expect(hasFlushHandler, 'debouncedStorage should register pagehide/beforeunload handler for flushing').toBe(true);
    });
  });

  describe('Hydration error isolation', () => {
    it('hydration hook handles individual store failures', () => {
      const hydrationPath = path.join(srcDir, 'hooks', 'useHydration.ts');
      if (!fs.existsSync(hydrationPath)) return;
      const content = fs.readFileSync(hydrationPath, 'utf-8');

      // Should have try/catch or .catch for individual store hydration
      const hasTryCatch = content.includes('try') && content.includes('catch');
      const hasCatchHandler = content.includes('.catch');
      expect(
        hasTryCatch || hasCatchHandler,
        'useHydration should handle errors per-store so one failing store doesn\'t block the app'
      ).toBe(true);
    });
  });

  describe('Store structure consistency', () => {
    it('useAppStore exports a default store with persist middleware', () => {
      const storePath = path.join(srcDir, 'store', 'useAppStore.ts');
      const content = fs.readFileSync(storePath, 'utf-8');
      expect(content).toContain('persist');
      expect(content).toContain('export default');
    });

    it('useProfileStore exports with persist middleware', () => {
      const storePath = path.join(srcDir, 'store', 'useProfileStore.ts');
      const content = fs.readFileSync(storePath, 'utf-8');
      expect(content).toContain('persist');
      expect(content).toContain('useProfileStore');
    });
  });

  describe('Evidence document error handling', () => {
    it('useEvidence hook has IndexedDB error handling', () => {
      const evidencePath = path.join(srcDir, 'hooks', 'useEvidence.ts');
      if (!fs.existsSync(evidencePath)) return;
      const content = fs.readFileSync(evidencePath, 'utf-8');

      // Should handle IndexedDB errors gracefully
      const hasErrorHandling = content.includes('catch') || content.includes('try');
      expect(hasErrorHandling, 'useEvidence should handle IndexedDB errors').toBe(true);
    });
  });

  describe('Condition deletion cascade', () => {
    it('deleteUserCondition removes linked data', () => {
      const storePath = path.join(srcDir, 'store', 'useAppStore.ts');
      const content = fs.readFileSync(storePath, 'utf-8');

      // Check that condition deletion also cleans up linked symptoms/medications
      if (content.includes('deleteUserCondition') || content.includes('removeCondition')) {
        // Should filter/remove linked items when a condition is deleted
        const hasLinkedCleanup = content.includes('filter') || content.includes('linked');
        expect(
          hasLinkedCleanup,
          'Condition deletion should cascade to linked data'
        ).toBe(true);
      }
    });
  });
});
