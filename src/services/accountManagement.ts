import { supabase } from '@/lib/supabase';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useAICacheStore } from '@/store/useAICacheStore';
import { stopSync } from '@/services/syncEngine';
import { ALL_LOCAL_STORAGE_KEYS } from '@/services/auth';

export async function exportAllData(format: 'json' | 'pdf'): Promise<Blob> {
  const appState = useAppStore.getState();
  const profileState = useProfileStore.getState();

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

  if (format === 'json') {
    return new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
  }

  // PDF export
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;
  const lineHeight = 7;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;

  const addLine = (text: string, fontSize = 10, bold = false) => {
    if (y > 270) {
      doc.addPage();
      y = margin;
    }
    doc.setFontSize(fontSize);
    if (bold) doc.setFont('helvetica', 'bold');
    else doc.setFont('helvetica', 'normal');

    const lines = doc.splitTextToSize(text, pageWidth);
    doc.text(lines, margin, y);
    y += lines.length * lineHeight;
  };

  addLine('Vet Claim Support - Data Export', 16, true);
  addLine(`Exported: ${new Date().toLocaleDateString()}`, 10);
  y += lineHeight;

  addLine('Profile', 14, true);
  addLine(`Name: ${profileState.firstName} ${profileState.lastName}`);
  addLine(`Branch: ${profileState.branch || 'Not set'}`);
  addLine(`MOS: ${profileState.mosCode || 'Not set'} ${profileState.mosTitle || ''}`);
  y += lineHeight;

  if (appState.claimConditions.length > 0) {
    addLine('Conditions', 14, true);
    appState.claimConditions.forEach((c) => {
      addLine(`- ${c.name} (${c.status || 'active'})`);
    });
    y += lineHeight;
  }

  if (appState.symptoms.length > 0) {
    addLine('Symptom Logs', 14, true);
    appState.symptoms.forEach((s) => {
      addLine(`- ${s.date || 'No date'}: ${s.name || s.condition || 'Entry'}`);
    });
    y += lineHeight;
  }

  if (appState.medications.length > 0) {
    addLine('Medications', 14, true);
    appState.medications.forEach((m) => {
      addLine(`- ${m.name}: ${m.dosage || ''} ${m.frequency || ''}`);
    });
    y += lineHeight;
  }

  if (appState.medicalVisits.length > 0) {
    addLine('Medical Visits', 14, true);
    appState.medicalVisits.forEach((v) => {
      addLine(`- ${v.date || 'No date'}: ${v.provider || 'Unknown provider'}`);
    });
    y += lineHeight;
  }

  if (appState.sleepEntries.length > 0) {
    addLine('Sleep Entries', 14, true);
    appState.sleepEntries.forEach((s) => {
      addLine(`- ${s.date || 'No date'}: ${s.quality || 'No quality'} (${s.hours ?? '?'}h)`);
    });
    y += lineHeight;
  }

  if (appState.migraines.length > 0) {
    addLine('Migraines', 14, true);
    appState.migraines.forEach((m) => {
      addLine(`- ${m.date || 'No date'}: severity ${m.severity ?? '?'}/10`);
    });
    y += lineHeight;
  }

  if (appState.exposures.length > 0) {
    addLine('Exposures', 14, true);
    appState.exposures.forEach((e) => {
      addLine(`- ${e.type || e.name || 'Exposure'}: ${e.location || ''} ${e.duration || ''}`);
    });
    y += lineHeight;
  }

  if (appState.serviceHistory.length > 0) {
    addLine('Service History', 14, true);
    appState.serviceHistory.forEach((s) => {
      addLine(`- ${s.branch || 'Unknown branch'}: ${s.startDate || '?'} - ${s.endDate || '?'}`);
    });
    y += lineHeight;
  }

  if (appState.buddyContacts.length > 0) {
    addLine('Buddy Contacts', 14, true);
    appState.buddyContacts.forEach((b) => {
      addLine(`- ${b.name || 'Unknown'}: ${b.relationship || ''}`);
    });
    y += lineHeight;
  }

  if (appState.documents.length > 0) {
    addLine('Documents', 14, true);
    appState.documents.forEach((d) => {
      addLine(`- ${d.name || 'Document'}: ${d.status || 'Unknown status'}`);
    });
    y += lineHeight;
  }

  return doc.output('blob');
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

  for (const table of tables) {
    const { error: deleteError } = await supabase.from(table).delete().eq('user_id', userId);
    if (deleteError) console.error(`[deleteAccount] failed to delete ${table}:`, deleteError.message);
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
  if (profileDeleteError) console.error('[deleteAccount] failed to delete profile:', profileDeleteError.message);

  // 4. Delete auth user via Edge Function
  try {
    await supabase.functions.invoke('delete-user', {
      body: { userId },
    });
  } catch {
    // Edge function may not be deployed yet; continue with sign-out
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
