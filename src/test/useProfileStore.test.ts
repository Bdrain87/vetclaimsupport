/**
 * useProfileStore — Zustand profile store unit tests
 *
 * Tests initial state, setters for profile fields, service period CRUD,
 * BRANCH_LABELS / BRANCH_COLORS constants, and resetProfile.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks — hoisted before the store import
// ---------------------------------------------------------------------------

vi.mock('@/lib/encryptedStorage', () => ({
  encryptedStorage: {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    removeItem: (key: string) => localStorage.removeItem(key),
  },
}));

import {
  useProfileStore,
  BRANCH_LABELS,
  BRANCH_COLORS,
} from '@/store/useProfileStore';
import type { Branch, ServicePeriod } from '@/store/useProfileStore';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resetStore() {
  useProfileStore.getState().resetProfile();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useProfileStore', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------
  describe('initial state', () => {
    it('starts with empty string fields', () => {
      const s = useProfileStore.getState();
      expect(s.firstName).toBe('');
      expect(s.lastName).toBe('');
      expect(s.branch).toBe('');
      expect(s.mosCode).toBe('');
      expect(s.mosTitle).toBe('');
    });

    it('starts with hasCompletedOnboarding false', () => {
      expect(useProfileStore.getState().hasCompletedOnboarding).toBe(false);
    });

    it('starts with serviceDates as undefined', () => {
      expect(useProfileStore.getState().serviceDates).toBeUndefined();
    });

    it('starts with empty servicePeriods', () => {
      expect(useProfileStore.getState().servicePeriods).toEqual([]);
    });

    it('starts with entitlement as "preview"', () => {
      expect(useProfileStore.getState().entitlement).toBe('preview');
    });

    it('starts with vaultPasscodeSet as false', () => {
      expect(useProfileStore.getState().vaultPasscodeSet).toBe(false);
    });

    it('starts with lastSyncedAt as null', () => {
      expect(useProfileStore.getState().lastSyncedAt).toBeNull();
    });

    it('starts with claimType and claimGoal as undefined', () => {
      const s = useProfileStore.getState();
      expect(s.claimType).toBeUndefined();
      expect(s.claimGoal).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // BRANCH_LABELS export
  // -------------------------------------------------------------------------
  describe('BRANCH_LABELS', () => {
    it('contains all six branches', () => {
      const branches: Branch[] = ['army', 'marines', 'navy', 'air_force', 'coast_guard', 'space_force'];
      branches.forEach((b) => {
        expect(BRANCH_LABELS[b]).toBeDefined();
        expect(typeof BRANCH_LABELS[b]).toBe('string');
      });
    });

    it('maps correctly for known branches', () => {
      expect(BRANCH_LABELS.army).toBe('Army');
      expect(BRANCH_LABELS.marines).toBe('Marine Corps');
      expect(BRANCH_LABELS.navy).toBe('Navy');
      expect(BRANCH_LABELS.air_force).toBe('Air Force');
      expect(BRANCH_LABELS.coast_guard).toBe('Coast Guard');
      expect(BRANCH_LABELS.space_force).toBe('Space Force');
    });
  });

  // -------------------------------------------------------------------------
  // BRANCH_COLORS export
  // -------------------------------------------------------------------------
  describe('BRANCH_COLORS', () => {
    it('contains hex color values for all branches', () => {
      const branches: Branch[] = ['army', 'marines', 'navy', 'air_force', 'coast_guard', 'space_force'];
      branches.forEach((b) => {
        expect(BRANCH_COLORS[b]).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  // -------------------------------------------------------------------------
  // Setters for profile fields
  // -------------------------------------------------------------------------
  describe('profile field setters', () => {
    it('setFirstName updates firstName', () => {
      useProfileStore.getState().setFirstName('John');
      expect(useProfileStore.getState().firstName).toBe('John');
    });

    it('setLastName updates lastName', () => {
      useProfileStore.getState().setLastName('Doe');
      expect(useProfileStore.getState().lastName).toBe('Doe');
    });

    it('setBranch updates branch', () => {
      useProfileStore.getState().setBranch('marines');
      expect(useProfileStore.getState().branch).toBe('marines');
    });

    it('setBranch accepts empty string to clear', () => {
      useProfileStore.getState().setBranch('army');
      useProfileStore.getState().setBranch('');
      expect(useProfileStore.getState().branch).toBe('');
    });

    it('setMOS updates both mosCode and mosTitle', () => {
      useProfileStore.getState().setMOS('11B', 'Infantryman');
      const s = useProfileStore.getState();
      expect(s.mosCode).toBe('11B');
      expect(s.mosTitle).toBe('Infantryman');
    });

    it('setServiceDates updates serviceDates', () => {
      useProfileStore.getState().setServiceDates({ start: '2015-01-01', end: '2020-06-01' });
      const dates = useProfileStore.getState().serviceDates;
      expect(dates).toEqual({ start: '2015-01-01', end: '2020-06-01' });
    });

    it('setClaimType updates claimType', () => {
      useProfileStore.getState().setClaimType('increase');
      expect(useProfileStore.getState().claimType).toBe('increase');
    });

    it('setClaimGoal updates claimGoal', () => {
      useProfileStore.getState().setClaimGoal('secondary');
      expect(useProfileStore.getState().claimGoal).toBe('secondary');
    });

    it('setIntentToFile updates both filed and date', () => {
      useProfileStore.getState().setIntentToFile(true, '2025-03-15');
      const s = useProfileStore.getState();
      expect(s.intentToFileFiled).toBe(true);
      expect(s.intentToFileDate).toBe('2025-03-15');
    });

    it('setSeparationDate updates separationDate', () => {
      useProfileStore.getState().setSeparationDate('2025-09-01');
      expect(useProfileStore.getState().separationDate).toBe('2025-09-01');
    });

    it('setEntitlement updates entitlement', () => {
      useProfileStore.getState().setEntitlement('lifetime');
      expect(useProfileStore.getState().entitlement).toBe('lifetime');
    });

    it('setVaultPasscodeSet updates vaultPasscodeSet', () => {
      useProfileStore.getState().setVaultPasscodeSet(true);
      expect(useProfileStore.getState().vaultPasscodeSet).toBe(true);
    });

    it('setLastSyncedAt updates lastSyncedAt', () => {
      const now = new Date().toISOString();
      useProfileStore.getState().setLastSyncedAt(now);
      expect(useProfileStore.getState().lastSyncedAt).toBe(now);
    });

    it('completeOnboarding sets hasCompletedOnboarding to true', () => {
      useProfileStore.getState().completeOnboarding();
      expect(useProfileStore.getState().hasCompletedOnboarding).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Service Periods CRUD
  // -------------------------------------------------------------------------
  describe('service periods', () => {
    const period: ServicePeriod = {
      id: 'sp-1',
      branch: 'army',
      mos: '11B',
      jobTitle: 'Infantryman',
      startDate: '2015-01-01',
      endDate: '2019-12-31',
    };

    it('setServicePeriods replaces the entire array', () => {
      useProfileStore.getState().setServicePeriods([period]);
      expect(useProfileStore.getState().servicePeriods).toEqual([period]);
    });

    it('addServicePeriod appends to the array', () => {
      useProfileStore.getState().addServicePeriod(period);
      useProfileStore.getState().addServicePeriod({ ...period, id: 'sp-2', branch: 'marines' });

      expect(useProfileStore.getState().servicePeriods).toHaveLength(2);
    });

    it('updateServicePeriod modifies the matching period', () => {
      useProfileStore.getState().addServicePeriod(period);
      useProfileStore.getState().updateServicePeriod('sp-1', { mos: '68W', jobTitle: 'Combat Medic' });

      const updated = useProfileStore.getState().servicePeriods[0];
      expect(updated.mos).toBe('68W');
      expect(updated.jobTitle).toBe('Combat Medic');
      expect(updated.branch).toBe('army'); // unchanged
    });

    it('removeServicePeriod removes the matching period', () => {
      useProfileStore.getState().addServicePeriod(period);
      useProfileStore.getState().addServicePeriod({ ...period, id: 'sp-2' });

      useProfileStore.getState().removeServicePeriod('sp-1');

      const remaining = useProfileStore.getState().servicePeriods;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('sp-2');
    });
  });

  // -------------------------------------------------------------------------
  // resetProfile
  // -------------------------------------------------------------------------
  describe('resetProfile', () => {
    it('restores all fields to initial values', () => {
      // Populate the store
      const store = useProfileStore.getState();
      store.setFirstName('John');
      store.setLastName('Doe');
      store.setBranch('army');
      store.setMOS('11B', 'Infantryman');
      store.setServiceDates({ start: '2015-01-01', end: '2020-01-01' });
      store.setClaimType('initial');
      store.setEntitlement('lifetime');
      store.setVaultPasscodeSet(true);
      store.completeOnboarding();
      store.addServicePeriod({
        id: 'sp-1',
        branch: 'army',
        mos: '11B',
        jobTitle: 'Inf',
        startDate: '',
        endDate: '',
      });

      useProfileStore.getState().resetProfile();

      const s = useProfileStore.getState();
      expect(s.firstName).toBe('');
      expect(s.lastName).toBe('');
      expect(s.branch).toBe('');
      expect(s.mosCode).toBe('');
      expect(s.mosTitle).toBe('');
      expect(s.hasCompletedOnboarding).toBe(false);
      expect(s.serviceDates).toBeUndefined();
      expect(s.servicePeriods).toEqual([]);
      expect(s.claimType).toBeUndefined();
      expect(s.claimGoal).toBeUndefined();
      expect(s.intentToFileFiled).toBeUndefined();
      expect(s.intentToFileDate).toBeUndefined();
      expect(s.separationDate).toBeUndefined();
      expect(s.entitlement).toBe('preview');
      expect(s.vaultPasscodeSet).toBe(false);
      expect(s.lastSyncedAt).toBeNull();
    });
  });
});
