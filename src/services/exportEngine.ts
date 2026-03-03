import { format } from 'date-fns';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { getAllBranchLabels } from '@/utils/veteranProfile';
import { getConditionById } from '@/data/vaConditions';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import type { UserCondition } from '@/store/useAppStore';
import type {
  ClaimCondition,
  QuickLogEntry,
  MedicalVisit,
  SymptomEntry,
  Medication,
  SleepEntry,
  MigraineEntry,
  ServiceEntry,
  Exposure,
  BuddyContact,
  DocumentItem,
  DeploymentEntry,
  CombatEntry,
  MajorEvent,
  PTSDSymptomEntry,
  EmploymentImpactEntry,
} from '@/types/claims';

// ============================================================================
// Types
// ============================================================================

export interface ExportSections {
  personalInfo: boolean;
  conditions: boolean;
  evidenceChecklist: boolean;
  healthLogs: boolean;
  generatedDocs: boolean;
  formDrafts: boolean;
  romMeasurements: boolean;
  timeline: boolean;
}

function safeDate(dateStr: string | undefined | null): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
}

export type ExportFormat = 'pdf' | 'text' | 'json';

export interface ExportOptions {
  sections: ExportSections;
  format: ExportFormat;
}

export interface ExportResult {
  content: string | Blob;
  filename: string;
  mimeType: string;
}

// ============================================================================
// PDF Color palette (from tokens.ts Dress Blues)
// ============================================================================

const PDF_COLORS = {
  navy: [0, 0, 0] as [number, number, number],
  navyLight: [26, 26, 26] as [number, number, number],
  blue: [59, 130, 246] as [number, number, number],
  textPrimary: [248, 250, 252] as [number, number, number],
  textDark: [15, 23, 42] as [number, number, number],
  textSecondary: [71, 85, 105] as [number, number, number],
  textMuted: [100, 116, 139] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
  background: [241, 245, 249] as [number, number, number],
  success: [16, 185, 129] as [number, number, number],
  warning: [245, 158, 11] as [number, number, number],
  danger: [239, 68, 68] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  watermark: [200, 210, 225] as [number, number, number],
};

// ============================================================================
// Data Gathering
// ============================================================================

interface GatheredData {
  // Profile
  firstName: string;
  lastName: string;
  branch: string;
  mosCode: string;
  mosTitle: string;
  serviceDates?: { start: string; end: string };
  claimType?: string;
  separationDate?: string;

  // App data
  userConditions: UserCondition[];
  claimConditions: ClaimCondition[];
  documents: DocumentItem[];
  quickLogs: QuickLogEntry[];
  medicalVisits: MedicalVisit[];
  symptoms: SymptomEntry[];
  medications: Medication[];
  sleepEntries: SleepEntry[];
  migraines: MigraineEntry[];
  serviceHistory: ServiceEntry[];
  exposures: Exposure[];
  buddyContacts: BuddyContact[];
  deployments: DeploymentEntry[];
  combatHistory: CombatEntry[];
  majorEvents: MajorEvent[];
  ptsdSymptoms: PTSDSymptomEntry[];
  employmentImpact: EmploymentImpactEntry[];
  dutyStations: { id: string; baseName: string; startDate: string; endDate: string }[];
  formDrafts: Record<string, Record<string, string> & { lastModified: string }>;
}

function gatherData(): GatheredData {
  const appState = useAppStore.getState();
  const profileState = useProfileStore.getState();

  return {
    firstName: profileState.firstName,
    lastName: profileState.lastName,
    branch: getAllBranchLabels(profileState) || '',
    mosCode: profileState.mosCode,
    mosTitle: profileState.mosTitle,
    serviceDates: profileState.serviceDates,
    claimType: profileState.claimType,
    separationDate: profileState.separationDate,

    userConditions: appState.userConditions,
    claimConditions: appState.claimConditions,
    documents: appState.documents,
    quickLogs: appState.quickLogs,
    medicalVisits: appState.medicalVisits,
    symptoms: appState.symptoms,
    medications: appState.medications,
    sleepEntries: appState.sleepEntries,
    migraines: appState.migraines,
    serviceHistory: appState.serviceHistory,
    exposures: appState.exposures,
    buddyContacts: appState.buddyContacts,
    deployments: appState.deployments,
    combatHistory: appState.combatHistory,
    majorEvents: appState.majorEvents,
    ptsdSymptoms: appState.ptsdSymptoms,
    employmentImpact: appState.employmentImpactEntries || [],
    dutyStations: appState.dutyStations || [],
    formDrafts: appState.formDrafts,
  };
}

// ============================================================================
// Main Export Function
// ============================================================================

export async function generateExport(options: ExportOptions): Promise<ExportResult> {
  const data = gatherData();
  const dateStr = format(new Date(), 'yyyy-MM-dd');

  switch (options.format) {
    case 'json':
      return generateJSON(data, options.sections, dateStr);
    case 'text':
      return generateText(data, options.sections, dateStr);
    case 'pdf':
      return generatePDF(data, options.sections, dateStr);
    default:
      return generateText(data, options.sections, dateStr);
  }
}

// ============================================================================
// JSON Format
// ============================================================================

function generateJSON(
  data: GatheredData,
  sections: ExportSections,
  dateStr: string
): ExportResult {
  const output: Record<string, unknown> = {
    exportInfo: {
      generatedAt: new Date().toISOString(),
      format: 'json',
      application: 'Vet Claim Support',
      disclaimer: 'DRAFT - NOT AN OFFICIAL VA DOCUMENT',
    },
  };

  if (sections.personalInfo) {
    output.personalInfo = {
      name: `${data.firstName} ${data.lastName}`.trim() || 'Not provided',
      branch: data.branch || 'Not provided',
      mos: data.mosCode ? `${data.mosCode} - ${data.mosTitle}` : 'Not provided',
      serviceDates: data.serviceDates || null,
      separationDate: data.separationDate || null,
      claimType: data.claimType || null,
      dutyStations: data.dutyStations,
    };
  }

  if (sections.conditions) {
    output.conditions = {
      userConditions: data.userConditions.map((c) => {
        const vaInfo = getConditionById(c.conditionId);
        return {
          name: vaInfo?.name || getConditionDisplayName(c),
          diagnosticCode: vaInfo?.diagnosticCode || 'N/A',
          rating: c.rating ?? null,
          serviceConnected: c.serviceConnected,
          claimStatus: c.claimStatus,
          isPrimary: c.isPrimary,
          dateAdded: c.dateAdded,
        };
      }),
      claimConditions: data.claimConditions.map((c) => ({
        name: c.name,
        linkedMedicalVisits: c.linkedMedicalVisits.length,
        linkedExposures: c.linkedExposures.length,
        linkedSymptoms: c.linkedSymptoms.length,
        linkedDocuments: c.linkedDocuments.length,
        linkedBuddyContacts: c.linkedBuddyContacts.length,
        notes: c.notes,
      })),
    };
  }

  if (sections.evidenceChecklist) {
    output.evidenceChecklist = data.documents.map((d) => ({
      name: d.name,
      status: d.status,
      count: d.count,
      notes: d.notes,
    }));
  }

  if (sections.healthLogs) {
    output.healthLogs = {
      quickLogs: data.quickLogs,
      symptoms: data.symptoms,
      medications: data.medications,
      sleepEntries: data.sleepEntries,
      migraines: data.migraines,
      ptsdSymptoms: data.ptsdSymptoms,
      employmentImpact: data.employmentImpact,
    };
  }

  if (sections.generatedDocs) {
    output.generatedDocs = {
      buddyContacts: data.buddyContacts,
      note: 'Generated documents are stored within the app. Buddy contacts listed here may have associated buddy statement drafts.',
    };
  }

  if (sections.formDrafts) {
    const draftsForExport: Record<string, Record<string, string>> = {};
    Object.entries(data.formDrafts).forEach(([formId, fields]) => {
      const { lastModified, ...fieldValues } = fields;
      const hasContent = Object.values(fieldValues).some((v) => v && v.trim());
      if (hasContent) {
        draftsForExport[formId] = { ...fieldValues, lastModified };
      }
    });
    output.formDrafts =
      Object.keys(draftsForExport).length > 0
        ? draftsForExport
        : { note: 'No form drafts recorded yet' };
  }

  if (sections.romMeasurements) {
    output.romMeasurements = { note: 'No ROM measurement data recorded yet' };
  }

  if (sections.timeline) {
    output.timeline = buildTimelineData(data);
  }

  const content = JSON.stringify(output, null, 2);
  return {
    content,
    filename: `VCS-Export-${dateStr}.json`,
    mimeType: 'application/json',
  };
}

