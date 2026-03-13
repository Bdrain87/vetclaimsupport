/**
 * Unified Legal Copy Source of Truth
 *
 * Every legal, disclaimer, and policy string in the app pulls from this file.
 * Version each section independently with effective dates.
 */

// ---------------------------------------------------------------------------
// Version metadata
// ---------------------------------------------------------------------------
export const LEGAL_VERSIONS = {
  app: '1.4.0',
  terms: { version: '1.4', effectiveDate: '2026-03-11' },
  privacy: { version: '1.3', effectiveDate: '2026-03-11' },
  disclaimer: { version: '1.3', effectiveDate: '2026-03-08' },
} as const;

export function formatLegalDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Core disclaimers — used across About, Disclaimer, Liability, etc.
// ---------------------------------------------------------------------------
export const CORE_DISCLAIMERS = {
  mainDisclaimer:
    'Vet Claim Support is an educational and organizational tool. It is NOT affiliated with, endorsed by, or connected to the U.S. Department of Veterans Affairs.',

  notLegalAdvice: 'NOT legal advice',
  notMedicalAdvice: 'NOT medical advice',
  notVAAccredited:
    'NOT a VA-accredited representative, attorney, claims agent, or VSO as defined under 38 U.S.C. §§ 5901-5905 and 38 C.F.R. Part 14',
  notClaimsFiling:
    'NOT a claims filing service — VCS does not prepare, present, or prosecute claims on your behalf (38 C.F.R. § 14.629)',
  notSubstitute: 'NOT a substitute for professional consultation',
  notGuarantee: 'NOT a guarantee of any claim outcome',

  yourResponsibility:
    'You are solely responsible for the accuracy of all information you enter. You must review and verify ALL content before submitting anything to the VA — especially AI-generated content.',

  fraudWarning:
    'Submitting false statements may have serious legal consequences.',

  estimateDisclaimer:
    'Estimates only. Actual ratings determined by VA.',

  professionalConsultation:
    'We strongly recommend consulting with a VA-accredited Veterans Service Organization (VSO), attorney, or claims agent before filing your claim.',

  vsoFinderUrl: 'https://www.va.gov/ogc/apps/accreditation',
} as const;

// ---------------------------------------------------------------------------
// AI-specific copy
// ---------------------------------------------------------------------------
export const AI_COPY = {
  contentBadge:
    'AI-Assisted Draft — Review before submitting to the VA.',

  contentBadgeWithDate: (date: string) =>
    `AI-Assisted Draft — Review before submitting to the VA. Generated ${date}.`,

  hallucinationWarning:
    'AI output can be inaccurate or fabricated. Verify any legal citations using official sources before relying on them.',

  scopeStatement:
    'AI only processes what you choose to send.',

  redactionToggleLabel:
    'Redact SSNs, DOBs, addresses before AI (recommended)',

  localVsCloud:
    'Core data: stored locally only. AI features: selected text you submit is processed by the AI provider.',

  noTelemetry:
    'We do not store the document. The AI provider processes the text you send under their terms.',

  aiPromptInstruction:
    'Do not cite specific rating percentages, diagnostic code criteria, legal cases, regulations, or statistics unless this data was explicitly provided. Never guess or fabricate rating criteria.',

  safeModeLevels: {
    0: 'AI only processes text you type. No document upload to AI.',
    1: 'Documents are redacted before analysis. Identifiers like SSN, DOB, and addresses are stripped.',
    2: 'On-device only processing. No data leaves your device.',
  },

  analyzeCTA: 'Analyze Document (Safe Mode)',

  preSendHeader: 'Analyze Document (Safe Mode)',
  preSendBody:
    'We will automatically remove identifiers like name, SSN, address, and claim numbers before sending text to the AI service. Review redactions before continuing.',
  whatGetsSent:
    'Only the redacted text you approve is sent. We do not upload your original PDF or images. Some features (C-File Intel, Evidence Scanner) upload documents to the AI service with PII automatically redacted — you will be asked for consent before any upload.',
  yourControl:
    'You can skip AI entirely. The app works without it.',

  redactionStrictness: {
    high: 'High privacy — aggressively strips anything that looks like a name, number, or identifier.',
    standard: 'Standard — removes known patterns like SSN, DOB, phone, email.',
  },

  auditLogEntry: (date: string, mode: string) =>
    `Sent to AI on ${date} with ${mode} redaction mode`,

  defaultOffPerUpload:
    'AI analysis is off by default. You must opt in for each document.',
} as const;

// ---------------------------------------------------------------------------
// Export confirmation copy
// ---------------------------------------------------------------------------
export const EXPORT_CONFIRMATION = {
  title: 'Before You Export',
  body: 'If you plan to submit this to the VA, please verify:',
  checks: [
    'All content is accurate and truthful',
    'AI-generated content has been reviewed for accuracy',
    'Medical opinions are authored by a licensed clinician, not AI',
    'Consider consulting a VA-accredited VSO before filing',
  ],
  acknowledgment:
    'I understand this content is my responsibility and I have reviewed it for accuracy.',
} as const;

// ---------------------------------------------------------------------------
// C-File upload consent copy
// ---------------------------------------------------------------------------
export const C_FILE_CONSENT = {
  title: 'C-File Upload Consent',
  body: 'Your C-File PDF will be uploaded to Google\'s AI service for analysis.',
  details: [
    'Personal identifiers (SSN, names, addresses, claim numbers) are automatically redacted before upload',
    'The file is deleted from Google\'s servers immediately after analysis',
    'Results are stored only on your device, encrypted',
    'You can cancel anytime during processing',
  ],
  acknowledgment:
    'I consent to uploading my redacted C-File for AI analysis under the terms described above.',
} as const;

