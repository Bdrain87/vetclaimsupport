/**
 * Prefill helpers — shared functions for carrying data between tools.
 * These extract user-entered data from the store and format it for pre-filling form fields.
 */

import type { SymptomEntry, Medication, CombatEntry, MajorEvent, PTSDSymptomEntry, DeploymentEntry, MigraineEntry, SleepEntry, EmploymentImpactEntry } from '@/types/claims';

/**
 * Filter symptoms by condition name or conditionTags match.
 */
export function getConditionSymptoms(
  conditionName: string,
  symptoms: SymptomEntry[]
): SymptomEntry[] {
  const lower = conditionName.toLowerCase();
  return symptoms.filter(s => {
    if (s.conditionTags?.some(tag => tag.toLowerCase().includes(lower))) return true;
    if (s.bodyArea?.toLowerCase().includes(lower)) return true;
    if (s.symptom?.toLowerCase().includes(lower)) return true;
    return false;
  });
}

/**
 * Filter medications by prescribedFor field matching the condition.
 */
export function getConditionMedications(
  conditionName: string,
  medications: Medication[]
): Medication[] {
  const lower = conditionName.toLowerCase();
  return medications.filter(m =>
    m.prescribedFor?.toLowerCase().includes(lower) ||
    m.name?.toLowerCase().includes(lower)
  );
}

/**
 * Format an array of symptoms into a text summary.
 */
export function buildSymptomSummary(symptoms: SymptomEntry[]): string {
  if (symptoms.length === 0) return '';
  return symptoms
    .map(s => {
      const parts = [s.symptom];
      if (s.bodyArea) parts.push(`(${s.bodyArea})`);
      if (s.severity) parts.push(`severity ${s.severity}/10`);
      if (s.frequency) parts.push(s.frequency);
      return parts.join(' ');
    })
    .join('. ') + '.';
}

/**
 * Format an array of medications into a text summary.
 */
export function buildMedicationSummary(medications: Medication[]): string {
  if (medications.length === 0) return '';
  return medications
    .map(m => {
      const parts = [m.name];
      if (m.prescribedFor) parts.push(`for ${m.prescribedFor}`);
      if (m.sideEffects) parts.push(`(side effects: ${m.sideEffects})`);
      if (!m.stillTaking) parts.push('[discontinued]');
      return parts.join(' ');
    })
    .join('; ');
}

/**
 * Extract dailyImpact fields from symptoms into a summary.
 */
export function buildFunctionalImpactSummary(symptoms: SymptomEntry[]): string {
  const impacts = symptoms
    .filter(s => s.dailyImpact)
    .map(s => s.dailyImpact);
  return impacts.join('. ');
}

/**
 * Build stressor statement pre-fill data from combat history, major events, PTSD symptoms, and deployments.
 */
export function buildStressorPrefill(data: {
  combatHistory?: CombatEntry[];
  majorEvents?: MajorEvent[];
  ptsdSymptoms?: PTSDSymptomEntry[];
  deployments?: DeploymentEntry[];
}): {
  whatHappened: string;
  whenStart: string;
  whenEnd: string;
  whereLocation: string;
  whereUnit: string;
  howAffectedOngoing: string;
} {
  const result = {
    whatHappened: '',
    whenStart: '',
    whenEnd: '',
    whereLocation: '',
    whereUnit: '',
    howAffectedOngoing: '',
  };

  // From major events (traumatic events, injuries, etc.)
  const traumaticEvents = (data.majorEvents || []).filter(e =>
    e.type === 'Traumatic Event' || e.type === 'Assault/MST' || e.type === 'TBI Event' || e.type === 'Injury'
  );
  if (traumaticEvents.length > 0) {
    const event = traumaticEvents[0];
    result.whatHappened = event.description || event.title || '';
    if (event.date) result.whenStart = event.date;
    if (event.location) result.whereLocation = event.location;
  }

  // From combat history
  const combatEntries = data.combatHistory || [];
  if (combatEntries.length > 0 && !result.whatHappened) {
    const entry = combatEntries[0];
    result.whatHappened = entry.description || '';
    if (entry.startDate) result.whenStart = entry.startDate;
    if (entry.endDate) result.whenEnd = entry.endDate;
    if (entry.location) result.whereLocation = entry.location;
  }

  // From deployments (location fallback)
  const deployments = data.deployments || [];
  if (deployments.length > 0 && !result.whereLocation) {
    result.whereLocation = deployments.map(d => d.location).filter(Boolean).join(', ');
  }

  // From PTSD symptoms
  const ptsd = data.ptsdSymptoms || [];
  if (ptsd.length > 0) {
    result.howAffectedOngoing = ptsd
      .map(p => {
        const parts: string[] = [];
        if (p.selectedSymptoms?.length) parts.push(p.selectedSymptoms.join(', '));
        if (p.occupationalImpairment) parts.push(`Work impact: ${p.occupationalImpairment}`);
        if (p.socialImpairment) parts.push(`Social impact: ${p.socialImpairment}`);
        if (p.notes) parts.push(p.notes);
        if (p.triggeredBy) parts.push(`Triggered by: ${p.triggeredBy}`);
        return parts.join('. ');
      })
      .filter(Boolean)
      .join('. ');
  }

  return result;
}