// ============================================================================
// Plain Text Format
// ============================================================================

function generateText(
  data: GatheredData,
  sections: ExportSections,
  dateStr: string
): ExportResult {
  const lines: string[] = [];
  const divider = '═'.repeat(60);
  const subDivider = '─'.repeat(60);

  lines.push(divider);
  lines.push('  VET CLAIM SUPPORT');
  lines.push('  Claim Preparation Packet');
  lines.push(`  Generated: ${format(new Date(), 'MMMM d, yyyy')}`);
  lines.push(divider);
  lines.push('');
  lines.push('  DRAFT — NOT AN OFFICIAL VA DOCUMENT');
  lines.push('');

  let sectionNum = 1;

  // 1. Personal Information
  if (sections.personalInfo) {
    lines.push(`${sectionNum}. PERSONAL INFORMATION`);
    lines.push(subDivider);
    lines.push(`  Name: ${`${data.firstName} ${data.lastName}`.trim() || 'Not provided'}`);
    lines.push(`  Branch: ${data.branch || 'Not provided'}`);
    lines.push(`  MOS: ${data.mosCode ? `${data.mosCode} — ${data.mosTitle}` : 'Not provided'}`);
    if (data.serviceDates) {
      lines.push(`  Service Dates: ${data.serviceDates.start} to ${data.serviceDates.end || 'Present'}`);
    }
    if (data.separationDate) {
      lines.push(`  Separation Date: ${data.separationDate}`);
    }
    if (data.claimType) {
      lines.push(`  Claim Type: ${data.claimType}`);
    }
    if (data.dutyStations.length > 0) {
      lines.push('  Duty Stations:');
      data.dutyStations.forEach((ds) => {
        lines.push(`    • ${ds.baseName} (${safeDate(ds.startDate)} – ${safeDate(ds.endDate)})`);
      });
    }
    lines.push('');
    sectionNum++;
  }

  // 2. Conditions & Ratings
  if (sections.conditions) {
    lines.push(`${sectionNum}. CONDITIONS & RATINGS`);
    lines.push(subDivider);
    if (data.userConditions.length === 0 && data.claimConditions.length === 0) {
      lines.push('  No conditions recorded yet.');
    } else {
      data.userConditions.forEach((c) => {
        const vaInfo = getConditionById(c.conditionId);
        const name = vaInfo?.name || getConditionDisplayName(c);
        const dc = vaInfo?.diagnosticCode || 'N/A';
        lines.push(`  • ${name} — DC ${dc}`);
        lines.push(`    Rating: ${c.rating != null ? `${c.rating}%` : 'Pending'} | Status: ${c.claimStatus} | ${c.isPrimary ? 'Primary' : 'Secondary'}`);
      });
      if (data.claimConditions.length > 0) {
        lines.push('');
        lines.push('  Claim Builder Conditions:');
        data.claimConditions.forEach((c) => {
          lines.push(`  • ${c.name}`);
          if (c.notes) lines.push(`    Notes: ${c.notes}`);
        });
      }
    }
    lines.push('');
    sectionNum++;
  }

  // 3. Evidence Checklist
  if (sections.evidenceChecklist) {
    lines.push(`${sectionNum}. EVIDENCE CHECKLIST`);
    lines.push(subDivider);
    data.documents.forEach((d) => {
      const check = d.status === 'Obtained' || d.status === 'Submitted' ? '✓' : '✗';
      lines.push(`  [${check}] ${d.name} — ${d.status}${d.count > 0 ? ` (${d.count})` : ''}`);
    });
    lines.push('');
    sectionNum++;
  }

  // 4. Health Log Summary
  if (sections.healthLogs) {
    lines.push(`${sectionNum}. HEALTH LOG SUMMARY`);
    lines.push(subDivider);

    // Quick Logs
    if (data.quickLogs.length > 0) {
      lines.push(`  Daily Logs: ${data.quickLogs.length} entries`);
      const avgPain = (data.quickLogs.reduce((s, l) => s + (l.painLevel || l.overallFeeling || 0), 0) / data.quickLogs.length).toFixed(1);
      lines.push(`  Average Pain Level: ${avgPain}/10`);
      const flareUps = data.quickLogs.filter((l) => l.hadFlareUp).length;
      lines.push(`  Flare-Ups Recorded: ${flareUps}`);
      lines.push('');
    }

    // Symptoms
    if (data.symptoms.length > 0) {
      lines.push(`  Symptom Entries: ${data.symptoms.length}`);
      const avgSev = (data.symptoms.reduce((s, e) => s + (e.severity || 0), 0) / data.symptoms.length).toFixed(1);
      lines.push(`  Average Severity: ${avgSev}/10`);
      const severe = data.symptoms.filter((s) => s.severity >= 7).length;
      lines.push(`  Severe Episodes (7+): ${severe}`);
      lines.push('');
    }

    // Medications
    if (data.medications.length > 0) {
      const current = data.medications.filter((m) => m.stillTaking);
      lines.push(`  Medications: ${current.length} current, ${data.medications.length - current.length} past`);
      current.forEach((m) => {
        lines.push(`    • ${m.name} — for ${m.prescribedFor || 'N/A'}`);
      });
      lines.push('');
    }

    // Sleep
    if (data.sleepEntries.length > 0) {
      const avgSleep = (data.sleepEntries.reduce((s, e) => s + (e.hoursSlept || 0), 0) / data.sleepEntries.length).toFixed(1);
      lines.push(`  Sleep Log: ${data.sleepEntries.length} entries, avg ${avgSleep} hrs/night`);
      const cpap = data.sleepEntries.filter((e) => e.usesCPAP).length;
      if (cpap > 0) lines.push(`  CPAP Usage: ${cpap} nights`);
      lines.push('');
    }

    // Migraines
    if (data.migraines.length > 0) {
      const prostrating = data.migraines.filter((m) => m.wasProstrating).length;
      lines.push(`  Migraine Log: ${data.migraines.length} entries`);
      lines.push(`  Prostrating Episodes: ${prostrating}`);
      const workImpact = data.migraines.filter((m) => m.couldNotWork).length;
      lines.push(`  Work Impact Episodes: ${workImpact}`);
      lines.push('');
    }

    // Employment Impact
    if (data.employmentImpact.length > 0) {
      const totalHours = data.employmentImpact.reduce((s, e) => s + e.hoursLost, 0);
      lines.push(`  Employment Impact: ${data.employmentImpact.length} entries`);
      lines.push(`  Total Hours Lost: ${totalHours}`);
      lines.push('');
    }

    if (
      data.quickLogs.length === 0 &&
      data.symptoms.length === 0 &&
      data.medications.length === 0 &&
      data.sleepEntries.length === 0 &&
      data.migraines.length === 0 &&
      data.employmentImpact.length === 0
    ) {
      lines.push('  No health log data recorded yet.');
      lines.push('');
    }
    sectionNum++;
  }

  // 5. Generated Documents
  if (sections.generatedDocs) {
    lines.push(`${sectionNum}. GENERATED DOCUMENTS`);
    lines.push(subDivider);
    if (data.buddyContacts.length > 0) {
      lines.push('  Buddy Contacts / Statement Status:');
      data.buddyContacts.forEach((b) => {
        lines.push(`  • ${b.rank ? `${b.rank} ` : ''}${b.name} — ${b.statementStatus}`);
        if (b.whatTheyWitnessed) lines.push(`    Witnessed: ${b.whatTheyWitnessed}`);
      });
    } else {
      lines.push('  No generated documents recorded yet.');
    }
    lines.push('');
    sectionNum++;
  }

  // 6. Form Drafts
  if (sections.formDrafts) {
    lines.push(`${sectionNum}. FORM DRAFTS`);
    lines.push(subDivider);
    const draftEntries = Object.entries(data.formDrafts);
    const nonEmpty = draftEntries.filter(([, fields]) => {
      const { lastModified: _lastModified, ...vals } = fields;
      return Object.values(vals).some((v) => v && v.trim());
    });

    if (nonEmpty.length === 0) {
      lines.push('  No form drafts recorded yet.');
    } else {
      nonEmpty.forEach(([formId, fields]) => {
        lines.push(`  Form: ${formId}`);
        const { lastModified: _lastModified, ...vals } = fields;
        Object.entries(vals).forEach(([fieldId, value]) => {
          if (value && value.trim()) {
            lines.push(`    ${fieldId}: ${value}`);
          }
        });
        lines.push('');
      });
    }
    lines.push('');
    sectionNum++;
  }

  // 7. ROM Measurements
  if (sections.romMeasurements) {
    lines.push(`${sectionNum}. ROM MEASUREMENTS`);
    lines.push(subDivider);
    lines.push('  No ROM measurement data recorded yet.');
    lines.push('');
    sectionNum++;
  }

  // 8. Timeline
  if (sections.timeline) {
    lines.push(`${sectionNum}. TIMELINE NARRATIVE`);
    lines.push(subDivider);
    const timeline = buildTimelineData(data);
    if (timeline.length === 0) {
      lines.push('  No timeline data available yet.');
    } else {
      timeline.forEach((event) => {
        lines.push(`  ${event.date} | [${event.type}] ${event.description}`);
      });
    }
    lines.push('');
  }

  // Footer
  lines.push(divider);
  lines.push('  DRAFT WORKSHEET — NOT A VA SUBMISSION');
  lines.push('  Vet Claim Support — Claim Preparation Tools');
  lines.push(divider);

  const content = lines.join('\n');
  return {
    content,
    filename: `VCS-Export-${dateStr}.txt`,
    mimeType: 'text/plain',
  };
}

