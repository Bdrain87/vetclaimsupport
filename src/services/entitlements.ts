import { useProfileStore } from '@/store/useProfileStore';
import { supabase } from '@/lib/supabase';

/** Team accounts that always have lifetime access (hashed for client-side privacy). */
const TEAM_HASHES = new Set([
  '75e09f', // internal
  '6bd846', // internal
  '6790d1', // internal
  '4e39f8', // Tommy — Aftertheuniformmedia
]);

function hashEmail(email: string): string {
  // Simple non-crypto hash — just enough to avoid raw emails in the bundle.
  // Server-side entitlement table is the real source of truth.
  let h = 0;
  for (let i = 0; i < email.length; i++) {
    h = ((h << 5) - h + email.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(16).slice(0, 6);
}

// Pre-compute at module load so we only hash once per email check
const LIFETIME_HASHES = TEAM_HASHES;

export type EntitlementStatus = 'preview' | 'premium' | 'lifetime';
export type EntitlementSource = 'apple' | 'stripe' | 'lifetime';

export const PREVIEW_LIMITS = {
  maxConditions: 5,
  maxHealthLogs: 50,
  maxDocumentUploads: 3,
  exportEnabled: false,
  cloudSyncEnabled: false,
  formGuideDraftingEnabled: true,
} as const;

/** Routes that require premium or lifetime access. */
export const PREMIUM_ROUTES = [
  // Claims
  '/claims/strategy',
  '/claims/body-map',
  '/claims/bilateral',
  '/claims/rating-gaps',
  '/claims/readiness',
  // '/claims/secondary-finder' — free (AI gated by quota, competes with VeteranAI free tier)
  // Health — symptom/sleep/migraine tracking free up to PREVIEW_LIMITS
  // '/health/symptoms' — free (core feature, gated by maxHealthLogs)
  // '/health/sleep' — free (gated by maxHealthLogs)
  // '/health/migraines' — free (gated by maxHealthLogs)
  '/health/medications',
  '/health/visits',
  '/health/exposures',
  '/health/summary',
  '/health/timeline',
  // Prep
  '/prep/personal-statement',
  '/prep/buddy-statement',
  '/prep/doctor-summary',
  '/prep/stressor',
  // '/prep/exam' — free (exam prep is a key differentiator)
  '/prep/dbq',
  // '/prep/back-pay' — free (calculator, no AI)
  '/prep/packet',
  '/prep/appeals',
  // Claims (continued)
  '/claims/vault',
  // '/claims/decision-decoder' — free (regex mode free, AI gated by quota)
  '/claims/evidence-strength',
  // Health (continued)
  '/health/work-impact',
  '/health/trends',
  // Prep (continued)
  '/prep/vso-packet',
  '/prep/doctor-packet',
  '/prep/exam-simulator',
  '/prep/post-debrief',
  '/prep/family-statement',
  '/prep/evidence-scanner',
  '/prep/interactive-dbq',
  '/prep/dbq-analyzer',
  // '/prep/state-benefits' — free (reference data)
  '/prep/cfile-intel',
  '/prep/ask-intel',
  '/prep/medication-compliance',
] as const;

export function isPremiumRoute(pathname: string): boolean {
  return (PREMIUM_ROUTES as readonly string[]).includes(pathname);
}

let cachedEmail: string | null = null;

/**
 * Session-level flag: once a user is confirmed premium in this app session,
 * they should never be blocked by a timeout. This prevents paying users from
 * being locked out on slow cell networks.
 */
let _wasPremiumThisSession = false;

export function wasPremiumInSession(): boolean {
  return _wasPremiumThisSession;
}

export function markPremiumSession(): void {
  _wasPremiumThisSession = true;
}

function isTeamAccount(): boolean {
  return cachedEmail != null && LIFETIME_HASHES.has(hashEmail(cachedEmail.toLowerCase()));
}

export function checkEntitlement(): EntitlementStatus {
  if (isTeamAccount()) return 'lifetime';
  const entitlement = useProfileStore.getState().entitlement;
  return entitlement || 'preview';
}

export function hasPremiumAccess(): boolean {
  const status = checkEntitlement();
  const isPremium = status === 'premium' || status === 'lifetime';
  if (isPremium) _wasPremiumThisSession = true;
  return isPremium;
}

export function isFeatureAvailable(feature: keyof typeof PREVIEW_LIMITS): boolean {
  if (hasPremiumAccess()) return true;

  const limit = PREVIEW_LIMITS[feature];
  if (typeof limit === 'boolean') return limit;

  // For numeric limits, feature is "available" (caller checks count separately)
  return true;
}

export function canAddCondition(currentCount: number): boolean {
  if (hasPremiumAccess()) return true;
  return currentCount < PREVIEW_LIMITS.maxConditions;
}

export function canAddHealthLog(currentCount: number): boolean {
  if (hasPremiumAccess()) return true;
  return currentCount < PREVIEW_LIMITS.maxHealthLogs;
}

// --- Server-side entitlement refresh ---

const ENTITLEMENT_TTL_MS = 5 * 60 * 1000; // 5 minutes
let lastRefreshAt = 0;

/**
 * Query the user_entitlements table and update the Zustand store.
 * Returns the new entitlement status.
 */
export async function refreshEntitlementFromServer(): Promise<EntitlementStatus> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return checkEntitlement();

    // Cache email for team account bypass
    cachedEmail = session.user.email ?? null;
    if (isTeamAccount()) {
      useProfileStore.getState().setEntitlement('lifetime');
      lastRefreshAt = Date.now();
      return 'lifetime';
    }

    const { data } = await supabase
      .from('user_entitlements')
      .select('entitled, source')
      .eq('user_id', session.user.id)
      .single();

    let status: EntitlementStatus = 'preview';
    if (data?.entitled) {
      status = data.source === 'lifetime' ? 'lifetime' : 'premium';
    }

    useProfileStore.getState().setEntitlement(status);
    lastRefreshAt = Date.now();
    return status;
  } catch {
    // Offline or error — keep current cached value
    return checkEntitlement();
  }
}

