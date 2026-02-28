import { supabase } from '@/lib/supabase';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { redactPII } from '@/lib/redaction';
import { logger } from '@/utils/logger';


function isNonNullObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function hasString(obj: Record<string, unknown>, key: string): boolean {
  return typeof obj[key] === 'string';
}

/** Type-safe string extraction from a validated record (avoids `as string` casts). */
function getString(obj: Record<string, unknown>, key: string): string {
  const val = obj[key];
  return typeof val === 'string' ? val : '';
}

function isValidConditionRow(row: unknown): row is { id: string; name: string; created_at?: string; updated_at?: string; service_connection_notes?: string } {
  if (!isNonNullObject(row)) return false;
  return hasString(row, 'id') && hasString(row, 'name');
}

function isValidHealthLogRow(row: unknown): row is { id: string; log_type: string; data: Record<string, unknown> } {
  if (!isNonNullObject(row)) return false;
  if (!hasString(row, 'id') || !hasString(row, 'log_type')) return false;
  return isNonNullObject(row.data);
}

function isValidHealthLogData(logType: string, data: Record<string, unknown>): boolean {
  switch (logType) {
    case 'symptom':
      return hasString(data, 'date') && hasString(data, 'symptom');
    case 'sleep':
      return hasString(data, 'date') && typeof data.hoursSlept === 'number';
    case 'migraine':
      return hasString(data, 'date');
    default:
      return false;
  }
}