// ============================================================================
// PDF Format
// ============================================================================

async function generatePDF(
  data: GatheredData,
  sections: ExportSections,
  dateStr: string
): Promise<ExportResult> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // --- Helpers ---
  const addWatermark = () => {
    doc.setFontSize(9);
    doc.setTextColor(...PDF_COLORS.watermark);
    doc.setFont('helvetica', 'italic');
    doc.text('DRAFT — NOT AN OFFICIAL VA DOCUMENT', pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.setFont('helvetica', 'normal');
  };

  const addFooter = () => {
    doc.setFontSize(7);
    doc.setTextColor(...PDF_COLORS.textMuted);
    doc.text('Vet Claim Support — Claim Preparation Tools', pageWidth / 2, pageHeight - 8, { align: 'center' });
  };

  const checkPageBreak = (needed: number): number => {
    if (y + needed > pageHeight - 30) {
      doc.addPage();
      addWatermark();
      addFooter();
      return 20;
    }
    return y;
  };

  const addSectionHeader = (title: string) => {
    y = checkPageBreak(20);
    doc.setFillColor(...PDF_COLORS.navy);
    doc.roundedRect(margin, y - 4, contentWidth, 12, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setTextColor(...PDF_COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 6, y + 4);
    doc.setFont('helvetica', 'normal');
    y += 14;
  };

  // --- Page 1 Header ---
  // Navy header bar
  doc.setFillColor(...PDF_COLORS.navy);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Blue accent line
  doc.setFillColor(...PDF_COLORS.blue);
  doc.rect(0, 40, pageWidth, 2, 'F');

  // Header text
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.text('VET CLAIM SUPPORT', margin, 18);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Claim Preparation Packet', margin, 28);

  doc.setFontSize(9);
  doc.text(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, margin, 36);

  // Watermark + footer on first page
  addWatermark();
  addFooter();

  y = 52;

  // Draft notice box
  doc.setFillColor(...PDF_COLORS.background);
  doc.setDrawColor(...PDF_COLORS.border);
  doc.roundedRect(margin, y - 2, contentWidth, 14, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.danger);
  doc.setFont('helvetica', 'bold');
  doc.text('DRAFT — NOT AN OFFICIAL VA DOCUMENT', pageWidth / 2, y + 7, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  y += 20;

  let sectionNum = 1;

  // --- 1. Personal Information ---
  if (sections.personalInfo) {
    addSectionHeader(`${sectionNum}. PERSONAL INFORMATION`);
    const name = `${data.firstName} ${data.lastName}`.trim() || 'Not provided';
    const infoLines = [
      ['Name', name],
      ['Branch', data.branch || 'Not provided'],
      ['MOS', data.mosCode ? `${data.mosCode} — ${data.mosTitle}` : 'Not provided'],
    ];
    if (data.serviceDates) {
      infoLines.push(['Service Dates', `${data.serviceDates.start} to ${data.serviceDates.end || 'Present'}`]);
    }
    if (data.separationDate) {
      infoLines.push(['Separation Date', data.separationDate]);
    }
    if (data.claimType) {
      infoLines.push(['Claim Type', data.claimType]);
    }

    infoLines.forEach(([label, value]) => {
      y = checkPageBreak(8);
      doc.setFontSize(9);
      doc.setTextColor(...PDF_COLORS.textMuted);
      doc.text(`${label}:`, margin + 4, y);
      doc.setTextColor(...PDF_COLORS.textDark);
      doc.text(value, margin + 50, y);
      y += 6;
    });

    if (data.dutyStations.length > 0) {
      y = checkPageBreak(8);
      doc.setFontSize(9);
      doc.setTextColor(...PDF_COLORS.textMuted);
      doc.text('Duty Stations:', margin + 4, y);
      y += 6;
      data.dutyStations.forEach((ds) => {
        y = checkPageBreak(6);
        doc.setFontSize(8);
        doc.setTextColor(...PDF_COLORS.textDark);
        doc.text(`• ${ds.baseName} (${safeDate(ds.startDate)} – ${safeDate(ds.endDate)})`, margin + 8, y);
        y += 5;
      });
    }

    y += 6;
    sectionNum++;
  }

  // --- 2. Conditions & Ratings ---
  if (sections.conditions) {
    addSectionHeader(`${sectionNum}. CONDITIONS & RATINGS`);
    if (data.userConditions.length === 0 && data.claimConditions.length === 0) {
      doc.setFontSize(9);
      doc.setTextColor(...PDF_COLORS.textMuted);
      doc.text('No conditions recorded yet.', margin + 4, y);
      y += 8;
    } else {
      data.userConditions.forEach((c) => {
        y = checkPageBreak(18);
        const name = getConditionDisplayName(c);
        const vaInfo = getConditionById(c.conditionId);
        const dc = vaInfo?.diagnosticCode || 'N/A';

        doc.setFontSize(10);
        doc.setTextColor(...PDF_COLORS.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text(name, margin + 4, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...PDF_COLORS.textMuted);
        doc.text(`DC ${dc}`, margin + 4, y + 5);

        doc.setFontSize(9);
        const ratingText = c.rating != null ? `${c.rating}%` : 'Pending';
        doc.setTextColor(...PDF_COLORS.blue);
        doc.text(`Rating: ${ratingText}`, pageWidth - margin - 40, y);
        doc.setTextColor(...PDF_COLORS.textSecondary);
        doc.text(`${c.isPrimary ? 'Primary' : 'Secondary'} | ${c.claimStatus}`, pageWidth - margin - 65, y + 5);
        y += 14;
      });

      if (data.claimConditions.length > 0) {
        y = checkPageBreak(12);
        doc.setFontSize(9);
        doc.setTextColor(...PDF_COLORS.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text('Claim Builder Conditions:', margin + 4, y);
        doc.setFont('helvetica', 'normal');
        y += 6;
        data.claimConditions.forEach((c) => {
          y = checkPageBreak(8);
          doc.setFontSize(9);
          doc.setTextColor(...PDF_COLORS.textDark);
          doc.text(`• ${c.name}`, margin + 8, y);
          y += 6;
        });
      }
    }
    y += 6;
    sectionNum++;
  }

  // --- 3. Evidence Checklist ---
  if (sections.evidenceChecklist) {
    addSectionHeader(`${sectionNum}. EVIDENCE CHECKLIST`);
    data.documents.forEach((d) => {
      y = checkPageBreak(10);
      const isObtained = d.status === 'Obtained' || d.status === 'Submitted';
      doc.setFontSize(9);
      const checkColor = isObtained ? PDF_COLORS.success : PDF_COLORS.danger;
      doc.setTextColor(...checkColor);
      doc.text(isObtained ? '✓' : '✗', margin + 4, y);
      doc.setTextColor(...PDF_COLORS.textDark);
      doc.text(d.name, margin + 12, y);
      doc.setTextColor(...PDF_COLORS.textMuted);
      doc.setFontSize(8);
      doc.text(d.status, pageWidth - margin - 30, y);
      y += 6;
    });
    y += 6;
    sectionNum++;
  }

  // --- 4. Health Log Summary ---
  if (sections.healthLogs) {
    addSectionHeader(`${sectionNum}. HEALTH LOG SUMMARY`);
    let hasAnyLogs = false;

    // Quick Logs
    if (data.quickLogs.length > 0) {
      hasAnyLogs = true;
      y = checkPageBreak(20);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...PDF_COLORS.textDark);
      doc.text(`Daily Logs: ${data.quickLogs.length} entries`, margin + 4, y);
      doc.setFont('helvetica', 'normal');
      y += 6;
      const avgPain = (data.quickLogs.reduce((s, l) => s + (l.painLevel || l.overallFeeling || 0), 0) / data.quickLogs.length).toFixed(1);
      doc.setTextColor(...PDF_COLORS.textSecondary);
      doc.text(`Average Pain Level: ${avgPain}/10`, margin + 8, y);
      y += 5;
      const flareUps = data.quickLogs.filter((l) => l.hadFlareUp).length;
      doc.text(`Flare-Ups: ${flareUps}`, margin + 8, y);
      y += 8;
    }

    // Symptoms
    if (data.symptoms.length > 0) {
      hasAnyLogs = true;
      y = checkPageBreak(20);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...PDF_COLORS.textDark);
      doc.text(`Symptom Journal: ${data.symptoms.length} entries`, margin + 4, y);
      doc.setFont('helvetica', 'normal');
      y += 6;
      const avgSev = (data.symptoms.reduce((s, e) => s + (e.severity || 0), 0) / data.symptoms.length).toFixed(1);
      doc.setTextColor(...PDF_COLORS.textSecondary);
      doc.text(`Average Severity: ${avgSev}/10 | Severe (7+): ${data.symptoms.filter((s) => s.severity >= 7).length}`, margin + 8, y);
      y += 8;

      // Show recent entries
      const recentSymptoms = [...data.symptoms]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      recentSymptoms.forEach((s) => {
        y = checkPageBreak(8);
        doc.setFontSize(8);
        doc.setTextColor(...PDF_COLORS.textMuted);
        doc.text(safeDate(s.date), margin + 8, y);
        doc.setTextColor(...PDF_COLORS.textDark);
        doc.text(`${s.symptom} (${s.severity}/10)`, margin + 35, y);
        y += 5;
      });
      y += 4;
    }

    // Medications
    if (data.medications.length > 0) {
      hasAnyLogs = true;
      y = checkPageBreak(14);
      const current = data.medications.filter((m) => m.stillTaking);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...PDF_COLORS.textDark);
      doc.text(`Medications: ${current.length} current, ${data.medications.length - current.length} past`, margin + 4, y);
      doc.setFont('helvetica', 'normal');
      y += 6;
      current.slice(0, 5).forEach((m) => {
        y = checkPageBreak(6);
        doc.setFontSize(8);
        doc.setTextColor(...PDF_COLORS.textDark);
        doc.text(`• ${m.name} — ${m.prescribedFor || 'N/A'}`, margin + 8, y);
        y += 5;
      });
      y += 4;
    }

    // Sleep
    if (data.sleepEntries.length > 0) {
      hasAnyLogs = true;
      y = checkPageBreak(14);
      const avgSleep = (data.sleepEntries.reduce((s, e) => s + (e.hoursSlept || 0), 0) / data.sleepEntries.length).toFixed(1);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...PDF_COLORS.textDark);
      doc.text(`Sleep Log: ${data.sleepEntries.length} entries, avg ${avgSleep} hrs/night`, margin + 4, y);
      doc.setFont('helvetica', 'normal');
      y += 8;
    }

    // Migraines
    if (data.migraines.length > 0) {
      hasAnyLogs = true;
      y = checkPageBreak(14);
      const prostrating = data.migraines.filter((m) => m.wasProstrating).length;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...PDF_COLORS.textDark);
      doc.text(`Migraine Log: ${data.migraines.length} entries`, margin + 4, y);
      doc.setFont('helvetica', 'normal');
      y += 6;
      doc.setTextColor(...PDF_COLORS.textSecondary);
      doc.text(`Prostrating: ${prostrating} | Work Impact: ${data.migraines.filter((m) => m.couldNotWork).length}`, margin + 8, y);
      y += 8;
    }

    // Employment Impact
    if (data.employmentImpact.length > 0) {
      hasAnyLogs = true;
      y = checkPageBreak(14);
      const totalHours = data.employmentImpact.reduce((s, e) => s + e.hoursLost, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...PDF_COLORS.textDark);
      doc.text(`Employment Impact: ${data.employmentImpact.length} entries`, margin + 4, y);
      doc.setFont('helvetica', 'normal');
      y += 6;
      doc.setTextColor(...PDF_COLORS.textSecondary);
      doc.text(`Total Hours Lost: ${totalHours}`, margin + 8, y);
      y += 8;
    }

    if (!hasAnyLogs) {
      doc.setFontSize(9);
      doc.setTextColor(...PDF_COLORS.textMuted);
      doc.text('No health log data recorded yet.', margin + 4, y);
      y += 8;
    }
    y += 4;
    sectionNum++;
  }

  // --- 5. Generated Documents ---
  if (sections.generatedDocs) {
    addSectionHeader(`${sectionNum}. GENERATED DOCUMENTS`);
    if (data.buddyContacts.length === 0) {
      doc.setFontSize(9);
      doc.setTextColor(...PDF_COLORS.textMuted);
      doc.text('No generated documents recorded yet.', margin + 4, y);
      y += 8;
    } else {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...PDF_COLORS.textDark);
      doc.text('Buddy Contacts / Statement Status:', margin + 4, y);
      doc.setFont('helvetica', 'normal');
      y += 6;
      data.buddyContacts.forEach((b) => {
        y = checkPageBreak(12);
        doc.setFontSize(9);
        doc.setTextColor(...PDF_COLORS.textDark);
        doc.text(`• ${b.rank ? `${b.rank} ` : ''}${b.name}`, margin + 8, y);
        const statusColor = b.statementStatus === 'Received' || b.statementStatus === 'Submitted'
          ? PDF_COLORS.success
          : PDF_COLORS.warning;
        doc.setTextColor(...statusColor);
        doc.text(b.statementStatus, pageWidth - margin - 35, y);
        y += 6;
      });
    }
    y += 6;
    sectionNum++;
  }

  // --- 6. Form Drafts ---
  if (sections.formDrafts) {
    addSectionHeader(`${sectionNum}. FORM DRAFTS`);
    const draftEntries = Object.entries(data.formDrafts);
    const nonEmpty = draftEntries.filter(([, fields]) => {
      const { lastModified: _lastModified, ...vals } = fields;
      return Object.values(vals).some((v) => v && v.trim());
    });

    if (nonEmpty.length === 0) {
      doc.setFontSize(9);
      doc.setTextColor(...PDF_COLORS.textMuted);
      doc.text('No form drafts recorded yet.', margin + 4, y);
      y += 8;
    } else {
      nonEmpty.forEach(([formId, fields]) => {
        y = checkPageBreak(14);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...PDF_COLORS.textDark);
        doc.text(`Form: ${formId}`, margin + 4, y);
        doc.setFont('helvetica', 'normal');
        y += 6;
        const { lastModified: _lastModified, ...vals } = fields;
        Object.entries(vals).forEach(([fieldId, value]) => {
          if (value && value.trim()) {
            y = checkPageBreak(12);
            doc.setFontSize(8);
            doc.setTextColor(...PDF_COLORS.textMuted);
            doc.text(`${fieldId}:`, margin + 8, y);
            y += 4;
            doc.setTextColor(...PDF_COLORS.textDark);
            const wrappedLines = doc.splitTextToSize(value, contentWidth - 16);
            doc.text(wrappedLines, margin + 8, y);
            y += wrappedLines.length * 4;
            y += 2;
          }
        });
        y += 4;
      });
    }
    y += 4;
    sectionNum++;
  }

  // --- 7. ROM Measurements ---
  if (sections.romMeasurements) {
    addSectionHeader(`${sectionNum}. ROM MEASUREMENTS`);
    doc.setFontSize(9);
    doc.setTextColor(...PDF_COLORS.textMuted);
    doc.text('No ROM measurement data recorded yet.', margin + 4, y);
    y += 12;
    sectionNum++;
  }

  // --- 8. Timeline ---
  if (sections.timeline) {
    addSectionHeader(`${sectionNum}. TIMELINE NARRATIVE`);
    const timeline = buildTimelineData(data);
    if (timeline.length === 0) {
      doc.setFontSize(9);
      doc.setTextColor(...PDF_COLORS.textMuted);
      doc.text('No timeline data available yet.', margin + 4, y);
      y += 8;
    } else {
      timeline.forEach((event) => {
        y = checkPageBreak(10);

        // Colored dot for event type
        const typeColor =
          event.type === 'Service' ? PDF_COLORS.navy :
          event.type === 'Medical' ? PDF_COLORS.success :
          event.type === 'Symptom' ? PDF_COLORS.warning :
          event.type === 'Deployment' ? PDF_COLORS.blue :
          PDF_COLORS.textMuted;
        doc.setFillColor(...typeColor);
        doc.circle(margin + 6, y - 1, 2, 'F');

        doc.setFontSize(8);
        doc.setTextColor(...PDF_COLORS.textMuted);
        doc.text(event.date, margin + 12, y);

        doc.setFontSize(8);
        doc.setTextColor(...PDF_COLORS.textDark);
        const desc = `[${event.type}] ${event.description}`;
        const truncDesc = desc.length > 75 ? desc.substring(0, 72) + '...' : desc;
        doc.text(truncDesc, margin + 38, y);
        y += 7;
      });
    }
    y += 4;
  }

  // --- Final Footer Bar ---
  y = checkPageBreak(25);
  doc.setFillColor(...PDF_COLORS.background);
  doc.setDrawColor(...PDF_COLORS.border);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setTextColor(...PDF_COLORS.danger);
  doc.setFont('helvetica', 'bold');
  doc.text('DRAFT WORKSHEET — NOT A VA SUBMISSION', pageWidth / 2, y + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...PDF_COLORS.textMuted);
  doc.text('Vet Claim Support — Claim Preparation Tools', pageWidth / 2, y + 12, { align: 'center' });

  const blob = doc.output('blob');
  return {
    content: blob,
    filename: `VCS-Claim-Packet-${dateStr}.pdf`,
    mimeType: 'application/pdf',
  };
}

