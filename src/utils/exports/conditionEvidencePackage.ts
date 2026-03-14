/**
 * Condition Evidence Package - Comprehensive Evidence PDF
 *
 * Organizes all evidence for a single condition around the specific DBQ
 * form sections for that condition type using conditionTypeStrategies.
 * Replaces the old chronological data dump with condition-centric layout.
 *
 * Legal: Patient-organized clinical information. Rating criteria presented
 * as "educational reference to published regulations."
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
  type TableColumn,
  type TableRow,
} from '@/utils/pdf/pdfRenderer';
import { PDF_BRAND } from '@/utils/pdf/pdfColors';
import { assembleConditionData, type ConditionDataBundle } from './conditionDataAssembler';
import { getConditionStrategy } from './conditionTypeStrategies';
import type { UserCondition } from '@/store/useAppStore';
import { EMPLOYMENT_IMPACT_TYPES } from '@/types/claims';

// ── Evidence Strength Score ─────────────────────────────────────

interface EvidenceScore {
  score: number; // 0-100
  maxScore: number;
  items: { label: string; points: number; maxPoints: number; status: 'complete' | 'partial' | 'missing' }[];
}

function computeEvidenceScore(bundle: ConditionDataBundle): EvidenceScore {
  const items: EvidenceScore['items'] = [];

  // Symptom logs (up to 25 pts)
  const symptomPts = Math.min(25, bundle.symptoms.length * 2);
  items.push({
    label: 'Symptom logs',
    points: symptomPts,
    maxPoints: 25,
    status: symptomPts >= 20 ? 'complete' : symptomPts > 0 ? 'partial' : 'missing',
  });

  // Medical visits (up to 15 pts)
  const visitPts = Math.min(15, bundle.medicalVisits.length * 5);
  items.push({
    label: 'Medical visits',
    points: visitPts,
    maxPoints: 15,
    status: visitPts >= 10 ? 'complete' : visitPts > 0 ? 'partial' : 'missing',
  });

  // Medications (up to 10 pts)
  const medPts = Math.min(10, bundle.medications.length * 5);
  items.push({
    label: 'Medications documented',
    points: medPts,
    maxPoints: 10,
    status: medPts >= 10 ? 'complete' : medPts > 0 ? 'partial' : 'missing',
  });

  // Employment impact (up to 15 pts)
  const empPts = Math.min(15, bundle.employmentImpact.length * 3);
  items.push({
    label: 'Employment impact entries',
    points: empPts,
    maxPoints: 15,
    status: empPts >= 10 ? 'complete' : empPts > 0 ? 'partial' : 'missing',
  });

  // Buddy statements (up to 10 pts)
  const buddyPts = Math.min(10, bundle.buddyContacts.length * 5);
  items.push({
    label: 'Buddy statements',
    points: buddyPts,
    maxPoints: 10,
    status: buddyPts >= 5 ? 'complete' : buddyPts > 0 ? 'partial' : 'missing',
  });

  // Service history context (up to 10 pts)
  const servicePts = Math.min(10,
    (bundle.serviceHistory.length > 0 ? 3 : 0) +
    (bundle.exposures.length > 0 ? 4 : 0) +
    (bundle.majorEvents.length > 0 ? 3 : 0)
  );
  items.push({
    label: 'Service history context',
    points: servicePts,
    maxPoints: 10,
    status: servicePts >= 7 ? 'complete' : servicePts > 0 ? 'partial' : 'missing',
  });

  // Log consistency/coverage (up to 15 pts)
  const coveragePts = Math.min(15,
    (bundle.logCoverage.last30Days >= 10 ? 5 : bundle.logCoverage.last30Days >= 5 ? 3 : 0) +
    (bundle.logCoverage.last90Days >= 20 ? 5 : bundle.logCoverage.last90Days >= 10 ? 3 : 0) +
    (bundle.logCoverage.last180Days >= 30 ? 5 : bundle.logCoverage.last180Days >= 15 ? 3 : 0)
  );
  items.push({
    label: 'Logging consistency',
    points: coveragePts,
    maxPoints: 15,
    status: coveragePts >= 10 ? 'complete' : coveragePts > 0 ? 'partial' : 'missing',
  });

  const score = items.reduce((sum, i) => sum + i.points, 0);
  const maxScore = items.reduce((sum, i) => sum + i.maxPoints, 0);

  return { score, maxScore, items };
}

// ── Main Export Function ────────────────────────────────────────

/**
 * Generate a Condition Evidence Package PDF.
 */
