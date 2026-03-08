/**
 * Veteran Context Builder
 *
 * Centralized system for assembling veteran data from both stores
 * into a structured format suitable for AI prompt injection.
 *
 * Uses getState() for synchronous reads — call at generation time,
 * not in render.
 */

import useAppStore from '@/store/useAppStore';
import { useProfileStore, BRANCH_LABELS, type Branch } from '@/store/useProfileStore';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VeteranContext {
  profile: {
    name: string;
    branch: string;
    mos: string;
    serviceDates: string;
    separationDate?: string;
    claimType?: string;
    claimGoal?: string;
  };
  conditions: Array<{
    name: string;
    diagnosticCode?: string;
    rating?: number;
    claimStatus: string;
    connectionType?: string;
    isPrimary: boolean;
    secondaryTo?: string;
  }>;
  symptomsByCondition: Array<{
    conditionName: string;
    totalEntries: number;
    avgSeverity: number;
    topSymptoms: string[];
    functionalImpacts: string[];
  }>;
  medications: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    prescribedFor: string;
    effectiveness?: string;
    sideEffects?: string;
    stillTaking: boolean;
  }>;
  medicalVisits: {
    total: number;
    recent: Array<{ date: string; type: string; reason: string; diagnosis: string }>;
  };
  service: {
    periods: Array<{ branch: string; mos: string; start: string; end: string }>;
    deployments: Array<{ operation: string; location: string; dates: string; combat: boolean }>;
    combatHistory: Array<{ location: string; dates: string; directCombat: boolean }>;
    majorEvents: Array<{ type: string; title: string; date: string; location: string }>;
  };
  exposures: Array<{ type: string; location: string; duration: string }>;
  sleep: { avgHours: number; avgQuality: string; usesCPAP: boolean; nightmareRate: string } | null;
  migraines: { avgPerMonth: number; prostratingPercent: number; commonTriggers: string[]; workDaysMissed: number } | null;
  ptsd: { avgSeverity: number; topSymptoms: string[]; occupationalImpacts: string[] } | null;
  flareUps: { totalCount: number; avgSeverity: number; commonTriggers: string[] } | null;
  evidence: {
    buddyStatementsReceived: number;
    documentCount: number;
    hasSTRs: boolean;
    hasDD214: boolean;
  };
  dataCounts: Record<string, number>;
}

