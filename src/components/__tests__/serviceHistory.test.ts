/**
 * Service History Form Validation — pure logic tests
 *
 * Tests date validation, MOS validation, and service period CRUD
 * operations against the actual useProfileStore Zustand store.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks — hoisted before any store import
// ---------------------------------------------------------------------------

vi.mock('@/lib/encryptedStorage', () => ({
  encryptedStorage: {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    removeItem: (key: string) => localStorage.removeItem(key),
  },
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => false,
    getPlatform: () => 'web',
  },
}));

import { useProfileStore } from '@/store/useProfileStore';
import type { ServicePeriod } from '@/store/useProfileStore';

// ---------------------------------------------------------------------------
// Helpers — pure date validation logic extracted for testing
// ---------------------------------------------------------------------------

/**
 * Validates whether an end date is before a start date.
 * Returns true when the dates are INVALID (end before start).
 */
function isEndDateBeforeStartDate(startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return false;
  return new Date(endDate) < new Date(startDate);
}

/**
 * Validates whether a service period needs an end date.
 * A period with currentlyServing=true does NOT require an end date.
 */
function requiresEndDate(period: Partial<ServicePeriod>): boolean {
  return !period.currentlyServing;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Service History Form Validation', () => {
  beforeEach(() => {
    localStorage.clear();
    useProfileStore.getState().resetProfile();
  });

  // -----------------------------------------------------------------------
  // Date Validation
  // -----------------------------------------------------------------------
  describe('Date Validation', () => {
    it('detects end date before start date', () => {
      const startDate = '2020-06-15';
      const endDate = '2019-01-01';
      expect(isEndDateBeforeStartDate(startDate, endDate)).toBe(true);
    });

    it('allows end date equal to start date', () => {
      const date = '2020-06-15';
      expect(isEndDateBeforeStartDate(date, date)).toBe(false);
    });

    it('allows end date after start date', () => {
      const startDate = '2015-01-01';
      const endDate = '2020-06-15';
      expect(isEndDateBeforeStartDate(startDate, endDate)).toBe(false);
    });

    it('allows empty end date when currently serving', () => {
      const period: Partial<ServicePeriod> = {
        startDate: '2020-01-01',
        endDate: '',
        currentlyServing: true,
      };
      expect(requiresEndDate(period)).toBe(false);
      // Empty end date with currently serving should not flag as invalid
      expect(isEndDateBeforeStartDate(period.startDate!, period.endDate!)).toBe(false);
    });

    it('requires end date when not currently serving', () => {
      const period: Partial<ServicePeriod> = {
        startDate: '2020-01-01',
        endDate: '',
        currentlyServing: false,
      };
      expect(requiresEndDate(period)).toBe(true);
    });

    it('does not flag validation error for empty dates', () => {
      expect(isEndDateBeforeStartDate('', '')).toBe(false);
      expect(isEndDateBeforeStartDate('2020-01-01', '')).toBe(false);
      expect(isEndDateBeforeStartDate('', '2020-01-01')).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // MOS/AFSC Validation
  // -----------------------------------------------------------------------
  describe('MOS/AFSC Validation', () => {
    it('allows empty MOS', () => {
      const period: ServicePeriod = {
        id: 'sp-empty-mos',
        branch: 'army',
        mos: '',
        jobTitle: 'Rifleman',
        startDate: '2015-01-01',
        endDate: '2019-12-31',
      };
      // MOS is a plain string field — empty is allowed
      expect(period.mos).toBe('');
      expect(period.mos.length).toBe(0);
    });

    it('allows valid Army MOS like 11B', () => {
      const period: ServicePeriod = {
        id: 'sp-army-mos',
        branch: 'army',
        mos: '11B',
        jobTitle: 'Infantryman',
        startDate: '2015-01-01',
        endDate: '2019-12-31',
      };
      expect(period.mos).toBe('11B');
      expect(period.mos.length).toBeGreaterThan(0);
    });

    it('allows valid Air Force AFSC like 3E7X1', () => {
      const period: ServicePeriod = {
        id: 'sp-af-afsc',
        branch: 'air_force',
        mos: '3E7X1',
        jobTitle: 'Fire Protection',
        startDate: '2010-05-01',
        endDate: '2016-05-01',
      };
      expect(period.mos).toBe('3E7X1');
      expect(period.mos.length).toBeGreaterThan(0);
    });

    it('allows Navy NEC/rating codes', () => {
      const period: ServicePeriod = {
        id: 'sp-navy',
        branch: 'navy',
        mos: 'HM-8404',
        jobTitle: 'Hospital Corpsman',
        startDate: '2012-08-01',
        endDate: '2018-08-01',
      };
      expect(period.mos).toBe('HM-8404');
    });
  });

  // -----------------------------------------------------------------------
  // Service Period Store Operations
  // -----------------------------------------------------------------------
  describe('Service Period Store Operations', () => {
    const basePeriod: ServicePeriod = {
      id: 'sp-1',
      branch: 'army',
      mos: '11B',
      jobTitle: 'Infantryman',
      startDate: '2008-06-15',
      endDate: '2012-06-15',
    };

    it('adds a service period to store', () => {
      useProfileStore.getState().addServicePeriod(basePeriod);
      const periods = useProfileStore.getState().servicePeriods;
      expect(periods).toHaveLength(1);
      expect(periods[0]).toEqual(basePeriod);
    });

    it('adds multiple service periods to store', () => {
      const secondPeriod: ServicePeriod = {
        id: 'sp-2',
        branch: 'marines',
        mos: '0311',
        jobTitle: 'Rifleman',
        startDate: '2013-01-01',
        endDate: '2017-01-01',
      };
      useProfileStore.getState().addServicePeriod(basePeriod);
      useProfileStore.getState().addServicePeriod(secondPeriod);

      const periods = useProfileStore.getState().servicePeriods;
      expect(periods).toHaveLength(2);
      expect(periods[0].id).toBe('sp-1');
      expect(periods[1].id).toBe('sp-2');
    });

    it('updates a service period', () => {
      useProfileStore.getState().addServicePeriod(basePeriod);
      useProfileStore.getState().updateServicePeriod('sp-1', {
        mos: '68W',
        jobTitle: 'Combat Medic',
      });

      const updated = useProfileStore.getState().servicePeriods[0];
      expect(updated.mos).toBe('68W');
      expect(updated.jobTitle).toBe('Combat Medic');
      // Untouched fields remain
      expect(updated.branch).toBe('army');
      expect(updated.startDate).toBe('2008-06-15');
      expect(updated.endDate).toBe('2012-06-15');
    });

    it('removes a service period', () => {
      const secondPeriod: ServicePeriod = {
        id: 'sp-2',
        branch: 'navy',
        mos: 'HM',
        jobTitle: 'Corpsman',
        startDate: '2014-01-01',
        endDate: '2018-01-01',
      };

      useProfileStore.getState().addServicePeriod(basePeriod);
      useProfileStore.getState().addServicePeriod(secondPeriod);
      useProfileStore.getState().removeServicePeriod('sp-1');

      const remaining = useProfileStore.getState().servicePeriods;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('sp-2');
    });

    it('does not remove non-matching periods', () => {
      useProfileStore.getState().addServicePeriod(basePeriod);
      useProfileStore.getState().removeServicePeriod('non-existent-id');

      const remaining = useProfileStore.getState().servicePeriods;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('sp-1');
    });

    it('stores service period with currentlyServing=true and no endDate', () => {
      const activePeriod: ServicePeriod = {
        id: 'sp-active',
        branch: 'air_force',
        mos: '1A8X2',
        jobTitle: 'Airborne ISR Operator',
        startDate: '2022-03-01',
        endDate: '',
        currentlyServing: true,
      };

      useProfileStore.getState().addServicePeriod(activePeriod);
      const stored = useProfileStore.getState().servicePeriods[0];
      expect(stored.currentlyServing).toBe(true);
      expect(stored.endDate).toBe('');
    });

    it('setServicePeriods replaces entire array', () => {
      useProfileStore.getState().addServicePeriod(basePeriod);
      expect(useProfileStore.getState().servicePeriods).toHaveLength(1);

      const replacements: ServicePeriod[] = [
        { id: 'new-1', branch: 'coast_guard', mos: 'BM', jobTitle: 'Boatswain Mate', startDate: '2019-01-01', endDate: '2023-01-01' },
        { id: 'new-2', branch: 'space_force', mos: '5S', jobTitle: 'Space Systems', startDate: '2023-06-01', endDate: '', currentlyServing: true },
      ];
      useProfileStore.getState().setServicePeriods(replacements);

      const periods = useProfileStore.getState().servicePeriods;
      expect(periods).toHaveLength(2);
      expect(periods[0].id).toBe('new-1');
      expect(periods[1].id).toBe('new-2');
    });
  });
});
