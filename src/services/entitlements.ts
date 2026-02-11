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

// Stub for future IAP integration
export async function purchaseLifetime(): Promise<boolean> {
  // TODO: Integrate with RevenueCat / native IAP
  // IAP not yet configured — stub
  return false;
}

// Stub for restore purchases
export async function restorePurchases(): Promise<boolean> {
  // TODO: Integrate with RevenueCat
  // Restore Purchases not yet configured — stub
  return false;
}
