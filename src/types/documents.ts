// Document attachment types for evidence management

// Document categories for organization
export type DocumentCategory = 
  | 'medical-records'
  | 'service-documents'
  | 'personal-statements'
  | 'buddy-letters'
  | 'photos'
  | 'other';

export const documentCategoryLabels: Record<DocumentCategory, string> = {
  'medical-records': 'Medical Records',
  'service-documents': 'Service Documents',
  'personal-statements': 'Personal Statements',
  'buddy-letters': 'Buddy Letters',
  'photos': 'Photos/Screenshots',
  'other': 'Other',
};

export const documentCategoryIcons: Record<DocumentCategory, string> = {
  'medical-records': 'Stethoscope',
  'service-documents': 'FileText',
  'personal-statements': 'User',
  'buddy-letters': 'Users',
  'photos': 'Image',
  'other': 'Folder',
};

// Entry types that can have attachments
export type AttachableEntryType = 
  | 'symptom'
  | 'medical-visit'
  | 'medication'
  | 'sleep'
  | 'migraine'
  | 'exposure'
  | 'service-entry'
  | 'combat'
  | 'major-event'
  | 'deployment'
  | 'ptsd-symptom'
  | 'claim-condition';

// A document/evidence file stored 100% locally on user's device
export interface EvidenceDocument {
  id: string;
  fileName: string;
  fileType: string; // MIME type
  fileSize: number;
  dataUrl: string; // Base64 for small files (localStorage)
  thumbnailUrl?: string; // For images/PDFs
  uploadedAt: string;
  category: DocumentCategory;
  title: string;
  description?: string;
  // Links to entries (many-to-many relationship)
  linkedEntries: LinkedEntry[];
  // Auto-suggested category from filename
  autoSuggestedCategory?: DocumentCategory;
  // OCR extracted text (if applicable)
  extractedText?: string;
  // Storage location indicator (all local, no cloud)
  storageType: 'localStorage' | 'indexedDB';
}

export interface LinkedEntry {
  entryType: AttachableEntryType;
  entryId: string;
  linkedAt: string;
}

// Missing document suggestions per condition type
export interface MissingDocumentSuggestion {
  documentType: string;
  priority: 'critical' | 'recommended' | 'helpful';
  description: string;
  category: DocumentCategory;
}

export const conditionDocumentRequirements: Record<string, MissingDocumentSuggestion[]> = {
  'PTSD': [
    { documentType: 'Stressor Statement', priority: 'critical', description: 'Detailed description of traumatic event(s)', category: 'personal-statements' },
    { documentType: 'Buddy Statements', priority: 'critical', description: 'Witness accounts of behavior changes', category: 'buddy-letters' },
    { documentType: 'Treatment Records', priority: 'critical', description: 'Mental health treatment documentation', category: 'medical-records' },
    { documentType: 'Service Records', priority: 'recommended', description: 'Deployment orders, combat records', category: 'service-documents' },
  ],
  'Mental Health': [
    { documentType: 'Treatment Records', priority: 'critical', description: 'Counseling/therapy documentation', category: 'medical-records' },
    { documentType: 'Buddy Statements', priority: 'recommended', description: 'Witness behavior changes', category: 'buddy-letters' },
    { documentType: 'Personal Statement', priority: 'recommended', description: 'Impact on daily life', category: 'personal-statements' },
  ],
  'Hearing': [
    { documentType: 'Audiogram Results', priority: 'critical', description: 'Hearing test documentation', category: 'medical-records' },
    { documentType: 'Noise Exposure Records', priority: 'recommended', description: 'MOS/duty hazard documentation', category: 'service-documents' },
    { documentType: 'Buddy Statements', priority: 'helpful', description: 'Witness hearing difficulties', category: 'buddy-letters' },
  ],
  'Back': [
    { documentType: 'Medical Imaging', priority: 'critical', description: 'X-rays, MRI, CT scans', category: 'medical-records' },
    { documentType: 'Nexus Letter', priority: 'critical', description: 'Doctor linking condition to service', category: 'medical-records' },
    { documentType: 'Treatment Records', priority: 'recommended', description: 'Physical therapy, medications', category: 'medical-records' },
    { documentType: 'Service Records', priority: 'recommended', description: 'Heavy lifting duties, injuries', category: 'service-documents' },
  ],
  'default': [
    { documentType: 'Nexus Letter', priority: 'critical', description: 'Doctor statement linking to service', category: 'medical-records' },
    { documentType: 'Treatment Records', priority: 'critical', description: 'Medical documentation', category: 'medical-records' },
    { documentType: 'Buddy Statements', priority: 'recommended', description: 'Witness statements', category: 'buddy-letters' },
    { documentType: 'Personal Statement', priority: 'recommended', description: 'Impact on daily life', category: 'personal-statements' },
  ],
};

// Auto-suggest category based on filename
export function suggestCategoryFromFilename(filename: string): DocumentCategory {
  const lower = filename.toLowerCase();
  
  // Service documents
  if (lower.includes('dd214') || lower.includes('dd-214') || lower.includes('dd 214')) return 'service-documents';
  if (lower.includes('deployment') || lower.includes('orders') || lower.includes('pcs')) return 'service-documents';
  if (lower.includes('str') || lower.includes('service treatment')) return 'service-documents';
  if (lower.includes('personnel') || lower.includes('ompf') || lower.includes('epr') || lower.includes('opr')) return 'service-documents';
  if (lower.includes('award') || lower.includes('medal') || lower.includes('certificate')) return 'service-documents';
  
  // Medical records
  if (lower.includes('medical') || lower.includes('doctor') || lower.includes('hospital')) return 'medical-records';
  if (lower.includes('diagnosis') || lower.includes('treatment') || lower.includes('prescription')) return 'medical-records';
  if (lower.includes('xray') || lower.includes('x-ray') || lower.includes('mri') || lower.includes('ct scan')) return 'medical-records';
  if (lower.includes('audiogram') || lower.includes('hearing')) return 'medical-records';
  if (lower.includes('nexus') || lower.includes('dbq')) return 'medical-records';
  if (lower.includes('sleep study') || lower.includes('cpap')) return 'medical-records';
  
  // Personal statements
  if (lower.includes('statement') && !lower.includes('buddy')) return 'personal-statements';
  if (lower.includes('stressor') || lower.includes('personal')) return 'personal-statements';
  
  // Buddy letters
  if (lower.includes('buddy') || lower.includes('witness') || lower.includes('lay statement')) return 'buddy-letters';
  
  // Photos
  if (lower.includes('photo') || lower.includes('picture') || lower.includes('screenshot')) return 'photos';
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|heic)$/i)) return 'photos';
  
  return 'other';
}

// Get file type icon name based on MIME type
export function getFileTypeIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType === 'application/pdf') return 'FileText';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'FileText';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'Table';
  return 'File';
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
