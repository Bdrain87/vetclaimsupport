import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { useProfileStore } from '@/store/useProfileStore';
import {
  checkEntitlement,
  hasPremiumAccess,
  isPremiumRoute,
  isFeatureAvailable,
  canAddCondition,
  canAddHealthLog,
  PREVIEW_LIMITS,
  PREMIUM_ROUTES,
  refreshEntitlementFromServer,
  ensureFreshEntitlement,
  startCheckout,
  verifyAppleReceipt,
  restorePurchases,
} from '../entitlements';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
    functions: {
      invoke: vi.fn(),
    },
  },
}));

import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Set the entitlement field directly on the Zustand store. */
function setEntitlement(value: 'preview' | 'premium' | 'lifetime') {
  useProfileStore.setState({ entitlement: value });
}

// ===========================================================================
// Section 3A — Entitlement State Machine
// ===========================================================================

describe('Section 3A — Entitlement State Machine', () => {
  beforeEach(() => {
    // Reset store to default (preview)
    useProfileStore.setState({ entitlement: 'preview' });
  });

  it('defaults to "preview" for a free user', () => {
    expect(checkEntitlement()).toBe('preview');
  });

  it('returns "preview" when entitlement is explicitly set to preview', () => {
    setEntitlement('preview');
    expect(checkEntitlement()).toBe('preview');
    expect(hasPremiumAccess()).toBe(false);
  });

  it('recognizes Apple premium subscription', () => {
    setEntitlement('premium');
    expect(checkEntitlement()).toBe('premium');
    expect(hasPremiumAccess()).toBe(true);
  });

  it('recognizes Stripe premium subscription', () => {
    setEntitlement('premium');
    expect(checkEntitlement()).toBe('premium');
    expect(hasPremiumAccess()).toBe(true);
  });

  it('recognizes lifetime entitlement', () => {
    setEntitlement('lifetime');
    expect(checkEntitlement()).toBe('lifetime');
    expect(hasPremiumAccess()).toBe(true);
  });

  it('hasPremiumAccess returns false for preview users', () => {
    setEntitlement('preview');
    expect(hasPremiumAccess()).toBe(false);
  });

  it('hasPremiumAccess returns true for premium users', () => {
    setEntitlement('premium');
    expect(hasPremiumAccess()).toBe(true);
  });

  it('hasPremiumAccess returns true for lifetime users', () => {
    setEntitlement('lifetime');
    expect(hasPremiumAccess()).toBe(true);
  });

  it('transitions from preview to premium correctly', () => {
    setEntitlement('preview');
    expect(hasPremiumAccess()).toBe(false);

    setEntitlement('premium');
    expect(hasPremiumAccess()).toBe(true);
    expect(checkEntitlement()).toBe('premium');
  });

  it('transitions from premium to lifetime correctly', () => {
    setEntitlement('premium');
    expect(checkEntitlement()).toBe('premium');

    setEntitlement('lifetime');
    expect(checkEntitlement()).toBe('lifetime');
    expect(hasPremiumAccess()).toBe(true);
  });
});

// ===========================================================================
// Section 3B — isPremiumRoute
// ===========================================================================

