/**
 * Condition Type Strategies
 *
 * Strategy pattern that maps condition categories to DBQ-specific
 * section organization. Each strategy defines which sections to render
 * and how to pull the relevant data from a ConditionDataBundle.
 */
import type jsPDFType from 'jspdf';
import type { ConditionDataBundle, ConditionExportCategory } from './conditionDataAssembler';
import {
  addSubsectionHeading,
  addTable,
  addHighlightBox,
  addStatBox,
  addKeyValue,
  addBulletList,
  addNotYetDocumented,
  addSelfReportedLabel,
  checkPageBreak,
  safeDate,
  type TableColumn,
  type TableRow,
} from '@/utils/pdf/pdfRenderer';
import { PDF_BRAND } from '@/utils/pdf/pdfColors';
import { FLARE_UP_DURATIONS, EMPLOYMENT_IMPACT_TYPES } from '@/types/claims';

// ── PTSD Symptom -> DSM-5 Criteria Mapping ──────────────────────

const DSM5_CRITERIA: Record<string, { label: string; description: string }> = {
  B: { label: 'Criterion B: Intrusion', description: 'Re-experiencing the traumatic event (nightmares, flashbacks, intrusive memories)' },
  C: { label: 'Criterion C: Avoidance', description: 'Avoiding reminders of the trauma (places, people, thoughts)' },
  D: { label: 'Criterion D: Negative Cognitions/Mood', description: 'Negative thoughts, feelings of detachment, inability to feel positive emotions' },
  E: { label: 'Criterion E: Arousal/Reactivity', description: 'Hypervigilance, exaggerated startle, irritability, sleep disturbance, reckless behavior' },
};

// Map common PTSD symptom IDs to DSM-5 criteria categories
const SYMPTOM_TO_DSM5: Record<string, string> = {
  // Criterion B - Intrusion
  'nightmares': 'B', 'flashbacks': 'B', 'intrusive-memories': 'B',
  'intrusive-thoughts': 'B', 'distressing-dreams': 'B', 'psychological-distress': 'B',
  'physiological-reactions': 'B',
  // Criterion C - Avoidance
  'avoidance-thoughts': 'C', 'avoidance-reminders': 'C', 'avoidance-activities': 'C',
  'avoidance-places': 'C', 'avoidance-people': 'C',
  // Criterion D - Negative Cognitions
  'negative-beliefs': 'D', 'distorted-blame': 'D', 'negative-emotions': 'D',
  'diminished-interest': 'D', 'detachment': 'D', 'inability-positive': 'D',
  'memory-gaps': 'D', 'emotional-numbing': 'D',
  // Criterion E - Arousal
  'irritability': 'E', 'reckless-behavior': 'E', 'hypervigilance': 'E',
  'exaggerated-startle': 'E', 'concentration-problems': 'E', 'sleep-disturbance': 'E',
  'anger-outbursts': 'E',
};

// ── Strategy Interface ──────────────────────────────────────────

export interface ConditionStrategy {
  category: ConditionExportCategory;
  /** Render condition-specific sections into the PDF. Returns final yPos. */
  renderSections(doc: jsPDFType, bundle: ConditionDataBundle, yPos: number): number;
}

// ── PTSD / Mental Health Strategy ───────────────────────────────

