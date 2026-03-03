/**
 * Privacy-first analytics service.
 *
 * Logs anonymized events only — never PII. Uses SHA-256 hash of user ID.
 * Respects Do Not Track and provides opt-out toggle.
 *
 * Events are batched locally and flushed to Supabase `analytics_events` table
 * periodically or on app background.
 */

import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

const ANALYTICS_OPT_OUT_KEY = 'vcs_analytics_opt_out';
const BATCH_FLUSH_INTERVAL_MS = 60_000; // Flush every 60 seconds
const MAX_BATCH_SIZE = 50;

interface AnalyticsEvent {
  user_id_hash: string;
  event_name: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

let _userIdHash: string | null = null;
let _batch: AnalyticsEvent[] = [];
let _flushTimer: ReturnType<typeof setInterval> | null = null;

/**
 * SHA-256 hash a string and return hex digest.
 */
async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if analytics is enabled.
 */
export function isAnalyticsEnabled(): boolean {
  // Respect Do Not Track
  if (navigator.doNotTrack === '1') return false;
  // Check user opt-out
  return localStorage.getItem(ANALYTICS_OPT_OUT_KEY) !== 'true';
}

/**
 * Set analytics opt-out preference.
 */
export function setAnalyticsOptOut(optOut: boolean): void {
  if (optOut) {
    localStorage.setItem(ANALYTICS_OPT_OUT_KEY, 'true');
    _batch = []; // Clear pending events
  } else {
    localStorage.removeItem(ANALYTICS_OPT_OUT_KEY);
  }
}

/**
 * Initialize analytics with the current user's ID.
 * Call once after sign-in. The ID is hashed immediately — raw ID is never stored.
 */
export async function initAnalytics(userId: string): Promise<void> {
  if (!isAnalyticsEnabled()) return;
  _userIdHash = await sha256(userId);

  // Start periodic flush
  if (!_flushTimer) {
    _flushTimer = setInterval(flushEvents, BATCH_FLUSH_INTERVAL_MS);
  }
}

/**
 * Track an analytics event.
 *
 * @param eventName - Event identifier (e.g., 'condition_added', 'premium_purchased')
 * @param metadata - Optional key-value pairs (never include PII)
 */
export function trackEvent(
  eventName: string,
  metadata?: Record<string, string | number | boolean>,
): void {
  if (!isAnalyticsEnabled() || !_userIdHash) return;

  _batch.push({
    user_id_hash: _userIdHash,
    event_name: eventName,
    metadata,
    timestamp: new Date().toISOString(),
  });

  // Auto-flush if batch is full
  if (_batch.length >= MAX_BATCH_SIZE) {
    flushEvents();
  }
}

/**
 * Flush batched events to Supabase.
 */
async function flushEvents(): Promise<void> {
  if (_batch.length === 0) return;

  const events = [..._batch];
  _batch = [];

  try {
    const { error } = await supabase.from('analytics_events').insert(events);
    if (error) {
      // Put events back on failure (up to max)
      _batch = [...events.slice(0, MAX_BATCH_SIZE - _batch.length), ..._batch];
      logger.warn('[analytics] Flush failed:', error.message);
    }
  } catch {
    // Re-queue silently
    _batch = [...events.slice(0, MAX_BATCH_SIZE - _batch.length), ..._batch];
  }
}

/**
 * Flush on app background/close.
 */
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushEvents();
    }
  });
}

/**
 * Clean up analytics (call on sign-out).
 */
export function resetAnalytics(): void {
  _userIdHash = null;
  _batch = [];
  if (_flushTimer) {
    clearInterval(_flushTimer);
    _flushTimer = null;
  }
}

// ── Standard event names ──────────────────────────────────────────────

export const EVENTS = {
  ONBOARDING_COMPLETED: 'onboarding_completed',
  CONDITION_ADDED: 'condition_added',
  CONDITION_REMOVED: 'condition_removed',
  PREMIUM_PURCHASED: 'premium_purchased',
  PREMIUM_RESTORED: 'premium_restored',
  AI_GENERATED: 'ai_generated',
  EXPORT_CREATED: 'export_created',
  FEATURE_VIEWED: 'feature_viewed',
  SYMPTOM_LOGGED: 'symptom_logged',
  QUICK_LOG_SAVED: 'quick_log_saved',
  DOCUMENT_SCANNED: 'document_scanned',
  BUDDY_STATEMENT_SHARED: 'buddy_statement_shared',
  UPGRADE_MODAL_SHOWN: 'upgrade_modal_shown',
  UPGRADE_MODAL_DISMISSED: 'upgrade_modal_dismissed',
} as const;
