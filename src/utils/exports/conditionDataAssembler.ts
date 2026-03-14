/**
 * Condition Data Assembler
 *
 * Takes a UserCondition and pulls ALL related data from every store
 * into a single ConditionDataBundle. This is the critical missing piece
 * that enables condition-centric exports instead of data-type-fragmented ones.
 *
 * Linking logic uses multiple paths: conditionTags, relatedCondition,
 * linkedConditions, ClaimCondition explicit links, and bodyPart fallback.
 */
import useAppStore, { type UserCondition } from '@/store/useAppStore';
import { useProfileStore, type Branch } from '@/store/useProfileStore';
import { getConditionById } from '@/data/conditions';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import { getJobCodeLabel } from '@/utils/veteranProfile';
import { resolveDBQ, resolveRatingCriteria, resolveLegacyRatingCriteria } from '@/utils/dbqLookup';
import type { VACondition } from '@/data/conditions/types';
import type { DBQReference } from '@/data/vaResources/dbqReference';
import type { RatingCriteria } from '@/data/vaResources/ratingCriteria';
import type { ConditionRatingCriteria } from '@/data/ratingCriteria';
import type {
  MedicalVisit, SymptomEntry, Medication, Exposure, BuddyContact,
  MigraineEntry, SleepEntry, PTSDSymptomEntry, QuickLogEntry,
  EmploymentImpactEntry, MajorEvent, CombatEntry, DeploymentEntry,
  ServiceEntry, ClaimCondition,
} from '@/types/claims';
import type { EvidenceDocument } from '@/types/documents';

// ── Condition Category ──────────────────────────────────────────

export type ConditionExportCategory =
  | 'mental_health'
  | 'musculoskeletal'
  | 'sleep'
  | 'migraine'
  | 'general';

// ── Coverage Stats ──────────────────────────────────────────────

export interface LogCoverage {
  last30Days: number;
  last90Days: number;
  last180Days: number;
}

// ── Symptom Frequency Stats ─────────────────────────────────────

export interface SymptomFrequencyStat {
  symptomName: string;
  count: number;
  avgSeverity: number;
  mostRecentDate: string;
}

// ── Severity Trend ──────────────────────────────────────────────

export type SeverityTrend = 'improving' | 'stable' | 'worsening' | 'insufficient_data';

// ── Veteran Info ────────────────────────────────────────────────

export interface VeteranInfo {
  firstName: string;
  lastName: string;
  branch: string;
  branchLabel: string;
  specialtyLabel: string; // MOS, AFSC, Rate, etc.
  specialtyCode: string;
  specialtyTitle: string;
  serviceDates?: { start: string; end: string };
  separationDate?: string;
  claimType?: string;
  claimGoal?: string;
}

// ── The Bundle ──────────────────────────────────────────────────

export interface ConditionDataBundle {
  // Core condition info
  userCondition: UserCondition;
  displayName: string;
  vaCondition: VACondition | undefined;
  dbqReference: DBQReference | undefined;
  ratingCriteria: RatingCriteria | undefined;
  legacyRatingCriteria: ConditionRatingCriteria | undefined;

  // Linked data
  symptoms: SymptomEntry[];
  medications: Medication[];
  medicalVisits: MedicalVisit[];
  migraines: MigraineEntry[];
  sleepEntries: SleepEntry[];
  ptsdSymptoms: PTSDSymptomEntry[];
  exposures: Exposure[];
  majorEvents: MajorEvent[];
  combatHistory: CombatEntry[];
  deployments: DeploymentEntry[];
  serviceHistory: ServiceEntry[];
  buddyContacts: BuddyContact[];
  employmentImpact: EmploymentImpactEntry[];
  quickLogs: QuickLogEntry[];
  evidenceDocuments: EvidenceDocument[];
  claimCondition: ClaimCondition | undefined;

  // Computed
  symptomFrequencyStats: SymptomFrequencyStat[];
  totalEmploymentHoursLost: number;
  severityTrend: SeverityTrend;
  logCoverage: LogCoverage;
  conditionCategory: ConditionExportCategory;

