const LAST_ACTIVITY_KEY = '_lastActivity';
const RETENTION_DAYS = 365;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;
const RETENTION_WARNING_KEY = '_retentionWarningShown';

/** localStorage keys used by the app's Zustand stores */
const APP_STORAGE_KEYS = [
  'vcs-app-data',
  'vet-user-profile',
  'vcs-ai-cache',
];

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
      // Do NOT auto-purge. Flag for user confirmation on next interaction.
      localStorage.setItem(RETENTION_WARNING_KEY, 'pending');
    }
  }

  // Update the timestamp to now
  localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
}

/** Check if the user needs to confirm data retention. */
export function isRetentionWarningPending(): boolean {
  return localStorage.getItem(RETENTION_WARNING_KEY) === 'pending';
}

/** User confirmed they want to keep their data. */
export function dismissRetentionWarning(): void {
  localStorage.removeItem(RETENTION_WARNING_KEY);
}

/** User confirmed data purge. */
export function purgeAppData(): void {
  for (const key of APP_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
  localStorage.removeItem(RETENTION_WARNING_KEY);
}