const mentalHealthStrategy: ConditionStrategy = {
  category: 'mental_health',
  renderSections(doc, bundle, yPos) {
    // 1. Stressor/Trauma History
    yPos = addSubsectionHeading(doc, 'Stressor/Trauma History', yPos);
    if (bundle.majorEvents.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);
      const eventRows: TableRow[] = bundle.majorEvents.map(e => ({
        cells: [safeDate(e.date), e.type, e.title, e.location, e.documented ? 'Yes' : 'No'],
      }));
      const eventCols: TableColumn[] = [
        { header: 'Date', width: 70 },
        { header: 'Type', width: 90 },
        { header: 'Event', width: 170 },
        { header: 'Location', width: 100 },
        { header: 'Documented', width: 65 },
      ];
      yPos = addTable(doc, eventCols, eventRows, yPos);
    }

    if (bundle.combatHistory.length > 0) {
      for (const combat of bundle.combatHistory) {
        yPos = addKeyValue(doc, 'Combat Zone', `${combat.location} (${safeDate(combat.startDate)} - ${safeDate(combat.endDate)})`, yPos);
        if (combat.directCombat) {
          yPos = addKeyValue(doc, 'Direct Combat', 'Yes', yPos);
        }
        if (combat.awards) {
          yPos = addKeyValue(doc, 'Combat Awards', combat.awards, yPos);
        }
      }
    }

    if (bundle.majorEvents.length === 0 && bundle.combatHistory.length === 0) {
      yPos = addNotYetDocumented(doc, 'Stressor/trauma events', yPos);
    }

    // 2. DSM-5 Criteria Mapping
    yPos = addSubsectionHeading(doc, 'DSM-5 Criteria Mapping', yPos);
    if (bundle.ptsdSymptoms.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);

      // Collect all symptom IDs across all entries
      const allSymptomIds = new Set<string>();
      for (const entry of bundle.ptsdSymptoms) {
        for (const sid of entry.selectedSymptoms) {
          allSymptomIds.add(sid);
        }
      }

      // Group by criteria
      const criteriaGroups: Record<string, string[]> = { B: [], C: [], D: [], E: [] };
      const unmapped: string[] = [];
      for (const sid of allSymptomIds) {
        const criteria = SYMPTOM_TO_DSM5[sid];
        if (criteria && criteriaGroups[criteria]) {
          criteriaGroups[criteria].push(sid.replace(/-/g, ' '));
        } else {
          unmapped.push(sid.replace(/-/g, ' '));
        }
      }

      for (const [key, info] of Object.entries(DSM5_CRITERIA)) {
        const symptoms = criteriaGroups[key] || [];
        const status = symptoms.length > 0 ? `MET (${symptoms.length} symptom${symptoms.length > 1 ? 's' : ''})` : 'Not documented';
        yPos = addKeyValue(doc, info.label, status, yPos);
        if (symptoms.length > 0) {
          yPos = addBulletList(doc, symptoms.map(s => s.charAt(0).toUpperCase() + s.slice(1)), yPos);
        }
      }

      if (unmapped.length > 0) {
        yPos = addKeyValue(doc, 'Additional Symptoms', unmapped.join(', '), yPos);
      }
    } else {
      yPos = addNotYetDocumented(doc, 'PTSD symptom tracking entries', yPos);
    }

    // 3. Symptom Checklist (frequency)
    yPos = addSubsectionHeading(doc, 'Symptom Frequency Summary', yPos);
    if (bundle.ptsdSymptoms.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);

      // Recent entry stats
      const recent = bundle.ptsdSymptoms
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

      const avgSeverity = recent.reduce((sum, e) => sum + e.overallSeverity, 0) / recent.length;

      yPos = addStatBox(doc, [
        { label: 'Total Entries', value: String(bundle.ptsdSymptoms.length) },
        { label: 'Avg Severity', value: avgSeverity.toFixed(1) + '/10' },
        { label: 'Log Coverage (90 days)', value: String(bundle.logCoverage.last90Days) },
      ], yPos);
    }

    // 4. Occupational/Social Impairment
    yPos = addSubsectionHeading(doc, 'Occupational and Social Impairment', yPos);
    if (bundle.ptsdSymptoms.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);
      const latest = bundle.ptsdSymptoms
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      if (latest?.occupationalImpairment) {
        yPos = addHighlightBox(doc, `Occupational: ${latest.occupationalImpairment}`, yPos, { label: 'Most Recent Assessment' });
      }
      if (latest?.socialImpairment) {
        yPos = addHighlightBox(doc, `Social: ${latest.socialImpairment}`, yPos);
      }
    }

    // Employment impact for mental health
    if (bundle.employmentImpact.length > 0) {
      yPos = renderEmploymentImpact(doc, bundle, yPos);
    }

    return yPos;
  },
};

// ── Musculoskeletal Strategy ────────────────────────────────────

