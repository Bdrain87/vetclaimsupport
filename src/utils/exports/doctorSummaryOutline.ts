/**
 * Doctor Summary Outline - Condition-Centric PDF Export
 *
 * A professional, branded PDF that a veteran can print and bring to
 * a medical appointment. Auto-populates from logged data, organized
 * around a single condition and its related DBQ sections.
 *
 * Legal: "Patient-Organized Clinical Information" with PATIENT-PREPARED watermark.
 * Never uses "nexus" or pre-fills medical opinions.
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

// ── Clinician Question Generators ───────────────────────────────

function getClinicianQuestions(bundle: ConditionDataBundle): string[] {
  const questions: string[] = [];
  const cat = bundle.conditionCategory;

  // Universal questions
  questions.push('Based on your clinical evaluation, what is the current diagnosis and severity?');
  questions.push('In your clinical opinion, how does this condition affect the patient\'s daily functioning?');

  if (cat === 'mental_health') {
    questions.push('What level of occupational and social impairment do you observe?');
    questions.push('Are the symptoms consistent with the patient\'s reported stressor history?');
    questions.push('Does the patient require continuous medication for symptom management?');
  } else if (cat === 'musculoskeletal') {
    questions.push('What is the current range of motion, and does pain further limit function during flare-ups?');
    questions.push('Does the patient require assistive devices for ambulation?');
    questions.push('Are there additional functional limitations during flare-ups beyond what is observed today?');
  } else if (cat === 'sleep') {
    questions.push('Does the clinical evidence support a diagnosis requiring CPAP or other breathing assistance device?');
    questions.push('Is there evidence of persistent daytime hypersomnolence despite treatment?');
    questions.push('What impact does this condition have on the patient\'s occupational capacity?');
  } else if (cat === 'migraine') {
    questions.push('Based on the frequency data presented, how would you characterize the prostrating attack frequency?');
    questions.push('Are the attacks completely prostrating, and how often do they occur?');
    questions.push('What is the economic impact of these attacks on the patient\'s employment?');
  }

  // If secondary connection
  if (bundle.userCondition.connectionType === 'secondary' || bundle.userCondition.secondaryTo) {
    questions.push('In your clinical opinion, is there a relationship between this condition and the patient\'s other documented conditions?');
  }

  return questions;
}

// ── Main Export Function ────────────────────────────────────────

/**
 * Generate a Doctor Summary Outline PDF for a single condition.
 */