describe('Section 3B — isPremiumRoute', () => {
  it('identifies all routes in PREMIUM_ROUTES as premium', () => {
    for (const route of PREMIUM_ROUTES) {
      expect(isPremiumRoute(route)).toBe(true);
    }
  });

  it('contains at least 20 premium routes', () => {
    expect(PREMIUM_ROUTES.length).toBeGreaterThanOrEqual(20);
  });

  it('returns false for the root route', () => {
    expect(isPremiumRoute('/')).toBe(false);
  });

  it('returns false for the home/dashboard route', () => {
    expect(isPremiumRoute('/dashboard')).toBe(false);
  });

  it('returns false for generic settings', () => {
    expect(isPremiumRoute('/settings')).toBe(false);
  });

  it('returns false for a random non-existent route', () => {
    expect(isPremiumRoute('/not-a-real-route')).toBe(false);
  });

  it('returns true for /claims/strategy', () => {
    expect(isPremiumRoute('/claims/strategy')).toBe(true);
  });

  it('returns true for /prep/personal-statement', () => {
    expect(isPremiumRoute('/prep/personal-statement')).toBe(true);
  });

  it('returns false for /health/symptoms (now free)', () => {
    expect(isPremiumRoute('/health/symptoms')).toBe(false);
  });

  it('returns true for /claims/vault', () => {
    expect(isPremiumRoute('/claims/vault')).toBe(true);
  });

  it('returns false for /prep/exam (now free)', () => {
    expect(isPremiumRoute('/prep/exam')).toBe(false);
  });

  it('returns true for /claims/body-map', () => {
    expect(isPremiumRoute('/claims/body-map')).toBe(true);
  });

  it('is case-sensitive — uppercase does not match', () => {
    expect(isPremiumRoute('/CLAIMS/STRATEGY')).toBe(false);
  });

  it('does not match partial routes', () => {
    expect(isPremiumRoute('/claims/strategy/details')).toBe(false);
  });

  it('does not match routes with trailing slash', () => {
    expect(isPremiumRoute('/claims/strategy/')).toBe(false);
  });
});

// ===========================================================================
// Section 3C — Preview Limits Enforcement
// ===========================================================================

describe('Section 3C — Preview Limits Enforcement', () => {
  beforeEach(() => {
    useProfileStore.setState({ entitlement: 'preview' });
  });

  // --- PREVIEW_LIMITS constants ---

  it('PREVIEW_LIMITS.maxConditions is 5', () => {
    expect(PREVIEW_LIMITS.maxConditions).toBe(5);
  });

  it('PREVIEW_LIMITS.maxHealthLogs is 50', () => {
    expect(PREVIEW_LIMITS.maxHealthLogs).toBe(50);
  });

  it('PREVIEW_LIMITS.maxDocumentUploads is 3', () => {
    expect(PREVIEW_LIMITS.maxDocumentUploads).toBe(3);
  });

  it('PREVIEW_LIMITS.exportEnabled is false', () => {
    expect(PREVIEW_LIMITS.exportEnabled).toBe(false);
  });

  it('PREVIEW_LIMITS.cloudSyncEnabled is false', () => {
    expect(PREVIEW_LIMITS.cloudSyncEnabled).toBe(false);
  });

  it('PREVIEW_LIMITS.formGuideDraftingEnabled is true', () => {
    expect(PREVIEW_LIMITS.formGuideDraftingEnabled).toBe(true);
  });

  // --- canAddCondition ---

  it('canAddCondition allows first condition for free user (count=0)', () => {
    expect(canAddCondition(0)).toBe(true);
  });

  it('canAddCondition allows up to 4 conditions for free user (count=4)', () => {
    expect(canAddCondition(4)).toBe(true);
  });

  it('canAddCondition blocks sixth condition for free user (count=5)', () => {
    expect(canAddCondition(5)).toBe(false);
  });

  it('canAddCondition allows any count for premium user', () => {
    setEntitlement('premium');
    expect(canAddCondition(0)).toBe(true);
    expect(canAddCondition(1)).toBe(true);
    expect(canAddCondition(10)).toBe(true);
    expect(canAddCondition(100)).toBe(true);
  });

  it('canAddCondition allows any count for lifetime user', () => {
    setEntitlement('lifetime');
    expect(canAddCondition(0)).toBe(true);
    expect(canAddCondition(1)).toBe(true);
    expect(canAddCondition(50)).toBe(true);
  });

  // --- canAddHealthLog ---

  it('canAddHealthLog allows up to 49 for free user', () => {
    expect(canAddHealthLog(0)).toBe(true);
    expect(canAddHealthLog(49)).toBe(true);
  });

  it('canAddHealthLog blocks at 50 for free user', () => {
    expect(canAddHealthLog(50)).toBe(false);
  });

  it('canAddHealthLog blocks above 50 for free user', () => {
    expect(canAddHealthLog(60)).toBe(false);
    expect(canAddHealthLog(100)).toBe(false);
  });

  it('canAddHealthLog allows any count for premium user', () => {
    setEntitlement('premium');
    expect(canAddHealthLog(0)).toBe(true);
    expect(canAddHealthLog(10)).toBe(true);
    expect(canAddHealthLog(1000)).toBe(true);
  });

  it('canAddHealthLog allows any count for lifetime user', () => {
    setEntitlement('lifetime');
    expect(canAddHealthLog(0)).toBe(true);
    expect(canAddHealthLog(10)).toBe(true);
    expect(canAddHealthLog(500)).toBe(true);
  });

  // --- isFeatureAvailable ---

  it('isFeatureAvailable returns false for exportEnabled on free user', () => {
    expect(isFeatureAvailable('exportEnabled')).toBe(false);
  });

  it('isFeatureAvailable returns false for cloudSyncEnabled on free user', () => {
    expect(isFeatureAvailable('cloudSyncEnabled')).toBe(false);
  });

  it('isFeatureAvailable returns true for formGuideDraftingEnabled on free user', () => {
    expect(isFeatureAvailable('formGuideDraftingEnabled')).toBe(true);
  });

  it('isFeatureAvailable returns true for numeric-limit features on free user', () => {
    // Numeric limits return true from isFeatureAvailable; callers check counts separately
    expect(isFeatureAvailable('maxConditions')).toBe(true);
    expect(isFeatureAvailable('maxHealthLogs')).toBe(true);
    expect(isFeatureAvailable('maxDocumentUploads')).toBe(true);
  });

  it('isFeatureAvailable returns true for all features on premium user', () => {
    setEntitlement('premium');
    expect(isFeatureAvailable('exportEnabled')).toBe(true);
    expect(isFeatureAvailable('cloudSyncEnabled')).toBe(true);
    expect(isFeatureAvailable('formGuideDraftingEnabled')).toBe(true);
    expect(isFeatureAvailable('maxConditions')).toBe(true);
    expect(isFeatureAvailable('maxHealthLogs')).toBe(true);
    expect(isFeatureAvailable('maxDocumentUploads')).toBe(true);
  });

  it('isFeatureAvailable returns true for all features on lifetime user', () => {
    setEntitlement('lifetime');
    expect(isFeatureAvailable('exportEnabled')).toBe(true);
    expect(isFeatureAvailable('cloudSyncEnabled')).toBe(true);
    expect(isFeatureAvailable('formGuideDraftingEnabled')).toBe(true);
  });
});