const musculoskeletalStrategy: ConditionStrategy = {
  category: 'musculoskeletal',
  renderSections(doc, bundle, yPos) {
    // 1. Pain Level Documentation
    yPos = addSubsectionHeading(doc, 'Pain Level Documentation', yPos);
    if (bundle.symptoms.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);
      const painEntries = bundle.symptoms.filter(s =>
        s.severity != null
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      if (painEntries.length > 0) {
        const avgPain = painEntries.reduce((sum, s) => sum + s.severity, 0) / painEntries.length;
        const maxPain = Math.max(...painEntries.map(s => s.severity));

        yPos = addStatBox(doc, [
          { label: 'Avg Pain Level', value: avgPain.toFixed(1) + '/10' },
          { label: 'Max Pain Recorded', value: maxPain + '/10' },
          { label: 'Total Entries', value: String(painEntries.length) },
          { label: 'Trend', value: bundle.severityTrend === 'insufficient_data' ? 'N/A' : bundle.severityTrend },
        ], yPos);

        // Top symptoms table
        if (bundle.symptomFrequencyStats.length > 0) {
          const symRows: TableRow[] = bundle.symptomFrequencyStats.slice(0, 8).map(s => ({
            cells: [s.symptomName, String(s.count), s.avgSeverity.toFixed(1), safeDate(s.mostRecentDate)],
          }));
          yPos = addTable(doc, [
            { header: 'Symptom', width: 180 },
            { header: 'Count', width: 60 },
            { header: 'Avg Severity', width: 80 },
            { header: 'Most Recent', width: 100 },
          ], symRows, yPos);
        }
      }
    } else {
      yPos = addNotYetDocumented(doc, 'Pain/symptom entries', yPos);
    }

    // 2. Flare-up History
    yPos = addSubsectionHeading(doc, 'Flare-up History', yPos);
    const flareUps = bundle.quickLogs.filter(q => q.hadFlareUp);
    if (flareUps.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);
      yPos = addStatBox(doc, [
        { label: 'Total Flare-ups', value: String(flareUps.length) },
        { label: 'Avg Severity', value: flareUps.filter(f => f.flareUpSeverity).length > 0
          ? (flareUps.filter(f => f.flareUpSeverity).reduce((sum, f) => sum + (f.flareUpSeverity || 0), 0) / flareUps.filter(f => f.flareUpSeverity).length).toFixed(1) + '/10'
          : 'N/A' },
        { label: 'In Last 90 Days', value: String(flareUps.filter(f => {
          const d = new Date(f.date);
          return !isNaN(d.getTime()) && d >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        }).length) },
      ], yPos);

      const flareRows: TableRow[] = flareUps.slice(0, 10).map(f => ({
        cells: [
          safeDate(f.date),
          f.flareUpSeverity ? f.flareUpSeverity + '/10' : 'N/A',
          f.flareUpDuration ? (FLARE_UP_DURATIONS[f.flareUpDuration] || f.flareUpDuration) : 'N/A',
          f.flareUpNote || '',
        ],
      }));
      yPos = addTable(doc, [
        { header: 'Date', width: 80 },
        { header: 'Severity', width: 60 },
        { header: 'Duration', width: 100 },
        { header: 'Notes', width: 250 },
      ], flareRows, yPos);
    } else {
      yPos = addNotYetDocumented(doc, 'Flare-up entries', yPos);
    }

    // 3. Functional Limitations
    yPos = addSubsectionHeading(doc, 'Functional Limitations', yPos);
    const impactSymptoms = bundle.symptoms.filter(s => s.dailyImpact);
    if (impactSymptoms.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);
      const impacts = impactSymptoms.map(s => `${safeDate(s.date)}: ${s.dailyImpact}`);
      yPos = addBulletList(doc, impacts.slice(0, 8), yPos);
    } else {
      yPos = addNotYetDocumented(doc, 'Daily impact descriptions', yPos);
    }

    // 4. Work Impact
    if (bundle.employmentImpact.length > 0) {
      yPos = renderEmploymentImpact(doc, bundle, yPos);
    }

    return yPos;
  },
};

// ── Sleep Apnea Strategy ────────────────────────────────────────

