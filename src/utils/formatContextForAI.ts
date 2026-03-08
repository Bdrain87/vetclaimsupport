/**
 * Format Veteran Context for AI Prompts
 *
 * Converts VeteranContext → structured text block for AI prompt injection.
 * Three detail levels: minimal (~1500 chars), standard (~3000), detailed (~6000).
 */

import type { VeteranContext } from './veteranContext';

type DetailLevel = 'minimal' | 'standard' | 'detailed';

const CHAR_LIMITS: Record<DetailLevel, number> = {
  minimal: 1500,
  standard: 3000,
  detailed: 6000,
};

/**
 * Format veteran context as a structured text block for AI consumption.
 */
export function formatContextForAI(
  ctx: VeteranContext,
  detail: DetailLevel,
  maxChars?: number
): string {
  const limit = maxChars ?? CHAR_LIMITS[detail];
  const sections: string[] = [];

  // Profile — always included
  sections.push(formatProfile(ctx));

  // Conditions — always included
  sections.push(formatConditions(ctx, detail));

  // Symptoms
  if (detail !== 'minimal' && ctx.symptomsByCondition.length > 0) {
    sections.push(formatSymptoms(ctx, detail));
  }

  // Medications
  if (ctx.medications.length > 0) {
    sections.push(formatMedications(ctx, detail));
  }

  // Medical visits (detailed only)
  if (detail === 'detailed' && ctx.medicalVisits.total > 0) {
    sections.push(formatMedicalVisits(ctx));
  }

  // Service / deployments
  if (detail !== 'minimal' && (ctx.service.deployments.length > 0 || ctx.service.combatHistory.length > 0)) {
    sections.push(formatService(ctx, detail));
  }

  // Exposures
  if (ctx.exposures.length > 0) {
    sections.push(formatExposures(ctx, detail));
  }

  // Sleep / Migraines / PTSD (detailed and standard)
  if (detail !== 'minimal') {
    const specialSections = formatSpecialConditions(ctx, detail);
    if (specialSections) sections.push(specialSections);
  }

  // Flare-ups
  if (detail !== 'minimal' && ctx.flareUps) {
    sections.push(formatFlareUps(ctx));
  }

  // Evidence
  sections.push(formatEvidence(ctx));

  let text = sections.filter(Boolean).join('\n');

  // Truncate if needed
  if (text.length > limit) {
    text = text.slice(0, limit - 3) + '...';
  }

  return `<veteran_context>\n${text}\n</veteran_context>`;
}

// ---------------------------------------------------------------------------
// Section formatters
// ---------------------------------------------------------------------------

function formatProfile(ctx: VeteranContext): string {
  const parts = [ctx.profile.name];
  if (ctx.profile.branch) parts.push(ctx.profile.branch);
  if (ctx.profile.mos) parts.push(`(${ctx.profile.mos})`);
  if (ctx.profile.serviceDates) parts.push(`served ${ctx.profile.serviceDates}`);

  let line = `PROFILE: ${parts.join(', ')}`;
  if (ctx.profile.claimType || ctx.profile.claimGoal) {
    const claimParts: string[] = [];
    if (ctx.profile.claimGoal) claimParts.push(ctx.profile.claimGoal);
    if (ctx.profile.claimType) claimParts.push(`type: ${ctx.profile.claimType}`);
    line += `\nCLAIM: ${claimParts.join(', ')}, ${ctx.conditions.length} condition${ctx.conditions.length !== 1 ? 's' : ''}`;
  } else {
    line += `\nCLAIM: ${ctx.conditions.length} condition${ctx.conditions.length !== 1 ? 's' : ''}`;
  }
  return line;
}

function formatConditions(ctx: VeteranContext, detail: DetailLevel): string {
  if (ctx.conditions.length === 0) return 'CONDITIONS: None added';

  const lines = ctx.conditions.map(c => {
    const parts = [c.name];
    if (c.diagnosticCode) parts.push(`(DC ${c.diagnosticCode})`);
    if (c.rating !== undefined) parts.push(`— ${c.rating}% rated`);
    if (c.connectionType) parts.push(c.connectionType);
    if (c.claimStatus && c.claimStatus !== 'pending') parts.push(c.claimStatus);
    if (c.secondaryTo && detail !== 'minimal') parts.push(`secondary to ${c.secondaryTo}`);
    return `  • ${parts.join(' ')}`;
  });

  return `CONDITIONS:\n${lines.join('\n')}`;
}

function formatSymptoms(ctx: VeteranContext, detail: DetailLevel): string {
  const lines: string[] = [];
  for (const group of ctx.symptomsByCondition) {
    const header = `SYMPTOMS (${group.conditionName}): ${group.totalEntries} entries, avg severity ${group.avgSeverity}/10`;
    lines.push(header);
    if (group.topSymptoms.length > 0) {
      lines.push(`  Top: ${group.topSymptoms.join(', ')}`);
    }
    if (detail === 'detailed' && group.functionalImpacts.length > 0) {
      lines.push(`  Impact: ${group.functionalImpacts.map(i => `"${i}"`).join(', ')}`);
    }
  }
  return lines.join('\n');
}