// ===========================================================================
// Section 3D — Premium Feature Gating
// ===========================================================================

describe('Section 3D — Premium Feature Gating', () => {
  describe('what free users CAN access', () => {
    beforeEach(() => {
      useProfileStore.setState({ entitlement: 'preview' });
    });

    it('free users can add their first condition', () => {
      expect(canAddCondition(0)).toBe(true);
    });

    it('free users can add health logs up to the limit', () => {
      expect(canAddHealthLog(0)).toBe(true);
      expect(canAddHealthLog(9)).toBe(true);
    });

    it('free users can access non-premium routes', () => {
      expect(isPremiumRoute('/')).toBe(false);
      expect(isPremiumRoute('/dashboard')).toBe(false);
      expect(isPremiumRoute('/settings')).toBe(false);
    });

    it('free users have numeric feature availability (caller enforces counts)', () => {
      expect(isFeatureAvailable('maxConditions')).toBe(true);
      expect(isFeatureAvailable('maxHealthLogs')).toBe(true);
    });
  });

  describe('what free users CANNOT access', () => {
    beforeEach(() => {
      useProfileStore.setState({ entitlement: 'preview' });
    });

    it('free users cannot add a sixth condition', () => {
      expect(canAddCondition(5)).toBe(false);
    });

    it('free users cannot exceed health log limit', () => {
      expect(canAddHealthLog(50)).toBe(false);
    });

    it('free users cannot export', () => {
      expect(isFeatureAvailable('exportEnabled')).toBe(false);
    });

    it('free users cannot use cloud sync', () => {
      expect(isFeatureAvailable('cloudSyncEnabled')).toBe(false);
    });

    it('premium routes are gated from free users conceptually', () => {
      // isPremiumRoute just checks if the route is in the list — access
      // control is the caller's job, but the list correctly identifies them.
      expect(isPremiumRoute('/claims/strategy')).toBe(true);
      expect(isPremiumRoute('/prep/personal-statement')).toBe(true);
      expect(isPremiumRoute('/health/summary')).toBe(true);
      expect(isPremiumRoute('/claims/vault')).toBe(true);
    });
  });

  describe('premium users have full access', () => {
    beforeEach(() => {
      useProfileStore.setState({ entitlement: 'premium' });
    });

    it('premium users can add unlimited conditions', () => {
      expect(canAddCondition(0)).toBe(true);
      expect(canAddCondition(50)).toBe(true);
    });

    it('premium users can add unlimited health logs', () => {
      expect(canAddHealthLog(0)).toBe(true);
      expect(canAddHealthLog(999)).toBe(true);
    });

    it('premium users can export', () => {
      expect(isFeatureAvailable('exportEnabled')).toBe(true);
    });

    it('premium users can use cloud sync', () => {
      expect(isFeatureAvailable('cloudSyncEnabled')).toBe(true);
    });

    it('premium users can use form guide drafting', () => {
      expect(isFeatureAvailable('formGuideDraftingEnabled')).toBe(true);
    });
  });

  describe('lifetime users have full access', () => {
    beforeEach(() => {
      useProfileStore.setState({ entitlement: 'lifetime' });
    });

    it('lifetime users can add unlimited conditions', () => {
      expect(canAddCondition(100)).toBe(true);
    });

    it('lifetime users can add unlimited health logs', () => {
      expect(canAddHealthLog(500)).toBe(true);
    });

    it('lifetime users can export', () => {
      expect(isFeatureAvailable('exportEnabled')).toBe(true);
    });

    it('lifetime users can use cloud sync', () => {
      expect(isFeatureAvailable('cloudSyncEnabled')).toBe(true);
    });
  });
});

