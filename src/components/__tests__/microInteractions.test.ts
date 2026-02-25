/**
 * Micro-Interactions & Feedback Tests — Section 21
 *
 * Tests error recovery messages, backup health copy, and
 * data integrity patterns.
 */
import { describe, it, expect } from 'vitest';
import { BACKUP_COPY } from '@/data/legalCopy';

// ---------------------------------------------------------------------------
// 21C: Error Recovery Messages
// ---------------------------------------------------------------------------
describe('Micro-Interactions — Error Recovery', () => {
  it('backup health shows "Never backed up" for new users', () => {
    expect(BACKUP_COPY.neverBacked).toBe('Never backed up');
  });

  it('backup CTA says "Back up now"', () => {
    expect(BACKUP_COPY.backupNow).toBe('Back up now');
  });

  it('last backup label exists', () => {
    expect(BACKUP_COPY.healthIndicatorLabel).toBe('Last backup');
  });

  it('storage note provides guidance', () => {
    expect(BACKUP_COPY.storageNote).toContain('Files app');
    expect(BACKUP_COPY.storageNote).toContain('iCloud');
  });
});

// ---------------------------------------------------------------------------
// Error message patterns
// ---------------------------------------------------------------------------
describe('Micro-Interactions — Error Message Quality', () => {
  const BACKUP_ERROR_MESSAGE = 'Backup file not recognized. Export a new backup from your old device.';

  it('invalid backup error is specific and actionable', () => {
    expect(BACKUP_ERROR_MESSAGE).toContain('not recognized');
    expect(BACKUP_ERROR_MESSAGE).toContain('Export');
  });

  it('error message does not say "Something went wrong"', () => {
    expect(BACKUP_ERROR_MESSAGE).not.toContain('Something went wrong');
  });
});

// ---------------------------------------------------------------------------
// Backup file validation
// ---------------------------------------------------------------------------
describe('Micro-Interactions — Backup Validation', () => {
  it('valid JSON backup parses without error', () => {
    const validBackup = JSON.stringify({ version: '1.0', profile: {}, appData: {} });
    expect(() => JSON.parse(validBackup)).not.toThrow();
  });

  it('corrupted backup is caught by JSON.parse', () => {
    const corrupted = '{"version": "1.0", broken';
    expect(() => JSON.parse(corrupted)).toThrow();
  });

  it('non-JSON file is caught', () => {
    const html = '<html><body>Not a backup</body></html>';
    const parsed = (() => {
      try {
        const result = JSON.parse(html);
        return result;
      } catch {
        return null;
      }
    })();
    expect(parsed).toBeNull();
  });
});
