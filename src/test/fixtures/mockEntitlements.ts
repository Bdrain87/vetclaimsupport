/**
 * Mock entitlement states for testing premium gating.
 */

export const FREE_USER_STATE = {
  entitlement: 'preview' as const,
  source: undefined,
  purchaseDate: undefined,
};

export const APPLE_PREMIUM_STATE = {
  entitlement: 'premium' as const,
  source: 'apple' as const,
  purchaseDate: '2024-03-01T10:00:00.000Z',
};

export const STRIPE_PREMIUM_STATE = {
  entitlement: 'premium' as const,
  source: 'stripe' as const,
  purchaseDate: '2024-03-15T14:00:00.000Z',
};

export const LIFETIME_STATE = {
  entitlement: 'lifetime' as const,
  source: 'lifetime' as const,
  purchaseDate: '2023-12-01T00:00:00.000Z',
};

export const EXPIRED_STATE = {
  entitlement: 'preview' as const,
  source: undefined,
  purchaseDate: undefined,
  expired: true,
};
