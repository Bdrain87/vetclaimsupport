import { supabase } from '@/lib/supabase';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useAICacheStore } from '@/store/useAICacheStore';
import { stopSync } from '@/services/syncEngine';
import { ALL_LOCAL_STORAGE_KEYS } from '@/services/auth';
import { exportAllEvidence } from '@/utils/pdfExport';
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
  return blob as Blob;
}

export async function deleteCloudData(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const userId = session.user.id;

  // Delete all user data from cloud tables (order matters for FK constraints).
  // Each call is checked individually so partial failures are surfaced.
  const tables = [
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
    if (error) errors.push(`${table}: ${error.message}`);
  }
  if (errors.length > 0) {
    throw new Error('Some cloud data could not be deleted. Please try again.');
  }

  // Keep profile and auth account intact
}

export async function deleteAccount(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const userId = session.user.id;

  // 1. Delete all data rows (order matters for FK constraints).
  const tables = [
    'entitlements',
    'form_drafts',
    'documents',
    'evidence',
    'health_logs',
    'conditions',
  ] as const;

  const deleteErrors: string[] = [];
  for (const table of tables) {
    const { error: deleteError } = await supabase.from(table).delete().eq('user_id', userId);
    if (deleteError) {
      console.error(`[deleteAccount] failed to delete ${table}:`, deleteError.message);
      deleteErrors.push(`${table}: ${deleteError.message}`);
    }
  }
  if (deleteErrors.length > 0) {
    throw new Error(`Failed to delete account data (${deleteErrors.join('; ')}). Please try again.`);
  }

  // 2. Delete files from Supabase Storage (list may be paginated; loop until empty)
  try {
    let hasMore = true;
    while (hasMore) {
      const { data: files } = await supabase.storage
        .from('user-files')
        .list(userId, { limit: 100 });
      if (files && files.length > 0) {
        const paths = files.map((f) => `${userId}/${f.name}`);
        await supabase.storage.from('user-files').remove(paths);
      } else {
        hasMore = false;
      }
    }
  } catch {
    // Storage bucket may not exist yet -- non-fatal
  }

  // 3. Delete the profiles row (vault_passcode_hash goes with it)
  const { error: profileDeleteError } = await supabase.from('profiles').delete().eq('id', userId);
  if (profileDeleteError) {
    throw new Error(`Failed to delete profile: ${profileDeleteError.message}`);
  }

  // 4. Delete auth user via Edge Function
  try {
    const { error: fnError } = await supabase.functions.invoke('delete-user', {
      body: { userId },
    });
    if (fnError) {
      throw fnError;
    }
  } catch (err) {
    throw new Error(
      `Failed to delete auth user: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // 5. Stop sync, sign out, and wipe local data
  stopSync();
  await supabase.auth.signOut();
  clearLocalData();
}

export function clearLocalData(): void {
  // Wipe Zustand store state (so in-memory UI resets immediately)
  useAppStore.getState().resetAllData();
  useProfileStore.getState().resetProfile();
  useAICacheStore.getState().clearCache();

  // Clear ALL known localStorage keys so no user data lingers on disk
  for (const key of ALL_LOCAL_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}