/**
 * Invalidate the entitlement cache so the next check hits the server.
 * Call this after checkout or any event where entitlement may have changed.
 */
export function invalidateEntitlementCache(): void {
  lastRefreshAt = 0;
}

/**
 * Refresh entitlement from server if the TTL has expired.
 * Falls back to the cached value if offline.
 */
export async function ensureFreshEntitlement(): Promise<EntitlementStatus> {
  if (Date.now() - lastRefreshAt < ENTITLEMENT_TTL_MS) {
    return checkEntitlement();
  }
  return refreshEntitlementFromServer();
}

// --- Stripe checkout (web) ---

/**
 * Invoke the create-checkout-session Edge Function.
 * Returns the Stripe Checkout URL for redirect.
 *
 * Stripe payment verification flow:
 *   1. User completes Stripe Checkout
 *   2. Stripe webhook calls our verify-stripe-payment Edge Function
 *   3. Edge Function writes to user_entitlements: { entitled: true, source: 'stripe', purchase_id }
 *   4. Client calls refreshEntitlementFromServer() to pick up the new status
 */
export async function startCheckout(): Promise<string> {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: {},
  });
  if (error) throw new Error('Failed to start checkout. Please try again.');
  if (!data?.url) throw new Error('Invalid checkout URL received. Please try again.');

  const url = data.url;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('stripe.com')) {
      throw new Error('Invalid checkout URL');
    }
  } catch {
    throw new Error('Invalid checkout URL received. Please try again.');
  }
  return url;
}

// --- Apple IAP (iOS) ---

/**
 * Apple receipt verification flow (future implementation):
 *   1. User completes StoreKit purchase on iOS
 *   2. Client sends receipt to verify-apple-receipt Edge Function
 *   3. Edge Function validates with Apple's servers
 *   4. Edge Function writes to user_entitlements: { entitled: true, source: 'apple', purchase_id }
 *   5. Client calls refreshEntitlementFromServer() to pick up the new status
 */
export async function verifyAppleReceipt(receiptData: string): Promise<EntitlementStatus> {
  const { error } = await supabase.functions.invoke('verify-apple-receipt', {
    body: { receiptData },
  });
  if (error) throw new Error('Apple receipt verification failed.');

  return refreshEntitlementFromServer();
}

// --- Restore Purchases ---

/**
 * Restore purchases — checks the server for an existing entitlement.
 * Works for both Apple IAP restores and Stripe payment restores.
 * Call this from "Restore Purchases" button.
 */
export async function restorePurchases(): Promise<EntitlementStatus> {
  return refreshEntitlementFromServer();
}
