// Types for VA Claims Tracker

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
}

export interface ClaimsData {
  medicalVisits: MedicalVisit[];
  exposures: Exposure[];
  symptoms: SymptomEntry[];
  medications: Medication[];
  serviceHistory: ServiceEntry[];
  buddyContacts: BuddyContact[];
  documents: DocumentItem[];
  separationDate: string | null;
}
