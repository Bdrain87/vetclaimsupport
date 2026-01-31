// Types for Service Evidence Tracker

export interface MedicalVisit {
  id: string;
  date: string;
  visitType: 'Sick Call' | 'ER' | 'Mental Health' | 'PT' | 'Dental' | 'Specialist';
  location: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  provider: string;
  gotAfterVisitSummary: boolean;
  followUp: string;
  notes: string;
}

export interface Exposure {
  id: string;
  date: string;
  type: 'Burn pit' | 'Jet fuel' | 'Chemicals' | 'Noise' | 'Radiation' | 'Asbestos' | 'Extreme temps';
  duration: string;
  location: string;
  details: string;
  ppeProvided: boolean;
  witnesses: string;
}

export interface SymptomEntry {
  id: string;
  date: string;
  symptom: string;
  bodyArea: string;
  severity: number;
  frequency: string;
  dailyImpact: string;
  notes: string;
}

export interface Medication {
  id: string;
  startDate: string;
  endDate: string;
  name: string;
  prescribedFor: string;
  sideEffects: string;
  stillTaking: boolean;
}

export interface ServiceEntry {
  id: string;
  startDate: string;
  endDate: string;
  base: string;
  unit: string;
  afsc: string;
  duties: string;
  hazards: string;
}

export interface BuddyContact {
  id: string;
  name: string;
  rank: string;
  relationship: string;
  whatTheyWitnessed: string;
  contactInfo: string;
  statementStatus: 'Not Requested' | 'Requested' | 'Received' | 'Submitted';
}

export interface DocumentItem {
  id: string;
  name: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Obtained' | 'Submitted';
  notes: string;
  count: number;
}

export type MigraineSeverity = 'Mild' | 'Moderate' | 'Severe' | 'Prostrating';
export type MigraineDuration = '30min' | '1hr' | '2hrs' | '4hrs' | '8hrs' | '12hrs' | '24hrs+';
export type MigraneTrigger = 'Stress' | 'Lack of sleep' | 'Weather' | 'Food' | 'Bright lights' | 'Loud noise' | 'Physical exertion' | 'Hormonal' | 'Dehydration' | 'Other';
export type MigraineImpact = 'Continued normal activities' | 'Reduced productivity' | 'Had to rest' | 'Missed work/duty' | 'Went to ER';
export type MigraineSymptom = 'Aura' | 'Nausea' | 'Vomiting' | 'Light sensitivity' | 'Sound sensitivity' | 'Vision changes' | 'Numbness/tingling' | 'Dizziness';

export interface MigraineEntry {
  id: string;
  date: string;
  time: string;
  duration: MigraineDuration;
  severity: MigraineSeverity;
  symptoms: MigraineSymptom[];
  triggers: MigraneTrigger[];
  impact: MigraineImpact;
  treatment: string;
  notes: string;
}

// Uploaded document file
export interface UploadedDocument {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  dataUrl: string; // Base64 encoded file data
  uploadedAt: string;
  category: 'documents' | 'buddy-contacts';
}

export interface ClaimsData {
  medicalVisits: MedicalVisit[];
  exposures: Exposure[];
  symptoms: SymptomEntry[];
  medications: Medication[];
  serviceHistory: ServiceEntry[];
  buddyContacts: BuddyContact[];
  documents: DocumentItem[];
  migraines: MigraineEntry[];
  separationDate: string | null;
  uploadedDocuments: UploadedDocument[];
}
