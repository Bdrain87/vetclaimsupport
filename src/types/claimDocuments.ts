// Types for VA Claim Document Library

export type ClaimDocumentType =
  | 'dbq'
  | 'nexus-letter'
  | 'buddy-statement'
  | 'medical-records'
  | 'service-records'
  | 'cp-exam-results'
  | 'private-medical-opinion'
  | 'personal-statement'
  | 'stressor-statement'
  | 'shareable-summary'
  | 'cp-exam-prep'
  | 'other';

export const claimDocumentTypeLabels: Record<ClaimDocumentType, string> = {
  'dbq': 'DBQ (Disability Benefits Questionnaire)',
  'nexus-letter': 'Doctor Summary',
  'buddy-statement': 'Buddy Statement',
  'medical-records': 'Medical Records',
  'service-records': 'Service Records',
  'cp-exam-results': 'C&P Exam Results',
  'private-medical-opinion': 'Private Medical Opinion',
  'personal-statement': 'Personal Statement',
  'stressor-statement': 'Stressor Statement',
  'shareable-summary': 'Claims Summary',
  'cp-exam-prep': 'C&P Exam Prep',
  'other': 'Other',
};

export const claimDocumentTypeShort: Record<ClaimDocumentType, string> = {
  'dbq': 'DBQ',
  'nexus-letter': 'Dr. Summary',
  'buddy-statement': 'Buddy',
  'medical-records': 'Medical',
  'service-records': 'Service',
  'cp-exam-results': 'C&P Exam',
  'private-medical-opinion': 'PMO',
  'personal-statement': 'Personal',
  'stressor-statement': 'Stressor',
  'shareable-summary': 'Summary',
  'cp-exam-prep': 'C&P Prep',
  'other': 'Other',
};

// A claim document stored securely
export interface ClaimDocument {
  id: string;
  fileName: string;
  fileType: string; // MIME type
  fileSize: number;
  dataUrl: string; // Base64 data
  thumbnailUrl?: string; // For images
  uploadedAt: string;
  documentType: ClaimDocumentType;
  condition: string; // User's condition name
  title?: string; // Optional title
  notes?: string; // Optional notes like "Dr. Smith, Jan 2026"
  date: string; // Document date (auto-fills to today)
  storageType: 'localStorage' | 'indexedDB';
}

// Format file size for display
// Get document type badge color
export function getDocTypeColor(docType: ClaimDocumentType): string {
  switch (docType) {
    case 'dbq':
      return 'bg-primary/20 text-primary border-primary/30';
    case 'nexus-letter':
      return 'bg-success/20 text-success border-success/30';
    case 'buddy-statement':
      return 'bg-info/20 text-info border-info/30';
    case 'medical-records':
      return 'bg-gold/20 text-gold border-gold/30';
    case 'service-records':
      return 'bg-secondary/20 text-secondary-foreground border-secondary/30';
    case 'cp-exam-results':
      return 'bg-destructive/20 text-destructive border-destructive/30';
    case 'private-medical-opinion':
      return 'bg-accent/20 text-accent-foreground border-accent/30';
    case 'personal-statement':
      return 'bg-muted text-muted-foreground border-muted';
    case 'stressor-statement':
      return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
    case 'shareable-summary':
      return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    case 'cp-exam-prep':
      return 'bg-gold/20 text-gold border-gold/30';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}
