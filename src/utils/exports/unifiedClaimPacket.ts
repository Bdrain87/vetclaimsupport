/**
 * Unified Claim Packet - The "Everything" Document
 *
 * A comprehensive, condition-by-condition claim packet that can be handed
 * to a VSO, attorney, or doctor as a single document. Includes cover page,
 * veteran profile, per-condition evidence packages, cross-condition analysis,
 * and evidence readiness scorecard.
 *
 * Legal: Patient-organized clinical information. DRAFT watermark on cover.
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
import {
  assembleConditionData,
  assembleAllConditionData,
  type ConditionDataBundle,
  type VeteranInfo,
} from './conditionDataAssembler';
import { getConditionStrategy } from './conditionTypeStrategies';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { getAllBranchLabels, getJobCodeLabel } from '@/utils/veteranProfile';
import { EMPLOYMENT_IMPACT_TYPES } from '@/types/claims';

// ── Combined Rating Calculator (VA math) ────────────────────────

function computeCombinedRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sorted = [...ratings].sort((a, b) => b - a);
  let combined = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const remaining = 100 - combined;
    combined = combined + Math.round(remaining * sorted[i] / 100);
  }
  // Round to nearest 10
  return Math.round(combined / 10) * 10;
}

// ── Cover Page ──────────────────────────────────────────────────

function renderCoverPage(doc: jsPDFType, veteran: VeteranInfo, conditionCount: number, date: Date): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;

  // Gold top bar
  doc.setFillColor(...PDF_BRAND.goldDark);
  doc.rect(0, 0, pageWidth, 60, 'F');

  // Title
  doc.setFontSize(28);
  doc.setTextColor(...PDF_BRAND.white);
  doc.setFont('helvetica', 'bold');
  doc.text('VET CLAIM SUPPORT', centerX, 38, { align: 'center' });

  // Subtitle block
  let y = 100;
  doc.setFontSize(22);
  doc.setTextColor(...PDF_BRAND.goldDark);
  doc.text('Claim Evidence Packet', centerX, y, { align: 'center' });

  y += 30;
  doc.setFontSize(14);
  doc.setTextColor(...PDF_BRAND.textPrimary);
  doc.setFont('helvetica', 'normal');
  doc.text(`Prepared for: ${veteran.firstName} ${veteran.lastName}`, centerX, y, { align: 'center' });

  y += 20;
  doc.text(`Branch: ${veteran.branchLabel}`, centerX, y, { align: 'center' });

  if (veteran.specialtyCode) {
    y += 18;
    doc.text(`${veteran.specialtyLabel}: ${veteran.specialtyCode} - ${veteran.specialtyTitle}`, centerX, y, { align: 'center' });
  }

  y += 18;
  doc.text(`Generated: ${date.toLocaleDateString()}`, centerX, y, { align: 'center' });

  y += 18;
  doc.text(`Conditions Covered: ${conditionCount}`, centerX, y, { align: 'center' });

  // DRAFT watermark
  doc.setFontSize(60);
  doc.setTextColor(220, 215, 200);
  doc.setFont('helvetica', 'bold');
  doc.text('DRAFT', centerX, pageHeight / 2 + 40, { align: 'center', angle: 45 });

  // Bottom disclaimer bar
  const barY = pageHeight - 80;
  doc.setFillColor(...PDF_BRAND.cream);
  doc.rect(20, barY, pageWidth - 40, 60, 'F');
  doc.setFillColor(...PDF_BRAND.goldMedium);
  doc.rect(20, barY, 4, 60, 'F');

  doc.setFontSize(7);
  doc.setTextColor(...PDF_BRAND.textSecondary);
  doc.setFont('helvetica', 'normal');
  const disclaimerLines = [
    'DISCLAIMER: This document is patient-organized clinical information prepared by the veteran.',
    'Not VA-accredited (38 C.F.R. Part 14). Not legal or medical advice. Does not file claims.',
    'Does not provide medical opinions. Not affiliated with the U.S. Department of Veterans Affairs.',
    'All data is from veteran\'s self-reported logs unless otherwise noted.',
  ];
  let dy = barY + 14;
  for (const line of disclaimerLines) {
    doc.text(line, centerX, dy, { align: 'center' });
    dy += 10;
  }
}

// ── Table of Contents ───────────────────────────────────────────

function renderTableOfContents(doc: jsPDFType, bundles: ConditionDataBundle[], y: number): number {
  y = addSectionHeading(doc, 'Table of Contents', y);

  const tocItems = [
    '1. Veteran Service Profile',
    '2. Conditions Summary',
  ];

  for (let i = 0; i < bundles.length; i++) {
    tocItems.push(`${i + 3}. Evidence: ${bundles[i].displayName}`);
  }

  tocItems.push(`${bundles.length + 3}. Cross-Condition Analysis`);
  tocItems.push(`${bundles.length + 4}. Evidence Readiness Scorecard`);

  y = addBulletList(doc, tocItems, y);
  return y;
}

// ── Main Export Function ────────────────────────────────────────

/**
 * Generate a Unified Claim Packet PDF covering all conditions.
 */
