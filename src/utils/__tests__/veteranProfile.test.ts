import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getVeteranProfile,
  saveVeteranProfile,
  saveMOS,
  getSavedMOS,
  saveServiceDates,
  getSavedServiceDates,
  clearVeteranProfile,
} from '../veteranProfile';
import type { VeteranProfile } from '../veteranProfile';

const STORAGE_KEY = 'vet-claim-veteran-profile';

// ---------------------------------------------------------------------------
// Test setup: localStorage is cleared in src/test/setup.ts afterEach
// ---------------------------------------------------------------------------

describe('getVeteranProfile', () => {
  it('returns a default profile when localStorage is empty', () => {
    const profile = getVeteranProfile();
    expect(profile).toEqual({
      primaryMOS: '',
      branch: '',
      serviceStartDate: '',
      serviceEndDate: '',
      rank: '',
      lastUpdated: 0,
    });
  });

  it('returns stored profile merged with defaults', () => {
    const partial = { primaryMOS: '11B', branch: 'Army' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(partial));

    const profile = getVeteranProfile();
    expect(profile.primaryMOS).toBe('11B');
    expect(profile.branch).toBe('Army');
    // Defaults for missing fields
    expect(profile.serviceStartDate).toBe('');
    expect(profile.serviceEndDate).toBe('');
    expect(profile.rank).toBe('');
    expect(profile.lastUpdated).toBe(0);
  });

  it('returns default profile when localStorage has invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{{not valid json');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const profile = getVeteranProfile();
    expect(profile.primaryMOS).toBe('');
    expect(profile.lastUpdated).toBe(0);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('returns a new object each time (no reference sharing)', () => {
    const a = getVeteranProfile();
    const b = getVeteranProfile();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});

describe('saveVeteranProfile', () => {
  it('saves a partial profile to localStorage', () => {
    saveVeteranProfile({ primaryMOS: '0311', branch: 'Marines' });

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!) as VeteranProfile;
    expect(parsed.primaryMOS).toBe('0311');
    expect(parsed.branch).toBe('Marines');
  });

  it('sets lastUpdated to a recent timestamp', () => {
    const before = Date.now();
    saveVeteranProfile({ primaryMOS: '11B' });
    const after = Date.now();

    const profile = getVeteranProfile();
    expect(profile.lastUpdated).toBeGreaterThanOrEqual(before);
    expect(profile.lastUpdated).toBeLessThanOrEqual(after);
  });

  it('merges with existing profile data', () => {
    saveVeteranProfile({ primaryMOS: '11B', branch: 'Army' });
    saveVeteranProfile({ rank: 'SGT' });

    const profile = getVeteranProfile();
    expect(profile.primaryMOS).toBe('11B');
    expect(profile.branch).toBe('Army');
    expect(profile.rank).toBe('SGT');
  });

  it('overwrites existing fields when provided', () => {
    saveVeteranProfile({ primaryMOS: '11B' });
    saveVeteranProfile({ primaryMOS: '68W' });

    const profile = getVeteranProfile();
    expect(profile.primaryMOS).toBe('68W');
  });

  it('handles QuotaExceededError gracefully', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });

    // Should not throw
    expect(() => saveVeteranProfile({ primaryMOS: 'test' })).not.toThrow();
    expect(warnSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
  });
});

describe('saveMOS', () => {
  it('saves MOS to the profile', () => {
    saveMOS('11B');

    const profile = getVeteranProfile();
    expect(profile.primaryMOS).toBe('11B');
  });

  it('saves MOS with branch when provided', () => {
    saveMOS('0311', 'Marines');

    const profile = getVeteranProfile();
    expect(profile.primaryMOS).toBe('0311');
    expect(profile.branch).toBe('Marines');
  });

  it('does not overwrite branch when branch argument is omitted', () => {
    saveVeteranProfile({ branch: 'Army' });
    saveMOS('11B');

    const profile = getVeteranProfile();
    expect(profile.primaryMOS).toBe('11B');
    expect(profile.branch).toBe('Army');
  });

  it('does not set branch when branch argument is empty string', () => {
    saveVeteranProfile({ branch: 'Army' });
    saveMOS('11B', '');

    const profile = getVeteranProfile();
    // Empty string is falsy, so the spread with `branch &&` is skipped
    expect(profile.branch).toBe('Army');
  });
});

describe('getSavedMOS', () => {
  it('returns empty mos and branch when nothing is saved', () => {
    const { mos, branch } = getSavedMOS();
    expect(mos).toBe('');
    expect(branch).toBe('');
  });

  it('returns the saved MOS and branch', () => {
    saveMOS('2T1X1', 'Air Force');
    const { mos, branch } = getSavedMOS();
    expect(mos).toBe('2T1X1');
    expect(branch).toBe('Air Force');
  });
});

describe('saveServiceDates', () => {
  it('saves service start and end dates', () => {
    saveServiceDates('2010-01-15', '2014-06-30');

    const profile = getVeteranProfile();
    expect(profile.serviceStartDate).toBe('2010-01-15');
    expect(profile.serviceEndDate).toBe('2014-06-30');
  });

  it('preserves other profile fields when saving dates', () => {
    saveMOS('11B', 'Army');
    saveServiceDates('2010-01-15', '2014-06-30');

    const profile = getVeteranProfile();
    expect(profile.primaryMOS).toBe('11B');
    expect(profile.branch).toBe('Army');
    expect(profile.serviceStartDate).toBe('2010-01-15');
    expect(profile.serviceEndDate).toBe('2014-06-30');
  });
});

describe('getSavedServiceDates', () => {
  it('returns empty strings when nothing is saved', () => {
    const { startDate, endDate } = getSavedServiceDates();
    expect(startDate).toBe('');
    expect(endDate).toBe('');
  });

  it('returns the saved service dates', () => {
    saveServiceDates('2005-03-01', '2009-03-01');
    const { startDate, endDate } = getSavedServiceDates();
    expect(startDate).toBe('2005-03-01');
    expect(endDate).toBe('2009-03-01');
  });
});

describe('clearVeteranProfile', () => {
  it('removes the profile from localStorage', () => {
    saveVeteranProfile({ primaryMOS: '11B', branch: 'Army' });
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

    clearVeteranProfile();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('returns default profile after clearing', () => {
    saveVeteranProfile({ primaryMOS: '11B', branch: 'Army' });
    clearVeteranProfile();

    const profile = getVeteranProfile();
    expect(profile.primaryMOS).toBe('');
    expect(profile.branch).toBe('');
    expect(profile.lastUpdated).toBe(0);
  });

  it('does not throw when localStorage is already empty', () => {
    expect(() => clearVeteranProfile()).not.toThrow();
  });

  it('handles localStorage errors gracefully', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const removeSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('Storage unavailable');
    });

    expect(() => clearVeteranProfile()).not.toThrow();
    expect(warnSpy).toHaveBeenCalled();

    removeSpy.mockRestore();
  });
});