// ---------------------------------------------------------------------------
// AI analysis disclosure (two-mode features)
// ---------------------------------------------------------------------------
export const AI_ANALYSIS_DISCLOSURE =
  'This feature has two modes: Local analysis is processed entirely on your device — no data leaves your phone. AI analysis sends redacted text to Google\'s AI service for deeper insights. You choose which mode to use.';

// ---------------------------------------------------------------------------
// Doctor Summary AI disclaimer
// ---------------------------------------------------------------------------
export const DOCTOR_SUMMARY_AI_DISCLAIMER =
  'This AI-enhanced outline organizes your documented evidence for physician review. It does NOT contain medical opinions. All sections marked [CLINICIAN TO PROVIDE] require independent evaluation by a licensed clinician. This is not a medical document — it is an organizational tool.';

// ---------------------------------------------------------------------------
// Premium / payment copy
// ---------------------------------------------------------------------------
export const PREMIUM_COPY = {
  ctaLabel: 'Unlock Premium · Starting at $14.99/mo',
  subtext: 'Export PDFs, advanced templates, and deeper tracking.',
  priceDisplay: '$14.99/mo · $39.99/3mo · $74.99/6mo · $124.99/yr',
  accountNote:
    'Premium follows your account on iPhone and web when signed in.',
  cardPromise:
    'Subscribe to unlock all premium features. Cancel anytime.',
  activeLabel: 'Premium Active',
  restorePurchasesLabel: 'Restore Purchases',
  restorePremiumLabel: 'Restore Premium',
  whatYouGet: [
    'PDF claim packet export',
    'Advanced personal statement templates',
    'AI-assisted document analysis',
    'Body map PDF export',
    'Full health tracking suite',
  ],
  alreadyPurchased: 'Already purchased? Tap Restore below.',
  signInNote: 'Sign in to sync across devices.',
} as const;

// ---------------------------------------------------------------------------
// Data privacy copy
// ---------------------------------------------------------------------------
export const DATA_PRIVACY_COPY = {
  localDefault:
    'Local-only by default. Sign in enables cloud sync and cross-device access.',
  whatStaysLocal:
    'Health data, documents, vault, symptom logs, and claim preparation data stay on your device.',
  whatSyncs:
    'When signed in, conditions, symptoms, medications, medical visits, exposures, service history, premium entitlement, and account profile sync to the cloud for cross-device access.',
  exportWarning:
    'Exported files are outside the app sandbox and are not automatically encrypted.',
  backupWarning:
    'Backups can include sensitive health information. Store them securely.',
  noTracking:
    'No tracking. No ads. No selling data.',
} as const;

// ---------------------------------------------------------------------------
// Notification copy (platform-specific)
// ---------------------------------------------------------------------------
export const NOTIFICATION_COPY = {
  ios: {
    enable: 'Enable notifications to get daily symptom reminders.',
    denied: 'Notifications are blocked. Open iOS Settings to enable them.',
  },
  web: {
    enable: 'Enable browser notifications to receive symptom logging reminders.',
    denied: 'Notifications are blocked. Enable notifications in your browser settings to receive reminders.',
  },
  disabledHelper: 'Enable reminders to set frequency.',
} as const;

// ---------------------------------------------------------------------------
// About VCS copy
// ---------------------------------------------------------------------------
export const ABOUT_COPY = {
  tagline: 'Privacy-first, local-first.',
  missionBlocks: [
    {
      heading: 'Built for Veterans',
      body: 'VCS helps you organize your service history, track symptoms, and prepare your claim materials — all in one private, local-first app.',
    },
    {
      heading: 'Privacy by Design',
      body: 'Your health data stays on your device. AI features are opt-in and scope-limited. No tracking, no ads, no selling data.',
    },
    {
      heading: 'Tools, Not Promises',
      body: 'VCS is an organizational and educational tool. It does not file claims, provide legal advice, or guarantee outcomes. Work with an accredited VSO for the best results.',
    },
  ],
  whatVCSDoes: [
    'Organize conditions, symptoms, and medical visit records',
    'Track health patterns over time with logs and charts',
    'Generate a summary PDF you can share with your VSO',
    'Prepare for C&P exams with checklists and practice questions',
    'Draft personal and buddy statements with AI assistance',
    'Estimate potential VA disability ratings (estimates only)',
    'Store documents securely on your device',
  ],
  differentiator: 'Privacy-first, local-first.',
} as const;

// ---------------------------------------------------------------------------
// Claim dates copy
// ---------------------------------------------------------------------------
export const CLAIM_DATES_COPY = {
  etsDefinition: 'ETS/DOS: your official separation date.',
  autoSaveLabel: 'Saved automatically.',
  bddGuideTitle: 'BDD Guide',
  itfTitle: 'Intent to File',
} as const;

// ---------------------------------------------------------------------------
// Backup copy
// ---------------------------------------------------------------------------
export const BACKUP_COPY = {
  healthIndicatorLabel: 'Last backup',
  neverBacked: 'Never backed up',
  backupNow: 'Back up now',
  storageNote:
    'Backups are saved to your device (Files app / iCloud / Drive). VCS cannot recover data if you lose your device and never exported a backup.',
} as const;

// ---------------------------------------------------------------------------
// Delete account copy
// ---------------------------------------------------------------------------
export const DELETE_ACCOUNT_COPY = {
  title: 'Delete Account',
  dangerZoneLabel: 'Danger Zone',
  consequences:
    'All local data will be permanently deleted. Your account and any server-side data will be removed. This cannot be undone.',
  requiresReauth: true,
} as const;

// ---------------------------------------------------------------------------
// Admin contact
// ---------------------------------------------------------------------------
export const ADMIN_EMAIL = 'admin@vetclaimsupport.com';
