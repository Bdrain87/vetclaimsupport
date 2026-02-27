/**
 * Export packet utilities — generate comprehensive text reports for
 * VSO/attorney consultations and doctor appointment preparation.
 */

import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { getConditionById } from '@/data/vaConditions';
import { conditionRatingCriteria } from '@/data/ratingCriteria';
import { EMPLOYMENT_IMPACT_TYPES, FLARE_UP_DURATIONS } from '@/types/claims';
import type { UserCondition } from '@/store/useAppStore';

function formatDate(d: string | undefined | null): string {
  if (!d) return 'N/A';
  const date = new Date(d);
  return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function recentDays(dateStr: string, days: number): boolean {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return dateStr >= cutoff.toISOString().slice(0, 10);
}

// ── VSO / Attorney Export Packet ───────────────────────────────────────────

export function generateVSOPacket(): string {
  const store = useAppStore.getState();
  const profile = useProfileStore.getState();
  const conditions = store.userConditions || [];

  const lines: string[] = [];
  const sep = '─'.repeat(60);

  lines.push('═'.repeat(60));
  lines.push('     VETERAN CLAIM SUPPORT — VSO/ATTORNEY PACKET');
  lines.push('═'.repeat(60));
  lines.push(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
  lines.push('');

  // Veteran Profile
  lines.push(sep);
  lines.push('VETERAN INFORMATION');
  lines.push(sep);
  if (profile.firstName || profile.lastName) lines.push(`Name: ${profile.firstName} ${profile.lastName}`.trim());
  if (profile.branch) lines.push(`Branch: ${profile.branch}`);
  if (profile.mosCode) lines.push(`MOS/Rating: ${profile.mosCode} — ${profile.mosTitle || ''}`);
  if (profile.serviceDates?.start) lines.push(`Service Dates: ${formatDate(profile.serviceDates.start)} – ${formatDate(profile.serviceDates.end) || 'Present'}`);
  if (profile.separationDate) lines.push(`Separation Date: ${formatDate(profile.separationDate)}`);
  if (profile.intentToFileDate) lines.push(`Intent to File: ${formatDate(profile.intentToFileDate)}`);
  lines.push('');

  // Claimed Conditions
  lines.push(sep);
  lines.push('CLAIMED CONDITIONS');
  lines.push(sep);
  const pending = conditions.filter((c: UserCondition) => c.claimStatus !== 'approved');
  const approved = conditions.filter((c: UserCondition) => c.claimStatus === 'approved');

  for (const uc of pending) {
    const details = getConditionById(uc.conditionId);
    const name = details?.name || uc.conditionId;
    const dc = details?.diagnosticCode ? ` (DC ${details.diagnosticCode})` : '';
    lines.push(`  [PENDING] ${name}${dc}`);
    if (uc.claimType) lines.push(`           Type: ${uc.claimType}`);
  }
  for (const uc of approved) {
    const details = getConditionById(uc.conditionId);
    const name = details?.name || uc.conditionId;
    lines.push(`  [APPROVED ${uc.rating || 0}%] ${name}`);
  }
  lines.push('');

  // Evidence Summary
  lines.push(sep);
  lines.push('EVIDENCE SUMMARY');
  lines.push(sep);
  const symptoms90 = store.symptoms.filter((s) => recentDays(s.date, 90));
  const migraines90 = store.migraines.filter((m) => recentDays(m.date, 90));
  const sleep90 = store.sleepEntries.filter((s) => recentDays(s.date, 90));

  lines.push(`Symptom Logs (90 days): ${symptoms90.length}`);
  lines.push(`Migraine Logs (90 days): ${migraines90.length}`);
  lines.push(`Sleep Logs (90 days): ${sleep90.length}`);
  lines.push(`Medical Visits: ${store.medicalVisits.length}`);
  lines.push(`Medications (active): ${store.medications.filter((m) => m.stillTaking).length}`);
  lines.push(`Buddy Contacts: ${store.buddyContacts.length}`);

  const receivedBuddies = store.buddyContacts.filter((b) => b.statementStatus === 'Received' || b.statementStatus === 'Submitted');
  if (receivedBuddies.length > 0) {
    lines.push(`Buddy Statements Received: ${receivedBuddies.length}`);
  }
  lines.push('');

  // Employment Impact
  const employmentEntries = store.employmentImpactEntries || [];
  if (employmentEntries.length > 0) {
    lines.push(sep);
    lines.push('EMPLOYMENT IMPACT');
    lines.push(sep);
    const totalHours = employmentEntries.reduce((sum, e) => sum + e.hoursLost, 0);
    lines.push(`Total entries: ${employmentEntries.length}`);
    lines.push(`Total hours lost: ${totalHours}`);
    lines.push('');
    for (const entry of employmentEntries.slice(0, 10)) {
      lines.push(`  ${formatDate(entry.date)} — ${EMPLOYMENT_IMPACT_TYPES[entry.type]} (${entry.hoursLost}h)`);
      lines.push(`    ${entry.description}`);
    }
    if (employmentEntries.length > 10) {
      lines.push(`  ... and ${employmentEntries.length - 10} more entries`);
    }
    lines.push('');
  }

  // Flare-Up History
  const flareUps = (store.quickLogs || []).filter((q) => q.hadFlareUp);
  if (flareUps.length > 0) {
    lines.push(sep);
    lines.push('FLARE-UP HISTORY');
    lines.push(sep);
    lines.push(`Total flare-ups logged: ${flareUps.length}`);
    for (const f of flareUps.slice(0, 10)) {
      const duration = f.flareUpDuration ? FLARE_UP_DURATIONS[f.flareUpDuration] : '';
      lines.push(`  ${formatDate(f.date)} — Severity: ${f.flareUpSeverity || f.overallFeeling}/10${duration ? `, Duration: ${duration}` : ''}`);
      if (f.flareUpTriggers?.length) lines.push(`    Triggers: ${f.flareUpTriggers.join(', ')}`);
      if (f.flareUpActivitiesAffected) lines.push(`    Activities affected: ${f.flareUpActivitiesAffected}`);
    }
    lines.push('');
  }

  // Rating Criteria References
  lines.push(sep);
  lines.push('APPLICABLE RATING CRITERIA');
  lines.push(sep);
  for (const uc of pending) {
    const criteria = conditionRatingCriteria.find((c) => c.conditionId === uc.conditionId);
    if (criteria) {
      lines.push(`${criteria.conditionName} — ${criteria.cfrReference}`);
      for (const rl of criteria.ratingLevels) {
        lines.push(`  ${rl.percent}%: ${rl.criteria.slice(0, 120)}${rl.criteria.length > 120 ? '...' : ''}`);
      }
      lines.push('');
    }
  }

  lines.push(sep);
  lines.push('This packet was generated by Vet Claim Support for informational purposes.');
  lines.push('It does not constitute legal or medical advice.');
  lines.push(sep);

  return lines.join('\n');
}

// ── Doctor Preparation Packet ──────────────────────────────────────────────

export function generateDoctorPacket(conditionId?: string): string {
  const store = useAppStore.getState();
  const profile = useProfileStore.getState();

  const lines: string[] = [];
  const sep = '─'.repeat(60);

  lines.push('═'.repeat(60));
  lines.push('     PRE-APPOINTMENT SUMMARY');
  lines.push('═'.repeat(60));
  lines.push(`Prepared: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
  lines.push('');

  // Patient Info
  lines.push(sep);
  lines.push('PATIENT');
  lines.push(sep);
  if (profile.firstName || profile.lastName) lines.push(`Name: ${profile.firstName} ${profile.lastName}`.trim());
  lines.push(`Veteran — ${profile.branch || 'Branch not specified'}`);
  lines.push('');

  // Conditions Being Discussed
  const conditions = store.userConditions || [];
  const targetConditions = conditionId
    ? conditions.filter((c: UserCondition) => c.conditionId === conditionId)
    : conditions.filter((c: UserCondition) => c.claimStatus !== 'approved');

  lines.push(sep);
  lines.push('CONDITIONS');
  lines.push(sep);
  for (const uc of targetConditions) {
    const details = getConditionById(uc.conditionId);
    const name = details?.name || uc.conditionId;
    const dc = details?.diagnosticCode ? ` (DC ${details.diagnosticCode})` : '';
    lines.push(`  ${name}${dc}`);
  }
  lines.push('');

  // Current Symptoms (last 30 days)
  lines.push(sep);
  lines.push('RECENT SYMPTOMS (30 DAYS)');
  lines.push(sep);
  const recentSymptoms = store.symptoms.filter((s) => recentDays(s.date, 30));
  if (recentSymptoms.length === 0) {
    lines.push('  No symptom logs in the last 30 days.');
  } else {
    // Group by symptom name
    const grouped: Record<string, { count: number; avgSeverity: number; frequencies: string[] }> = {};
    for (const s of recentSymptoms) {
      const key = s.symptom || s.bodyArea || 'General';
      if (!grouped[key]) grouped[key] = { count: 0, avgSeverity: 0, frequencies: [] };
      grouped[key].count++;
      grouped[key].avgSeverity += s.severity || 0;
      if (s.frequency) grouped[key].frequencies.push(s.frequency);
    }
    for (const [symptom, data] of Object.entries(grouped)) {
      const avg = data.count > 0 ? (data.avgSeverity / data.count).toFixed(1) : '0';
      const freq = data.frequencies.length > 0 ? data.frequencies[data.frequencies.length - 1] : '';
      lines.push(`  ${symptom}: ${data.count} entries, avg severity ${avg}/10${freq ? `, ${freq}` : ''}`);
    }
  }
  lines.push('');

  // Migraine Summary
  const recentMigraines = store.migraines.filter((m) => recentDays(m.date, 30));
  if (recentMigraines.length > 0) {
    lines.push(sep);
    lines.push('MIGRAINES (30 DAYS)');
    lines.push(sep);
    const prostrating = recentMigraines.filter((m) => m.wasProstrating || m.severity === 'Prostrating' || m.severity === 'Severe');
    lines.push(`  Total: ${recentMigraines.length}`);
    lines.push(`  Prostrating: ${prostrating.length}`);
    lines.push('');
  }

  // Current Medications
  const activeMeds = store.medications.filter((m) => m.stillTaking);
  lines.push(sep);
  lines.push('CURRENT MEDICATIONS');
  lines.push(sep);
  if (activeMeds.length === 0) {
    lines.push('  No active medications recorded.');
  } else {
    for (const m of activeMeds) {
      lines.push(`  ${m.name}${m.prescribedFor ? ` — for ${m.prescribedFor}` : ''}`);
      if (m.sideEffects) lines.push(`    Side effects: ${m.sideEffects}`);
    }
  }
  lines.push('');

  // Functional Impact
  const impacts = recentSymptoms.filter((s) => s.dailyImpact).map((s) => s.dailyImpact);
  if (impacts.length > 0) {
    lines.push(sep);
    lines.push('FUNCTIONAL IMPACT (FROM SYMPTOM LOGS)');
    lines.push(sep);
    const unique = [...new Set(impacts)];
    for (const impact of unique.slice(0, 5)) {
      lines.push(`  - ${impact}`);
    }
    lines.push('');
  }

  // Questions for the Doctor
  lines.push(sep);
  lines.push('SUGGESTED DISCUSSION POINTS');
  lines.push(sep);
  lines.push('  [ ] Current diagnosis and severity assessment');
  lines.push('  [ ] Whether condition is "at least as likely as not" related to service');
  lines.push('  [ ] Functional limitations and impact on employment');
  lines.push('  [ ] Prognosis and expected progression');
  lines.push('  [ ] Any secondary conditions caused by primary disabilities');
  lines.push('  [ ] Whether a DBQ (Disability Benefits Questionnaire) can be completed');
  lines.push('');

  lines.push(sep);
  lines.push('Prepared by Vet Claim Support for appointment preparation.');
  lines.push('This is not medical advice.');
  lines.push(sep);

  return lines.join('\n');
}
