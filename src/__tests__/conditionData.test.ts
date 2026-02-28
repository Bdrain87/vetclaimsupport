/**
 * Condition Data Integrity Tests
 *
 * Validates that all VA condition data is consistent:
 * - No duplicate IDs
 * - All commonSecondary IDs reference existing conditions
 * - No IDs with suspicious characters (parentheses, spaces)
 * - resolveConditionId handles all vaDisability names
 * - getConditionDisplayName always returns a human-readable string
 */

import { describe, it, expect } from 'vitest';
import { vaConditions } from '@/data/vaConditions';
import { resolveConditionId, getConditionDisplayName, isSuspiciousConditionId } from '@/utils/conditionResolver';
import type { UserCondition } from '@/store/useAppStore';

describe('Condition Data Integrity', () => {
  it('all condition IDs are unique', () => {
    const ids = vaConditions.map(c => c.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    expect(duplicates).toEqual([]);
  });

  it('no condition IDs contain parentheses', () => {
    const bad = vaConditions.filter(c => c.id.includes('(') || c.id.includes(')'));
    expect(bad.map(c => c.id)).toEqual([]);
  });

  it('no condition IDs contain spaces', () => {
    const bad = vaConditions.filter(c => c.id.includes(' '));
    expect(bad.map(c => c.id)).toEqual([]);
  });

  it('no condition IDs are excessively long', () => {
    const bad = vaConditions.filter(c => c.id.length > 60);
    expect(bad.map(c => `${c.id} (${c.id.length} chars)`)).toEqual([]);
  });

  it('all commonSecondary IDs reference existing conditions', () => {
    const allIds = new Set(vaConditions.map(c => c.id));
    const broken: string[] = [];

    for (const c of vaConditions) {
      for (const secId of c.commonSecondaries || []) {
        if (!allIds.has(secId)) {
          broken.push(`${c.id} -> ${secId}`);
        }
      }
    }

    expect(broken).toEqual([]);
  });

  it('all conditions have required fields', () => {
    const incomplete: string[] = [];

    for (const c of vaConditions) {
      if (!c.id) incomplete.push(`missing id`);
      if (!c.name) incomplete.push(`${c.id}: missing name`);
      if (!c.abbreviation) incomplete.push(`${c.id}: missing abbreviation`);
      if (!c.diagnosticCode) incomplete.push(`${c.id}: missing diagnosticCode`);
      if (!c.category) incomplete.push(`${c.id}: missing category`);
    }

    expect(incomplete).toEqual([]);
  });
});

describe('resolveConditionId', () => {
  it('resolves direct ID matches', () => {
    const result = resolveConditionId('ptsd');
    expect(result.conditionId).toBe('ptsd');
  });

  it('resolves by abbreviation', () => {
    const result = resolveConditionId('GERD');
    expect(result.conditionId).not.toContain('(');
    expect(result.conditionId).not.toContain(' ');
  });

  it('resolves by full name', () => {
    const result = resolveConditionId('Post-Traumatic Stress Disorder');
    expect(result.conditionId).toBe('ptsd');
  });

  it('returns slug for unresolvable inputs', () => {
    const result = resolveConditionId('Some Unknown Condition XYZ123');
    expect(result.conditionId).not.toContain(' ');
    expect(result.conditionId).not.toContain('(');
    expect(result.displayName).toBe('Some Unknown Condition XYZ123');
  });

  it('handles empty input', () => {
    const result = resolveConditionId('');
    expect(result.conditionId).toBe('');
  });

  it('resolves vaDisability names to valid IDs', () => {
    // Sample a few common ones
    const testNames = ['Tinnitus', 'Sleep Apnea', 'Lumbar Strain'];
    for (const name of testNames) {
      const result = resolveConditionId(name);
      expect(result.conditionId).not.toContain('(');
      expect(result.conditionId).not.toContain(' ');
      expect(result.conditionId.length).toBeGreaterThan(0);
    }
  });
});

describe('getConditionDisplayName', () => {
  it('returns displayName when set', () => {
    const uc: UserCondition = {
      id: '1',
      conditionId: 'some-unknown',
      displayName: 'My Custom Condition',
      serviceConnected: true,
      claimStatus: 'pending',
      isPrimary: true,
      dateAdded: new Date().toISOString(),
    };
    expect(getConditionDisplayName(uc)).toBe('My Custom Condition');
  });

  it('falls back to VA database lookup', () => {
    const uc: UserCondition = {
      id: '1',
      conditionId: 'ptsd',
      serviceConnected: true,
      claimStatus: 'pending',
      isPrimary: true,
      dateAdded: new Date().toISOString(),
    };
    const name = getConditionDisplayName(uc);
    expect(name).toBeTruthy();
    expect(name).not.toBe('ptsd');
  });

  it('humanizes conditionId as last resort', () => {
    const uc: UserCondition = {
      id: '1',
      conditionId: 'some-unknown-thing',
      serviceConnected: true,
      claimStatus: 'pending',
      isPrimary: true,
      dateAdded: new Date().toISOString(),
    };
    expect(getConditionDisplayName(uc)).toBe('Some Unknown Thing');
  });

  it('never returns an empty string', () => {
    const uc: UserCondition = {
      id: '1',
      conditionId: 'x',
      serviceConnected: true,
      claimStatus: 'pending',
      isPrimary: true,
      dateAdded: new Date().toISOString(),
    };
    expect(getConditionDisplayName(uc).length).toBeGreaterThan(0);
  });
});

describe('isSuspiciousConditionId', () => {
  it('flags IDs with parentheses', () => {
    expect(isSuspiciousConditionId('gerd-(gastroesophageal-reflux-disease)')).toBe(true);
  });

  it('flags IDs with spaces', () => {
    expect(isSuspiciousConditionId('sleep apnea')).toBe(true);
  });

  it('flags very long IDs', () => {
    expect(isSuspiciousConditionId('a'.repeat(61))).toBe(true);
  });

  it('passes clean IDs', () => {
    expect(isSuspiciousConditionId('ptsd')).toBe(false);
    expect(isSuspiciousConditionId('sleep-apnea')).toBe(false);
    expect(isSuspiciousConditionId('lumbar-strain')).toBe(false);
  });
});
