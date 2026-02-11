import { supabase } from '@/lib/supabase';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { stopSync } from '@/services/syncEngine';
import { jsPDF } from 'jspdf';

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
  }

  return doc.output('blob');
}

export async function deleteCloudData(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const userId = session.user.id;

  // Delete all user data from cloud tables (order matters for FK constraints)
  await supabase.from('entitlements').delete().eq('user_id', userId);
  await supabase.from('form_drafts').delete().eq('user_id', userId);
  await supabase.from('documents').delete().eq('user_id', userId);
  await supabase.from('evidence').delete().eq('user_id', userId);
  await supabase.from('health_logs').delete().eq('user_id', userId);
  await supabase.from('conditions').delete().eq('user_id', userId);

  // Keep profile and auth account intact
}

export async function deleteAccount(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const userId = session.user.id;

  // 1. Delete all data rows (order matters for FK constraints)
  await supabase.from('entitlements').delete().eq('user_id', userId);
  await supabase.from('form_drafts').delete().eq('user_id', userId);
  await supabase.from('documents').delete().eq('user_id', userId);
  await supabase.from('evidence').delete().eq('user_id', userId);
  await supabase.from('health_logs').delete().eq('user_id', userId);
  await supabase.from('conditions').delete().eq('user_id', userId);

  // 2. Delete files from Supabase Storage
  try {
    const { data: files } = await supabase.storage
      .from('user-files')
      .list(userId);
    if (files && files.length > 0) {
      const paths = files.map((f) => `${userId}/${f.name}`);
      await supabase.storage.from('user-files').remove(paths);
    }
  } catch {
    // Storage bucket may not exist yet
  }

  // 3. Destroy vault passcode hash
  await supabase
    .from('profiles')
    .update({ vault_passcode_hash: null })
    .eq('id', userId);

  // 4. Delete the profiles row
  await supabase.from('profiles').delete().eq('id', userId);

  // 5. Delete auth user via Edge Function, then sign out and clear local data
  try {
    await supabase.functions.invoke('delete-user', {
      body: { userId },
    });
  } catch {
    // Edge function may not be deployed yet; continue with sign-out
  }

  stopSync();
  await supabase.auth.signOut();
  clearLocalData();
}

export function clearLocalData(): void {
  // Wipe Zustand stores
  useAppStore.getState().resetAllData();
  useProfileStore.getState().resetProfile();

  // Clear localStorage keys directly
  localStorage.removeItem('vcs-app-data');
  localStorage.removeItem('vet-user-profile');
}
