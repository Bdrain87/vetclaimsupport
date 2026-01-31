import { useState, useEffect, useCallback } from 'react';
import type { ClaimsData, MedicalVisit, Exposure, SymptomEntry, Medication, ServiceEntry, BuddyContact, DocumentItem } from '@/types/claims';

const STORAGE_KEY = 'va-claims-tracker-data';

const defaultDocuments: DocumentItem[] = [
  { id: '1', name: 'Service Treatment Records (STRs)', description: 'Complete medical records from military service', status: 'Not Started', notes: '', count: 0 },
  { id: '2', name: 'DD-214', description: 'Certificate of Release or Discharge from Active Duty', status: 'Not Started', notes: '', count: 0 },
  { id: '3', name: 'Personnel Records', description: 'Official Military Personnel File (OMPF)', status: 'Not Started', notes: '', count: 0 },
  { id: '4', name: 'Deployment Orders', description: 'TDY/PCS orders and deployment documentation', status: 'Not Started', notes: '', count: 0 },
  { id: '5', name: 'Training Records', description: 'AF Form 623, training certifications', status: 'Not Started', notes: '', count: 0 },
  { id: '6', name: 'Performance Reports', description: 'EPRs/OPRs documenting duties and conditions', status: 'Not Started', notes: '', count: 0 },
  { id: '7', name: 'Awards/Decorations', description: 'Citations that may indicate hazardous duty', status: 'Not Started', notes: '', count: 0 },
  { id: '8', name: 'Buddy Statements', description: 'Witness statements from fellow service members', status: 'Not Started', notes: '', count: 0 },
  { id: '9', name: 'Private Medical Records', description: 'Post-service civilian medical records', status: 'Not Started', notes: '', count: 0 },
  { id: '10', name: 'Nexus Letters', description: 'Doctor statements linking conditions to service', status: 'Not Started', notes: '', count: 0 },
];

const getInitialData = (): ClaimsData => {
  if (typeof window === 'undefined') {
    return {
      medicalVisits: [],
      exposures: [],
      symptoms: [],
      medications: [],
      serviceHistory: [],
      buddyContacts: [],
      documents: defaultDocuments,
      separationDate: null,
    };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      console.error('Failed to parse stored data');
    }
  }
  
  return {
    medicalVisits: [],
    exposures: [],
    symptoms: [],
    medications: [],
    serviceHistory: [],
    buddyContacts: [],
    documents: defaultDocuments,
    separationDate: null,
  };
};

export function useClaimsData() {
  const [data, setData] = useState<ClaimsData>(getInitialData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const generateId = () => crypto.randomUUID();

  // Medical Visits
  const addMedicalVisit = useCallback((visit: Omit<MedicalVisit, 'id'>) => {
    setData(prev => ({
      ...prev,
      medicalVisits: [...prev.medicalVisits, { ...visit, id: generateId() }],
    }));
  }, []);

  const updateMedicalVisit = useCallback((id: string, visit: Partial<MedicalVisit>) => {
    setData(prev => ({
      ...prev,
      medicalVisits: prev.medicalVisits.map(v => v.id === id ? { ...v, ...visit } : v),
    }));
  }, []);

  const deleteMedicalVisit = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      medicalVisits: prev.medicalVisits.filter(v => v.id !== id),
    }));
  }, []);

  // Exposures
  const addExposure = useCallback((exposure: Omit<Exposure, 'id'>) => {
    setData(prev => ({
      ...prev,
      exposures: [...prev.exposures, { ...exposure, id: generateId() }],
    }));
  }, []);

  const updateExposure = useCallback((id: string, exposure: Partial<Exposure>) => {
    setData(prev => ({
      ...prev,
      exposures: prev.exposures.map(e => e.id === id ? { ...e, ...exposure } : e),
    }));
  }, []);

  const deleteExposure = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      exposures: prev.exposures.filter(e => e.id !== id),
    }));
  }, []);

  // Symptoms
  const addSymptom = useCallback((symptom: Omit<SymptomEntry, 'id'>) => {
    setData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, { ...symptom, id: generateId() }],
    }));
  }, []);

  const updateSymptom = useCallback((id: string, symptom: Partial<SymptomEntry>) => {
    setData(prev => ({
      ...prev,
      symptoms: prev.symptoms.map(s => s.id === id ? { ...s, ...symptom } : s),
    }));
  }, []);

  const deleteSymptom = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(s => s.id !== id),
    }));
  }, []);

  // Medications
  const addMedication = useCallback((medication: Omit<Medication, 'id'>) => {
    setData(prev => ({
      ...prev,
      medications: [...prev.medications, { ...medication, id: generateId() }],
    }));
  }, []);

  const updateMedication = useCallback((id: string, medication: Partial<Medication>) => {
    setData(prev => ({
      ...prev,
      medications: prev.medications.map(m => m.id === id ? { ...m, ...medication } : m),
    }));
  }, []);

  const deleteMedication = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m.id !== id),
    }));
  }, []);

  // Service History
  const addServiceEntry = useCallback((entry: Omit<ServiceEntry, 'id'>) => {
    setData(prev => ({
      ...prev,
      serviceHistory: [...prev.serviceHistory, { ...entry, id: generateId() }],
    }));
  }, []);

  const updateServiceEntry = useCallback((id: string, entry: Partial<ServiceEntry>) => {
    setData(prev => ({
      ...prev,
      serviceHistory: prev.serviceHistory.map(s => s.id === id ? { ...s, ...entry } : s),
    }));
  }, []);

  const deleteServiceEntry = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      serviceHistory: prev.serviceHistory.filter(s => s.id !== id),
    }));
  }, []);

  // Buddy Contacts
  const addBuddyContact = useCallback((contact: Omit<BuddyContact, 'id'>) => {
    setData(prev => ({
      ...prev,
      buddyContacts: [...prev.buddyContacts, { ...contact, id: generateId() }],
    }));
  }, []);

  const updateBuddyContact = useCallback((id: string, contact: Partial<BuddyContact>) => {
    setData(prev => ({
      ...prev,
      buddyContacts: prev.buddyContacts.map(c => c.id === id ? { ...c, ...contact } : c),
    }));
  }, []);

  const deleteBuddyContact = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      buddyContacts: prev.buddyContacts.filter(c => c.id !== id),
    }));
  }, []);

  // Documents
  const updateDocument = useCallback((id: string, doc: Partial<DocumentItem>) => {
    setData(prev => ({
      ...prev,
      documents: prev.documents.map(d => d.id === id ? { ...d, ...doc } : d),
    }));
  }, []);

  // Separation Date
  const setSeparationDate = useCallback((date: string | null) => {
    setData(prev => ({
      ...prev,
      separationDate: date,
    }));
  }, []);

  return {
    data,
    addMedicalVisit,
    updateMedicalVisit,
    deleteMedicalVisit,
    addExposure,
    updateExposure,
    deleteExposure,
    addSymptom,
    updateSymptom,
    deleteSymptom,
    addMedication,
    updateMedication,
    deleteMedication,
    addServiceEntry,
    updateServiceEntry,
    deleteServiceEntry,
    addBuddyContact,
    updateBuddyContact,
    deleteBuddyContact,
    updateDocument,
    setSeparationDate,
  };
}