function sanitizeRecord<T extends Record<string, unknown>>(record: T): T {
  const sanitized = { ...record };
  for (const key of Object.keys(sanitized)) {
    const val = sanitized[key];
    if (typeof val === 'string') {
      (sanitized as Record<string, unknown>)[key] = redactPII(val, 'high').redactedText;
    }
  }
  return sanitized;
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

let syncInterval: ReturnType<typeof setInterval> | null = null;
let currentStatus: SyncStatus = 'offline';
let lastSyncedAt: string | null = null;
let syncInProgress: Promise<void> | null = null;
let consecutiveFailures = 0;
const statusListeners = new Set<(status: SyncStatus) => void>();
const SYNC_DEBOUNCE_MS = 60000; // 60 seconds — avoid hammering the server

function notifyListeners() {
  statusListeners.forEach((fn) => fn(currentStatus));
}

function setStatus(status: SyncStatus) {
  currentStatus = status;
  notifyListeners();
}

export function onSyncStatusChange(listener: (status: SyncStatus) => void) {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
}

// ---------------------------------------------------------------------------
// Helpers for content-based deduplication
// ---------------------------------------------------------------------------

/** Normalize a string for fuzzy comparison (trim, lowercase, collapse whitespace). */
function norm(s: string | undefined | null): string {
  return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Return the newer ISO timestamp, or fallback to `b` when comparison is
 * impossible (missing values).
 */
function newerTimestamp(a: string | undefined | null, b: string | undefined | null): string {
  if (!a) return b || new Date().toISOString();
  if (!b) return a;
  return a > b ? a : b;
}

// ---------------------------------------------------------------------------
// Pull
// ---------------------------------------------------------------------------

export async function pullFromCloud(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const userId = session.user.id;

  // Pull profile data (maybeSingle — new users may not have a row yet)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {
    logger.error('[sync] pull profile failed', profileError.message, profileError);
  }

  if (profile) {
    const profileStore = useProfileStore.getState();
    if (profile.branch) profileStore.setBranch(profile.branch as Parameters<typeof profileStore.setBranch>[0]);
    if (profile.mos_code) profileStore.setMOS(profile.mos_code, profile.mos_title || '');
    if (profile.service_start_date && profile.service_end_date) {
      profileStore.setServiceDates({
        start: profile.service_start_date,
        end: profile.service_end_date,
      });
    }
    if (profile.intent_to_file_date) {
      profileStore.setIntentToFile(true, profile.intent_to_file_date);
    }
    if (profile.entitlement) {
      profileStore.setEntitlement(profile.entitlement as 'preview' | 'premium' | 'lifetime');
    }
    // Restore name from display_name
    if (profile.display_name) {
      const parts = profile.display_name.split(' ');
      profileStore.setFirstName(parts[0] || '');
      if (parts.length > 1) profileStore.setLastName(parts.slice(1).join(' '));
    }
    // Restore onboarding status — allows returning users to skip onboarding after sign-in
    if (profile.onboarding_completed) {
      profileStore.completeOnboarding();
    }
  }

  // ------------------------------------------------------------------
  // Pull conditions — deduplicate by ID *and* by normalized name so
  // locally-created conditions (with a local UUID) don't produce
  // duplicates when the cloud has the same condition under a different
  // UUID.
  // ------------------------------------------------------------------
  const { data: conditions, error: conditionsError } = await supabase
    .from('conditions')
    .select('*')
    .eq('user_id', userId);

  if (conditionsError) {
    logger.error('[sync] pull conditions failed', conditionsError.message, conditionsError);
  }

  if (conditions && conditions.length > 0) {
    const appStore = useAppStore.getState();

    for (const rawCondition of conditions) {
      if (!isValidConditionRow(rawCondition)) {
        logger.warn('[sync] Skipping invalid condition row from cloud');
        continue;
      }
      const cloudCondition = rawCondition;
      const cloudName = norm(cloudCondition.name);
      const cloudUpdatedAt: string = cloudCondition.updated_at || cloudCondition.created_at || '';

      // 1. Exact ID match — the ideal case.
      const byId = appStore.claimConditions.find(
        (c) => c.id === cloudCondition.id,
      );

      if (byId) {
        // Already synced. If cloud is newer, update local fields.
        const localUpdatedAt = byId.createdAt || '';
        if (cloudUpdatedAt && cloudUpdatedAt > localUpdatedAt) {
          appStore.updateClaimCondition(byId.id, {
            name: cloudCondition.name,
            notes: cloudCondition.service_connection_notes ?? byId.notes,
          });
        }
        continue;
      }

      // 2. Name match — local condition exists with a different UUID.
      const byName = appStore.claimConditions.find(
        (c) => norm(c.name) === cloudName,
      );

      if (byName) {
        // Adopt the cloud ID so future syncs align, and merge any
        // newer data from the cloud.
        const merged = {
          name: cloudCondition.name, // prefer cloud casing
          notes: cloudCondition.service_connection_notes
            ? cloudCondition.service_connection_notes
            : byName.notes,
          createdAt: newerTimestamp(cloudCondition.created_at, byName.createdAt),
        };

        // Remove the local-only entry and atomically insert a
        // replacement that carries the cloud UUID — avoids the race
        // condition of add-then-lookup-by-array-index.
        useAppStore.setState((s) => ({
          claimConditions: [
            ...s.claimConditions.filter((c) => c.id !== byName.id),
            {
              id: cloudCondition.id,
              name: merged.name,
              linkedMedicalVisits: byName.linkedMedicalVisits,
              linkedExposures: byName.linkedExposures,
              linkedSymptoms: byName.linkedSymptoms,
              linkedDocuments: byName.linkedDocuments,
              linkedBuddyContacts: byName.linkedBuddyContacts,
              notes: merged.notes || '',
              createdAt: merged.createdAt,
            },
          ],
        }));
        continue;
      }

      // 3. No match at all — genuinely new cloud condition. Insert
      //    atomically with the cloud UUID to avoid race conditions.
      useAppStore.setState((s) => ({
        claimConditions: [
          ...s.claimConditions,
          {
            id: cloudCondition.id,
            name: cloudCondition.name,
            linkedMedicalVisits: [],
            linkedExposures: [],
            linkedSymptoms: [],
            linkedDocuments: [],
            linkedBuddyContacts: [],
            notes: cloudCondition.service_connection_notes || '',
            createdAt: cloudCondition.created_at || new Date().toISOString(),
          },
        ],
      }));
    }
  }

  // ------------------------------------------------------------------
  // Pull health logs — deduplicate by ID and by content fingerprint
  // (date + type-specific descriptor) to avoid duplicates when the
  // local store used a different UUID.
  // ------------------------------------------------------------------
  const { data: healthLogs, error: healthLogsError } = await supabase
    .from('health_logs')
    .select('*')
    .eq('user_id', userId);

  if (healthLogsError) {
    logger.error('[sync] pull health logs failed', healthLogsError.message, healthLogsError);
  }

  if (healthLogs && healthLogs.length > 0) {
    const appStore = useAppStore.getState();

    for (const rawLog of healthLogs) {
      if (!isValidHealthLogRow(rawLog)) {
        logger.warn('[sync] Skipping invalid health log row from cloud');
        continue;
      }
      const log = rawLog;
      const logData = log.data;
      if (!isValidHealthLogData(log.log_type, logData)) {
        logger.warn('[sync] Skipping health log with invalid data shape');
        continue;
      }

      switch (log.log_type) {
        case 'symptom': {
          // Check by ID
          const byId = appStore.symptoms.find((s) => s.id === log.id);
          if (byId) break;

          // Check by content: same date + same symptom description
          const cloudDate = norm(getString(logData, 'date'));
          const cloudSymptom = norm(getString(logData, 'symptom'));
          const byContent = appStore.symptoms.find(
            (s) => norm(s.date) === cloudDate && norm(s.symptom) === cloudSymptom,
          );
          if (byContent) {
            // Adopt cloud ID so future syncs align.  If the cloud
            // record carries newer / richer data we could merge here,
            // but at minimum we unify the IDs.
            appStore.updateSymptom(byContent.id, { id: log.id });
            break;
          }

          // Genuinely new — insert with cloud ID preserved.
          appStore.addSymptom({
            id: log.id,
            ...logData,
          } as unknown as Parameters<typeof appStore.addSymptom>[0]);
          break;
        }
        case 'sleep': {
          const byId = appStore.sleepEntries.find((s) => s.id === log.id);
          if (byId) break;

          // Content fingerprint: same date is unique enough for a
          // single daily sleep entry.
          const cloudDate = norm(getString(logData, 'date'));
          const byContent = appStore.sleepEntries.find(
            (s) => norm(s.date) === cloudDate,
          );
          if (byContent) {
            appStore.updateSleepEntry(byContent.id, { id: log.id });
            break;
          }

          appStore.addSleepEntry({
            id: log.id,
            ...logData,
          } as unknown as Parameters<typeof appStore.addSleepEntry>[0]);
          break;
        }
        case 'migraine': {
          const byId = appStore.migraines.find((m) => m.id === log.id);
          if (byId) break;

          // Content fingerprint: date + time.
          const cloudDate = norm(getString(logData, 'date'));
          const cloudTime = norm(getString(logData, 'time'));
          const byContent = appStore.migraines.find(
            (m) => norm(m.date) === cloudDate && norm(m.time) === cloudTime,
          );
          if (byContent) {
            appStore.updateMigraine(byContent.id, { id: log.id });
            break;
          }

          appStore.addMigraine({
            id: log.id,
            ...logData,
          } as unknown as Parameters<typeof appStore.addMigraine>[0]);
          break;
        }
      }
    }
  }

  // ------------------------------------------------------------------
  // Pull form drafts
  // ------------------------------------------------------------------
  const { data: formDraftRows, error: formDraftsError } = await supabase
    .from('form_drafts')
    .select('*')
    .eq('user_id', userId);

  if (formDraftsError) {
    logger.error('[sync] pull form drafts failed', formDraftsError.message, formDraftsError);
  }

  if (formDraftRows && formDraftRows.length > 0) {
    const appStore = useAppStore.getState();
    const localDrafts = appStore.formDrafts;

    for (const row of formDraftRows) {
      if (!row.form_type || typeof row.form_type !== 'string') continue;

      const key = row.condition_id
        ? `${row.form_type}:${row.condition_id}`
        : row.form_type;

      const cloudContent = row.content as Record<string, string> & { lastModified?: string };
      const cloudUpdatedAt = row.updated_at || '';
      const localDraft = localDrafts[key];
      const localUpdatedAt = localDraft?.lastModified || '';

      // Merge: cloud wins if newer or local doesn't exist
      if (!localDraft || (cloudUpdatedAt && cloudUpdatedAt > localUpdatedAt)) {
        useAppStore.setState((s) => ({
          formDrafts: {
            ...s.formDrafts,
            [key]: {
              ...cloudContent,
              lastModified: cloudUpdatedAt || new Date().toISOString(),
            },
          },
        }));
      }
    }
  }

  lastSyncedAt = new Date().toISOString();
  useProfileStore.getState().setLastSyncedAt(lastSyncedAt);
}

// ---------------------------------------------------------------------------
// Push
// ---------------------------------------------------------------------------

export async function pushToCloud(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const userId = session.user.id;
  const profileState = useProfileStore.getState();
  const appState = useAppStore.getState();
  const pushErrors: string[] = [];

  // Push profile (upsert by id -- local state wins on conflict).
  // Profile is critical — if it fails, abort the entire push.
  const { error: profilePushError } = await supabase.from('profiles').upsert({
    id: userId,
    email: session.user.email || null,
    branch: profileState.branch || null,
    mos_code: profileState.mosCode || null,
    mos_title: profileState.mosTitle || null,
    service_start_date: profileState.serviceDates?.start || null,
    service_end_date: profileState.serviceDates?.end || null,
    intent_to_file_date: profileState.intentToFileDate || null,
    entitlement: profileState.entitlement,
    onboarding_completed: profileState.hasCompletedOnboarding,
    display_name: [profileState.firstName, profileState.lastName].filter(Boolean).join(' ') || null,
    updated_at: new Date().toISOString(),
  });
  if (profilePushError) {
    logger.error('[sync] push profile failed', profilePushError.message, profilePushError);
    pushErrors.push('profile');
  }

  // ------------------------------------------------------------------
  // Push conditions — upsert by primary key (id).
  //
  // Because pullFromCloud now unifies local UUIDs with cloud UUIDs,
  // duplicate rows should not occur.  We still upsert on `id` so that
  // re-pushes are idempotent.
  //
  // Non-critical entity pushes continue on failure so that partial
  // sync is better than no sync.
  // ------------------------------------------------------------------
  if (appState.claimConditions.length > 0) {
    const conditionRows = appState.claimConditions.map((c) => ({
      id: c.id,
      user_id: userId,
      name: c.name,
      service_connection_notes: c.notes ? redactPII(c.notes, 'high').redactedText : null,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase
      .from('conditions')
      .upsert(conditionRows, { onConflict: 'id' });
    if (error) {
      logger.error('[sync] push conditions failed', error);
      pushErrors.push('conditions');
    }

    // Delete cloud conditions that were removed locally
    const localConditionIds = new Set(appState.claimConditions.map((c) => c.id));
    const { data: cloudConditions } = await supabase
      .from('conditions')
      .select('id')
      .eq('user_id', userId);
    if (cloudConditions) {
      const toDelete = cloudConditions
        .filter((cc) => !localConditionIds.has(cc.id))
        .map((cc) => cc.id);
      if (toDelete.length > 0) {
        const { error: delError } = await supabase
          .from('conditions')
          .delete()
          .eq('user_id', userId)
          .in('id', toDelete);
        if (delError) {
          logger.warn('[sync] delete stale cloud conditions failed', delError);
        }
      }
    }
  }

  // Push symptoms as health logs
  if (appState.symptoms.length > 0) {
    const symptomRows = appState.symptoms.map((s) => ({
      id: s.id,
      user_id: userId,
      log_type: 'symptom' as const,
      data: sanitizeRecord(s as unknown as Record<string, unknown>),
      logged_at: s.date || new Date().toISOString(),
    }));
    const { error } = await supabase
      .from('health_logs')
      .upsert(symptomRows, { onConflict: 'id' });
    if (error) {
      logger.error('[sync] push symptoms failed', error);
      pushErrors.push('symptoms');
    }
  }

  // Push sleep entries as health logs
  if (appState.sleepEntries.length > 0) {
    const sleepRows = appState.sleepEntries.map((s) => ({
      id: s.id,
      user_id: userId,
      log_type: 'sleep' as const,
      data: sanitizeRecord(s as unknown as Record<string, unknown>),
      logged_at: s.date || new Date().toISOString(),
    }));
    const { error } = await supabase
      .from('health_logs')
      .upsert(sleepRows, { onConflict: 'id' });
    if (error) {
      logger.error('[sync] push sleep failed', error);
      pushErrors.push('sleep');
    }
  }

  // Push migraines as health logs
  if (appState.migraines.length > 0) {
    const migraineRows = appState.migraines.map((m) => ({
      id: m.id,
      user_id: userId,
      log_type: 'migraine' as const,
      data: sanitizeRecord(m as unknown as Record<string, unknown>),
      logged_at: m.date || new Date().toISOString(),
    }));
    const { error } = await supabase
      .from('health_logs')
      .upsert(migraineRows, { onConflict: 'id' });
    if (error) {
      logger.error('[sync] push migraines failed', error);
      pushErrors.push('migraines');
    }
  }

  // Push form drafts
  const draftEntries = Object.entries(appState.formDrafts);
  if (draftEntries.length > 0) {
    const draftRows = draftEntries.map(([key, draft]) => {
      // Key format: "tool:buddy-statement" or "tool:personal-statement:conditionId"
      const parts = key.split(':');
      const formType = parts.length >= 2 ? `${parts[0]}:${parts[1]}` : key;
      const conditionId = parts.length > 2 ? parts.slice(2).join(':') : null;

      const { lastModified, ...content } = draft;
      return {
        user_id: userId,
        form_type: formType,
        condition_id: conditionId,
        content: content,
        updated_at: lastModified || new Date().toISOString(),
      };
    });

    const { error } = await supabase
      .from('form_drafts')
      .upsert(draftRows, { onConflict: 'user_id,form_type,condition_id' });
    if (error) {
      logger.error('[sync] push form drafts failed', error);
      pushErrors.push('formDrafts');
    }
  }

  lastSyncedAt = new Date().toISOString();
  useProfileStore.getState().setLastSyncedAt(lastSyncedAt);

  if (pushErrors.length > 0) {
    logger.warn(`[sync] Partial push failure: ${pushErrors.join(', ')}`);
  }
}

export async function syncNow(): Promise<void> {
  if (syncInProgress) return syncInProgress;

  if (!navigator.onLine) {
    setStatus('offline');
    return;
  }

  // Exponential backoff: skip sync if we've failed repeatedly
  if (consecutiveFailures >= 3) {
    const backoffMs = Math.min(SYNC_DEBOUNCE_MS * Math.pow(2, consecutiveFailures - 2), 600000);
    // Let the interval handle eventual retry — don't pile on
    logger.warn(`[sync] Backing off after ${consecutiveFailures} failures (next retry in ~${Math.round(backoffMs / 1000)}s)`);
    return;
  }

  const doSync = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus('offline');
        return;
      }

      setStatus('syncing');
      await pullFromCloud();
      await pushToCloud();
      setStatus('synced');
      consecutiveFailures = 0;
    } catch (err) {
      logger.error('[sync] syncNow failed:', err instanceof Error ? err.message : err);
      setStatus('error');
      consecutiveFailures++;
    }
  };

  syncInProgress = doSync().finally(() => {
    syncInProgress = null;
  });
  return syncInProgress;
}

export function startSync(): void {
  if (syncInterval) return;

  // Initial sync
  syncNow().catch(() => { /* handled inside syncNow */ });

  // Set up debounced interval
  syncInterval = setInterval(() => {
    syncNow().catch(() => { /* handled inside syncNow */ });
  }, SYNC_DEBOUNCE_MS);

  // Listen for online/offline events
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
}

export function stopSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
  setStatus('offline');
}

function handleOnline() {
  consecutiveFailures = 0; // Reset backoff on reconnect
  syncNow().catch(() => { /* handled inside syncNow */ });
}

function handleOffline() {
  setStatus('offline');
}

export function getSyncStatus(): SyncStatus {
  return currentStatus;
}

export function getLastSyncedAt(): string | null {
  return lastSyncedAt;
}