// ============================================================================
// Shared PDF utilities (for Form Guide export consistency)
// ============================================================================

export async function generateFormGuidePDF(
  formId: string,
  formTitle: string,
  fields: Array<{ section: string; label: string; fieldId: string }>,
  drafts: Record<string, string>
): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const addWatermark = () => {
    doc.setFontSize(9);
    doc.setTextColor(...PDF_COLORS.watermark);
    doc.setFont('helvetica', 'italic');
    doc.text('DRAFT WORKSHEET — NOT AN OFFICIAL VA FORM', pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.setFont('helvetica', 'normal');
  };

  const addFooter = () => {
    doc.setFontSize(7);
    doc.setTextColor(...PDF_COLORS.textMuted);
    doc.text('Vet Claim Support — Claim Preparation Tools', pageWidth / 2, pageHeight - 8, { align: 'center' });
  };

  const checkPageBreak = (needed: number): number => {
    if (y + needed > pageHeight - 30) {
      doc.addPage();
      addWatermark();
      addFooter();
      return 20;
    }
    return y;
  };

  // Header bar
  doc.setFillColor(...PDF_COLORS.navy);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setFillColor(...PDF_COLORS.blue);
  doc.rect(0, 35, pageWidth, 2, 'F');

  doc.setFontSize(16);
  doc.setTextColor(...PDF_COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.text('VET CLAIM SUPPORT — Draft Worksheet', margin, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formId} — ${formTitle}`, margin, 26);

  doc.setFontSize(8);
  doc.text(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, margin, 32);

  addWatermark();
  addFooter();
  y = 46;

  // Draft notice
  doc.setFillColor(...PDF_COLORS.background);
  doc.setDrawColor(...PDF_COLORS.border);
  doc.roundedRect(margin, y - 2, contentWidth, 12, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.danger);
  doc.setFont('helvetica', 'bold');
  doc.text('DRAFT WORKSHEET — NOT AN OFFICIAL VA FORM', pageWidth / 2, y + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  y += 18;

  // Fields
  let currentSection = '';
  fields.forEach((field) => {
    const val = drafts[field.fieldId] || '';

    // Section header
    if (field.section !== currentSection) {
      currentSection = field.section;
      y = checkPageBreak(16);
      doc.setFillColor(...PDF_COLORS.navyLight);
      doc.roundedRect(margin, y - 3, contentWidth, 10, 1, 1, 'F');
      doc.setFontSize(9);
      doc.setTextColor(...PDF_COLORS.white);
      doc.setFont('helvetica', 'bold');
      doc.text(field.section, margin + 4, y + 4);
      doc.setFont('helvetica', 'normal');
      y += 12;
    }

    y = checkPageBreak(16);
    doc.setFontSize(9);
    doc.setTextColor(...PDF_COLORS.textDark);
    doc.setFont('helvetica', 'bold');
    doc.text(field.label, margin + 4, y);
    doc.setFont('helvetica', 'normal');
    y += 5;

    if (val && val.trim()) {
      doc.setFontSize(9);
      doc.setTextColor(...PDF_COLORS.textSecondary);
      const wrappedLines = doc.splitTextToSize(val, contentWidth - 8);
      wrappedLines.forEach((line: string) => {
        y = checkPageBreak(5);
        doc.text(line, margin + 4, y);
        y += 4.5;
      });
    } else {
      doc.setFontSize(9);
      doc.setTextColor(...PDF_COLORS.textMuted);
      doc.text('[Not filled]', margin + 4, y);
      y += 5;
    }
    y += 4;
  });

  // Final footer
  y = checkPageBreak(20);
  doc.setFillColor(...PDF_COLORS.background);
  doc.setDrawColor(...PDF_COLORS.border);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setTextColor(...PDF_COLORS.danger);
  doc.setFont('helvetica', 'bold');
  doc.text('DRAFT WORKSHEET — NOT A VA SUBMISSION', pageWidth / 2, y + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...PDF_COLORS.textMuted);
  doc.text('Vet Claim Support — Claim Preparation Tools', pageWidth / 2, y + 10, { align: 'center' });

  doc.save(`VCS-Draft-${formId}.pdf`);
}

// ============================================================================
// Share / Save / Copy utilities
// ============================================================================

export async function shareExport(result: ExportResult): Promise<void> {
  if (navigator.share) {
    try {
      const blob =
        result.content instanceof Blob
          ? result.content
          : new Blob([result.content], { type: result.mimeType });
      const file = new File([blob], result.filename, { type: result.mimeType });
      await navigator.share({
        title: 'VCS Claim Packet',
        files: [file],
      });
      return;
    } catch (err) {
      // AbortError means user cancelled - that's ok
      if (err instanceof Error && err.name === 'AbortError') return;
      // Fall through to download
    }
  }
  downloadExport(result);
}

export async function downloadExport(result: ExportResult): Promise<void> {
  const blob =
    result.content instanceof Blob
      ? result.content
      : new Blob([result.content], { type: result.mimeType });

  // Use navigator.share on iOS/native (download attribute doesn't work in WKWebView)
  if (navigator.share && navigator.canShare?.({ files: [new File([blob], result.filename)] })) {
    try {
      await navigator.share({ files: [new File([blob], result.filename, { type: result.mimeType })] });
      return;
    } catch {
      // User cancelled or share failed — fall through to download
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = result.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyExport(result: ExportResult): Promise<boolean> {
  if (typeof result.content === 'string') {
    try {
      await navigator.clipboard.writeText(result.content);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

// ============================================================================
// Timeline Builder
// ============================================================================

interface TimelineEvent {
  date: string;
  type: string;
  description: string;
  sortDate: number;
}

function buildTimelineData(data: GatheredData): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Service dates
  if (data.serviceDates?.start) {
    events.push({
      date: data.serviceDates.start,
      type: 'Service',
      description: `Entered service${data.branch ? ` (${data.branch})` : ''}`,
      sortDate: new Date(data.serviceDates.start).getTime(),
    });
  }
  if (data.serviceDates?.end) {
    events.push({
      date: data.serviceDates.end,
      type: 'Service',
      description: 'Separated from service',
      sortDate: new Date(data.serviceDates.end).getTime(),
    });
  }

  // Service history
  data.serviceHistory.forEach((entry) => {
    events.push({
      date: entry.startDate,
      type: 'Service',
      description: `Duty station: ${entry.base || entry.unit || 'Unknown'}`,
      sortDate: new Date(entry.startDate).getTime(),
    });
  });

  // Duty stations
  data.dutyStations.forEach((ds) => {
    events.push({
      date: ds.startDate,
      type: 'Service',
      description: `Stationed at ${ds.baseName}`,
      sortDate: new Date(ds.startDate).getTime(),
    });
  });

  // Deployments
  data.deployments.forEach((dep) => {
    events.push({
      date: dep.startDate,
      type: 'Deployment',
      description: `${dep.operationName || 'Deployment'} — ${dep.location || 'Unknown'}`,
      sortDate: new Date(dep.startDate).getTime(),
    });
  });

  // Combat history
  data.combatHistory.forEach((combat) => {
    events.push({
      date: combat.startDate,
      type: 'Service',
      description: `${combat.combatZoneType}: ${combat.location || 'Unknown'}`,
      sortDate: new Date(combat.startDate).getTime(),
    });
  });

  // Major events
  data.majorEvents.forEach((event) => {
    events.push({
      date: event.date,
      type: 'Event',
      description: `${event.type}: ${event.title}`,
      sortDate: new Date(event.date).getTime(),
    });
  });

  // Medical visits (recent)
  data.medicalVisits.slice(0, 10).forEach((visit) => {
    events.push({
      date: visit.date,
      type: 'Medical',
      description: visit.reason || visit.diagnosis || 'Medical visit',
      sortDate: new Date(visit.date).getTime(),
    });
  });

  // Severe symptoms
  data.symptoms
    .filter((s) => s.severity >= 7)
    .slice(0, 10)
    .forEach((symptom) => {
      events.push({
        date: symptom.date,
        type: 'Symptom',
        description: `${symptom.symptom} (${symptom.severity}/10)`,
        sortDate: new Date(symptom.date).getTime(),
      });
    });

  // Condition add dates
  data.userConditions.forEach((c) => {
    if (c.dateAdded) {
      events.push({
        date: c.dateAdded,
        type: 'Condition',
        description: `Claimed: ${getConditionDisplayName(c)}`,
        sortDate: new Date(c.dateAdded).getTime(),
      });
    }
  });

  // Sort chronologically and deduplicate
  events.sort((a, b) => a.sortDate - b.sortDate);

  // Format dates for display
  return events
    .filter((e) => !isNaN(e.sortDate))
    .map((e) => ({
      ...e,
      date: formatDateSafe(e.date),
    }));
}

function formatDateSafe(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

// ============================================================================
// C&P Exam Packet PDF Export
// ============================================================================

export interface CPExamPacketData {
  profile: {
    firstName: string;
    lastName: string;
    branch: string;
    mosCode: string;
    mosTitle: string;
    serviceDates?: { start: string; end: string };
    intentToFileDate?: string;
    currentRating: number;
  };
  conditions: Array<{
    id: string;
    name: string;
    diagnosticCode?: string;
    claimType: string;
    isPrimary: boolean;
    linkedPrimaryName?: string;
    rating?: number;
  }>;
  evidenceSummaries: Array<{
    conditionName: string;
    medRecords: number;
    buddyCount: number;
    symptomCount: number;
    docCount: number;
    hasNexus: boolean;
    hasPersonalStatement: boolean;
    gaps: string[];
  }>;
  symptomSummary: {
    avgPain: string;
    flareUps: number;
    worstPain: number;
    worstDate: string | null;
    avgSleep: string | null;
    migraineCount: number;
    prostratingCount: number;
    currentMeds: Array<{ id: string; name: string; prescribedFor: string }>;
    totalLogs: number;
  };
  medications: Array<{ id: string; name: string; prescribedFor: string }>;
  examQuestions: Record<string, string>;
}

export async function generateCPExamPacketPDF(data: CPExamPacketData): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;
  const dateStr = format(new Date(), 'MMMM d, yyyy');
  const veteranName = `${data.profile.firstName} ${data.profile.lastName}`.trim() || 'Veteran';

  // --- Helpers ---
  const addHeader = () => {
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.textMuted);
    doc.text(`C&P Exam Preparation Packet — ${veteranName} — ${dateStr}`, pageWidth / 2, 8, { align: 'center' });
  };

  const addFooterText = () => {
    doc.setFontSize(7);
    doc.setTextColor(...PDF_COLORS.textMuted);
    doc.text(
      'Prepared by Vet Claim Support — For personal use only — Not an official VA document',
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  };

  const checkPageBreak = (needed: number): number => {
    if (y + needed > pageHeight - 25) {
      doc.addPage();
      addHeader();
      addFooterText();
      return 18;
    }
    return y;
  };

  const addSectionHeader = (num: number, title: string) => {
    y = checkPageBreak(18);
    doc.setFillColor(...PDF_COLORS.navy);
    doc.roundedRect(margin, y - 4, contentWidth, 12, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setTextColor(...PDF_COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.text(`${num}. ${title}`, margin + 6, y + 4);
    doc.setFont('helvetica', 'normal');
    y += 14;
  };

  const addSubHeader = (title: string) => {
    y = checkPageBreak(12);
    doc.setFontSize(10);
    doc.setTextColor(...PDF_COLORS.blue);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 4, y);
    doc.setFont('helvetica', 'normal');
    y += 6;
  };

  const addText = (text: string, indent = 4) => {
    y = checkPageBreak(6);
    doc.setFontSize(9);
    doc.setTextColor(...PDF_COLORS.textDark);
    const lines = doc.splitTextToSize(text, contentWidth - indent - 4);
    lines.forEach((line: string) => {
      y = checkPageBreak(5);
      doc.text(line, margin + indent, y);
      y += 4.5;
    });
  };

  const addLabelValue = (label: string, value: string) => {
    y = checkPageBreak(7);
    doc.setFontSize(9);
    doc.setTextColor(...PDF_COLORS.textMuted);
    doc.text(`${label}:`, margin + 4, y);
    doc.setTextColor(...PDF_COLORS.textDark);
    doc.text(value, margin + 55, y);
    y += 6;
  };

  const addBullet = (text: string, indent = 8, color = PDF_COLORS.textDark) => {
    y = checkPageBreak(6);
    doc.setFontSize(9);
    doc.setTextColor(...PDF_COLORS.blue);
    doc.text('\u2022', margin + indent, y);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentWidth - indent - 10);
    lines.forEach((line: string, i: number) => {
      if (i > 0) y = checkPageBreak(5);
      doc.text(line, margin + indent + 5, y);
      if (i < lines.length - 1) y += 4.5;
    });
    y += 5;
  };

  // === PAGE 1: Title Page + Table of Contents ===
  doc.setFillColor(...PDF_COLORS.navy);
  doc.rect(0, 0, pageWidth, 55, 'F');
  doc.setFillColor(...PDF_COLORS.blue);
  doc.rect(0, 55, pageWidth, 3, 'F');

  doc.setFontSize(22);
  doc.setTextColor(...PDF_COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.text('C&P EXAM PREPARATION PACKET', margin, 22);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(veteranName, margin, 34);
  doc.setFontSize(10);
  doc.text(dateStr, margin, 42);
  doc.setFontSize(9);
  doc.text('Vet Claim Support', margin, 50);

  addFooterText();
  y = 70;

  // Table of Contents
  doc.setFontSize(14);
  doc.setTextColor(...PDF_COLORS.textDark);
  doc.setFont('helvetica', 'bold');
  doc.text('TABLE OF CONTENTS', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 10;

  const tocItems = [
    '1. Veteran Information',
    '2. Conditions Being Claimed',
    '3. Evidence Summary',
    '4. Symptom History (90 Days)',
    '5. Key Talking Points',
    '6. Questions to Expect',
    '7. Case Law References',
  ];
  tocItems.forEach((item) => {
    doc.setFontSize(10);
    doc.setTextColor(...PDF_COLORS.textDark);
    doc.text(item, margin + 4, y);
    y += 7;
  });

  y += 6;
  doc.setFillColor(...PDF_COLORS.background);
  doc.setDrawColor(...PDF_COLORS.border);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setTextColor(...PDF_COLORS.danger);
  doc.setFont('helvetica', 'bold');
  doc.text('NOT AN OFFICIAL VA DOCUMENT — FOR PERSONAL USE ONLY', pageWidth / 2, y + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...PDF_COLORS.textMuted);
  doc.text('Always verify AI-generated content before use', pageWidth / 2, y + 11, { align: 'center' });

  // === SECTION 1: Veteran Information ===
  doc.addPage();
  addHeader();
  addFooterText();
  y = 18;

  addSectionHeader(1, 'VETERAN INFORMATION');
  addLabelValue('Name', veteranName);
  addLabelValue('Branch', data.profile.branch || 'Not provided');
  addLabelValue('MOS/AFSC', data.profile.mosCode ? `${data.profile.mosCode} — ${data.profile.mosTitle}` : 'Not provided');
  if (data.profile.serviceDates) {
    addLabelValue('Service Dates', `${data.profile.serviceDates.start} to ${data.profile.serviceDates.end || 'Present'}`);
  }
  addLabelValue('Current VA Rating', data.profile.currentRating > 0 ? `${data.profile.currentRating}%` : 'None on file');
  if (data.profile.intentToFileDate) {
    addLabelValue('Intent to File', `Filed ${data.profile.intentToFileDate}`);
  }
  y += 6;

  // === SECTION 2: Conditions Being Claimed ===
  addSectionHeader(2, 'CONDITIONS BEING CLAIMED');
  if (data.conditions.length === 0) {
    addText('No conditions added yet.');
  } else {
    data.conditions.forEach((condition) => {
      y = checkPageBreak(20);
      doc.setFontSize(10);
      doc.setTextColor(...PDF_COLORS.textDark);
      doc.setFont('helvetica', 'bold');
      doc.text(condition.name, margin + 4, y);
      doc.setFont('helvetica', 'normal');

      // Claim type badge
      doc.setFontSize(8);
      doc.setTextColor(...PDF_COLORS.blue);
      doc.text(`[${condition.claimType.toUpperCase()}]`, pageWidth - margin - 30, y);
      y += 5;

      if (condition.diagnosticCode) {
        doc.setFontSize(8);
        doc.setTextColor(...PDF_COLORS.textMuted);
        doc.text(`Diagnostic Code: ${condition.diagnosticCode}`, margin + 8, y);
        y += 5;
      }
      if (condition.linkedPrimaryName) {
        doc.setFontSize(8);
        doc.setTextColor(...PDF_COLORS.textMuted);
        doc.text(`Secondary to: ${condition.linkedPrimaryName}`, margin + 8, y);
        y += 5;
      }
      y += 4;
    });
  }
  y += 4;

  // === SECTION 3: Evidence Summary ===
  addSectionHeader(3, 'EVIDENCE SUMMARY');
  if (data.evidenceSummaries.length === 0) {
    addText('No evidence data available.');
  } else {
    data.evidenceSummaries.forEach((es) => {
      y = checkPageBreak(30);
      addSubHeader(es.conditionName);
      doc.setFontSize(9);
      doc.setTextColor(...PDF_COLORS.textDark);
      doc.text(`Medical Records: ${es.medRecords}`, margin + 8, y); y += 5;
      doc.text(`Buddy Statements: ${es.buddyCount}`, margin + 8, y); y += 5;
      doc.text(`Doctor Summary: ${es.hasNexus ? 'Yes' : 'Missing'}`, margin + 8, y); y += 5;
      doc.text(`Personal Statement: ${es.hasPersonalStatement ? 'Yes' : 'Missing'}`, margin + 8, y); y += 5;

      if (es.gaps.length > 0) {
        doc.setTextColor(...PDF_COLORS.warning);
        doc.text(`Gaps: ${es.gaps.join(', ')}`, margin + 8, y);
        y += 5;
      }
      y += 4;
    });
  }

  // === SECTION 4: Symptom History ===
  addSectionHeader(4, 'SYMPTOM HISTORY (90 DAYS)');
  const ss = data.symptomSummary;
  if (ss.totalLogs === 0 && !ss.avgSleep && ss.migraineCount === 0) {
    addText('No symptom data recorded yet.');
  } else {
    addLabelValue('Average Pain Level', `${ss.avgPain}/10`);
    addLabelValue('Flare-Ups', String(ss.flareUps));
    addLabelValue('Worst Pain', ss.worstPain > 0 ? `${ss.worstPain}/10${ss.worstDate ? ` on ${ss.worstDate}` : ''}` : 'N/A');
    addLabelValue('Total Log Entries', String(ss.totalLogs));

    if (ss.avgSleep) {
      addLabelValue('Avg Sleep', `${ss.avgSleep} hrs/night`);
    }
    if (ss.migraineCount > 0) {
      addLabelValue('Migraines', `${ss.migraineCount} episodes, ${ss.prostratingCount} prostrating`);
    }
    if (ss.currentMeds.length > 0) {
      y += 2;
      addSubHeader('Current Medications');
      ss.currentMeds.forEach((m) => {
        addBullet(`${m.name} — ${m.prescribedFor || 'N/A'}`);
      });
    }
  }
  y += 4;

  // === SECTION 5: Key Talking Points ===
  addSectionHeader(5, 'KEY TALKING POINTS');
  addSubHeader('For ALL Conditions:');
  const universalPoints = [
    'Describe your WORST days, not your average',
    'Mention how this limits your daily activities and work',
    'Bring up frequency: how often symptoms occur',
    "Don't minimize — the examiner is evaluating functional loss",
    'Be specific with numbers (e.g., "3-4 times per week")',
  ];
  universalPoints.forEach((p) => addBullet(p));
  y += 4;

  // === SECTION 6: Questions to Expect ===
  addSectionHeader(6, 'QUESTIONS TO EXPECT');
  const hasQuestions = Object.keys(data.examQuestions).length > 0;
  if (!hasQuestions) {
    addText('No AI-generated questions available. Generate them in the app before exporting.');
  } else {
    // AI disclaimer
    y = checkPageBreak(12);
    doc.setFillColor(245, 245, 220);
    doc.roundedRect(margin, y - 2, contentWidth, 10, 1, 1, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.warning);
    doc.text('AI-generated content — verify before relying on this information', pageWidth / 2, y + 4, { align: 'center' });
    y += 12;

    Object.entries(data.examQuestions).forEach(([condition, questions]) => {
      addSubHeader(condition);
      const lines = questions.split('\n').filter((l) => l.trim());
      lines.forEach((line) => {
        addText(line.trim(), 8);
      });
      y += 4;
    });
  }

  // === SECTION 7: Legal Research Resources ===
  addSectionHeader(7, 'LEGAL RESEARCH RESOURCES');
  addText('Use these verified legal databases to find case law relevant to your claim:');
  y += 2;
  addText('• Board of Veterans\' Appeals (BVA) Decisions — www.va.gov/decision-reviews/board-appeal/');
  addText('• Court of Appeals for Veterans Claims (CAVC) — www.uscourts.cavc.gov/opinions.php');
  addText('• Google Scholar — Legal Opinions — scholar.google.com');
  addText('• 38 U.S.C. — Veterans\' Benefits (Cornell Law) — www.law.cornell.edu/uscode/text/38');

  // === Final Footer ===
  y = checkPageBreak(25);
  doc.setFillColor(...PDF_COLORS.background);
  doc.setDrawColor(...PDF_COLORS.border);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setTextColor(...PDF_COLORS.danger);
  doc.setFont('helvetica', 'bold');
  doc.text('NOT AN OFFICIAL VA DOCUMENT — FOR PERSONAL USE ONLY', pageWidth / 2, y + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...PDF_COLORS.textMuted);
  doc.text('Prepared by Vet Claim Support — Claim Preparation Tools', pageWidth / 2, y + 12, { align: 'center' });

  const dateFileStr = format(new Date(), 'yyyy-MM-dd');
  doc.save(`CP-Exam-Packet-${veteranName.replace(/\s+/g, '-')}-${dateFileStr}.pdf`);
}
