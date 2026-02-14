const LAST_ACTIVITY_KEY = '_lastActivity';
const RETENTION_DAYS = 365;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;
const RETENTION_WARNING_KEY = '_retentionWarningShown';

/** localStorage keys used by the app's Zustand stores */
export const APP_STORAGE_KEYS = [
  'vcs-app-data',
  'vet-user-profile',
  'vcs-ai-cache',
] as const;

/**
 * Check whether app data has exceeded the retention period (365 days of
 * inactivity). Never auto-purges — flags for user confirmation instead.
 * Always updates the last-activity timestamp to "now".
 */
export function checkDataRetention(): void {
  const now = Date.now();
  const lastActivityRaw = localStorage.getItem(LAST_ACTIVITY_KEY);

  if (lastActivityRaw) {
    const lastActivity = Number(lastActivityRaw);
    if (!Number.isNaN(lastActivity) && now - lastActivity > RETENTION_MS) {
      localStorage.setItem(RETENTION_WARNING_KEY, 'pending');
    }
  }

  localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
}

/**
 * Returns true if a data retention warning is pending (user was inactive for
 * 365+ days). The caller should surface a dialog/banner to the user.
 */
export function isRetentionWarningPending(): boolean {
  return localStorage.getItem(RETENTION_WARNING_KEY) === 'pending';
}

/** Dismiss the retention warning after user has acknowledged it. */
export function dismissRetentionWarning(): void {
  localStorage.removeItem(RETENTION_WARNING_KEY);
}

/**
 * Purge all app data from localStorage and IndexedDB.
 * Called only after explicit user confirmation.
 */
export function purgeAppData(): void {
  for (const key of APP_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  localStorage.removeItem(RETENTION_WARNING_KEY);
}

