/**
 * DBQ Prep Sheet - Condition-Aware PDF Export
 *
 * Maps logged data directly to specific DBQ key questions from dbqReference.ts.
 * For each question: shows the question text, "Why It Matters," auto-populated
 * relevant stats, prep tips, and common mistakes.
 *
 * Legal: "DBQ Prep Sheet" (never "DBQ Form Filler"). Educational preparation document.
 */
import type jsPDFType from 'jspdf';
import {
  createPDFDoc,
  finalizePDF,
  addBrandHeader,
  addSectionHeading,
  addSubsectionHeading,
  addKeyValue,
  addTable,
  addHighlightBox,
  addStatBox,
  addBulletList,
  addSelfReportedLabel,
  addNotYetDocumented,
  addSpacer,
  checkPageBreak,
  safeDate,
  assertExportClean,
  type TableRow,
} from '@/utils/pdf/pdfRenderer';
import { PDF_BRAND } from '@/utils/pdf/pdfColors';
import { assembleConditionData, type ConditionDataBundle } from './conditionDataAssembler';
import type { UserCondition } from '@/store/useAppStore';
import type { DBQQuestion } from '@/data/vaResources/dbqReference';

// ── Auto-populate data for a DBQ question ───────────────────────

function getAutoPopulatedData(
  question: DBQQuestion,
  bundle: ConditionDataBundle,
  questionIndex: number,
): string[] {
  const data: string[] = [];
  const cat = bundle.conditionCategory;
  const qLower = question.question.toLowerCase();

  // Symptom-related questions
  if (qLower.includes('symptom') || qLower.includes('what symptoms')) {
    if (bundle.symptomFrequencyStats.length > 0) {
      data.push(`${bundle.symptomFrequencyStats.length} unique symptoms documented`);
      const top3 = bundle.symptomFrequencyStats.slice(0, 3);
      for (const s of top3) {
        data.push(`${s.symptomName}: ${s.count} entries, avg severity ${s.avgSeverity}/10`);
      }
    }
    if (cat === 'mental_health' && bundle.ptsdSymptoms.length > 0) {
      const allSymptoms = new Set<string>();
      for (const entry of bundle.ptsdSymptoms) {
        for (const sid of entry.selectedSymptoms) allSymptoms.add(sid);
      }
      data.push(`${allSymptoms.size} PTSD symptoms tracked across ${bundle.ptsdSymptoms.length} entries`);
    }
  }

  // Impairment / functioning questions
  if (qLower.includes('impairment') || qLower.includes('occupational') || qLower.includes('social') || qLower.includes('functioning')) {
    if (bundle.employmentImpact.length > 0) {
      data.push(`${bundle.totalEmploymentHoursLost} hours of work lost documented`);
      data.push(`${bundle.employmentImpact.length} employment impact entries`);
    }
    if (cat === 'mental_health' && bundle.ptsdSymptoms.length > 0) {
      const latest = bundle.ptsdSymptoms.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
      if (latest?.occupationalImpairment) {
        data.push(`Most recent occupational impact: "${latest.occupationalImpairment}"`);
      }
      if (latest?.socialImpairment) {
        data.push(`Most recent social impact: "${latest.socialImpairment}"`);
      }
    }
  }

  // Diagnosis / criteria questions
  if (qLower.includes('diagnosis') || qLower.includes('criteria')) {
    if (bundle.vaCondition) {
      data.push(`Condition: ${bundle.displayName} (DC ${bundle.vaCondition.diagnosticCode})`);
    }
    if (bundle.medicalVisits.length > 0) {
      const withDiagnosis = bundle.medicalVisits.filter(v => v.diagnosis);
      if (withDiagnosis.length > 0) {
        data.push(`${withDiagnosis.length} medical visits with documented diagnoses`);
      }
    }
  }

  // Treatment / medication questions
  if (qLower.includes('treatment') || qLower.includes('medication') || qLower.includes('continuous medication')) {
    const activeMeds = bundle.medications.filter(m => m.stillTaking);
    if (activeMeds.length > 0) {
      data.push(`${activeMeds.length} active medications: ${activeMeds.map(m => m.name).join(', ')}`);
    }
    const withSideEffects = bundle.medications.filter(m => m.sideEffects);
    if (withSideEffects.length > 0) {
      data.push(`Side effects documented for: ${withSideEffects.map(m => m.name).join(', ')}`);
    }
  }

  // Range of motion questions
  if (qLower.includes('range of motion') || qLower.includes('rom')) {
    data.push('Range of motion measurements: Not yet documented in app');
  }

  // CPAP / sleep questions
  if (qLower.includes('cpap') || qLower.includes('breathing assistance')) {
    const cpapEntries = bundle.sleepEntries.filter(s => s.usesCPAP);
    if (cpapEntries.length > 0) {
      const usedNights = cpapEntries.filter(s => s.cpapUsedLastNight).length;
      const rate = (usedNights / cpapEntries.length * 100).toFixed(0);
      data.push(`CPAP compliance: ${rate}% (${usedNights}/${cpapEntries.length} nights)`);
    }
  }

  // Frequency / prostrating questions (migraines)
  if (qLower.includes('frequency') || qLower.includes('prostrating')) {
    if (bundle.migraines.length > 0) {
      const prostrating = bundle.migraines.filter(m => m.wasProstrating).length;
      data.push(`Total migraines logged: ${bundle.migraines.length}`);
      data.push(`Prostrating attacks: ${prostrating}`);
      data.push(`Required bed rest: ${bundle.migraines.filter(m => m.requiredBedRest).length}`);
    }
  }

  // Work impact questions
  if (qLower.includes('work') || qLower.includes('economic') || qLower.includes('employment')) {
    if (bundle.totalEmploymentHoursLost > 0) {
      data.push(`Total employment hours lost: ${bundle.totalEmploymentHoursLost}`);
    }
    if (cat === 'migraine') {
      const couldNotWork = bundle.migraines.filter(m => m.couldNotWork).length;
      if (couldNotWork > 0) {
        data.push(`Days unable to work due to migraines: ${couldNotWork}`);
      }
    }
  }

  // Stressor / traumatic event questions
  if (qLower.includes('stressor') || qLower.includes('traumatic') || qLower.includes('trauma')) {
    if (bundle.majorEvents.length > 0) {
      data.push(`${bundle.majorEvents.length} major events documented`);
      for (const e of bundle.majorEvents.slice(0, 2)) {
        data.push(`${e.type}: ${e.title} (${safeDate(e.date)})`);
      }
    }
    if (bundle.combatHistory.length > 0) {
      data.push(`${bundle.combatHistory.length} combat zone entries`);
    }
  }

  if (data.length === 0) {
    data.push('No matching data documented yet for this question');
  }

  return data;
}