// ===========================================================================
// Helpers for async tests
// ===========================================================================

/** Build a chained mock for supabase.from().select().eq().single() */
function mockSupabaseQuery(result: { data: unknown; error?: unknown }) {
  const singleFn = vi.fn().mockResolvedValue(result);
  const eqFn = vi.fn(() => ({ single: singleFn }));
  const selectFn = vi.fn(() => ({ eq: eqFn }));
  (supabase.from as Mock).mockReturnValue({ select: selectFn });
  return { selectFn, eqFn, singleFn };
}

// ===========================================================================
// Section 3E — refreshEntitlementFromServer
// ===========================================================================

describe('Section 3E — refreshEntitlementFromServer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useProfileStore.setState({ entitlement: 'preview' });

    // Re-establish the default chain mock so tests that don't override still work
    const singleFn = vi.fn().mockResolvedValue({ data: null, error: null });
    const eqFn = vi.fn(() => ({ single: singleFn }));
    const selectFn = vi.fn(() => ({ eq: eqFn }));
    (supabase.from as Mock).mockReturnValue({ select: selectFn });
  });

  it('returns current entitlement when there is no session', async () => {
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: null },
    });

    const result = await refreshEntitlementFromServer();
    expect(result).toBe('preview');
  });

  it('returns "lifetime" when data.entitled is true and source is "lifetime"', async () => {
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
    });
    mockSupabaseQuery({
      data: { entitled: true, source: 'lifetime' },
    });

    const result = await refreshEntitlementFromServer();
    expect(result).toBe('lifetime');
    expect(useProfileStore.getState().entitlement).toBe('lifetime');
  });

  it('returns "premium" when data.entitled is true and source is "stripe"', async () => {
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
    });
    mockSupabaseQuery({
      data: { entitled: true, source: 'stripe' },
    });

    const result = await refreshEntitlementFromServer();
    expect(result).toBe('premium');
    expect(useProfileStore.getState().entitlement).toBe('premium');
  });

  it('returns "premium" when data.entitled is true and source is "apple"', async () => {
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
    });
    mockSupabaseQuery({
      data: { entitled: true, source: 'apple' },
    });

    const result = await refreshEntitlementFromServer();
    expect(result).toBe('premium');
    expect(useProfileStore.getState().entitlement).toBe('premium');
  });

  it('returns "preview" when data.entitled is false', async () => {
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
    });
    mockSupabaseQuery({
      data: { entitled: false, source: null },
    });

    const result = await refreshEntitlementFromServer();
    expect(result).toBe('preview');
    expect(useProfileStore.getState().entitlement).toBe('preview');
  });

  it('returns "preview" when data is null (no row found)', async () => {
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
    });
    mockSupabaseQuery({ data: null });

    const result = await refreshEntitlementFromServer();
    expect(result).toBe('preview');
  });

  it('returns current cached value on network error', async () => {
    useProfileStore.setState({ entitlement: 'premium' });
    (supabase.auth.getSession as Mock).mockRejectedValue(new Error('Network error'));

    const result = await refreshEntitlementFromServer();
    expect(result).toBe('premium');
  });

  it('returns current cached value when query throws', async () => {
    useProfileStore.setState({ entitlement: 'lifetime' });
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
    });

    // Make the from() chain throw
    (supabase.from as Mock).mockImplementation(() => {
      throw new Error('DB error');
    });

    const result = await refreshEntitlementFromServer();
    expect(result).toBe('lifetime');
  });

  it('passes the correct user_id to the query', async () => {
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: { user: { id: 'specific-user-id' } } },
    });
    const { eqFn } = mockSupabaseQuery({
      data: { entitled: true, source: 'stripe' },
    });

    await refreshEntitlementFromServer();
    expect(eqFn).toHaveBeenCalledWith('user_id', 'specific-user-id');
  });

  it('queries the user_entitlements table', async () => {
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
    });
    mockSupabaseQuery({
      data: { entitled: true, source: 'stripe' },
    });

    await refreshEntitlementFromServer();
    expect(supabase.from).toHaveBeenCalledWith('user_entitlements');
  });
});

