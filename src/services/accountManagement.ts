import { supabase } from '@/lib/supabase';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useAICacheStore } from '@/store/useAICacheStore';
import { useFeatureFlagStore } from '@/store/useFeatureFlagStore';
import { stopSync } from '@/services/syncEngine';
import { ALL_LOCAL_STORAGE_KEYS } from '@/services/auth';
import { clearDatabase } from '@/lib/indexedDB';
import { clearSessionPassword } from '@/lib/encryptedStorage';
import { exportAllEvidence } from '@/utils/pdfExport';
import { logAuditEvent } from '@/services/auditLog';
import type { ClaimsData } from '@/types/claims';

export async function exportAllData(format: 'json' | 'pdf'): Promise<Blob> {
  const appState = useAppStore.getState();
  const profileState = useProfileStore.getState();

  if (format === 'json') {
    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: {
        firstName: profileState.firstName,
        lastName: profileState.lastName,
        branch: profileState.branch,
        mosCode: profileState.mosCode,
        mosTitle: profileState.mosTitle,
        serviceDates: profileState.serviceDates,
        claimType: profileState.claimType,
        intentToFileFiled: profileState.intentToFileFiled,
        intentToFileDate: profileState.intentToFileDate,
      },
      conditions: appState.claimConditions,
      symptoms: appState.symptoms,
      sleepEntries: appState.sleepEntries,
      migraines: appState.migraines,
      medications: appState.medications,
      medicalVisits: appState.medicalVisits,
      exposures: appState.exposures,
      serviceHistory: appState.serviceHistory,
      buddyContacts: appState.buddyContacts,
      documents: appState.documents,
      userConditions: appState.userConditions,
    };

    return new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
  }

  // PDF export — delegate to the comprehensive exportAllEvidence generator
  const claimsData: ClaimsData = {
    medicalVisits: appState.medicalVisits,
    exposures: appState.exposures,
    symptoms: appState.symptoms,
    medications: appState.medications,
    serviceHistory: appState.serviceHistory,
    combatHistory: appState.combatHistory,
    majorEvents: appState.majorEvents,
    deployments: appState.deployments,
    buddyContacts: appState.buddyContacts,
    documents: appState.documents,
    migraines: appState.migraines,
    sleepEntries: appState.sleepEntries,
    ptsdSymptoms: appState.ptsdSymptoms,
    separationDate: profileState.separationDate ?? null,
    uploadedDocuments: appState.uploadedDocuments,
    claimConditions: appState.claimConditions,
    quickLogs: appState.quickLogs,
    deadlines: appState.deadlines,
    documentScanDisclaimerShown: appState.documentScanDisclaimerShown,
    milestonesAchieved: appState.milestonesAchieved,
    approvedConditions: appState.approvedConditions,
    journeyProgress: appState.journeyProgress,
  };

  const blob = await exportAllEvidence(claimsData, { returnBlob: true });
  await logAuditEvent('data_export', `format=${format}`);
  return blob as Blob;
}

export async function deleteCloudData(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const userId = session.user.id;

  // Delete all user data from cloud tables (order matters for FK constraints).
  // Each call is checked individually so partial failures are surfaced.
  const tables = [
    'subscriptions',
    'user_entitlements',
    'entitlements',
    'form_drafts',
    'documents',
    'evidence',
    'health_logs',
    'conditions',
  ] as const;

  const errors: string[] = [];
  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq('user_id', userId);
    if (error) errors.push(table);
  }
  if (errors.length > 0) {
    throw new Error('Some cloud data could not be deleted. Please try again.');
  }

  const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
  if (profileError) {
    throw new Error(`Failed to delete profile: ${profileError.message}`);
  }
}

export async function deleteAccount(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const userId = session.user.id;

  // 1. Best-effort: delete storage files while we still have a valid session.
  //    The Edge Function handles all table/profile/auth deletion with the
  //    service-role key, but storage cleanup is easier to do here.
  try {
    const MAX_STORAGE_PAGES = 50;
    let hasMore = true;
    let page = 0;
    while (hasMore && page < MAX_STORAGE_PAGES) {
      const { data: files, error: listError } = await supabase.storage
        .from('user-files')
        .list(userId, { limit: 100 });
      if (listError) {
        console.error('[deleteAccount] storage list failed:', listError.message);
        break;
      }
      if (files && files.length > 0) {
        const paths = files.map((f) => `${userId}/${f.name}`);
        const { error: removeError } = await supabase.storage.from('user-files').remove(paths);
        if (removeError) {
          console.error('[deleteAccount] storage remove failed');
          break;
        }
      } else {
        hasMore = false;
      }
      page++;
    }
  } catch {
    // Storage bucket may not exist yet -- non-fatal
  }

  // 2. Delete account via Edge Function (handles all cloud table deletions,
  //    Stripe cancellation, profile removal, and auth user deletion using
  //    the service-role key so RLS policies cannot block it).
  try {
    const { error: fnError } = await supabase.functions.invoke('delete-user', {
      body: { userId },
    });
    if (fnError) {
      throw fnError;
    }
  } catch (err) {
    throw new Error(
      `Failed to delete account: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // 3. Stop sync, sign out, and wipe local data
  stopSync();
  await supabase.auth.signOut();
  await clearLocalData();
}

export async function clearLocalData(): Promise<void> {
  // Wipe Zustand store state (so in-memory UI resets immediately)
  useAppStore.getState().resetAllData();
  useProfileStore.getState().resetProfile();
  useAICacheStore.getState().clearCache();
  useFeatureFlagStore.getState().resetFlags();

  // Clear ALL known localStorage keys so no user data lingers on disk
  for (const key of ALL_LOCAL_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }

  // Clear sessionStorage (chunk reload flags, post-login redirects, etc.)
  sessionStorage.clear();

  // Clear the in-memory encryption key so it doesn't linger after sign-out
  clearSessionPassword();

  // Delete IndexedDB database (evidence documents, large files)
  try {
    await clearDatabase();
  } catch (error) {
    console.error('[clearLocalData] IndexedDB clear failed:', error);
  }
}