const sleepStrategy: ConditionStrategy = {
  category: 'sleep',
  renderSections(doc, bundle, yPos) {
    // 1. CPAP Compliance
    yPos = addSubsectionHeading(doc, 'CPAP Compliance', yPos);
    const cpapEntries = bundle.sleepEntries.filter(s => s.usesCPAP);
    if (cpapEntries.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);
      const usedNights = cpapEntries.filter(s => s.cpapUsedLastNight).length;
      const complianceRate = cpapEntries.length > 0 ? (usedNights / cpapEntries.length * 100) : 0;
      const avgHours = cpapEntries.filter(s => s.cpapHoursUsed).reduce((sum, s) => sum + (s.cpapHoursUsed || 0), 0)
        / (cpapEntries.filter(s => s.cpapHoursUsed).length || 1);

      yPos = addStatBox(doc, [
        { label: 'CPAP Compliance', value: complianceRate.toFixed(0) + '%' },
        { label: 'Avg Hours/Night', value: avgHours.toFixed(1) },
        { label: 'Tracked Nights', value: String(cpapEntries.length) },
      ], yPos);

      // Monthly breakdown
      const monthMap = new Map<string, { total: number; used: number }>();
      for (const e of cpapEntries) {
        const month = e.date.slice(0, 7);
        const entry = monthMap.get(month) || { total: 0, used: 0 };
        entry.total++;
        if (e.cpapUsedLastNight) entry.used++;
        monthMap.set(month, entry);
      }

      if (monthMap.size > 1) {
        const monthRows: TableRow[] = Array.from(monthMap.entries())
          .sort((a, b) => b[0].localeCompare(a[0]))
          .slice(0, 6)
          .map(([month, data]) => ({
            cells: [month, String(data.used), String(data.total), (data.used / data.total * 100).toFixed(0) + '%'],
          }));
        yPos = addTable(doc, [
          { header: 'Month', width: 100 },
          { header: 'Nights Used', width: 100 },
          { header: 'Total Nights', width: 100 },
          { header: 'Compliance %', width: 100 },
        ], monthRows, yPos);
      }
    } else if (bundle.sleepEntries.length > 0) {
      yPos = addHighlightBox(doc, 'Sleep entries are logged but CPAP usage is not indicated. If you use a CPAP, enable the CPAP tracking option in the sleep log.', yPos, { type: 'warning' });
    } else {
      yPos = addNotYetDocumented(doc, 'Sleep entries', yPos);
    }

    // 2. Oxygen/AHI Data
    yPos = addSubsectionHeading(doc, 'Oxygen and AHI Data', yPos);
    const oxygenEntries = bundle.sleepEntries.filter(s => s.lowestOxygenLevel || s.apneaEpisodes);
    if (oxygenEntries.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);
      const minO2 = Math.min(...oxygenEntries.filter(s => s.lowestOxygenLevel).map(s => s.lowestOxygenLevel!));
      const avgEpisodes = oxygenEntries.filter(s => s.apneaEpisodes).reduce((sum, s) => sum + (s.apneaEpisodes || 0), 0)
        / (oxygenEntries.filter(s => s.apneaEpisodes).length || 1);

      yPos = addStatBox(doc, [
        { label: 'Lowest O2 Recorded', value: isFinite(minO2) ? minO2 + '%' : 'N/A' },
        { label: 'Avg Apnea Episodes', value: avgEpisodes.toFixed(1) + '/night' },
        { label: 'Entries with Data', value: String(oxygenEntries.length) },
      ], yPos);
    } else {
      yPos = addNotYetDocumented(doc, 'Oxygen/AHI data', yPos);
    }

    // 3. Daytime Sleepiness
    yPos = addSubsectionHeading(doc, 'Daytime Sleepiness', yPos);
    const sleepinessEntries = bundle.sleepEntries.filter(s => s.daytimeSleepiness);
    if (sleepinessEntries.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);
      const sleepinessCounts: Record<string, number> = {};
      for (const e of sleepinessEntries) {
        const level = e.daytimeSleepiness || 'Not specified';
        sleepinessCounts[level] = (sleepinessCounts[level] || 0) + 1;
      }
      const items = Object.entries(sleepinessCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([level, count]) => `${level}: ${count} entries`);
      yPos = addBulletList(doc, items, yPos);

      const notRested = bundle.sleepEntries.filter(s => s.feltRested === false).length;
      const totalWithData = bundle.sleepEntries.filter(s => s.feltRested != null).length;
      if (totalWithData > 0) {
        yPos = addKeyValue(doc, 'Woke feeling unrested', `${notRested}/${totalWithData} nights (${(notRested / totalWithData * 100).toFixed(0)}%)`, yPos);
      }
    } else {
      yPos = addNotYetDocumented(doc, 'Daytime sleepiness data', yPos);
    }

    // 4. Work Impact
    if (bundle.employmentImpact.length > 0) {
      yPos = renderEmploymentImpact(doc, bundle, yPos);
    }

    return yPos;
  },
};

// ── Migraine Strategy ───────────────────────────────────────────