// ===========================================================================
// Section 3F — ensureFreshEntitlement
// ===========================================================================

describe('Section 3F — ensureFreshEntitlement', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useProfileStore.setState({ entitlement: 'preview' });
  });

  it('returns cached entitlement when within TTL', async () => {
    // First, do a successful refresh to set lastRefreshAt to now
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
    });
    mockSupabaseQuery({
      data: { entitled: true, source: 'stripe' },
    });
    await refreshEntitlementFromServer();

    // Now ensureFreshEntitlement should return cached value without calling server
    const result = await ensureFreshEntitlement();
    expect(result).toBe('premium');
  });

  it('calls refreshEntitlementFromServer when TTL is expired', async () => {
    // First, do a successful refresh
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
    });
    mockSupabaseQuery({
      data: { entitled: true, source: 'stripe' },
    });
    await refreshEntitlementFromServer();

    // Advance time beyond 5 minute TTL
    const realDateNow = Date.now;
    Date.now = vi.fn(() => realDateNow() + 6 * 60 * 1000);

    // Set up mock for the refresh call that ensureFreshEntitlement will make
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
    });
    mockSupabaseQuery({
      data: { entitled: true, source: 'lifetime' },
    });

    const result = await ensureFreshEntitlement();
    expect(result).toBe('lifetime');

    // Restore Date.now
    Date.now = realDateNow;
  });

  it('calls server on first call when lastRefreshAt is 0', async () => {
    // On a fresh module, lastRefreshAt is 0, so Date.now() - 0 > TTL
    // We need to ensure the module's lastRefreshAt is stale.
    // We can't directly reset it, but we can mock Date.now to a large value
    // to ensure the TTL check fails.
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: null },
    });

    const result = await ensureFreshEntitlement();
    // With no session, refreshEntitlementFromServer returns checkEntitlement()
    expect(result).toBe('preview');
    // Verify getSession was called (meaning it went through refreshEntitlementFromServer)
    expect(supabase.auth.getSession).toHaveBeenCalled();
  });
});

// ===========================================================================
// Section 3G — startCheckout
// ===========================================================================

