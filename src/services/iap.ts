/**
 * Apple In-App Purchase service using @capgo/capacitor-purchases (RevenueCat).
 *
 * Configure via environment variable:
 *   VITE_REVENUECAT_APPLE_API_KEY — RevenueCat Apple API key
 *
 * Product ID configured in App Store Connect / RevenueCat:
 *   vcs_lifetime — one-time $9.99 premium unlock
 */

import { isNativeApp } from '@/lib/platform';
import { logger } from '@/utils/logger';

const REVENUECAT_API_KEY = import.meta.env.VITE_REVENUECAT_APPLE_API_KEY as string | undefined;

// Lazy-import to avoid loading native plugin on web
let _plugin: typeof import('@capgo/capacitor-purchases').CapacitorPurchases | null = null;

async function getPlugin() {
  if (!isNativeApp) throw new Error('IAP is only available on native platforms');
  if (!_plugin) {
    const mod = await import('@capgo/capacitor-purchases');
    _plugin = mod.CapacitorPurchases;
  }
  return _plugin;
}

let _initialized = false;

/**
 * Initialize RevenueCat on native app boot.
 * Safe to call multiple times — only runs once.
 */
export async function initializePurchases(userId?: string): Promise<void> {
  if (!isNativeApp || _initialized) return;
  if (!REVENUECAT_API_KEY) {
    logger.warn('[iap] No RevenueCat API key configured — skipping IAP init');
    return;
  }

  try {
    const plugin = await getPlugin();
    await plugin.setup({
      apiKey: REVENUECAT_API_KEY,
      appUserID: userId || undefined,
    });
    _initialized = true;
    logger.info('[iap] RevenueCat initialized');
  } catch (err) {
    logger.error('[iap] Failed to initialize RevenueCat:', err);
  }
}

/**
 * Log the user into RevenueCat with their Supabase user ID.
 * This links purchases to their account.
 */
export async function loginPurchases(userId: string): Promise<void> {
  if (!isNativeApp || !_initialized) return;
  try {
    const plugin = await getPlugin();
    await plugin.logIn({ appUserID: userId });
  } catch (err) {
    logger.error('[iap] logIn failed:', err);
  }
}

/**
 * Log out from RevenueCat (e.g. on sign-out).
 */
export async function logoutPurchases(): Promise<void> {
  if (!isNativeApp || !_initialized) return;
  try {
    const plugin = await getPlugin();
    await plugin.logOut();
  } catch (err) {
    // logOut throws if user is already anonymous — safe to ignore
    logger.warn('[iap] logOut failed (may be anonymous):', err);
  }
}

export interface IAPOffering {
  identifier: string;
  title: string;
  description: string;
  priceString: string;
  price: number;
  packageIdentifier: string;
  offeringIdentifier: string;
}

/**
 * Fetch available offerings from RevenueCat / App Store.
 */
export async function getOfferings(): Promise<IAPOffering[]> {
  const plugin = await getPlugin();
  const { offerings } = await plugin.getOfferings();

  if (!offerings.current) return [];

  return offerings.current.availablePackages.map((pkg) => ({
    identifier: pkg.product.identifier,
    title: pkg.product.title,
    description: pkg.product.description,
    priceString: pkg.product.priceString,
    price: pkg.product.price,
    packageIdentifier: pkg.identifier,
    offeringIdentifier: pkg.offeringIdentifier,
  }));
}

export interface PurchaseResult {
  success: boolean;
  cancelled?: boolean;
  entitlementActive: boolean;
  error?: string;
}

/**
 * Purchase the lifetime package via Apple IAP.
 *
 * Flow:
 *   1. Fetch offerings
 *   2. Find the lifetime package (or first available)
 *   3. Trigger native purchase sheet
 *   4. Check entitlements on success
 */
export async function purchaseViaApple(): Promise<PurchaseResult> {
  try {
    const plugin = await getPlugin();

    // Get current offerings
    const { offerings } = await plugin.getOfferings();
    if (!offerings.current) {
      return { success: false, entitlementActive: false, error: 'No offerings available. Please try again later.' };
    }

    // Prefer the lifetime package, fall back to first available
    const pkg = offerings.current.lifetime ?? offerings.current.availablePackages[0];
    if (!pkg) {
      return { success: false, entitlementActive: false, error: 'No packages available.' };
    }

    // Trigger purchase
    const { customerInfo } = await plugin.purchasePackage({
      identifier: pkg.identifier,
      offeringIdentifier: pkg.offeringIdentifier,
    });

    // Check if premium entitlement is now active
    const premiumEntitlement = customerInfo.entitlements.active['premium'];
    return {
      success: true,
      entitlementActive: !!premiumEntitlement?.isActive,
    };
  } catch (err: unknown) {
    // RevenueCat error code 1 = user cancelled
    const rcError = err as { code?: number; message?: string };
    if (rcError.code === 1) {
      return { success: false, cancelled: true, entitlementActive: false };
    }
    logger.error('[iap] Purchase failed:', err);
    return {
      success: false,
      entitlementActive: false,
      error: rcError.message || 'Purchase failed. Please try again.',
    };
  }
}

/**
 * Restore previous purchases via RevenueCat.
 * Returns whether the premium entitlement is active after restore.
 */
export async function restoreApplePurchases(): Promise<{ restored: boolean; error?: string }> {
  try {
    const plugin = await getPlugin();
    const { customerInfo } = await plugin.restorePurchases();
    const premiumEntitlement = customerInfo.entitlements.active['premium'];
    return { restored: !!premiumEntitlement?.isActive };
  } catch (err: unknown) {
    const rcError = err as { message?: string };
    logger.error('[iap] Restore failed:', err);
    return { restored: false, error: rcError.message || 'Could not restore purchases.' };
  }
}

/**
 * Check current entitlement status from RevenueCat cache.
 */
export async function checkIAPEntitlements(): Promise<boolean> {
  if (!isNativeApp || !_initialized) return false;
  try {
    const plugin = await getPlugin();
    const { customerInfo } = await plugin.getCustomerInfo();
    return !!customerInfo.entitlements.active['premium']?.isActive;
  } catch {
    return false;
  }
}