export async function generateDoctorSummaryPDF(uc: UserCondition): Promise<Blob> {
  const bundle = assembleConditionData(uc);

  // Guard all free text
  const freeTexts = [
    ...bundle.symptoms.map(s => s.notes),
    ...bundle.symptoms.map(s => s.dailyImpact),
    ...bundle.medications.map(m => m.sideEffects),
    ...bundle.ptsdSymptoms.map(p => p.notes),
    ...bundle.ptsdSymptoms.map(p => p.occupationalImpairment),
    ...bundle.ptsdSymptoms.map(p => p.socialImpairment),
    ...bundle.employmentImpact.map(e => e.description),
    ...bundle.majorEvents.map(e => e.description),
  ].filter(Boolean).join(' ');
  if (freeTexts) assertExportClean(freeTexts);

  const { doc, state } = await createPDFDoc({ watermark: true, doctorFacing: true });

  let y = addBrandHeader(doc, {
    title: 'Doctor Summary Outline',
    subtitle: `Condition: ${bundle.displayName}`,
  });

  // ── Section 1: Patient & Service Overview ──
  y = addSectionHeading(doc, 'Patient & Service Overview', y);
  y = addKeyValue(doc, 'Name', `${bundle.veteran.firstName} ${bundle.veteran.lastName}`, y);
  y = addKeyValue(doc, 'Branch', bundle.veteran.branchLabel || 'Not specified', y);
  if (bundle.veteran.specialtyCode) {
    y = addKeyValue(doc, bundle.veteran.specialtyLabel, `${bundle.veteran.specialtyCode} - ${bundle.veteran.specialtyTitle}`, y);
  }
  if (bundle.veteran.serviceDates) {
    y = addKeyValue(doc, 'Service Dates', `${safeDate(bundle.veteran.serviceDates.start)} - ${safeDate(bundle.veteran.serviceDates.end)}`, y);
  }
  if (bundle.veteran.claimType) {
    y = addKeyValue(doc, 'Claim Type', bundle.veteran.claimType, y);
  }

  // ── Section 2: Condition Under Discussion ──
  y = addSectionHeading(doc, 'Condition Under Discussion', y);
  y = addKeyValue(doc, 'Condition', bundle.displayName, y);
  if (bundle.vaCondition?.diagnosticCode) {
    y = addKeyValue(doc, 'Diagnostic Code', bundle.vaCondition.diagnosticCode, y);
  }
  y = addKeyValue(doc, 'Connection Type', bundle.userCondition.connectionType || 'Not specified', y);
  if (bundle.userCondition.secondaryTo) {
    y = addKeyValue(doc, 'Secondary To', bundle.userCondition.secondaryTo, y);
  }
  if (bundle.userCondition.claimStatus) {
    y = addKeyValue(doc, 'Claim Status', bundle.userCondition.claimStatus, y);
  }

  // ── Section 3: Relevant Service History ──
  y = addSectionHeading(doc, 'Relevant Service History', y);

  if (bundle.serviceHistory.length > 0) {
    const stationRows: TableRow[] = bundle.serviceHistory.map(s => ({
      cells: [s.base, s.unit, safeDate(s.startDate) + ' - ' + safeDate(s.endDate), s.hazards || 'None noted'],
    }));
    y = addTable(doc, [
      { header: 'Installation', width: 130 },
      { header: 'Unit', width: 100 },
      { header: 'Dates', width: 130 },
      { header: 'Hazards', width: 130 },
    ], stationRows, y);
  }

  if (bundle.deployments.length > 0) {
    y = addSubsectionHeading(doc, 'Deployments', y);
    for (const dep of bundle.deployments) {
      y = addKeyValue(doc, dep.operationName || 'Deployment', `${dep.location} (${safeDate(dep.startDate)} - ${safeDate(dep.endDate)})`, y);
      if (dep.combatDeployment) {
        y = addKeyValue(doc, 'Combat Deployment', 'Yes', y);
      }
      if (dep.hazardsEncountered) {
        y = addKeyValue(doc, 'Hazards', dep.hazardsEncountered, y);
      }
    }
  }

  if (bundle.exposures.length > 0) {
    y = addSubsectionHeading(doc, 'Exposures', y);
    const expRows: TableRow[] = bundle.exposures.map(e => ({
      cells: [e.type, e.location, e.duration, e.ppeProvided ? 'Yes' : 'No'],
    }));
    y = addTable(doc, [
      { header: 'Type', width: 120 },
      { header: 'Location', width: 140 },
      { header: 'Duration', width: 100 },
      { header: 'PPE Provided', width: 80 },
    ], expRows, y);
  }

  if (bundle.majorEvents.length > 0) {
    y = addSubsectionHeading(doc, 'Significant Events', y);
    for (const event of bundle.majorEvents) {
      y = addKeyValue(doc, `${event.type} (${safeDate(event.date)})`, event.title, y);
      if (event.description) {
        y = addHighlightBox(doc, event.description, y);
      }
    }
  }

  if (bundle.serviceHistory.length === 0 && bundle.deployments.length === 0 && bundle.exposures.length === 0) {
    y = addNotYetDocumented(doc, 'Service history details', y);
  }

  // ── Section 4: Symptom Pattern Summary (90 days, auto-populated) ──
  y = addSectionHeading(doc, 'Symptom Pattern Summary (90-Day Window)', y);
  y = addSelfReportedLabel(doc, y);

  // Log coverage stats
  y = addStatBox(doc, [
    { label: '30-Day Entries', value: String(bundle.logCoverage.last30Days) },
    { label: '90-Day Entries', value: String(bundle.logCoverage.last90Days) },
    { label: '180-Day Entries', value: String(bundle.logCoverage.last180Days) },
    { label: 'Severity Trend', value: bundle.severityTrend === 'insufficient_data' ? 'N/A' : bundle.severityTrend },
  ], y);

  // Condition-specific sections from strategy
  const strategy = getConditionStrategy(bundle.conditionCategory);
  y = strategy.renderSections(doc, bundle, y);

  // ── Section 5: Current Treatment ──
  y = addSectionHeading(doc, 'Current Treatment', y);
  if (bundle.medications.length > 0) {
    y = addSelfReportedLabel(doc, y);
    const activeMeds = bundle.medications.filter(m => m.stillTaking);
    const pastMeds = bundle.medications.filter(m => !m.stillTaking);

    if (activeMeds.length > 0) {
      y = addSubsectionHeading(doc, 'Active Medications', y);
      const medRows: TableRow[] = activeMeds.map(m => ({
        cells: [
          m.name,
          m.dosage || 'N/A',
          m.effectiveness === 'effective' ? 'Effective' : m.effectiveness === 'partially_effective' ? 'Partially' : m.effectiveness === 'not_effective' ? 'Not Effective' : 'N/A',
          m.sideEffects || 'None reported',
        ],
      }));
      y = addTable(doc, [
        { header: 'Medication', width: 130 },
        { header: 'Dosage', width: 80 },
        { header: 'Effectiveness', width: 90 },
        { header: 'Side Effects', width: 190 },
      ], medRows, y);
    }

    // On-med vs off-med comparison
    const withComparison = bundle.medications.filter(m => m.functionalImpactOnMed || m.functionalImpactOffMed);
    if (withComparison.length > 0) {
      y = addSubsectionHeading(doc, 'Medication Impact Comparison', y);
      y = addSelfReportedLabel(doc, y);
      for (const med of withComparison) {
        if (med.functionalImpactOnMed) {
          y = addKeyValue(doc, `With ${med.name}`, med.functionalImpactOnMed, y);
        }
        if (med.functionalImpactOffMed) {
          y = addKeyValue(doc, `Without ${med.name}`, med.functionalImpactOffMed, y);
        }
      }
    }

    if (pastMeds.length > 0) {
      y = addSubsectionHeading(doc, 'Discontinued Medications', y);
      const pastRows: TableRow[] = pastMeds.map(m => ({
        cells: [m.name, safeDate(m.startDate) + ' - ' + safeDate(m.endDate), m.sideEffects || 'N/A'],
      }));
      y = addTable(doc, [
        { header: 'Medication', width: 150 },
        { header: 'Dates', width: 160 },
        { header: 'Side Effects / Reason Stopped', width: 180 },
      ], pastRows, y);
    }
  } else {
    y = addNotYetDocumented(doc, 'Medication entries', y);
  }

  // Medical visits
  if (bundle.medicalVisits.length > 0) {
    y = addSubsectionHeading(doc, 'Recent Medical Visits', y);
    y = addSelfReportedLabel(doc, y);
    const recentVisits = bundle.medicalVisits
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
    const visitRows: TableRow[] = recentVisits.map(v => ({
      cells: [safeDate(v.date), v.visitType, v.provider || 'N/A', v.reason || ''],
    }));
    y = addTable(doc, [
      { header: 'Date', width: 80 },
      { header: 'Type', width: 90 },
      { header: 'Provider', width: 140 },
      { header: 'Reason', width: 180 },
    ], visitRows, y);
  }

  // ── Section 6: Functional & Employment Impact ──
  y = addSectionHeading(doc, 'Functional & Employment Impact', y);
  if (bundle.employmentImpact.length > 0 || bundle.totalEmploymentHoursLost > 0) {
    y = addSelfReportedLabel(doc, y);
    y = addStatBox(doc, [
      { label: 'Total Hours Lost', value: String(bundle.totalEmploymentHoursLost) },
      { label: 'Impact Entries', value: String(bundle.employmentImpact.length) },
    ], y);

    // Recent impact descriptions
    const recentImpacts = bundle.employmentImpact
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    const impactItems = recentImpacts.map(e =>
      `${safeDate(e.date)}: ${EMPLOYMENT_IMPACT_TYPES[e.type] || e.type} - ${e.description} (${e.hoursLost}h lost)`
    );
    y = addBulletList(doc, impactItems, y);
  }

  // Daily activity limitations from symptoms
  const dailyImpactEntries = bundle.symptoms
    .filter(s => s.dailyImpact)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  if (dailyImpactEntries.length > 0) {
    y = addSubsectionHeading(doc, 'Daily Activity Limitations', y);
    y = addSelfReportedLabel(doc, y);
    const items = dailyImpactEntries.map(s => `${safeDate(s.date)}: ${s.dailyImpact}`);
    y = addBulletList(doc, items, y);
  }

  if (bundle.employmentImpact.length === 0 && dailyImpactEntries.length === 0) {
    y = addNotYetDocumented(doc, 'Employment and daily impact data', y);
  }

  // ── Section 7: Evidence Inventory ──
  y = addSectionHeading(doc, 'Evidence Inventory', y);

  if (bundle.buddyContacts.length > 0) {
    y = addSubsectionHeading(doc, 'Buddy Statement Contacts', y);
    const buddyRows: TableRow[] = bundle.buddyContacts.map(b => ({
      cells: [b.name, b.relationship, b.statementStatus, b.whatTheyWitnessed || ''],
    }));
    y = addTable(doc, [
      { header: 'Name', width: 120 },
      { header: 'Relationship', width: 100 },
      { header: 'Status', width: 90 },
      { header: 'What They Witnessed', width: 180 },
    ], buddyRows, y);
  }

  if (bundle.evidenceDocuments.length > 0) {
    y = addSubsectionHeading(doc, 'Uploaded Documents', y);
    const docRows: TableRow[] = bundle.evidenceDocuments.map(ed => ({
      cells: [ed.title || ed.fileName, ed.category, safeDate(ed.uploadedAt)],
    }));
    y = addTable(doc, [
      { header: 'Document', width: 220 },
      { header: 'Category', width: 130 },
      { header: 'Uploaded', width: 100 },
    ], docRows, y);
  }

  if (bundle.buddyContacts.length === 0 && bundle.evidenceDocuments.length === 0) {
    y = addNotYetDocumented(doc, 'Supporting evidence', y);
  }

  // ── Section 8: Questions for the Clinician ──
  y = addSectionHeading(doc, 'Questions for the Clinician', y);
  y = addHighlightBox(doc,
    'The following open-ended questions are provided to help guide a productive clinical discussion. They are not suggestive of any particular outcome.',
    y,
    { label: 'Note', type: 'info' },
  );
  const questions = getClinicianQuestions(bundle);
  const numberedQuestions = questions.map((q, i) => `${i + 1}. ${q}`);
  y = addBulletList(doc, numberedQuestions, y);

  // ── Section 9: Personal Notes from Veteran ──
  y = addSectionHeading(doc, 'Personal Notes from Veteran', y);
  y = addHighlightBox(doc,
    'This section is reserved for the veteran to add personal notes or context they wish to share with their clinician. Use the space below during your appointment.',
    y,
  );
  // Add some blank lines for handwriting
  y = checkPageBreak(doc, y, 60);
  for (let i = 0; i < 4; i++) {
    doc.setDrawColor(...PDF_BRAND.border);
    doc.setLineWidth(0.3);
    doc.line(20, y, doc.internal.pageSize.getWidth() - 20, y);
    y += 18;
  }

  return finalizePDF(doc, state);
}

/**
 * Generate the filename for a doctor summary PDF.
 */
export function getDoctorSummaryFilename(conditionName: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const safeName = conditionName.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
  return `vcs-doctor-summary-${safeName}-${date}.pdf`;
}