export async function generateConditionEvidencePackagePDF(uc: UserCondition): Promise<Blob> {
  const bundle = assembleConditionData(uc);

  // Guard free text
  const freeTexts = [
    ...bundle.symptoms.map(s => s.notes),
    ...bundle.symptoms.map(s => s.dailyImpact),
    ...bundle.medications.map(m => m.sideEffects),
    ...bundle.ptsdSymptoms.map(p => p.notes),
    ...bundle.employmentImpact.map(e => e.description),
    ...bundle.majorEvents.map(e => e.description),
    ...bundle.medicalVisits.map(v => v.notes),
    ...bundle.quickLogs.map(q => q.flareUpNote),
    ...bundle.quickLogs.map(q => q.notes || ''),
  ].filter(Boolean).join(' ');
  if (freeTexts) assertExportClean(freeTexts);

  const { doc, state } = await createPDFDoc({ watermark: true });

  let y = addBrandHeader(doc, {
    title: 'Condition Evidence Package',
    subtitle: bundle.displayName,
  });

  // ── Section 1: Condition Overview ──
  y = addSectionHeading(doc, 'Condition Overview', y);
  y = addKeyValue(doc, 'Condition', bundle.displayName, y);
  if (bundle.vaCondition?.diagnosticCode) {
    y = addKeyValue(doc, 'Diagnostic Code (DC)', bundle.vaCondition.diagnosticCode, y);
  }
  y = addKeyValue(doc, 'Connection Type', bundle.userCondition.connectionType || 'Not specified', y);
  y = addKeyValue(doc, 'Claim Status', bundle.userCondition.claimStatus || 'Not specified', y);

  if (bundle.userCondition.secondaryTo) {
    y = addKeyValue(doc, 'Secondary To', bundle.userCondition.secondaryTo, y);
  }

  // Evidence strength score
  const evidenceScore = computeEvidenceScore(bundle);
  y = addSpacer(doc, y, 4);
  y = addStatBox(doc, [
    { label: 'Evidence Score', value: `${evidenceScore.score}/${evidenceScore.maxScore}` },
    { label: 'Category', value: bundle.conditionCategory.replace(/_/g, ' ') },
    { label: 'Severity Trend', value: bundle.severityTrend === 'insufficient_data' ? 'N/A' : bundle.severityTrend },
  ], y);

  // Evidence readiness breakdown
  y = addSubsectionHeading(doc, 'Evidence Readiness', y);
  const scoreRows: TableRow[] = evidenceScore.items.map(item => ({
    cells: [
      item.label,
      `${item.points}/${item.maxPoints}`,
      item.status === 'complete' ? 'Complete' : item.status === 'partial' ? 'In Progress' : 'Not Started',
    ],
  }));
  y = addTable(doc, [
    { header: 'Evidence Area', width: 200 },
    { header: 'Score', width: 80 },
    { header: 'Status', width: 120 },
  ], scoreRows, y);

  // ── Section 2: Condition-Specific Sections (from strategy) ──
  y = addSectionHeading(doc, 'Condition-Specific Evidence', y);
  const strategy = getConditionStrategy(bundle.conditionCategory);
  y = strategy.renderSections(doc, bundle, y);

  // ── Section 3: Treatment History ──
  y = addSectionHeading(doc, 'Treatment History', y);

  // Medications table
  if (bundle.medications.length > 0) {
    y = addSubsectionHeading(doc, 'Medications', y);
    y = addSelfReportedLabel(doc, y);
    const medRows: TableRow[] = bundle.medications.map(m => ({
      cells: [
        m.name,
        m.dosage || 'N/A',
        m.stillTaking ? 'Active' : 'Discontinued',
        m.effectiveness === 'effective' ? 'Effective' :
          m.effectiveness === 'partially_effective' ? 'Partial' :
          m.effectiveness === 'not_effective' ? 'Not Effective' : 'N/A',
        safeDate(m.startDate),
      ],
    }));
    y = addTable(doc, [
      { header: 'Medication', width: 120 },
      { header: 'Dosage', width: 70 },
      { header: 'Status', width: 80 },
      { header: 'Effectiveness', width: 80 },
      { header: 'Start Date', width: 80 },
    ], medRows, y);
  } else {
    y = addNotYetDocumented(doc, 'Medications', y);
  }

  // Medical visit timeline
  if (bundle.medicalVisits.length > 0) {
    y = addSubsectionHeading(doc, 'Medical Visit Timeline', y);
    y = addSelfReportedLabel(doc, y);
    const visits = bundle.medicalVisits
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const visitRows: TableRow[] = visits.map(v => ({
      cells: [safeDate(v.date), v.visitType, v.provider || 'N/A', v.diagnosis || '', v.treatment || ''],
    }));
    y = addTable(doc, [
      { header: 'Date', width: 70 },
      { header: 'Type', width: 70 },
      { header: 'Provider', width: 110 },
      { header: 'Diagnosis', width: 110 },
      { header: 'Treatment', width: 120 },
    ], visitRows, y);
  } else {
    y = addNotYetDocumented(doc, 'Medical visits', y);
  }

  // ── Section 4: Supporting Evidence Inventory ──
  y = addSectionHeading(doc, 'Supporting Evidence Inventory', y);

  if (bundle.buddyContacts.length > 0) {
    y = addSubsectionHeading(doc, 'Buddy Statements', y);
    const buddyRows: TableRow[] = bundle.buddyContacts.map(b => ({
      cells: [b.name, b.relationship, b.statementStatus],
    }));
    y = addTable(doc, [
      { header: 'Contact', width: 150 },
      { header: 'Relationship', width: 140 },
      { header: 'Status', width: 120 },
    ], buddyRows, y);
  }

  if (bundle.evidenceDocuments.length > 0) {
    y = addSubsectionHeading(doc, 'Documents', y);
    const docRows: TableRow[] = bundle.evidenceDocuments.map(ed => ({
      cells: [ed.title || ed.fileName, ed.category, safeDate(ed.uploadedAt)],
    }));
    y = addTable(doc, [
      { header: 'Document', width: 220 },
      { header: 'Category', width: 130 },
      { header: 'Date', width: 100 },
    ], docRows, y);
  }

  // What's missing
  const missing: string[] = [];
  if (bundle.medicalVisits.length === 0) missing.push('Medical visit records for this condition');
  if (bundle.buddyContacts.length === 0) missing.push('Buddy/witness statements');
  if (bundle.medications.length === 0) missing.push('Medication documentation');
  if (bundle.employmentImpact.length === 0) missing.push('Employment impact entries');

  if (missing.length > 0) {
    y = addSubsectionHeading(doc, 'Evidence Gaps', y);
    y = addHighlightBox(doc,
      'The following evidence types have not been documented yet. Adding them may strengthen your claim packet.',
      y,
      { label: 'Recommended', type: 'warning' },
    );
    y = addBulletList(doc, missing, y);
  }

  // ── Section 5: Rating Criteria Reference ──
  y = addSectionHeading(doc, 'Rating Criteria Reference', y);
  y = addHighlightBox(doc,
    'The following is an educational reference to published VA regulations (38 CFR Part 4). Rating decisions are made by VA raters based on the totality of evidence.',
    y,
    { label: 'Educational Reference', type: 'info' },
  );

  if (bundle.ratingCriteria) {
    const rc = bundle.ratingCriteria;
    for (const level of rc.ratingLevels) {
      y = checkPageBreak(doc, y, 40);
      y = addSubsectionHeading(doc, `${level.percentage}% Rating`, y);

      // Use the vaResources format
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...PDF_BRAND.textPrimary);
      const lines = doc.splitTextToSize(level.description, pageWidth - 50);
      for (const line of lines) {
        y = checkPageBreak(doc, y, 11);
        doc.text(line, 25, y);
        y += 10;
      }
      y += 4;
    }
  } else if (bundle.legacyRatingCriteria) {
    const lrc = bundle.legacyRatingCriteria;
    y = addKeyValue(doc, 'Diagnostic Code', lrc.diagnosticCode, y);
    y = addKeyValue(doc, 'CFR Reference', lrc.cfrReference, y);

    for (const level of lrc.ratingLevels) {
      y = checkPageBreak(doc, y, 40);
      y = addSubsectionHeading(doc, `${level.percent}% Rating`, y);

      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...PDF_BRAND.textPrimary);
      const lines = doc.splitTextToSize(level.criteria, pageWidth - 50);
      for (const line of lines) {
        y = checkPageBreak(doc, y, 11);
        doc.text(line, 25, y);
        y += 10;
      }
      y += 4;
    }
  } else {
    y = addNotYetDocumented(doc, 'Rating criteria for this condition', y);
  }

  return finalizePDF(doc, state);
}

/**
 * Generate the filename for a condition evidence package PDF.
 */
export function getEvidencePackageFilename(conditionName: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const safeName = conditionName.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
  return `vcs-evidence-package-${safeName}-${date}.pdf`;
}