const migraineStrategy: ConditionStrategy = {
  category: 'migraine',
  renderSections(doc, bundle, yPos) {
    const migraines = bundle.migraines;

    // 1. Frequency Documentation
    yPos = addSubsectionHeading(doc, 'Frequency Documentation', yPos);
    if (migraines.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);

      // Monthly averages
      const monthCounts = new Map<string, number>();
      for (const m of migraines) {
        const month = m.date.slice(0, 7);
        monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
      }

      const months = Array.from(monthCounts.values());
      const avgPerMonth = months.length > 0 ? months.reduce((a, b) => a + b, 0) / months.length : 0;

      const prostrating = migraines.filter(m => m.wasProstrating).length;
      const bedRest = migraines.filter(m => m.requiredBedRest).length;
      const couldNotWork = migraines.filter(m => m.couldNotWork).length;

      yPos = addStatBox(doc, [
        { label: 'Total Logged', value: String(migraines.length) },
        { label: 'Avg Per Month', value: avgPerMonth.toFixed(1) },
        { label: 'Prostrating', value: String(prostrating) },
        { label: 'Required Bed Rest', value: String(bedRest) },
      ], yPos);
    } else {
      yPos = addNotYetDocumented(doc, 'Migraine entries', yPos);
      return yPos;
    }

    // 2. Prostrating Attack Count
    yPos = addSubsectionHeading(doc, 'Prostrating Attack Analysis', yPos);
    const prostrating = migraines.filter(m => m.wasProstrating);
    if (prostrating.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);
      const prostratingMonths = new Map<string, number>();
      for (const m of prostrating) {
        const month = m.date.slice(0, 7);
        prostratingMonths.set(month, (prostratingMonths.get(month) || 0) + 1);
      }

      const proMonthVals = Array.from(prostratingMonths.values());
      const avgProstratingPerMonth = proMonthVals.length > 0 ? proMonthVals.reduce((a, b) => a + b, 0) / proMonthVals.length : 0;

      yPos = addHighlightBox(doc,
        `Prostrating attacks: ${prostrating.length} total across ${prostratingMonths.size} month(s). Average: ${avgProstratingPerMonth.toFixed(1)} per month. ` +
        `Of these, ${migraines.filter(m => m.couldNotWork).length} prevented work entirely.`,
        yPos,
        { label: 'VA Rating Relevance', type: 'info' },
      );
    }

    // 3. Duration Patterns
    yPos = addSubsectionHeading(doc, 'Duration Patterns', yPos);
    const DURATION_LABELS: Record<string, string> = {
      '30min': '30 minutes', '1hr': '1 hour', '2hrs': '2 hours', '4hrs': '4 hours',
      '8hrs': '8 hours', '12hrs': '12 hours', '24hrs+': '24+ hours',
    };
    const durationCounts: Record<string, number> = {};
    for (const m of migraines) {
      const label = DURATION_LABELS[m.duration] || m.duration;
      durationCounts[label] = (durationCounts[label] || 0) + 1;
    }
    const durationItems = Object.entries(durationCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([dur, count]) => `${dur}: ${count} episode${count !== 1 ? 's' : ''}`);
    yPos = addBulletList(doc, durationItems, yPos);

    // 4. Economic Impact
    yPos = addSubsectionHeading(doc, 'Economic Impact', yPos);
    const totalHoursLost = migraines.reduce((sum, m) => sum + (m.hoursLostToMigraine || 0), 0);
    const missedWork = migraines.filter(m => m.couldNotWork).length;

    if (totalHoursLost > 0 || missedWork > 0 || bundle.employmentImpact.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);
      const stats = [
        { label: 'Hours Lost to Migraines', value: totalHoursLost > 0 ? String(totalHoursLost) : 'N/A' },
        { label: 'Days Unable to Work', value: String(missedWork) },
      ];
      if (bundle.totalEmploymentHoursLost > 0) {
        stats.push({ label: 'Employment Hours Lost', value: String(bundle.totalEmploymentHoursLost) });
      }
      yPos = addStatBox(doc, stats, yPos);
    } else {
      yPos = addNotYetDocumented(doc, 'Economic impact data', yPos);
    }

    // 5. Treatment Effectiveness
    yPos = addSubsectionHeading(doc, 'Treatment Effectiveness', yPos);
    const withEffectiveness = migraines.filter(m => m.medicationEffective != null);
    if (withEffectiveness.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);
      const effective = withEffectiveness.filter(m => m.medicationEffective).length;
      const notEffective = withEffectiveness.length - effective;
      yPos = addKeyValue(doc, 'Medication Effective', `${effective}/${withEffectiveness.length} episodes (${(effective / withEffectiveness.length * 100).toFixed(0)}%)`, yPos);
      yPos = addKeyValue(doc, 'Medication Not Effective', `${notEffective}/${withEffectiveness.length} episodes`, yPos);
    }

    // Medication side effects
    const migraineMeds = bundle.medications.filter(m => m.sideEffects);
    if (migraineMeds.length > 0) {
      yPos = addSelfReportedLabel(doc, yPos);
      for (const med of migraineMeds) {
        yPos = addKeyValue(doc, med.name, `Side effects: ${med.sideEffects}`, yPos);
      }
    }

    return yPos;
  },
};

