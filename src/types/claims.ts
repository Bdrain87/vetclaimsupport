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

// Combat Zone Entry for tracking hostile fire, imminent danger pay
export interface CombatEntry {
  id: string;
  startDate: string;
  endDate: string;
  location: string; // Combat zone name/country
  combatZoneType: 'Combat Zone' | 'Hostile Fire Area' | 'Imminent Danger Area' | 'Hazardous Duty';
  receivedHostileFirePay: boolean;
  receivedImmDangerPay: boolean;
  directCombat: boolean;
  description: string;
  awards?: string; // Combat-related awards (CAB, CIB, Purple Heart, etc.)
}

// Major Event for tracking significant incidents during service
export type MajorEventType = 
  | 'Injury' 
  | 'Accident' 
  | 'Assault/MST' 
  | 'Award/Decoration'
  | 'TBI Event'
  | 'Traumatic Event'
  | 'Line of Duty Investigation'
  | 'Other';

export interface MajorEvent {
  id: string;
  date: string;
  type: MajorEventType;
  title: string;
  location: string;
  description: string;
  documented: boolean; // Was this documented in service records?
  witnesses: string;
  linkedConditions?: string[]; // Conditions this event relates to
}

// Deployment Entry (separate from duty stations)
export interface DeploymentEntry {
  id: string;
  startDate: string;
  endDate: string;
  operationName: string; // e.g., OEF, OIF, OND
  location: string;
  unit: string;
  role: string;
  combatDeployment: boolean;
  hazardsEncountered: string;
  notes: string;
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
  impact: MigraineImpact; // Legacy: single value for backwards compatibility
  impacts?: MigraineImpact[]; // New: multi-select impacts
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

// Sleep Apnea Severity for VA rating alignment (38 CFR 4.97 DC 6847)
export type SleepApneaSeverity = 'None' | 'Mild' | 'Moderate' | 'Severe';

// Daytime symptoms for Sleep Apnea rating
export type DaytimeSleepiness = 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Persistent hypersomnolence';

export interface SleepEntry {
  id: string;
  date: string;
  hoursSlept: number;
  quality: SleepQuality;
  usesCPAP: boolean;
  cpapUsedLastNight?: boolean;
  cpapHoursUsed?: number; // Hours CPAP was used (VA checks compliance)
  interruptions: number;
  nightmares: boolean;
  notes: string;
  // VA Sleep Apnea Rating Fields (DC 6847)
  apneaEpisodes?: number; // Number of breathing cessation episodes
  oxygenDesaturation?: boolean; // Did oxygen levels drop?
  lowestOxygenLevel?: number; // Lowest O2 saturation if known
  requiresOxygen?: boolean; // Requires supplemental oxygen
  chronicRespiratoryFailure?: boolean; // Chronic respiratory failure (100% rating)
  daytimeSleepiness?: DaytimeSleepiness;
  timesWokeGasping?: number; // Times woke up gasping/choking
  spouseObserved?: boolean; // Spouse/partner witnessed apnea
  morningHeadache?: boolean; // Woke with headache (common apnea symptom)
  feltRested?: boolean; // Did you feel rested upon waking?
  impactOnWork?: string; // How sleep affected work/activities
  severityRating?: number; // 1-10 severity scale
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
  combatHistory: CombatEntry[];
  majorEvents: MajorEvent[];
  deployments: DeploymentEntry[];
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
  // VA Approved Conditions
  approvedConditions?: ApprovedCondition[];
  // Claim Journey Progress
  journeyProgress?: JourneyProgress;
}

// Claim Journey Progress Tracking
export interface JourneyProgress {
  currentPhase: number;
  completedChecklist: Record<string, boolean>;
  phaseCompletedDates?: Record<string, string>;
}

// VA Approved Condition - already service-connected with rating
export type BodyPart = 
  | 'left_arm' | 'right_arm' 
  | 'left_leg' | 'right_leg' 
  | 'left_hand' | 'right_hand'
  | 'left_foot' | 'right_foot'
  | 'left_knee' | 'right_knee'
  | 'left_hip' | 'right_hip'
  | 'left_shoulder' | 'right_shoulder'
  | 'left_elbow' | 'right_elbow'
  | 'left_ankle' | 'right_ankle'
  | 'left_wrist' | 'right_wrist'
  | 'other';

export interface ApprovedCondition {
  id: string;
  name: string;
  rating: number; // 0-100 in increments of 10
  effectiveDate: string; // ISO date string
  bodyPart: BodyPart;
  createdAt: string;
}
