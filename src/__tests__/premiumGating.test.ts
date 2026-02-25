/**
 * Premium Gating — entitlements logic tests
 *
 * Tests hasPremiumAccess, canAddCondition, canAddHealthLog,
 * isFeatureAvailable, isPremiumRoute, PREVIEW_LIMITS, and PREMIUM_ROUTES
 * against the actual entitlements service and profile store.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks — hoisted before any store / service import
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

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }) },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }),
    functions: { invoke: vi.fn() },
  },
}));

import {
  hasPremiumAccess,
  canAddCondition,
  canAddHealthLog,
  isFeatureAvailable,
  isPremiumRoute,
  PREVIEW_LIMITS,
  PREMIUM_ROUTES,
} from '@/services/entitlements';
import { useProfileStore } from '@/store/useProfileStore';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Premium Gating', () => {
  beforeEach(() => {
    localStorage.clear();
    useProfileStore.getState().resetProfile();
    // Default to preview (free) tier
    useProfileStore.setState({ entitlement: 'preview' });
  });

  // -----------------------------------------------------------------------
  // Free User Access
  // -----------------------------------------------------------------------
  describe('Free User Access', () => {
    it('free user does not have premium access', () => {
      expect(hasPremiumAccess()).toBe(false);
    });

    it('free user cannot export', () => {
      expect(isFeatureAvailable('exportEnabled')).toBe(false);
    });

    it('free user cannot use cloud sync', () => {
      expect(isFeatureAvailable('cloudSyncEnabled')).toBe(false);
    });

    it('free user cannot use form guide drafting', () => {
      expect(isFeatureAvailable('formGuideDraftingEnabled')).toBe(false);
    });

    it('free user can add 1 condition (at count=0)', () => {
      expect(canAddCondition(0)).toBe(true);
    });

    it('free user cannot add 2nd condition (at count=1)', () => {
      expect(canAddCondition(1)).toBe(false);
    });

    it('free user cannot add beyond limit (at count=5)', () => {
      expect(canAddCondition(5)).toBe(false);
    });

    it('free user can add health logs up to limit', () => {
      // Can add at counts 0 through 9
      for (let i = 0; i < PREVIEW_LIMITS.maxHealthLogs; i++) {
        expect(canAddHealthLog(i)).toBe(true);
      }
      // Cannot add at limit
      expect(canAddHealthLog(PREVIEW_LIMITS.maxHealthLogs)).toBe(false);
    });

    it('free user cannot add health logs beyond limit', () => {
      expect(canAddHealthLog(10)).toBe(false);
      expect(canAddHealthLog(100)).toBe(false);
    });

    it('non-premium routes are accessible (isPremiumRoute returns false)', () => {
      expect(isPremiumRoute('/')).toBe(false);
      expect(isPremiumRoute('/dashboard')).toBe(false);
      expect(isPremiumRoute('/profile')).toBe(false);
      expect(isPremiumRoute('/onboarding')).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Premium User Access
  // -----------------------------------------------------------------------
  describe('Premium User Access', () => {
    beforeEach(() => {
      useProfileStore.setState({ entitlement: 'premium' });
    });

    it('premium user has premium access', () => {
      expect(hasPremiumAccess()).toBe(true);
    });

    it('premium user can access all boolean features', () => {
      expect(isFeatureAvailable('exportEnabled')).toBe(true);
      expect(isFeatureAvailable('cloudSyncEnabled')).toBe(true);
      expect(isFeatureAvailable('formGuideDraftingEnabled')).toBe(true);
    });

    it('premium user has unlimited conditions', () => {
      expect(canAddCondition(0)).toBe(true);
      expect(canAddCondition(1)).toBe(true);
      expect(canAddCondition(10)).toBe(true);
      expect(canAddCondition(100)).toBe(true);
    });

    it('premium user has unlimited health logs', () => {
      expect(canAddHealthLog(0)).toBe(true);
      expect(canAddHealthLog(10)).toBe(true);
      expect(canAddHealthLog(100)).toBe(true);
      expect(canAddHealthLog(1000)).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Lifetime User Access
  // -----------------------------------------------------------------------
  describe('Lifetime User Access', () => {
    beforeEach(() => {
      useProfileStore.setState({ entitlement: 'lifetime' });
    });

    it('lifetime user has premium access', () => {
      expect(hasPremiumAccess()).toBe(true);
    });

    it('lifetime user can export', () => {
      expect(isFeatureAvailable('exportEnabled')).toBe(true);
    });

    it('lifetime user has unlimited conditions', () => {
      expect(canAddCondition(50)).toBe(true);
    });

    it('lifetime user has unlimited health logs', () => {
      expect(canAddHealthLog(500)).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // PREVIEW_LIMITS constants
  // -----------------------------------------------------------------------
  describe('PREVIEW_LIMITS', () => {
    it('maxConditions is 1', () => {
      expect(PREVIEW_LIMITS.maxConditions).toBe(1);
    });

    it('maxHealthLogs is 10', () => {
      expect(PREVIEW_LIMITS.maxHealthLogs).toBe(10);
    });

    it('maxDocumentUploads is 0', () => {
      expect(PREVIEW_LIMITS.maxDocumentUploads).toBe(0);
    });

    it('exportEnabled is false', () => {
      expect(PREVIEW_LIMITS.exportEnabled).toBe(false);
    });

    it('cloudSyncEnabled is false', () => {
      expect(PREVIEW_LIMITS.cloudSyncEnabled).toBe(false);
    });

    it('formGuideDraftingEnabled is false', () => {
      expect(PREVIEW_LIMITS.formGuideDraftingEnabled).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Premium Routes
  // -----------------------------------------------------------------------
  describe('Premium Routes', () => {
    it('contains expected premium routes', () => {
      expect(PREMIUM_ROUTES).toContain('/claims/strategy');
      expect(PREMIUM_ROUTES).toContain('/claims/body-map');
      expect(PREMIUM_ROUTES).toContain('/health/symptoms');
      expect(PREMIUM_ROUTES).toContain('/health/medications');
      expect(PREMIUM_ROUTES).toContain('/prep/personal-statement');
      expect(PREMIUM_ROUTES).toContain('/prep/buddy-statement');
      expect(PREMIUM_ROUTES).toContain('/settings/vault');
    });

    it('isPremiumRoute returns true for premium paths', () => {
      expect(isPremiumRoute('/claims/strategy')).toBe(true);
      expect(isPremiumRoute('/health/symptoms')).toBe(true);
      expect(isPremiumRoute('/prep/personal-statement')).toBe(true);
      expect(isPremiumRoute('/settings/vault')).toBe(true);
      expect(isPremiumRoute('/prep/exam')).toBe(true);
      expect(isPremiumRoute('/health/timeline')).toBe(true);
    });

    it('isPremiumRoute returns false for non-premium paths', () => {
      expect(isPremiumRoute('/')).toBe(false);
      expect(isPremiumRoute('/dashboard')).toBe(false);
      expect(isPremiumRoute('/settings')).toBe(false);
      expect(isPremiumRoute('/login')).toBe(false);
      expect(isPremiumRoute('/onboarding')).toBe(false);
    });

    it('PREMIUM_ROUTES is a non-empty array', () => {
      expect(Array.isArray(PREMIUM_ROUTES)).toBe(true);
      expect(PREMIUM_ROUTES.length).toBeGreaterThan(0);
    });

    it('all premium routes start with /', () => {
      for (const route of PREMIUM_ROUTES) {
        expect(route.startsWith('/')).toBe(true);
      }
    });

    it('premium routes include claims, health, prep, and settings sections', () => {
      const sections = new Set(PREMIUM_ROUTES.map((r) => r.split('/')[1]));
      expect(sections.has('claims')).toBe(true);
      expect(sections.has('health')).toBe(true);
      expect(sections.has('prep')).toBe(true);
      expect(sections.has('settings')).toBe(true);
    });
  });
});