export async function generateUnifiedClaimPacketPDF(): Promise<Blob> {
  const bundles = assembleAllConditionData();
  const profile = useProfileStore.getState();
  const appState = useAppStore.getState();

  // Guard all free text across all bundles
  const allFreeTexts: string[] = [];
  for (const bundle of bundles) {
    allFreeTexts.push(
      ...bundle.symptoms.map(s => s.notes),
      ...bundle.symptoms.map(s => s.dailyImpact),
      ...bundle.medications.map(m => m.sideEffects),
      ...bundle.ptsdSymptoms.map(p => p.notes),
      ...bundle.employmentImpact.map(e => e.description),
      ...bundle.majorEvents.map(e => e.description),
    );
  }
  const freeText = allFreeTexts.filter(Boolean).join(' ');
  if (freeText) assertExportClean(freeText);

  const { doc, state } = await createPDFDoc({ watermark: true });
  const date = new Date();

  // Use first bundle's veteran info (all bundles share the same)
  const veteran = bundles[0]?.veteran || {
    firstName: profile.firstName,
    lastName: profile.lastName,
    branch: profile.branch as string,
    branchLabel: getAllBranchLabels(profile),
    specialtyLabel: getJobCodeLabel(profile.branch as string),
    specialtyCode: profile.mosCode,
    specialtyTitle: profile.mosTitle,
    serviceDates: profile.serviceDates,
    separationDate: profile.separationDate,
    claimType: profile.claimType,
    claimGoal: profile.claimGoal,
  };

  // ── Cover Page ──
  renderCoverPage(doc, veteran, bundles.length, date);

  // ── Table of Contents ──
  doc.addPage();
  let y = 40;
  y = renderTableOfContents(doc, bundles, y);

  // ── Veteran Profile ──
  doc.addPage();
  y = addBrandHeader(doc, { title: 'Veteran Service Profile', date });

  y = addKeyValue(doc, 'Name', `${veteran.firstName} ${veteran.lastName}`, y);
  y = addKeyValue(doc, 'Branch', veteran.branchLabel || 'Not specified', y);
  if (veteran.specialtyCode) {
    y = addKeyValue(doc, veteran.specialtyLabel, `${veteran.specialtyCode} - ${veteran.specialtyTitle}`, y);
  }
  if (veteran.serviceDates) {
    y = addKeyValue(doc, 'Service Dates', `${safeDate(veteran.serviceDates.start)} - ${safeDate(veteran.serviceDates.end)}`, y);
  }
  if (veteran.separationDate) {
    y = addKeyValue(doc, 'Separation Date', safeDate(veteran.separationDate), y);
  }
  if (veteran.claimType) {
    y = addKeyValue(doc, 'Claim Type', veteran.claimType, y);
  }

  // Service timeline
  const allService = appState.serviceHistory;
  if (allService.length > 0) {
    y = addSubsectionHeading(doc, 'Duty Stations', y);
    const stationRows: TableRow[] = allService.map(s => ({
      cells: [s.base, s.unit, `${safeDate(s.startDate)} - ${safeDate(s.endDate)}`, s.hazards || 'None'],
    }));
    y = addTable(doc, [
      { header: 'Installation', width: 140 },
      { header: 'Unit', width: 100 },
      { header: 'Dates', width: 130 },
      { header: 'Hazards', width: 120 },
    ], stationRows, y);
  }

  // Deployments
  if (appState.deployments.length > 0) {
    y = addSubsectionHeading(doc, 'Deployments', y);
    const depRows: TableRow[] = appState.deployments.map(d => ({
      cells: [d.operationName || 'N/A', d.location, `${safeDate(d.startDate)} - ${safeDate(d.endDate)}`, d.combatDeployment ? 'Yes' : 'No'],
    }));
    y = addTable(doc, [
      { header: 'Operation', width: 120 },
      { header: 'Location', width: 140 },
      { header: 'Dates', width: 130 },
      { header: 'Combat', width: 70 },
    ], depRows, y);
  }

  // Combat history
  if (appState.combatHistory.length > 0) {
    y = addSubsectionHeading(doc, 'Combat History', y);
    for (const c of appState.combatHistory) {
      y = addKeyValue(doc, c.combatZoneType, `${c.location} (${safeDate(c.startDate)} - ${safeDate(c.endDate)})`, y);
      if (c.directCombat) y = addKeyValue(doc, 'Direct Combat', 'Yes', y);
      if (c.awards) y = addKeyValue(doc, 'Awards', c.awards, y);
    }
  }

  // Exposures (all)
  if (appState.exposures.length > 0) {
    y = addSubsectionHeading(doc, 'Exposures', y);
    const expRows: TableRow[] = appState.exposures.map(e => ({
      cells: [e.type, e.location, e.duration, e.ppeProvided ? 'Yes' : 'No'],
    }));
    y = addTable(doc, [
      { header: 'Type', width: 120 },
      { header: 'Location', width: 140 },
      { header: 'Duration', width: 100 },
      { header: 'PPE', width: 60 },
    ], expRows, y);
  }

  // ── Conditions Summary Table ──
  doc.addPage();
  y = addBrandHeader(doc, { title: 'Conditions Summary', date });

  const conditionRows: TableRow[] = bundles.map(b => ({
    cells: [
      b.displayName,
      b.vaCondition?.diagnosticCode || 'N/A',
      b.userCondition.claimStatus || 'N/A',
      b.userCondition.connectionType || 'N/A',
      b.userCondition.rating != null ? `${b.userCondition.rating}%` : 'Pending',
    ],
  }));
  y = addTable(doc, [
    { header: 'Condition', width: 160 },
    { header: 'DC Code', width: 60 },
    { header: 'Status', width: 70 },
    { header: 'Connection', width: 80 },
    { header: 'Rating', width: 60 },
  ], conditionRows, y);

  // Combined rating
  const ratings = bundles
    .filter(b => b.userCondition.rating != null && b.userCondition.rating > 0)
    .map(b => b.userCondition.rating!);
  if (ratings.length > 0) {
    const combined = computeCombinedRating(ratings);
    y = addStatBox(doc, [
      { label: 'Individual Ratings', value: ratings.map(r => r + '%').join(', ') },
      { label: 'Combined Rating (VA Math)', value: combined + '%' },
    ], y);
  }

  // ── Per-Condition Evidence Packages ──
  for (const bundle of bundles) {
    doc.addPage();
    y = addBrandHeader(doc, {
      title: `Evidence: ${bundle.displayName}`,
      subtitle: bundle.vaCondition?.diagnosticCode ? `DC ${bundle.vaCondition.diagnosticCode}` : undefined,
      date,
    });

    // Quick stats
    y = addStatBox(doc, [
      { label: 'Symptom Entries', value: String(bundle.symptoms.length) },
      { label: 'Medical Visits', value: String(bundle.medicalVisits.length) },
      { label: 'Medications', value: String(bundle.medications.length) },
      { label: 'Employment Impact', value: String(bundle.employmentImpact.length) },
    ], y);

    // Condition-specific sections
    const strategy = getConditionStrategy(bundle.conditionCategory);
    y = strategy.renderSections(doc, bundle, y);

    // Medications
    if (bundle.medications.length > 0) {
      y = addSubsectionHeading(doc, 'Medications', y);
      y = addSelfReportedLabel(doc, y);
      const medRows: TableRow[] = bundle.medications.map(m => ({
        cells: [m.name, m.stillTaking ? 'Active' : 'Past', m.dosage || 'N/A', m.sideEffects || 'None'],
      }));
      y = addTable(doc, [
        { header: 'Name', width: 130 },
        { header: 'Status', width: 60 },
        { header: 'Dosage', width: 80 },
        { header: 'Side Effects', width: 220 },
      ], medRows, y);
    }

    // Medical visits
    if (bundle.medicalVisits.length > 0) {
      y = addSubsectionHeading(doc, 'Medical Visits', y);
      y = addSelfReportedLabel(doc, y);
      const visitRows: TableRow[] = bundle.medicalVisits
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)
        .map(v => ({
          cells: [safeDate(v.date), v.visitType, v.provider || '', v.reason || ''],
        }));
      y = addTable(doc, [
        { header: 'Date', width: 80 },
        { header: 'Type', width: 80 },
        { header: 'Provider', width: 140 },
        { header: 'Reason', width: 190 },
      ], visitRows, y);
    }

    // Evidence docs
    if (bundle.buddyContacts.length > 0 || bundle.evidenceDocuments.length > 0) {
      y = addSubsectionHeading(doc, 'Supporting Evidence', y);
      if (bundle.buddyContacts.length > 0) {
        y = addKeyValue(doc, 'Buddy Statements', `${bundle.buddyContacts.length} contacts`, y);
      }
      if (bundle.evidenceDocuments.length > 0) {
        y = addKeyValue(doc, 'Uploaded Documents', `${bundle.evidenceDocuments.length} files`, y);
      }
    }
  }

  // ── Cross-Condition Analysis ──
  doc.addPage();
  y = addBrandHeader(doc, { title: 'Cross-Condition Analysis', date });

  // Total employment impact across all conditions
  const totalHoursLost = bundles.reduce((sum, b) => sum + b.totalEmploymentHoursLost, 0);
  const totalEmpEntries = bundles.reduce((sum, b) => sum + b.employmentImpact.length, 0);
  const totalMeds = new Set(bundles.flatMap(b => b.medications.map(m => m.name)));

  y = addStatBox(doc, [
    { label: 'Total Hours Lost (All)', value: String(totalHoursLost) },
    { label: 'Employment Entries (All)', value: String(totalEmpEntries) },
    { label: 'Unique Medications', value: String(totalMeds.size) },
    { label: 'Conditions Tracked', value: String(bundles.length) },
  ], y);

  // Medication burden
  if (totalMeds.size > 0) {
    y = addSubsectionHeading(doc, 'Medication Burden', y);
    y = addSelfReportedLabel(doc, y);
    const allMeds = bundles.flatMap(b => b.medications);
    const activeMeds = allMeds.filter(m => m.stillTaking);
    const withSideEffects = activeMeds.filter(m => m.sideEffects);
    y = addKeyValue(doc, 'Active Medications', String(activeMeds.length), y);
    y = addKeyValue(doc, 'With Side Effects', String(withSideEffects.length), y);
    if (withSideEffects.length > 0) {
      const sideEffectItems = withSideEffects.map(m => `${m.name}: ${m.sideEffects}`);
      y = addBulletList(doc, sideEffectItems, y);
    }
  }

  // Overlapping symptoms
  const symptomConditionMap = new Map<string, string[]>();
  for (const bundle of bundles) {
    for (const stat of bundle.symptomFrequencyStats) {
      const existing = symptomConditionMap.get(stat.symptomName) || [];
      existing.push(bundle.displayName);
      symptomConditionMap.set(stat.symptomName, existing);
    }
  }
  const overlapping = Array.from(symptomConditionMap.entries())
    .filter(([, conditions]) => conditions.length > 1);

  if (overlapping.length > 0) {
    y = addSubsectionHeading(doc, 'Overlapping Symptoms', y);
    const overlapItems = overlapping.map(([symptom, conditions]) =>
      `${symptom}: affects ${conditions.join(', ')}`
    );
    y = addBulletList(doc, overlapItems, y);
  }

  // ── Evidence Readiness Scorecard ──
  doc.addPage();
  y = addBrandHeader(doc, { title: 'Evidence Readiness Scorecard', date });

  const scorecardRows: TableRow[] = bundles.map(b => {
    const hasSymptoms = b.symptoms.length > 0 || b.ptsdSymptoms.length > 0 || b.migraines.length > 0 || b.sleepEntries.length > 0;
    const hasVisits = b.medicalVisits.length > 0;
    const hasMeds = b.medications.length > 0;
    const hasBuddies = b.buddyContacts.length > 0;
    const hasImpact = b.employmentImpact.length > 0;
    const checkCount = [hasSymptoms, hasVisits, hasMeds, hasBuddies, hasImpact].filter(Boolean).length;

    return {
      cells: [
        b.displayName,
        hasSymptoms ? 'Yes' : 'No',
        hasVisits ? 'Yes' : 'No',
        hasMeds ? 'Yes' : 'No',
        hasBuddies ? 'Yes' : 'No',
        hasImpact ? 'Yes' : 'No',
        `${checkCount}/5`,
      ],
    };
  });

  y = addTable(doc, [
    { header: 'Condition', width: 120 },
    { header: 'Symptoms', width: 60 },
    { header: 'Visits', width: 50 },
    { header: 'Meds', width: 50 },
    { header: 'Buddies', width: 55 },
    { header: 'Work Impact', width: 65 },
    { header: 'Score', width: 50 },
  ], scorecardRows, y);

  // Gaps summary
  const allGaps: string[] = [];
  for (const b of bundles) {
    if (b.symptoms.length === 0 && b.ptsdSymptoms.length === 0 && b.migraines.length === 0 && b.sleepEntries.length === 0) {
      allGaps.push(`${b.displayName}: No symptom/condition-specific logs`);
    }
    if (b.medicalVisits.length === 0) {
      allGaps.push(`${b.displayName}: No medical visits linked`);
    }
    if (b.employmentImpact.length === 0) {
      allGaps.push(`${b.displayName}: No employment impact entries`);
    }
  }

  if (allGaps.length > 0) {
    y = addSubsectionHeading(doc, 'Evidence Gaps', y);
    y = addHighlightBox(doc,
      'The following areas need additional documentation. Filling these gaps before your C&P exam or claim submission can strengthen your case.',
      y,
      { type: 'warning', label: 'Action Items' },
    );
    y = addBulletList(doc, allGaps, y);
  }

  return finalizePDF(doc, state);
}

/**
 * Generate filename for a unified claim packet PDF.
 */
export function getUnifiedPacketFilename(): string {
  const date = new Date().toISOString().slice(0, 10);
  return `vcs-claim-packet-${date}.pdf`;
}
