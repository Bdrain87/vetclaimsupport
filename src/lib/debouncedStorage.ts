/**
 * Debounced storage wrapper for Zustand persist middleware.
 *
 * Wraps any StateStorage implementation and debounces setItem calls
 * by key. This prevents excessive encryption + write cycles when
 * multiple state updates fire in rapid succession (e.g. form inputs,
 * slider drags, batch imports).
 *
 * Each key gets its own independent debounce timer so a write to
 * 'vcs-app-data' doesn't delay 'vcs-profile'.
 */

import type { StateStorage } from 'zustand/middleware';

const DEFAULT_DEBOUNCE_MS = 300;

export function createDebouncedStorage(
  storage: StateStorage,
  debounceMs: number = DEFAULT_DEBOUNCE_MS,
): StateStorage {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const pending = new Map<string, string>();

  // Flush all pending writes synchronously — called on page unload so
  // edits made in the last debounce window aren't lost.
  function flushAll() {
    for (const [key, value] of pending) {
      const timer = timers.get(key);
      if (timer) clearTimeout(timer);
      timers.delete(key);
      storage.setItem(key, value);
    }
    pending.clear();
  }

  // 'pagehide' fires reliably on iOS/Safari (beforeunload does not).
  // Both are registered for maximum coverage.
  if (typeof globalThis.addEventListener === 'function') {
    globalThis.addEventListener('pagehide', flushAll);
    globalThis.addEventListener('beforeunload', flushAll);
  }

  return {
    getItem(key: string) {
      // If there's a pending write that hasn't flushed yet, return
      // the pending value so reads are consistent.
      if (pending.has(key)) {
        return pending.get(key)!;
      }
      return storage.getItem(key);
    },

    setItem(key: string, value: string) {
      pending.set(key, value);

      const existing = timers.get(key);
      if (existing) clearTimeout(existing);

      timers.set(
        key,
        setTimeout(() => {
          timers.delete(key);
          pending.delete(key);
          storage.setItem(key, value);
        }, debounceMs),
      );
    },

    removeItem(key: string) {
      // Cancel any pending write and remove immediately.
      const existing = timers.get(key);
      if (existing) {
        clearTimeout(existing);
        timers.delete(key);
      }
      pending.delete(key);
      storage.removeItem(key);
    },
  };
}