/**
 * Filter migraines by conditionTags or notes matching condition name.
 */
export function getConditionMigraines(
  conditionName: string,
  migraines: MigraineEntry[],
): MigraineEntry[] {
  const lower = conditionName.toLowerCase();
  if (!lower.includes('migraine') && !lower.includes('headache')) return migraines;
  return migraines; // All migraines are relevant for migraine conditions
}

/**
 * Filter sleep entries by conditionTags or notes matching condition name.
 */
export function getConditionSleepEntries(
  conditionName: string,
  sleepEntries: SleepEntry[],
): SleepEntry[] {
  const lower = conditionName.toLowerCase();
  if (lower.includes('sleep') || lower.includes('apnea') || lower.includes('insomnia')) {
    return sleepEntries;
  }
  return sleepEntries.filter(
    (s) => s.notes?.toLowerCase().includes(lower) || s.conditionTags?.some((t) => t.toLowerCase().includes(lower)),
  );
}

/**
 * Filter PTSD symptom entries.
 */
export function getConditionPTSDSymptoms(
  conditionName: string,
  ptsdSymptoms: PTSDSymptomEntry[],
): PTSDSymptomEntry[] {
  const lower = conditionName.toLowerCase();
  if (lower.includes('ptsd') || lower.includes('post-traumatic') || lower.includes('anxiety') || lower.includes('depression')) {
    return ptsdSymptoms;
  }
  return ptsdSymptoms.filter(
    (p) => p.notes?.toLowerCase().includes(lower) || p.triggeredBy?.toLowerCase().includes(lower),
  );
}

/**
 * Filter employment impact entries by condition field.
 */
export function getConditionEmploymentImpact(
  conditionName: string,
  entries: EmploymentImpactEntry[],
): EmploymentImpactEntry[] {
  const lower = conditionName.toLowerCase();
  return entries.filter((e) => e.condition.toLowerCase().includes(lower));
}

/**
 * Build a comprehensive tracker summary for a condition — master prefill function.
 * Aggregates all tracked data for a condition into a single text block.
 */
export function buildTrackerSummary(data: {
  conditionName: string;
  symptoms: SymptomEntry[];
  medications: Medication[];
  migraines?: MigraineEntry[];
  sleepEntries?: SleepEntry[];
  ptsdSymptoms?: PTSDSymptomEntry[];
  employmentImpact?: EmploymentImpactEntry[];
}): string {
  const parts: string[] = [];

  if (data.symptoms.length > 0) {
    const avgSev = data.symptoms.reduce((s, e) => s + e.severity, 0) / data.symptoms.length;
    parts.push(
      `Symptoms (${data.symptoms.length} entries, avg severity ${avgSev.toFixed(1)}/10): ${buildSymptomSummary(data.symptoms.slice(0, 5))}`,
    );
  }

  if (data.medications.length > 0) {
    parts.push(`Medications: ${buildMedicationSummary(data.medications)}`);
  }

  if (data.migraines && data.migraines.length > 0) {
    const prostrating = data.migraines.filter((m) => m.wasProstrating).length;
    parts.push(
      `Migraines: ${data.migraines.length} logged, ${prostrating} prostrating`,
    );
  }

  if (data.sleepEntries && data.sleepEntries.length > 0) {
    const avgHours =
      data.sleepEntries.reduce((s, e) => s + e.hoursSlept, 0) / data.sleepEntries.length;
    const nightmareCount = data.sleepEntries.filter((e) => e.nightmares).length;
    parts.push(
      `Sleep: ${data.sleepEntries.length} entries, avg ${avgHours.toFixed(1)} hrs/night, ${nightmareCount} nights with nightmares`,
    );
  }

  if (data.ptsdSymptoms && data.ptsdSymptoms.length > 0) {
    const avgSev =
      data.ptsdSymptoms.reduce((s, e) => s + e.overallSeverity, 0) / data.ptsdSymptoms.length;
    parts.push(
      `PTSD symptoms: ${data.ptsdSymptoms.length} entries, avg severity ${avgSev.toFixed(1)}/10`,
    );
  }

  if (data.employmentImpact && data.employmentImpact.length > 0) {
    const totalHours = data.employmentImpact.reduce((s, e) => s + e.hoursLost, 0);
    parts.push(
      `Work impact: ${data.employmentImpact.length} incidents, ${totalHours} total hours lost`,
    );
  }

  return parts.join('\n');
}