// ── General Strategy ────────────────────────────────────────────

const generalStrategy: ConditionStrategy = {
  category: 'general',
  renderSections(doc, bundle, yPos) {
    // Symptom summary
    if (bundle.symptoms.length > 0) {
      yPos = addSubsectionHeading(doc, 'Symptom Summary', yPos);
      yPos = addSelfReportedLabel(doc, yPos);

      if (bundle.symptomFrequencyStats.length > 0) {
        const symRows: TableRow[] = bundle.symptomFrequencyStats.slice(0, 10).map(s => ({
          cells: [s.symptomName, String(s.count), s.avgSeverity.toFixed(1), safeDate(s.mostRecentDate)],
        }));
        yPos = addTable(doc, [
          { header: 'Symptom', width: 180 },
          { header: 'Occurrences', width: 80 },
          { header: 'Avg Severity', width: 80 },
          { header: 'Most Recent', width: 100 },
        ], symRows, yPos);
      }
    }

    // Functional impact
    const impactSymptoms = bundle.symptoms.filter(s => s.dailyImpact);
    if (impactSymptoms.length > 0) {
      yPos = addSubsectionHeading(doc, 'Functional Impact', yPos);
      yPos = addSelfReportedLabel(doc, yPos);
      const impacts = impactSymptoms
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6)
        .map(s => `${safeDate(s.date)}: ${s.dailyImpact}`);
      yPos = addBulletList(doc, impacts, yPos);
    }

    // Employment impact
    if (bundle.employmentImpact.length > 0) {
      yPos = renderEmploymentImpact(doc, bundle, yPos);
    }

    // Quick log flare-ups
    const flareUps = bundle.quickLogs.filter(q => q.hadFlareUp);
    if (flareUps.length > 0) {
      yPos = addSubsectionHeading(doc, 'Flare-up History', yPos);
      yPos = addSelfReportedLabel(doc, yPos);
      yPos = addKeyValue(doc, 'Total Flare-ups', String(flareUps.length), yPos);
      const recent = flareUps
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      const items = recent.map(f =>
        `${safeDate(f.date)}: Severity ${f.flareUpSeverity || 'N/A'}/10${f.flareUpNote ? ' - ' + f.flareUpNote : ''}`
      );
      yPos = addBulletList(doc, items, yPos);
    }

    return yPos;
  },
};

// ── Shared: Employment Impact Renderer ──────────────────────────

function renderEmploymentImpact(doc: jsPDFType, bundle: ConditionDataBundle, yPos: number): number {
  yPos = addSubsectionHeading(doc, 'Work Impact', yPos);
  yPos = addSelfReportedLabel(doc, yPos);

  yPos = addStatBox(doc, [
    { label: 'Total Hours Lost', value: String(bundle.totalEmploymentHoursLost) },
    { label: 'Impact Entries', value: String(bundle.employmentImpact.length) },
  ], yPos);

  // Breakdown by type
  const typeCounts: Record<string, number> = {};
  for (const e of bundle.employmentImpact) {
    const label = EMPLOYMENT_IMPACT_TYPES[e.type] || e.type;
    typeCounts[label] = (typeCounts[label] || 0) + 1;
  }
  const typeItems = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => `${type}: ${count} occurrence${count !== 1 ? 's' : ''}`);
  yPos = addBulletList(doc, typeItems, yPos);

  return yPos;
}

// ── Strategy Resolver ───────────────────────────────────────────

const strategies: Record<ConditionExportCategory, ConditionStrategy> = {
  mental_health: mentalHealthStrategy,
  musculoskeletal: musculoskeletalStrategy,
  sleep: sleepStrategy,
  migraine: migraineStrategy,
  general: generalStrategy,
};

/**
 * Get the rendering strategy for a condition category.
 */
export function getConditionStrategy(category: ConditionExportCategory): ConditionStrategy {
  return strategies[category] || generalStrategy;
}
