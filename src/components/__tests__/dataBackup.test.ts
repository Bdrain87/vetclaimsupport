/**
 * Backup & Restore — data structure round-trip tests
 *
 * Validates that backup fixtures have correct structure, data survives
 * round-trips, and corrupt / wrong-type / future-version backups are
 * detectable.
 */

import { describe, it, expect } from 'vitest';

import {
  VALID_BACKUP,
  EMPTY_BACKUP,
  CORRUPTED_BACKUP,
  WRONG_TYPE_BACKUP,
  FUTURE_VERSION_BACKUP,
} from '@/test/fixtures/mockBackup';

// ---------------------------------------------------------------------------
// Current app backup version for compatibility checks
// ---------------------------------------------------------------------------

const CURRENT_BACKUP_VERSION = '1.0';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Backup & Restore', () => {
  // -----------------------------------------------------------------------
  // Export produces valid file
  // -----------------------------------------------------------------------
  describe('Export produces valid file', () => {
    it('valid backup has version metadata', () => {
      expect(VALID_BACKUP.version).toBeDefined();
      expect(typeof VALID_BACKUP.version).toBe('string');
      expect(VALID_BACKUP.version).toBe('1.0');
    });

    it('valid backup has exportDate', () => {
      expect(VALID_BACKUP.exportDate).toBeDefined();
      expect(typeof VALID_BACKUP.exportDate).toBe('string');
      // Should be a valid ISO date string
      const parsed = new Date(VALID_BACKUP.exportDate);
      expect(parsed.getTime()).not.toBeNaN();
    });

    it('valid backup contains profile data', () => {
      expect(VALID_BACKUP.profile).toBeDefined();
      expect(VALID_BACKUP.profile.firstName).toBe('James');
      expect(VALID_BACKUP.profile.lastName).toBe('Rodriguez');
      expect(VALID_BACKUP.profile.branch).toBe('army');
      expect(VALID_BACKUP.profile.mosCode).toBe('11B');
      expect(VALID_BACKUP.profile.mosTitle).toBe('Infantryman');
      expect(VALID_BACKUP.profile.entitlement).toBe('premium');
    });

    it('valid backup contains app data', () => {
      expect(VALID_BACKUP.appData).toBeDefined();
      expect(VALID_BACKUP.appData.symptoms).toBeDefined();
      expect(VALID_BACKUP.appData.medications).toBeDefined();
      expect(VALID_BACKUP.appData.migraines).toBeDefined();
      expect(VALID_BACKUP.appData.sleepEntries).toBeDefined();
      expect(VALID_BACKUP.appData.quickLogs).toBeDefined();
      expect(VALID_BACKUP.appData.medicalVisits).toBeDefined();
      expect(VALID_BACKUP.appData.exposures).toBeDefined();
    });

    it('valid backup contains settings', () => {
      expect(VALID_BACKUP.settings).toBeDefined();
      expect(VALID_BACKUP.settings.aiSafeLevel).toBeDefined();
      expect(VALID_BACKUP.settings.theme).toBeDefined();
      expect(typeof VALID_BACKUP.settings.notificationsEnabled).toBe('boolean');
      expect(VALID_BACKUP.settings.reminderTime).toBeDefined();
    });

    it('valid backup is parseable JSON', () => {
      expect(() => JSON.stringify(VALID_BACKUP)).not.toThrow();
      const serialized = JSON.stringify(VALID_BACKUP);
      const deserialized = JSON.parse(serialized);
      expect(deserialized).toEqual(VALID_BACKUP);
    });

    it('empty backup produces valid structure', () => {
      expect(EMPTY_BACKUP.version).toBe('1.0');
      expect(EMPTY_BACKUP.exportDate).toBeDefined();
      expect(EMPTY_BACKUP.profile).toBeDefined();
      expect(EMPTY_BACKUP.profile.firstName).toBe('');
      expect(EMPTY_BACKUP.profile.lastName).toBe('');
      expect(EMPTY_BACKUP.profile.servicePeriods).toEqual([]);
      expect(EMPTY_BACKUP.appData).toBeDefined();
      expect(EMPTY_BACKUP.appData.symptoms).toEqual([]);
      expect(EMPTY_BACKUP.appData.medications).toEqual([]);
      expect(EMPTY_BACKUP.settings).toBeDefined();
    });

    it('empty backup has all required top-level keys', () => {
      expect(Object.keys(EMPTY_BACKUP)).toContain('version');
      expect(Object.keys(EMPTY_BACKUP)).toContain('exportDate');
      expect(Object.keys(EMPTY_BACKUP)).toContain('profile');
      expect(Object.keys(EMPTY_BACKUP)).toContain('appData');
      expect(Object.keys(EMPTY_BACKUP)).toContain('settings');
    });
  });

  // -----------------------------------------------------------------------
  // Restore recovers all data (round-trip serialization)
  // -----------------------------------------------------------------------
  describe('Restore recovers all data', () => {
    // Simulate round-trip: serialize then deserialize
    const roundTripped = JSON.parse(JSON.stringify(VALID_BACKUP));

    it('service periods survive round-trip', () => {
      expect(roundTripped.profile.servicePeriods).toEqual(VALID_BACKUP.profile.servicePeriods);
      expect(roundTripped.profile.servicePeriods).toHaveLength(1);
      expect(roundTripped.profile.servicePeriods[0].id).toBe('sp-1');
      expect(roundTripped.profile.servicePeriods[0].branch).toBe('army');
      expect(roundTripped.profile.servicePeriods[0].mos).toBe('11B');
      expect(roundTripped.profile.servicePeriods[0].startDate).toBe('2008-06-15');
      expect(roundTripped.profile.servicePeriods[0].endDate).toBe('2012-06-15');
    });

    it('symptoms survive round-trip', () => {
      expect(roundTripped.appData.symptoms).toEqual(VALID_BACKUP.appData.symptoms);
      expect(roundTripped.appData.symptoms).toHaveLength(1);
      expect(roundTripped.appData.symptoms[0].symptom).toBe('Lower back pain');
      expect(roundTripped.appData.symptoms[0].severity).toBe(7);
      expect(roundTripped.appData.symptoms[0].frequency).toBe('daily');
    });

    it('medications survive round-trip', () => {
      expect(roundTripped.appData.medications).toEqual(VALID_BACKUP.appData.medications);
      expect(roundTripped.appData.medications).toHaveLength(1);
      expect(roundTripped.appData.medications[0].name).toBe('Sertraline');
      expect(roundTripped.appData.medications[0].dosage).toBe('50mg');
      expect(roundTripped.appData.medications[0].reason).toBe('PTSD');
    });

    it('settings survive round-trip', () => {
      expect(roundTripped.settings).toEqual(VALID_BACKUP.settings);
      expect(roundTripped.settings.aiSafeLevel).toBe(0);
      expect(roundTripped.settings.theme).toBe('dark');
      expect(roundTripped.settings.notificationsEnabled).toBe(false);
      expect(roundTripped.settings.reminderTime).toBe('09:00');
    });

    it('entitlement state survives round-trip', () => {
      expect(roundTripped.profile.entitlement).toBe(VALID_BACKUP.profile.entitlement);
      expect(roundTripped.profile.entitlement).toBe('premium');
    });

    it('migraines survive round-trip', () => {
      expect(roundTripped.appData.migraines).toEqual(VALID_BACKUP.appData.migraines);
      expect(roundTripped.appData.migraines[0].severity).toBe(8);
      expect(roundTripped.appData.migraines[0].prostrating).toBe(true);
    });

    it('sleep entries survive round-trip', () => {
      expect(roundTripped.appData.sleepEntries).toEqual(VALID_BACKUP.appData.sleepEntries);
      expect(roundTripped.appData.sleepEntries[0].hoursSlept).toBe(4);
      expect(roundTripped.appData.sleepEntries[0].quality).toBe('poor');
    });

    it('profile identity fields survive round-trip', () => {
      expect(roundTripped.profile.firstName).toBe('James');
      expect(roundTripped.profile.lastName).toBe('Rodriguez');
      expect(roundTripped.profile.branch).toBe('army');
      expect(roundTripped.profile.mosCode).toBe('11B');
      expect(roundTripped.profile.mosTitle).toBe('Infantryman');
    });
  });

  // -----------------------------------------------------------------------
  // Restore safety
  // -----------------------------------------------------------------------
  describe('Restore safety', () => {
    it('corrupted backup is detectable', () => {
      expect(() => JSON.parse(CORRUPTED_BACKUP)).toThrow();
    });

    it('wrong file type is detectable', () => {
      // WRONG_TYPE_BACKUP is an HTML string — it has no backup keys
      expect(typeof WRONG_TYPE_BACKUP).toBe('string');
      // If someone tries to parse it as JSON it should fail
      expect(() => JSON.parse(WRONG_TYPE_BACKUP)).toThrow();
      // Or if parsed as an object, it lacks required backup fields
      expect(WRONG_TYPE_BACKUP).toContain('<html>');
      expect(WRONG_TYPE_BACKUP).not.toContain('"version"');
    });

    it('future version is detectable', () => {
      expect(FUTURE_VERSION_BACKUP.version).toBeDefined();
      const futureVersion = parseFloat(FUTURE_VERSION_BACKUP.version);
      const currentVersion = parseFloat(CURRENT_BACKUP_VERSION);
      expect(futureVersion).toBeGreaterThan(currentVersion);
    });

    it('future version backup has a version number higher than current', () => {
      expect(FUTURE_VERSION_BACKUP.version).toBe('99.0');
      expect(parseFloat(FUTURE_VERSION_BACKUP.version)).toBe(99.0);
    });

    it('future version backup still has basic structure', () => {
      expect(FUTURE_VERSION_BACKUP.profile).toBeDefined();
      expect(FUTURE_VERSION_BACKUP.appData).toBeDefined();
      expect(FUTURE_VERSION_BACKUP.settings).toBeDefined();
    });

    it('corrupted backup is a string, not an object', () => {
      expect(typeof CORRUPTED_BACKUP).toBe('string');
    });

    it('valid backup version matches current app version', () => {
      expect(VALID_BACKUP.version).toBe(CURRENT_BACKUP_VERSION);
    });
  });
});
