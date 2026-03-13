/**
 * Network Check — Utility to verify connectivity before AI operations.
 *
 * Call `requireOnline()` before any AI API call. Returns false and shows
 * a toast if the device is offline.
 */

import { toast } from '@/hooks/use-toast';

/**
 * Check if the device is online. If offline, shows a toast notification
 * and returns `false`. If online, returns `true`.
 *
 * @param feature - Name of the feature requiring connectivity (for toast message)
 */
export function requireOnline(feature?: string): boolean {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    toast({
      title: 'You\'re offline',
      description: feature
        ? `${feature} requires an internet connection. Your data is saved locally.`
        : 'AI features require an internet connection. Your data is saved locally.',
    });
    return false;
  }
  return true;
}