export interface BuildContextOptions {
  conditionId?: string;
  maskPII?: boolean;
  recentLimit?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function branchLabel(branch: string): string {
  return BRANCH_LABELS[branch as Branch] || branch || '';
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function topN<T>(arr: T[], key: (item: T) => string, n: number): string[] {
  const counts = new Map<string, number>();
  for (const item of arr) {
    const k = key(item);
    if (k) counts.set(k, (counts.get(k) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count]) => `${name} (${count}x)`);
}

function unique(arr: (string | undefined | null)[]): string[] {
  return [...new Set(arr.filter((s): s is string => !!s && s.trim().length > 0))];
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Main Builder
// ---------------------------------------------------------------------------

export function buildVeteranContext(options: BuildContextOptions = {}): VeteranContext {
  const { conditionId, maskPII = true, recentLimit = 10 } = options;

  const app = useAppStore.getState();
  const prof = useProfileStore.getState();

  // Profile
  const name = maskPII ? '[VETERAN]' : `${prof.firstName} ${prof.lastName}`.trim() || '[VETERAN]';
  const branches = prof.servicePeriods.length > 0
    ? unique(prof.servicePeriods.map(p => branchLabel(p.branch)))
    : (prof.branch ? [branchLabel(prof.branch)] : []);
  const mosDisplay = prof.servicePeriods.length > 0
    ? prof.servicePeriods.filter(p => p.mos).map(p => `${p.mos}${p.jobTitle ? ` — ${p.jobTitle}` : ''}`).join(', ')
    : (prof.mosCode ? `${prof.mosCode}${prof.mosTitle ? ` — ${prof.mosTitle}` : ''}` : '');
  const serviceDates = prof.serviceDates
    ? `${prof.serviceDates.start} to ${prof.serviceDates.end || 'present'}`
    : (prof.servicePeriods.length > 0
      ? prof.servicePeriods.map(p => `${p.startDate} to ${p.endDate || 'present'}`).join('; ')
      : '');

  // Conditions
  const userConditions = app.userConditions || [];
  const conditionFilter = conditionId
    ? userConditions.filter(c => c.id === conditionId || c.conditionId === conditionId)
    : userConditions;

  const conditions = conditionFilter.map(c => ({
    name: c.displayName || c.conditionId,
    diagnosticCode: c.vaDiagnosticCode,
    rating: c.rating,
    claimStatus: c.claimStatus,
    connectionType: c.connectionType,
    isPrimary: c.isPrimary,
    secondaryTo: c.secondaryTo,
  }));

  // Get condition names for filtering symptoms/meds
  const conditionNames = conditionFilter.map(c => (c.displayName || c.conditionId).toLowerCase());

  // Symptoms — group by condition
  const allSymptoms = app.symptoms || [];
  const symptomsInScope = conditionId
    ? allSymptoms.filter(s =>
        s.conditionTags?.some(tag => conditionNames.some(cn => tag.toLowerCase().includes(cn))) ||
        conditionNames.some(cn => s.symptom?.toLowerCase().includes(cn) || s.bodyArea?.toLowerCase().includes(cn))
      )
    : allSymptoms;

  // Group symptoms by conditionTag (or "ungrouped")
  const symptomGroups = new Map<string, typeof allSymptoms>();
  for (const s of symptomsInScope) {
    const tags = s.conditionTags?.length ? s.conditionTags : ['ungrouped'];
    for (const tag of tags) {
      const group = symptomGroups.get(tag) || [];
      group.push(s);
      symptomGroups.set(tag, group);
    }
  }

  const symptomsByCondition = [...symptomGroups.entries()].map(([condName, entries]) => ({
    conditionName: condName,
    totalEntries: entries.length,
    avgSeverity: avg(entries.map(s => s.severity || 0).filter(v => v > 0)),
    topSymptoms: topN(entries, s => s.symptom, 5),
    functionalImpacts: unique(entries.map(s => s.dailyImpact)).slice(0, 5),
  }));

  // Medications
  const allMeds = app.medications || [];
  const medsInScope = conditionId
    ? allMeds.filter(m =>
        conditionNames.some(cn =>
          m.prescribedFor?.toLowerCase().includes(cn) ||
          m.conditionTags?.some(tag => tag.toLowerCase().includes(cn)) ||
          m.name?.toLowerCase().includes(cn)
        )
      )
    : allMeds;

  const medications = medsInScope.map(m => ({
    name: m.name,
    dosage: m.dosage,
    frequency: m.frequency,
    prescribedFor: m.prescribedFor || '',
    effectiveness: m.effectiveness,
    sideEffects: m.sideEffects,
    stillTaking: m.stillTaking,
  }));

  // Medical visits
  const allVisits = app.medicalVisits || [];
  const sortedVisits = [...allVisits].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const medicalVisits = {
    total: allVisits.length,
    recent: sortedVisits.slice(0, recentLimit).map(v => ({
      date: v.date,
      type: v.visitType,
      reason: v.reason,
      diagnosis: v.diagnosis,
    })),
  };

  // Service
  const servicePeriods = prof.servicePeriods.map(p => ({
    branch: branchLabel(p.branch),
    mos: `${p.mos}${p.jobTitle ? ` — ${p.jobTitle}` : ''}`,
    start: p.startDate,
    end: p.endDate || 'present',
  }));

  const deployments = (app.deployments || []).map(d => ({
    operation: d.operationName || '',
    location: d.location || '',
    dates: `${d.startDate} to ${d.endDate || 'present'}`,
    combat: d.combatDeployment,
  }));

  const combatHistory = (app.combatHistory || []).map(c => ({
    location: c.location,
    dates: `${c.startDate} to ${c.endDate || ''}`,
    directCombat: c.directCombat,
  }));

  const majorEvents = (app.majorEvents || []).map(e => ({
    type: e.type,
    title: e.title,
    date: e.date,
    location: e.location,
  }));

  // Exposures
  const exposures = (app.exposures || []).map(e => ({
    type: e.type,
    location: e.location,
    duration: e.duration,
  }));

  // Sleep (last 90 days)
  const cutoff90 = daysAgo(90);
  const recentSleep = (app.sleepEntries || []).filter(s => s.date >= cutoff90);
  const sleep = recentSleep.length > 0 ? {
    avgHours: avg(recentSleep.map(s => s.hoursSlept || 0)),
    avgQuality: (() => {
      const qualities = recentSleep.map(s => s.quality).filter(Boolean);
      if (qualities.length === 0) return 'Unknown';
      const counts = new Map<string, number>();
      for (const q of qualities) counts.set(q!, (counts.get(q!) || 0) + 1);
      return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    })(),
    usesCPAP: recentSleep.some(s => s.usesCPAP),
    nightmareRate: (() => {
      const withNightmares = recentSleep.filter(s => s.nightmares).length;
      const pct = Math.round((withNightmares / recentSleep.length) * 100);
      return `${pct}% of nights`;
    })(),
  } : null;

  // Migraines (last 90 days)
  const recentMigraines = (app.migraines || []).filter(m => m.date >= cutoff90);
  const migraines = recentMigraines.length > 0 ? {
    avgPerMonth: Math.round((recentMigraines.length / 3) * 10) / 10,
    prostratingPercent: Math.round(
      (recentMigraines.filter(m => m.wasProstrating).length / recentMigraines.length) * 100
    ),
    commonTriggers: (() => {
      const all = recentMigraines.flatMap(m => m.triggers || []);
      return topN(all.map(t => ({ t })), i => i.t, 3).map(s => s.replace(/ \(\d+x\)$/, ''));
    })(),
    workDaysMissed: recentMigraines.filter(m => m.couldNotWork).length,
  } : null;

  // PTSD (last 90 days)
  const recentPTSD = (app.ptsdSymptoms || []).filter(p => p.date >= cutoff90);
  const ptsd = recentPTSD.length > 0 ? {
    avgSeverity: avg(recentPTSD.map(p => p.overallSeverity || 0)),
    topSymptoms: (() => {
      const allSymps = recentPTSD.flatMap(p => p.selectedSymptoms || []);
      return topN(allSymps.map(s => ({ s })), i => i.s, 5).map(s => s.replace(/ \(\d+x\)$/, ''));
    })(),
    occupationalImpacts: unique(recentPTSD.map(p => p.occupationalImpairment)),
  } : null;

  // Flare-ups (from quickLogs)
  const quickLogs = app.quickLogs || [];
  const flareUpLogs = quickLogs.filter(q => q.hadFlareUp);
  const flareUps = flareUpLogs.length > 0 ? {
    totalCount: flareUpLogs.length,
    avgSeverity: avg(flareUpLogs.map(q => q.flareUpSeverity || 0).filter(v => v > 0)),
    commonTriggers: unique(flareUpLogs.flatMap(q => q.flareUpTriggers || [])).slice(0, 5),
  } : null;

  // Evidence
  const buddyContacts = app.buddyContacts || [];
  const documents = app.documents || [];
  const uploadedDocs = app.uploadedDocuments || [];
  const evidence = {
    buddyStatementsReceived: buddyContacts.filter(b => b.statementStatus === 'Received').length,
    documentCount: uploadedDocs.length,
    hasSTRs: uploadedDocs.some(d => d.documentType === 'str') || documents.some(d => d.name?.toLowerCase().includes('service treatment') && d.status === 'Obtained'),
    hasDD214: uploadedDocs.some(d => d.documentType === 'dd214') || documents.some(d => d.name?.toLowerCase().includes('dd-214') && d.status === 'Obtained'),
  };

  // Data counts
  const dataCounts: Record<string, number> = {
    conditions: userConditions.length,
    symptoms: allSymptoms.length,
    medications: allMeds.length,
    medicalVisits: allVisits.length,
    deployments: (app.deployments || []).length,
    exposures: (app.exposures || []).length,
    combatHistory: (app.combatHistory || []).length,
    majorEvents: (app.majorEvents || []).length,
    sleepEntries: (app.sleepEntries || []).length,
    migraines: (app.migraines || []).length,
    ptsdSymptoms: (app.ptsdSymptoms || []).length,
    quickLogs: quickLogs.length,
    buddyContacts: buddyContacts.length,
    documents: uploadedDocs.length,
  };

  return {
    profile: {
      name,
      branch: branches.join(', '),
      mos: mosDisplay,
      serviceDates,
      separationDate: prof.separationDate,
      claimType: prof.claimType,
      claimGoal: prof.claimGoal,
    },
    conditions,
    symptomsByCondition,
    medications,
    medicalVisits,
    service: { periods: servicePeriods, deployments, combatHistory, majorEvents },
    exposures,
    sleep,
    migraines,
    ptsd,
    flareUps,
    evidence,
    dataCounts,
  };
}

/**
 * Shortcut: build context scoped to a specific condition (by ID or name).
 */
export function buildConditionContext(conditionIdOrName: string): VeteranContext {
  // Empty string → full context (no condition filter)
  if (!conditionIdOrName) {
    return buildVeteranContext({ maskPII: true });
  }

  // Try to find by ID first, then by name
  const app = useAppStore.getState();
  const conditions = app.userConditions || [];
  const byId = conditions.find(c => c.id === conditionIdOrName || c.conditionId === conditionIdOrName);
  if (byId) {
    return buildVeteranContext({ conditionId: byId.id, maskPII: true });
  }
  // Name match
  const lower = conditionIdOrName.toLowerCase();
  const byName = conditions.find(c =>
    (c.displayName || c.conditionId).toLowerCase().includes(lower)
  );
  if (byName) {
    return buildVeteranContext({ conditionId: byName.id, maskPII: true });
  }
  // Fallback: return full context
  return buildVeteranContext({ maskPII: true });
}