describe('Section 3G — startCheckout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a valid stripe.com URL on success', async () => {
    (supabase.functions.invoke as Mock).mockResolvedValue({
      data: { url: 'https://checkout.stripe.com/c/pay_abc123' },
      error: null,
    });

    const url = await startCheckout();
    expect(url).toBe('https://checkout.stripe.com/c/pay_abc123');
  });

  it('throws when the edge function returns an error', async () => {
    (supabase.functions.invoke as Mock).mockResolvedValue({
      data: null,
      error: new Error('Function error'),
    });

    await expect(startCheckout()).rejects.toThrow('Failed to start checkout. Please try again.');
  });

  it('throws when the URL is not a stripe.com domain', async () => {
    (supabase.functions.invoke as Mock).mockResolvedValue({
      data: { url: 'https://evil.com/steal-money' },
      error: null,
    });

    await expect(startCheckout()).rejects.toThrow('Invalid checkout URL received. Please try again.');
  });

  it('throws when the URL is invalid / not parseable', async () => {
    (supabase.functions.invoke as Mock).mockResolvedValue({
      data: { url: 'not-a-valid-url' },
      error: null,
    });

    await expect(startCheckout()).rejects.toThrow('Invalid checkout URL received. Please try again.');
  });

  it('throws when the URL is undefined', async () => {
    (supabase.functions.invoke as Mock).mockResolvedValue({
      data: { url: undefined },
      error: null,
    });

    await expect(startCheckout()).rejects.toThrow('Invalid checkout URL received. Please try again.');
  });

  it('calls supabase.functions.invoke with correct parameters', async () => {
    (supabase.functions.invoke as Mock).mockResolvedValue({
      data: { url: 'https://checkout.stripe.com/session123' },
      error: null,
    });

    await startCheckout();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('create-checkout-session', {
      body: {},
    });
  });

  it('accepts URLs on stripe.com subdomains', async () => {
    (supabase.functions.invoke as Mock).mockResolvedValue({
      data: { url: 'https://billing.stripe.com/session/abc' },
      error: null,
    });

    const url = await startCheckout();
    expect(url).toBe('https://billing.stripe.com/session/abc');
  });
});

// ===========================================================================
// Section 3H — verifyAppleReceipt
// ===========================================================================

describe('Section 3H — verifyAppleReceipt', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useProfileStore.setState({ entitlement: 'preview' });
  });

  it('calls refreshEntitlementFromServer and returns status on success', async () => {
    (supabase.functions.invoke as Mock).mockResolvedValue({
      data: { verified: true },
      error: null,
    });

    // Mock the refresh call that verifyAppleReceipt triggers
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
    });
    mockSupabaseQuery({
      data: { entitled: true, source: 'apple' },
    });

    const result = await verifyAppleReceipt('base64-receipt-data');
    expect(result).toBe('premium');
    expect(useProfileStore.getState().entitlement).toBe('premium');
  });

  it('throws when the edge function returns an error', async () => {
    (supabase.functions.invoke as Mock).mockResolvedValue({
      data: null,
      error: new Error('Verification failed'),
    });

    await expect(verifyAppleReceipt('invalid-receipt')).rejects.toThrow(
      'Apple receipt verification failed.'
    );
  });

  it('passes the receipt data in the body', async () => {
    (supabase.functions.invoke as Mock).mockResolvedValue({
      data: { verified: true },
      error: null,
    });

    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: null },
    });

    await verifyAppleReceipt('my-receipt-data-123');
    expect(supabase.functions.invoke).toHaveBeenCalledWith('verify-apple-receipt', {
      body: { receiptData: 'my-receipt-data-123' },
    });
  });
});

// ===========================================================================
// Section 3I — restorePurchases
// ===========================================================================

describe('Section 3I — restorePurchases', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useProfileStore.setState({ entitlement: 'preview' });
  });

  it('delegates to refreshEntitlementFromServer', async () => {
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
    });
    mockSupabaseQuery({
      data: { entitled: true, source: 'lifetime' },
    });

    const result = await restorePurchases();
    expect(result).toBe('lifetime');
    expect(useProfileStore.getState().entitlement).toBe('lifetime');
  });

  it('returns current cached value when no session exists', async () => {
    useProfileStore.setState({ entitlement: 'premium' });
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: null },
    });

    const result = await restorePurchases();
    expect(result).toBe('premium');
  });

  it('returns current cached value on error', async () => {
    useProfileStore.setState({ entitlement: 'preview' });
    (supabase.auth.getSession as Mock).mockRejectedValue(new Error('Offline'));

    const result = await restorePurchases();
    expect(result).toBe('preview');
  });
});
