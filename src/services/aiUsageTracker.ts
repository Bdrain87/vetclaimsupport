/**
 * AI Usage Tracker — Central service for tracking AI calls + rate limiting.
 *
 * Local counter in localStorage (auto-resets monthly) with server sync
 * for tamper resistance. Fire-and-forget writes to ai_usage_events.
 */

import { create } from 'zustand';
import { supabase, getSharedSession } from '@/lib/supabase';
import { isNativeApp } from '@/lib/platform';
import { checkEntitlement } from '@/services/entitlements';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UsageStatus {
  used: number;
  limit: number;
  remaining: number;
  percentage: number; // 0-100
  resetDate: string; // ISO date of first of next month
  isWarning: boolean; // >= 80%
  isBlocked: boolean; // >= 100%
}

export interface TrackAICallParams {
  feature: string;
  model?: string;
  success?: boolean;
  durationMs?: number;
  inputLength?: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_MONTHLY_LIMIT = 300;
const WARNING_THRESHOLD = 0.8; // 80%

function getStorageKey(): string {
  const now = new Date();
  return `vcs-ai-usage-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getResetDate(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString().split('T')[0];
}

function getMonthStart(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

// ---------------------------------------------------------------------------
// Local counter
// ---------------------------------------------------------------------------

function getLocalCount(): number {
  try {
    const val = localStorage.getItem(getStorageKey());
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function setLocalCount(count: number): void {
  try {
    localStorage.setItem(getStorageKey(), String(count));
  } catch {
    // Storage unavailable
  }
}

function incrementLocalCount(): number {
  const next = getLocalCount() + 1;
  setLocalCount(next);
  return next;
}

// ---------------------------------------------------------------------------
// Config cache
// ---------------------------------------------------------------------------

let cachedLimit = DEFAULT_MONTHLY_LIMIT;
let configFetchedAt = 0;
const CONFIG_TTL = 5 * 60 * 1000; // 5 minutes

/** Monthly AI call limit for free/preview users. */
const PREVIEW_AI_LIMIT = 10;

async function fetchLimit(): Promise<number> {
  if (Date.now() - configFetchedAt < CONFIG_TTL) return cachedLimit;

  try {
    const entitlement = checkEntitlement();

    // Preview (free) users get a very limited AI allowance
    if (entitlement === 'preview') {
      cachedLimit = PREVIEW_AI_LIMIT;
      configFetchedAt = Date.now();
      return cachedLimit;
    }

    const plan = entitlement === 'lifetime' ? 'lifetime' : 'premium';

    const { data } = await supabase
      .from('ai_usage_config')
      .select('monthly_limit')
      .eq('plan', plan)
      .single();

    if (data?.monthly_limit) {
      cachedLimit = data.monthly_limit;
      configFetchedAt = Date.now();
    }
  } catch {
    // Use cached/default
  }
  return cachedLimit;
}

// ---------------------------------------------------------------------------
// Zustand mini-store for reactive UI updates
// ---------------------------------------------------------------------------

interface AIUsageState {
  used: number;
  limit: number;
  syncFromTracker: () => void;
}

export const useAIUsageStore = create<AIUsageState>((set) => ({
  used: getLocalCount(),
  limit: cachedLimit,
  syncFromTracker: () => {
    set({ used: getLocalCount(), limit: cachedLimit });
  },
}));

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Non-blocking: track an AI call after it completes. */
export function trackAICall(params: TrackAICallParams): void {
  const newCount = incrementLocalCount();
  useAIUsageStore.getState().syncFromTracker();

  // Fire-and-forget insert to Supabase
  getSharedSession()
    .then((session) => {
      if (!session) return;
      supabase
        .from('ai_usage_events')
        .insert({
          user_id: session.user.id,
          feature: params.feature,
          model: params.model || 'gemini-2.5-flash',
          success: params.success ?? true,
          duration_ms: params.durationMs,
          input_length: params.inputLength,
          platform: isNativeApp ? 'ios' : 'web',
        })
        .then(() => {
          // inserted
        })
        .catch(() => {
          // Non-critical — local counter is the source of truth for UX
        });
    })
    .catch(() => {
      // No session — still tracked locally
    });

  // Log to console in dev for debugging
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[ai-usage] ${params.feature}: ${newCount}/${cachedLimit}`);
  }
}

/** Synchronous read of current usage status. */
export function getUsageStatus(): UsageStatus {
  const used = getLocalCount();
  // If entitlement hasn't been fetched yet but user is preview, enforce low limit
  const entitlement = checkEntitlement();
  const limit = entitlement === 'preview' ? PREVIEW_AI_LIMIT : cachedLimit;
  const remaining = Math.max(0, limit - used);
  const percentage = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return {
    used,
    limit,
    remaining,
    percentage,
    resetDate: getResetDate(),
    isWarning: percentage >= WARNING_THRESHOLD * 100,
    isBlocked: used >= limit,
  };
}

/** Pre-call check. Returns whether the AI call should proceed. */
export function checkAIRateLimit(): { allowed: boolean; status: UsageStatus } {
  const status = getUsageStatus();
  return { allowed: !status.isBlocked, status };
}

/** Sync local counter with server on startup. Takes max(local, server). */
export async function syncUsageFromServer(): Promise<void> {
  try {
    const session = await getSharedSession();
    if (!session) return;

    const { data, error } = await supabase.rpc('get_ai_usage_count', {
      p_user_id: session.user.id,
      p_since: getMonthStart(),
    });

    if (!error && typeof data === 'number') {
      const local = getLocalCount();
      const reconciled = Math.max(local, data);
      setLocalCount(reconciled);
    }

    // Also refresh the limit from config
    await fetchLimit();

    useAIUsageStore.getState().syncFromTracker();
  } catch {
    // Offline — use local values
  }
}

// ---------------------------------------------------------------------------
// Custom error for rate limit blocks
// ---------------------------------------------------------------------------

export class AIRateLimitError extends Error {
  public status: UsageStatus;

  constructor(status: UsageStatus) {
    super(`Monthly AI limit reached (${status.used}/${status.limit}). Resets ${status.resetDate}.`);
    this.name = 'AIRateLimitError';
    this.status = status;
  }
}
