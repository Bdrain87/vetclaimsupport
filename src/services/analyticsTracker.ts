/**
 * Lightweight analytics event tracker.
 *
 * Batches events in memory and flushes to Supabase analytics_events table
 * every 30 seconds or on pagehide. Non-blocking, fire-and-forget.
 */

import { supabase, getSharedSession } from '@/lib/supabase';

interface PendingEvent {
  event_type: string;
  event_data: Record<string, unknown> | null;
  created_at: string;
}

const FLUSH_INTERVAL = 30_000; // 30 seconds
let buffer: PendingEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

/** Track a page view. */
export function trackPageView(route: string): void {
  buffer.push({
    event_type: 'page_view',
    event_data: { route },
    created_at: new Date().toISOString(),
  });
}

/** Track a discrete event. */
export function trackEvent(category: string, action: string, label?: string): void {
  buffer.push({
    event_type: `${category}:${action}`,
    event_data: label ? { label } : null,
    created_at: new Date().toISOString(),
  });
}

/** Flush buffered events to Supabase. */
async function flush(): Promise<void> {
  if (buffer.length === 0) return;

  const events = buffer.splice(0, buffer.length);

  try {
    const session = await getSharedSession();
    if (!session) {
      // Put events back if no session
      buffer.unshift(...events);
      return;
    }

    const rows = events.map((e) => ({
      user_id: session.user.id,
      ...e,
    }));

    await supabase.from('analytics_events').insert(rows);
  } catch {
    // Non-critical — drop events rather than growing memory
  }
}

/** Initialize the analytics flush loop. Call once on app startup. */
export function initAnalytics(): void {
  if (flushTimer) return;

  flushTimer = setInterval(flush, FLUSH_INTERVAL);

  // Flush on page hide (tab close, navigate away)
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flush();
      }
    });
  }
}