  // Veteran info
  veteran: VeteranInfo;
}

// ── Helpers ─────────────────────────────────────────────────────

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function isWithinDays(dateStr: string, days: number): boolean {
  const d = new Date(dateStr);
  return !isNaN(d.getTime()) && d >= daysAgo(days);
}

/**
 * Check if an entry is linked to a condition via multiple paths.
 */
function isLinkedToCondition(
  entry: {
    conditionTags?: string[];
    relatedCondition?: string;
    condition?: string;
    linkedConditions?: string[];
  },
  conditionId: string,
  displayName: string,
  bodyPart?: string,
  claimCondition?: ClaimCondition,
  entryId?: string,
): boolean {
  const nameLower = displayName.toLowerCase();
  const idLower = conditionId.toLowerCase();

  // Path 1: conditionTags array
  if (entry.conditionTags?.some(tag =>
    tag.toLowerCase() === idLower ||
    tag.toLowerCase() === nameLower ||
    tag.toLowerCase().includes(nameLower) ||
    nameLower.includes(tag.toLowerCase())
  )) return true;

  // Path 2: relatedCondition field
  if (entry.relatedCondition) {
    const rel = entry.relatedCondition.toLowerCase();
    if (rel === idLower || rel === nameLower || rel.includes(nameLower) || nameLower.includes(rel)) return true;
  }

  // Path 3: condition field (QuickLogEntry, EmploymentImpactEntry)
  if (entry.condition) {
    const cond = entry.condition.toLowerCase();
    if (cond === idLower || cond === nameLower || cond.includes(nameLower) || nameLower.includes(cond)) return true;
  }

  // Path 4: linkedConditions array
  if (entry.linkedConditions?.some(lc =>
    lc.toLowerCase() === idLower || lc.toLowerCase() === nameLower
  )) return true;

  // Path 5: ClaimCondition explicit links
  if (claimCondition && entryId) {
    if (claimCondition.linkedSymptoms?.includes(entryId)) return true;
    if (claimCondition.linkedMedicalVisits?.includes(entryId)) return true;
    if (claimCondition.linkedExposures?.includes(entryId)) return true;
    if (claimCondition.linkedDocuments?.includes(entryId)) return true;
    if (claimCondition.linkedBuddyContacts?.includes(entryId)) return true;
  }

  return false;
}

/**
 * Body-part fallback matching for symptoms.
 */
function matchesBodyPart(entry: { bodyArea?: string }, bodyPart?: string): boolean {
  if (!bodyPart || !entry.bodyArea) return false;
  const bpLower = bodyPart.toLowerCase().replace(/_/g, ' ');
  const areaLower = entry.bodyArea.toLowerCase();
  return areaLower.includes(bpLower) || bpLower.includes(areaLower);
}

// ── Category Detection ──────────────────────────────────────────

function detectConditionCategory(
  uc: UserCondition,
  vaCondition: VACondition | undefined,
  displayName: string,
): ConditionExportCategory {
  const name = displayName.toLowerCase();
  const category = vaCondition?.category?.toLowerCase() || '';

  // PTSD / Mental Health
  if (name.includes('ptsd') || name.includes('anxiety') || name.includes('depression') ||
      name.includes('mood') || name.includes('adjustment') || name.includes('bipolar') ||
      name.includes('mst') || category === 'mental-health') {
    return 'mental_health';
  }

  // Sleep
  if (name.includes('sleep apnea') || name.includes('insomnia') ||
      name.includes('sleep disorder')) {
    return 'sleep';
  }

  // Migraine
  if (name.includes('migraine') || name.includes('headache')) {
    return 'migraine';
  }

  // Musculoskeletal
  if (name.includes('knee') || name.includes('back') || name.includes('shoulder') ||
      name.includes('ankle') || name.includes('hip') || name.includes('spine') ||
      name.includes('lumbar') || name.includes('cervical') || name.includes('thoracic') ||
      name.includes('strain') || name.includes('arthritis') || name.includes('joint') ||
      name.includes('plantar') || name.includes('tendon') || name.includes('carpal') ||
      name.includes('elbow') || name.includes('wrist') || name.includes('foot') ||
      category === 'musculoskeletal') {
    return 'musculoskeletal';
  }

  return 'general';
}

