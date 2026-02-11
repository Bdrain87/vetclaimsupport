const LAST_ACTIVITY_KEY = '_lastActivity';
const RETENTION_DAYS = 90;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

/** localStorage keys used by the app's Zustand stores */
const APP_STORAGE_KEYS = [
  'vcs-app-data',
  'vet-user-profile',
  'vcs-ai-cache',
];

/**
 * Check whether app data has exceeded the retention period (90 days of
 * inactivity). If so, purge all Zustand-persisted localStorage entries.
 * Always updates the last-activity timestamp to "now".
 */
export function checkDataRetention(): void {
  const now = Date.now();
  const lastActivityRaw = localStorage.getItem(LAST_ACTIVITY_KEY);

  if (lastActivityRaw) {
    const lastActivity = Number(lastActivityRaw);
    if (!Number.isNaN(lastActivity) && now - lastActivity > RETENTION_MS) {
      // Purge all app stores
      for (const key of APP_STORAGE_KEYS) {
        localStorage.removeItem(key);
      }
    }
  }

  // Update the timestamp to now
  localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
}
