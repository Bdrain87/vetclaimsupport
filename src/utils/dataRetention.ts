import { clearLocalData } from '@/services/accountManagement';

const LAST_ACTIVITY_KEY = '_lastActivity';
const RETENTION_DAYS = 365;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;
const RETENTION_WARNING_KEY = '_retentionWarningShown';

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
  try { localStorage.removeItem(RETENTION_WARNING_KEY); } catch { /* storage error — ignore */ }
}

/**
 * Purge all app data. Delegates to `clearLocalData()` for comprehensive
 * cleanup (Zustand stores, localStorage, sessionStorage, IndexedDB,
 * encryption keys). Called only after explicit user confirmation.
 */
export async function purgeAppData(): Promise<void> {
  await clearLocalData();
}

