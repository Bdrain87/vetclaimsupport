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
  relatedCondition?: string; // Links to a claimed condition
}

export type ExposureType = 
  | 'Burn pit' 
  | 'Jet fuel' 
  | 'Chemicals' 
  | 'Noise' 
  | 'Radiation' 
  | 'Asbestos' 
  | 'Extreme temps'
  | 'Diesel exhaust'
  | 'Depleted uranium'
  | 'Sand/dust'
  | 'Contaminated water (Camp Lejeune)'
  | 'Herbicides'
  | 'Paint fumes'
  | 'Hydraulic fluid'
  | 'PFAS chemicals'
  | 'Contaminated water'
  | 'Other';

export interface Exposure {
  id: string;
  date: string;
  type: ExposureType;
  duration: string;
  location: string;
  details: string;
  ppeProvided: boolean;
  witnesses: string;
}

// Simplified VA-relevant frequency options
export type SymptomFrequency = 
  | 'Constant'
  | 'Daily'
  | 'Several times per week'
  | 'Weekly'
  | 'Monthly'
  | 'Occasional';

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

// VA Economic Impact for 50% rating documentation
export type EconomicImpactType = 
  | 'none'
  | 'reduced_hours'
  | 'missed_partial_day'
  | 'missed_full_day'
  | 'missed_multiple_days'
  | 'left_early'
  | 'called_out';

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
  // VA-specific fields for rating criteria alignment
  wasProstrating: boolean; // Explicit VA metric - required bed rest?
  requiredBedRest: boolean; // Could not function at all?
  couldNotWork: boolean; // Unable to perform job duties?
  economicImpact?: EconomicImpactType;
  hoursLostToMigraine?: number; // Hours of work/productivity lost
  medicationEffective?: boolean; // Did treatment help?
  functioningLevel?: number; // 0-100% functioning during attack
}

// Sleep Tracker types
export type SleepQuality = 'Very Poor' | 'Poor' | 'Fair' | 'Good' | 'Excellent';

// PTSD Symptom frequency options
export type PTSDSymptomFrequency = 'Daily' | 'Several times/week' | 'Weekly' | 'Monthly' | 'Occasional';

// Individual symptom with frequency
export interface PTSDSymptomWithFrequency {
  symptomId: string;
  frequency: PTSDSymptomFrequency;
}

// PTSD Symptom Entry for 38 CFR 4.130 tracking
export interface PTSDSymptomEntry {
  id: string;
  date: string;
  selectedSymptoms: string[]; // Legacy: IDs of symptoms from the checklist
  symptomFrequencies?: PTSDSymptomWithFrequency[]; // New: symptoms with frequency
  overallSeverity: number; // 1-10
  occupationalImpairment: string;
  socialImpairment: string;
  notes: string;
  triggeredBy?: string;
}

export interface SleepEntry {
  id: string;
  date: string;
  hoursSlept: number;
  quality: SleepQuality;
  usesCPAP: boolean;
  cpapUsedLastNight?: boolean;
  interruptions: number;
  nightmares: boolean;
  notes: string;
}

// Document type identifiers for categorizing uploads
export type DocumentTypeId = 'str' | 'dd214' | 'personnel' | 'medical-records' | 'nexus' | 'buddy-statement' | 'other';

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
  documentType?: DocumentTypeId; // Which document type this belongs to
  customLabel?: string; // For "other" documents, user-provided label
}

// Claim Builder types
export interface ClaimCondition {
  id: string;
  name: string;
  linkedMedicalVisits: string[];
  linkedExposures: string[];
  linkedSymptoms: string[];
  linkedDocuments: string[];
  linkedBuddyContacts: string[];
  notes: string;
  createdAt: string;
}

// Deadline types
export type DeadlineType = 
  | 'intent_to_file' 
  | 'cp_exam' 
  | 'nod_appeal' 
  | 'hlr_appeal' 
  | 'supplemental_claim'
  | 'custom';

export interface Deadline {
  id: string;
  type: DeadlineType;
  title: string;
  date: string; // ISO date string
  notes: string;
  completed: boolean;
  createdAt: string;
}

// Quick Log Entry for daily tracking
export interface QuickLogEntry {
  id: string;
  date: string;
  overallFeeling: number; // 1-10
  hadFlareUp: boolean;
  flareUpNote: string;
  cpapUsed?: boolean;
  painLevel?: number;
  createdAt: string;
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
  sleepEntries: SleepEntry[];
  ptsdSymptoms: PTSDSymptomEntry[];
  separationDate: string | null;
  uploadedDocuments: UploadedDocument[];
  claimConditions: ClaimCondition[];
  quickLogs: QuickLogEntry[];
  deadlines: Deadline[];
  documentScanDisclaimerShown?: boolean;
  // Milestones tracking
  milestonesAchieved?: string[];
}