// ── Main Export Function ────────────────────────────────────────

/**
 * Generate a condition-aware DBQ Prep Sheet PDF.
 */
export async function generateDBQPrepSheetPDF(uc: UserCondition): Promise<Blob> {
  const bundle = assembleConditionData(uc);

  // Guard free text
  const freeTexts = [
    ...bundle.symptoms.map(s => s.notes),
    ...bundle.ptsdSymptoms.map(p => p.notes),
    ...bundle.majorEvents.map(e => e.description),
    ...bundle.employmentImpact.map(e => e.description),
  ].filter(Boolean).join(' ');
  if (freeTexts) assertExportClean(freeTexts);

  const { doc, state } = await createPDFDoc({ watermark: true });

  let y = addBrandHeader(doc, {
    title: 'DBQ Prep Sheet',
    subtitle: bundle.displayName,
  });

  // Condition context
  y = addKeyValue(doc, 'Condition', bundle.displayName, y);
  if (bundle.vaCondition?.diagnosticCode) {
    y = addKeyValue(doc, 'Diagnostic Code', bundle.vaCondition.diagnosticCode, y);
  }
  if (bundle.dbqReference) {
    y = addKeyValue(doc, 'DBQ Form', `${bundle.dbqReference.name} (${bundle.dbqReference.formNumber})`, y);
  }
  y = addSpacer(doc, y);

  // ── DBQ Key Questions ──
  if (bundle.dbqReference && bundle.dbqReference.keyQuestions.length > 0) {
    y = addSectionHeading(doc, 'Key DBQ Questions', y);

    for (let qi = 0; qi < bundle.dbqReference.keyQuestions.length; qi++) {
      const question = bundle.dbqReference.keyQuestions[qi];
      y = checkPageBreak(doc, y, 80);

      // Question heading
      y = addSubsectionHeading(doc, `Question ${qi + 1}: ${question.question}`, y);

      // Why it matters
      y = addHighlightBox(doc, question.whyItMatters, y, { label: 'Why It Matters', type: 'info' });

      // Auto-populated data
      const autoData = getAutoPopulatedData(question, bundle, qi);
      y = addSubsectionHeading(doc, 'Your Documented Data', y);
      y = addSelfReportedLabel(doc, y);
      y = addBulletList(doc, autoData, y);

      // Prep tips
      if (question.tips && question.tips.length > 0) {
        y = addSubsectionHeading(doc, 'Preparation Tips', y);
        y = addBulletList(doc, question.tips, y);
      }

      y = addSpacer(doc, y, 6);
    }

    // Common mistakes
    if (bundle.dbqReference.commonMistakes.length > 0) {
      y = addSectionHeading(doc, 'Common Mistakes to Avoid', y);
      y = addHighlightBox(doc,
        'Veterans commonly make these mistakes during their C&P exams. Being aware of them can help you present your case more accurately.',
        y,
        { type: 'warning', label: 'Important' },
      );
      y = addBulletList(doc, bundle.dbqReference.commonMistakes, y);
    }

    // General prep tips
    if (bundle.dbqReference.prepTips.length > 0) {
      y = addSectionHeading(doc, 'General Preparation Tips', y);
      y = addBulletList(doc, bundle.dbqReference.prepTips, y);
    }
  } else {
    y = addSectionHeading(doc, 'DBQ Reference', y);
    y = addHighlightBox(doc,
      'No specific DBQ reference found for this condition. The general preparation guidance below still applies.',
      y,
      { type: 'warning' },
    );
  }

  // ── What Determines Your Rating ──
  y = addSectionHeading(doc, 'What Determines Your Rating', y);
  y = addHighlightBox(doc,
    'The following factors are used by VA raters when determining disability percentages. This is an educational reference to published 38 CFR Part 4 regulations.',
    y,
    { label: 'Educational Reference', type: 'info' },
  );

  if (bundle.dbqReference && bundle.dbqReference.whatDeterminesRating.length > 0) {
    y = addBulletList(doc, bundle.dbqReference.whatDeterminesRating, y);
  } else if (bundle.ratingCriteria) {
    const factors = bundle.ratingCriteria.generalTips || [];
    if (factors.length > 0) {
      y = addBulletList(doc, factors, y);
    }
  } else {
    y = addNotYetDocumented(doc, 'Rating factors for this condition', y);
  }

  // ── What to Bring Checklist ──
  y = addSectionHeading(doc, 'What to Bring', y);

  const checklistItems = [
    { label: 'Medical records / treatment history', has: bundle.medicalVisits.length > 0 },
    { label: 'Current medication list', has: bundle.medications.length > 0 },
    { label: 'Symptom log / daily tracker data', has: bundle.symptoms.length > 0 || bundle.quickLogs.length > 0 },
    { label: 'Employment impact documentation', has: bundle.employmentImpact.length > 0 },
    { label: 'Buddy / lay statements', has: bundle.buddyContacts.some(b => b.statementStatus === 'Received' || b.statementStatus === 'Submitted') },
    { label: 'Service treatment records', has: bundle.serviceHistory.length > 0 },
    { label: 'Stressor/event documentation', has: bundle.majorEvents.length > 0 },
    { label: 'This DBQ Prep Sheet', has: true },
  ];

  // Add condition-specific items
  if (bundle.conditionCategory === 'sleep') {
    checklistItems.splice(3, 0,
      { label: 'CPAP compliance data', has: bundle.sleepEntries.some(s => s.usesCPAP) },
      { label: 'Sleep study results', has: false }, // data gap
    );
  }
  if (bundle.conditionCategory === 'migraine') {
    checklistItems.splice(3, 0,
      { label: 'Migraine log with prostrating attack counts', has: bundle.migraines.length > 0 },
    );
  }

  const checklistRows: TableRow[] = checklistItems.map(item => ({
    cells: [item.has ? 'Documented' : 'NOT YET', item.label],
    bold: !item.has,
  }));
  y = addTable(doc, [
    { header: 'Status', width: 100 },
    { header: 'Item', width: 400 },
  ], checklistRows, y);

  return finalizePDF(doc, state);
}

/**
 * Generate filename for a DBQ prep sheet PDF.
 */
export function getDBQPrepSheetFilename(conditionName: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const safeName = conditionName.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
  return `vcs-dbq-prep-${safeName}-${date}.pdf`;
}
