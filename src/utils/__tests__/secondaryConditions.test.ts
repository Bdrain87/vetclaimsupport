import { describe, it, expect } from 'vitest';
import {
  conditionProfiles,
  secondaryConditions,
} from '../../data/secondaryConditions';

describe('conditionProfiles', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(conditionProfiles)).toBe(true);
    expect(conditionProfiles.length).toBeGreaterThan(0);
  });

  it('each entry has id, possibleSecondaries, and nexusTip', () => {
    for (const profile of conditionProfiles) {
      expect(profile).toHaveProperty('id');
      expect(profile).toHaveProperty('possibleSecondaries');
      expect(profile).toHaveProperty('nexusTip');
    }
  });

  it('possibleSecondaries are non-empty arrays for every profile', () => {
    for (const profile of conditionProfiles) {
      expect(Array.isArray(profile.possibleSecondaries)).toBe(true);
      expect(profile.possibleSecondaries.length).toBeGreaterThan(0);
    }
  });

  it('"ptsd" profile exists and has expected secondaries', () => {
    const ptsd = conditionProfiles.find((p) => p.id === 'ptsd');
    expect(ptsd).toBeDefined();
    expect(ptsd!.possibleSecondaries).toContain('sleep-apnea');
    expect(ptsd!.possibleSecondaries).toContain('hypertension');
    expect(ptsd!.possibleSecondaries).toContain('migraines');
  });

  it('"tinnitus" profile exists', () => {
    const tinnitus = conditionProfiles.find((p) => p.id === 'tinnitus');
    expect(tinnitus).toBeDefined();
  });

  it('has no duplicate profile IDs', () => {
    const ids = conditionProfiles.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('secondaryConditions', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(secondaryConditions)).toBe(true);
    expect(secondaryConditions.length).toBeGreaterThan(0);
  });

  it('each entry has primaryCondition, secondaryCondition, medicalConnection, and category', () => {
    for (const conn of secondaryConditions) {
      expect(conn).toHaveProperty('primaryCondition');
      expect(conn).toHaveProperty('secondaryCondition');
      expect(conn).toHaveProperty('medicalConnection');
      expect(conn).toHaveProperty('category');
    }
  });

  it('contains no empty strings in any field', () => {
    for (const conn of secondaryConditions) {
      expect(conn.primaryCondition.trim()).not.toBe('');
      expect(conn.secondaryCondition.trim()).not.toBe('');
      expect(conn.medicalConnection.trim()).not.toBe('');
      expect(conn.category.trim()).not.toBe('');
    }
  });

  it('includes secondaries for the primary condition "PTSD"', () => {
    const ptsdSecondaries = secondaryConditions.filter(
      (c) => c.primaryCondition === 'PTSD',
    );
    expect(ptsdSecondaries.length).toBeGreaterThan(0);
  });
});
