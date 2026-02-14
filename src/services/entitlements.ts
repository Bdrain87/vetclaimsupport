import { useProfileStore } from '@/store/useProfileStore';

export type EntitlementStatus = 'preview' | 'lifetime';

export const PREVIEW_LIMITS = {
  maxConditions: 1,
  maxHealthLogs: 10,
  maxDocumentUploads: 0,
  exportEnabled: false,
  cloudSyncEnabled: false,
  formGuideDraftingEnabled: false,
} as const;

export function checkEntitlement(): EntitlementStatus {
  const entitlement = useProfileStore.getState().entitlement;
  return entitlement || 'preview';
}

export function isFeatureAvailable(feature: keyof typeof PREVIEW_LIMITS): boolean {
  const status = checkEntitlement();
  if (status === 'lifetime') return true;

  const limit = PREVIEW_LIMITS[feature];
  if (typeof limit === 'boolean') return limit;

  // For numeric limits, feature is "available" (caller checks count separately)
  return true;
}

export function canAddCondition(currentCount: number): boolean {
  const status = checkEntitlement();
  if (status === 'lifetime') return true;
  return currentCount < PREVIEW_LIMITS.maxConditions;
}

export function canAddHealthLog(currentCount: number): boolean {
  const status = checkEntitlement();
  if (status === 'lifetime') return true;
  return currentCount < PREVIEW_LIMITS.maxHealthLogs;
}

/**
 * Purchase the lifetime entitlement.
 *
 * When IAP is configured (RevenueCat or native StoreKit / Google Play
 * Billing), this function should call the payment SDK, verify the receipt
 * server-side, and update the profile store on success.
 */
export async function purchaseLifetime(): Promise<boolean> {
  throw new Error(
    'In-app purchases are not yet configured. Lifetime access cannot be purchased at this time.',
  );
}

/**
 * Restore previously purchased entitlements.
 *
 * Should be wired to RevenueCat's restorePurchases (or equivalent) once IAP is
 * live.
 */
export async function restorePurchases(): Promise<boolean> {
  throw new Error(
    'In-app purchases are not yet configured. Purchase restoration is unavailable.',
  );
}