// ── Severity Trend Calculation ──────────────────────────────────

function computeSeverityTrend(symptoms: SymptomEntry[]): SeverityTrend {
  const recent = symptoms
    .filter(s => isWithinDays(s.date, 90) && s.severity != null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (recent.length < 4) return 'insufficient_data';

  const mid = Math.floor(recent.length / 2);
  const firstHalf = recent.slice(0, mid);
  const secondHalf = recent.slice(mid);

  const avgFirst = firstHalf.reduce((sum, s) => sum + s.severity, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((sum, s) => sum + s.severity, 0) / secondHalf.length;

  const diff = avgSecond - avgFirst;
  if (diff > 0.5) return 'worsening';
  if (diff < -0.5) return 'improving';
  return 'stable';
}

// ── Symptom Frequency Stats ─────────────────────────────────────

function computeSymptomFrequencyStats(symptoms: SymptomEntry[]): SymptomFrequencyStat[] {
  const map = new Map<string, { count: number; totalSeverity: number; mostRecent: string }>();

  for (const s of symptoms) {
    const key = s.symptom.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.count++;
      existing.totalSeverity += s.severity;
      if (s.date > existing.mostRecent) existing.mostRecent = s.date;
    } else {
      map.set(key, { count: 1, totalSeverity: s.severity, mostRecent: s.date });
    }
  }

  return Array.from(map.entries())
    .map(([name, data]) => ({
      symptomName: name,
      count: data.count,
      avgSeverity: Math.round((data.totalSeverity / data.count) * 10) / 10,
      mostRecentDate: data.mostRecent,
    }))
    .sort((a, b) => b.count - a.count);
}

// ── Log Coverage ────────────────────────────────────────────────

function computeLogCoverage(allDatedEntries: { date: string }[]): LogCoverage {
  return {
    last30Days: allDatedEntries.filter(e => isWithinDays(e.date, 30)).length,
    last90Days: allDatedEntries.filter(e => isWithinDays(e.date, 90)).length,
    last180Days: allDatedEntries.filter(e => isWithinDays(e.date, 180)).length,
  };
}

// ── Main Assembler ──────────────────────────────────────────────

/**
 * Assemble all data related to a single condition into one bundle.
 */
export function assembleConditionData(uc: UserCondition): ConditionDataBundle {
  const appState = useAppStore.getState();
  const profile = useProfileStore.getState();

  const displayName = getConditionDisplayName(uc);
  const vaCondition = getConditionById(uc.conditionId);

  // Resolve DBQ + rating criteria
  const dbqRef = resolveDBQ({
    id: uc.conditionId,
    name: displayName,
    diagnosticCode: uc.vaDiagnosticCode,
  });

  const ratingCrit = resolveRatingCriteria({
    id: uc.conditionId,
    diagnosticCode: uc.vaDiagnosticCode,
    diagnosticCodes: vaCondition?.diagnosticCodes,
  });

  const legacyRatingCrit = resolveLegacyRatingCriteria({
    id: uc.conditionId,
    diagnosticCode: uc.vaDiagnosticCode,
    diagnosticCodes: vaCondition?.diagnosticCodes,
  });

  // Find ClaimCondition link
  const claimCondition = appState.claimConditions.find(cc =>
    cc.name.toLowerCase() === displayName.toLowerCase() ||
    cc.id === uc.conditionId
  );

  const bodyPart = uc.bodyPart;
  const conditionId = uc.conditionId;

  // ── Filter linked data ──

  const isLinked = (entry: Record<string, unknown>, entryId?: string) =>
    isLinkedToCondition(entry as never, conditionId, displayName, bodyPart, claimCondition, entryId);

  const symptoms = appState.symptoms.filter(s =>
    isLinked(s, s.id) || matchesBodyPart(s, bodyPart)
  );

  const medications = appState.medications.filter(m => isLinked(m, m.id));

  const medicalVisits = appState.medicalVisits.filter(v => isLinked(v, v.id));

  const migraines = appState.migraines.filter(m => isLinked(m, m.id));

  const sleepEntries = appState.sleepEntries.filter(s => isLinked(s, s.id));

  // PTSD symptoms don't have conditionTags typically, include all for mental health conditions
  const conditionCategory = detectConditionCategory(uc, vaCondition, displayName);
  const ptsdSymptoms = conditionCategory === 'mental_health' ? appState.ptsdSymptoms : [];

  const exposures = appState.exposures.filter(e =>
    isLinked(e, e.id) ||
    (claimCondition?.linkedExposures?.includes(e.id))
  );

  const majorEvents = appState.majorEvents.filter(e =>
    e.linkedConditions?.some(lc =>
      lc.toLowerCase() === conditionId.toLowerCase() ||
      lc.toLowerCase() === displayName.toLowerCase()
    ) || isLinked(e, e.id)
  );

  const buddyContacts = appState.buddyContacts.filter(b =>
    claimCondition?.linkedBuddyContacts?.includes(b.id) || isLinked(b, b.id)
  );

  const employmentImpact = appState.employmentImpactEntries.filter(e => isLinked(e, e.id));

  const quickLogs = appState.quickLogs.filter(q => isLinked(q, q.id));

  const evidenceDocuments = appState.evidenceDocuments.filter(ed => {
    if (ed.linkedEntries?.some(le =>
      le.entryId === uc.id || le.entryId === uc.conditionId
    )) return true;
    return false;
  });

  // All data included for service context
  const combatHistory = appState.combatHistory;
  const deployments = appState.deployments;
  const serviceHistory = appState.serviceHistory;

  // ── Computed fields ──

  const allDated: { date: string }[] = [
    ...symptoms, ...medications.map(m => ({ date: m.startDate })),
    ...medicalVisits, ...migraines, ...sleepEntries,
    ...ptsdSymptoms, ...quickLogs, ...employmentImpact,
  ];

  const totalEmploymentHoursLost = employmentImpact.reduce((sum, e) => sum + (e.hoursLost || 0), 0);

  // Branch-appropriate specialty label
  const branchStr = profile.branch as string;
  const specialtyLabel = getJobCodeLabel(branchStr);

  const BRANCH_LABELS: Record<string, string> = {
    army: 'Army',
    marines: 'Marine Corps',
    navy: 'Navy',
    air_force: 'Air Force',
    coast_guard: 'Coast Guard',
    space_force: 'Space Force',
  };

  const veteran: VeteranInfo = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    branch: branchStr,
    branchLabel: BRANCH_LABELS[branchStr] || branchStr || '',
    specialtyLabel,
    specialtyCode: profile.mosCode,
    specialtyTitle: profile.mosTitle,
    serviceDates: profile.serviceDates,
    separationDate: profile.separationDate,
    claimType: profile.claimType,
    claimGoal: profile.claimGoal,
  };

  return {
    userCondition: uc,
    displayName,
    vaCondition,
    dbqReference: dbqRef,
    ratingCriteria: ratingCrit,
    legacyRatingCriteria: legacyRatingCrit,

    symptoms,
    medications,
    medicalVisits,
    migraines,
    sleepEntries,
    ptsdSymptoms,
    exposures,
    majorEvents,
    combatHistory,
    deployments,
    serviceHistory,
    buddyContacts,
    employmentImpact,
    quickLogs,
    evidenceDocuments,
    claimCondition,

    symptomFrequencyStats: computeSymptomFrequencyStats(symptoms),
    totalEmploymentHoursLost: totalEmploymentHoursLost,
    severityTrend: computeSeverityTrend(symptoms),
    logCoverage: computeLogCoverage(allDated),
    conditionCategory,

    veteran,
  };
}

/**
 * Assemble data for ALL user conditions.
 */
export function assembleAllConditionData(): ConditionDataBundle[] {
  const appState = useAppStore.getState();
  return appState.userConditions.map(uc => assembleConditionData(uc));
}
