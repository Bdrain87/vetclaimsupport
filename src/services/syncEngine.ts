import { supabase } from '@/lib/supabase';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

let syncInterval: ReturnType<typeof setInterval> | null = null;
let currentStatus: SyncStatus = 'offline';
let lastSyncedAt: string | null = null;
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

export async function pullFromCloud(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const userId = session.user.id;

  // Pull profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

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
      profileStore.setEntitlement(profile.entitlement as 'preview' | 'lifetime');
    }
  }

  // Pull conditions
  const { data: conditions } = await supabase
    .from('conditions')
    .select('*')
    .eq('user_id', userId);

  if (conditions && conditions.length > 0) {
    const appStore = useAppStore.getState();
    conditions.forEach((condition) => {
      const existing = appStore.claimConditions.find((c) => c.id === condition.id);
      if (!existing) {
        appStore.addClaimCondition({
          id: condition.id,
          name: condition.name,
          diagnosticCode: condition.diagnostic_code || '',
          category: condition.category || '',
          status: condition.status || 'active',
          claimedRating: condition.claimed_rating,
          isSecondary: condition.is_secondary || false,
        });
      }
    });
  }

  // Pull health logs
  const { data: healthLogs } = await supabase
    .from('health_logs')
    .select('*')
    .eq('user_id', userId);

  if (healthLogs && healthLogs.length > 0) {
    const appStore = useAppStore.getState();
    healthLogs.forEach((log) => {
      const logData = log.data as Record<string, unknown>;
      switch (log.log_type) {
        case 'symptom': {
          const existing = appStore.symptoms.find((s) => s.id === log.id);
          if (!existing && logData) {
            appStore.addSymptom({
              id: log.id,
              ...(logData as Record<string, string | number>),
            } as Parameters<typeof appStore.addSymptom>[0]);
          }
          break;
        }
        case 'sleep': {
          const existing = appStore.sleepEntries.find((s) => s.id === log.id);
          if (!existing && logData) {
            appStore.addSleepEntry({
              id: log.id,
              ...(logData as Record<string, string | number>),
            } as Parameters<typeof appStore.addSleepEntry>[0]);
          }
          break;
        }
        case 'migraine': {
          const existing = appStore.migraines.find((m) => m.id === log.id);
          if (!existing && logData) {
            appStore.addMigraine({
              id: log.id,
              ...(logData as Record<string, string | number>),
            } as Parameters<typeof appStore.addMigraine>[0]);
          }
          break;
        }
      }
    });
  }

  lastSyncedAt = new Date().toISOString();
  useProfileStore.getState().setLastSyncedAt(lastSyncedAt);
}

export async function pushToCloud(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const userId = session.user.id;
  const profileState = useProfileStore.getState();
  const appState = useAppStore.getState();

  // Push profile
  await supabase.from('profiles').upsert({
    id: userId,
    email: session.user.email,
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

  // Push conditions
  if (appState.claimConditions.length > 0) {
    const conditionRows = appState.claimConditions.map((c) => ({
      id: c.id,
      user_id: userId,
      name: c.name,
      diagnostic_code: c.diagnosticCode || null,
      category: c.category || null,
      status: c.status || 'active',
      claimed_rating: c.claimedRating ?? null,
      is_secondary: c.isSecondary || false,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from('conditions').upsert(conditionRows);
  }

  // Push symptoms as health logs
  if (appState.symptoms.length > 0) {
    const symptomRows = appState.symptoms.map((s) => ({
      id: s.id,
      user_id: userId,
      log_type: 'symptom' as const,
      data: s,
      logged_at: s.date || new Date().toISOString(),
    }));
    await supabase.from('health_logs').upsert(symptomRows);
  }

  // Push sleep entries as health logs
  if (appState.sleepEntries.length > 0) {
    const sleepRows = appState.sleepEntries.map((s) => ({
      id: s.id,
      user_id: userId,
      log_type: 'sleep' as const,
      data: s,
      logged_at: s.date || new Date().toISOString(),
    }));
    await supabase.from('health_logs').upsert(sleepRows);
  }

  // Push migraines as health logs
  if (appState.migraines.length > 0) {
    const migraineRows = appState.migraines.map((m) => ({
      id: m.id,
      user_id: userId,
      log_type: 'migraine' as const,
      data: m,
      logged_at: m.date || new Date().toISOString(),
    }));
    await supabase.from('health_logs').upsert(migraineRows);
  }

  lastSyncedAt = new Date().toISOString();
  useProfileStore.getState().setLastSyncedAt(lastSyncedAt);
}

export async function syncNow(): Promise<void> {
  if (!navigator.onLine) {
    setStatus('offline');
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    setStatus('offline');
    return;
  }

  try {
    setStatus('syncing');
    await pullFromCloud();
    await pushToCloud();
    setStatus('synced');
  } catch (err) {
    console.error('Sync failed:', err);
    setStatus('error');
  }
}

export function startSync(): void {
  if (syncInterval) return;

  // Initial sync
  syncNow();

  // Set up debounced interval
  syncInterval = setInterval(() => {
    syncNow();
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
  syncNow();
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