function formatMedications(ctx: VeteranContext, detail: DetailLevel): string {
  if (detail === 'minimal') {
    const names = ctx.medications.slice(0, 5).map(m => m.name);
    const more = ctx.medications.length > 5 ? ` (+${ctx.medications.length - 5} more)` : '';
    return `MEDICATIONS: ${names.join(', ')}${more}`;
  }

  const lines = ctx.medications.slice(0, detail === 'detailed' ? 15 : 8).map(m => {
    const parts = [m.name];
    if (m.dosage) parts.push(m.dosage);
    if (m.frequency) parts.push(m.frequency);
    if (m.prescribedFor) parts.push(`— for ${m.prescribedFor}`);
    if (detail === 'detailed') {
      if (m.effectiveness) parts.push(m.effectiveness.replace(/_/g, ' '));
      if (m.sideEffects) parts.push(`side effects: ${m.sideEffects}`);
    } else if (m.effectiveness) {
      parts.push(m.effectiveness.replace(/_/g, ' '));
    }
    if (!m.stillTaking) parts.push('[discontinued]');
    return `  • ${parts.join(', ')}`;
  });

  return `MEDICATIONS:\n${lines.join('\n')}`;
}

function formatMedicalVisits(ctx: VeteranContext): string {
  const lines = [`MEDICAL VISITS: ${ctx.medicalVisits.total} total`];
  for (const v of ctx.medicalVisits.recent.slice(0, 5)) {
    lines.push(`  • ${v.date} — ${v.type}: ${v.reason}${v.diagnosis ? ` (dx: ${v.diagnosis})` : ''}`);
  }
  return lines.join('\n');
}

function formatService(ctx: VeteranContext, detail: DetailLevel): string {
  const lines: string[] = [];

  if (ctx.service.deployments.length > 0) {
    const depParts = ctx.service.deployments.map(d => {
      const parts = [d.operation || d.location];
      if (d.operation && d.location) parts[0] = `${d.operation} ${d.location}`;
      parts.push(d.dates);
      if (d.combat) parts.push('combat');
      return parts.join(', ');
    });
    lines.push(`SERVICE: ${ctx.service.deployments.length} deployment${ctx.service.deployments.length !== 1 ? 's' : ''} (${depParts.join('; ')})`);
  }

  if (detail === 'detailed' && ctx.service.combatHistory.length > 0) {
    lines.push(`COMBAT: ${ctx.service.combatHistory.map(c => `${c.location} ${c.dates}${c.directCombat ? ' (direct combat)' : ''}`).join('; ')}`);
  }

  if (detail === 'detailed' && ctx.service.majorEvents.length > 0) {
    lines.push('MAJOR EVENTS:');
    for (const e of ctx.service.majorEvents.slice(0, 5)) {
      lines.push(`  • ${e.type}: ${e.title} (${e.date}, ${e.location})`);
    }
  }

  return lines.join('\n');
}

function formatExposures(ctx: VeteranContext, detail: DetailLevel): string {
  if (detail === 'minimal') {
    return `EXPOSURES: ${ctx.exposures.map(e => e.type).join(', ')}`;
  }
  const items = ctx.exposures.map(e => {
    const parts = [e.type];
    if (e.location) parts.push(e.location);
    if (e.duration) parts.push(e.duration);
    return parts.join(', ');
  });
  return `EXPOSURES: ${items.join('; ')}`;
}

function formatSpecialConditions(ctx: VeteranContext, detail: DetailLevel): string | null {
  const lines: string[] = [];

  if (ctx.sleep) {
    const s = ctx.sleep;
    lines.push(`SLEEP: avg ${s.avgHours} hrs, quality ${s.avgQuality}${s.usesCPAP ? ', uses CPAP' : ''}, nightmares ${s.nightmareRate}`);
  }

  if (ctx.migraines) {
    const m = ctx.migraines;
    lines.push(`MIGRAINES: ${m.avgPerMonth}/month, ${m.prostratingPercent}% prostrating, ${m.workDaysMissed} work days missed`);
    if (detail === 'detailed' && m.commonTriggers.length > 0) {
      lines.push(`  Triggers: ${m.commonTriggers.join(', ')}`);
    }
  }

  if (ctx.ptsd) {
    const p = ctx.ptsd;
    lines.push(`PTSD: avg severity ${p.avgSeverity}/10, top symptoms: ${p.topSymptoms.join(', ')}`);
    if (detail === 'detailed' && p.occupationalImpacts.length > 0) {
      lines.push(`  Occupational: ${p.occupationalImpacts.join('; ')}`);
    }
  }

  return lines.length > 0 ? lines.join('\n') : null;
}

function formatFlareUps(ctx: VeteranContext): string {
  if (!ctx.flareUps) return '';
  const f = ctx.flareUps;
  let line = `FLARE-UPS: ${f.totalCount} logged, avg severity ${f.avgSeverity}/10`;
  if (f.commonTriggers.length > 0) {
    line += `, triggers: ${f.commonTriggers.join(', ')}`;
  }
  return line;
}

function formatEvidence(ctx: VeteranContext): string {
  const parts: string[] = [];
  if (ctx.evidence.buddyStatementsReceived > 0) {
    parts.push(`${ctx.evidence.buddyStatementsReceived} buddy statement${ctx.evidence.buddyStatementsReceived !== 1 ? 's' : ''} received`);
  }
  if (ctx.evidence.documentCount > 0) {
    parts.push(`${ctx.evidence.documentCount} document${ctx.evidence.documentCount !== 1 ? 's' : ''} uploaded`);
  }
  parts.push(`DD-214 ${ctx.evidence.hasDD214 ? '✓' : '✗'}`);
  parts.push(`STRs ${ctx.evidence.hasSTRs ? '✓' : '✗'}`);
  return `EVIDENCE: ${parts.join(', ')}`;
}
