import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ClaimsData, MedicalVisit, Exposure, SymptomEntry, Medication,
  ServiceEntry, BuddyContact, DocumentItem, MigraineEntry,
  UploadedDocument, SleepEntry, ClaimCondition, QuickLogEntry,
  Deadline, PTSDSymptomEntry, CombatEntry, MajorEvent,
  DeploymentEntry, ApprovedCondition, JourneyProgress,
} from '@/types/claims';
import type { EvidenceDocument, DocumentCategory, AttachableEntryType } from '@/types/documents';
import type { ClaimDocument, ClaimDocumentType } from '@/types/claimDocuments';
import {
  storeFileData,
  getFileData,
  deleteFileData,
  INDEXEDDB_THRESHOLD,
  isIndexedDBAvailable,
} from '@/lib/indexedDB';

// ===== USER CONDITION TYPE (moved from context/user-conditions-context.ts) =====

export interface UserCondition {
  id: string;
  conditionId: string;
  rating?: number;
  serviceConnected: boolean;
  claimStatus: 'pending' | 'approved' | 'denied' | 'appeal';
  isPrimary: boolean;
  linkedPrimaryId?: string;
  notes?: string;
  dateAdded: string;
  bodyPart?: string;
}

// ===== DEFAULT DOCUMENTS CHECKLIST =====

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

// ===== DUTY STATION TYPE =====

export interface DutyStation {
  id: string;
  baseName: string;
  startDate: string;
  endDate: string;
}

// ===== STORE INTERFACE =====

interface AppState {
  // --- Claims Data (from types/claims.ts ClaimsData) ---
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
  documentScanDisclaimerShown: boolean;
  milestonesAchieved: string[];
  approvedConditions: ApprovedCondition[];
  journeyProgress: JourneyProgress;
  dutyStations: DutyStation[];

  // --- User Conditions (from UserConditionsContext) ---
  userConditions: UserCondition[];

  // --- Evidence Documents (from useEvidenceDocuments) ---
  evidenceDocuments: EvidenceDocument[];
  _evidenceLoading: Set<string>;

  // --- Claim Documents (from useClaimDocuments) ---
  claimDocuments: ClaimDocument[];
  _claimDocLoading: Set<string>;

  // ========== CLAIMS DATA METHODS ==========

  // Medical Visits
  addMedicalVisit: (visit: Omit<MedicalVisit, 'id'>) => void;
  updateMedicalVisit: (id: string, visit: Partial<MedicalVisit>) => void;
  deleteMedicalVisit: (id: string) => void;

  // Exposures
  addExposure: (exposure: Omit<Exposure, 'id'>) => void;
  updateExposure: (id: string, exposure: Partial<Exposure>) => void;
  deleteExposure: (id: string) => void;

  // Symptoms
  addSymptom: (symptom: Omit<SymptomEntry, 'id'>) => void;
  updateSymptom: (id: string, symptom: Partial<SymptomEntry>) => void;
  deleteSymptom: (id: string) => void;

  // Medications
  addMedication: (medication: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;

  // Service History
  addServiceEntry: (entry: Omit<ServiceEntry, 'id'>) => void;
  updateServiceEntry: (id: string, entry: Partial<ServiceEntry>) => void;
  deleteServiceEntry: (id: string) => void;

  // Combat History
  addCombatEntry: (entry: Omit<CombatEntry, 'id'>) => void;
  updateCombatEntry: (id: string, entry: Partial<CombatEntry>) => void;
  deleteCombatEntry: (id: string) => void;

  // Major Events
  addMajorEvent: (event: Omit<MajorEvent, 'id'>) => void;
  updateMajorEvent: (id: string, event: Partial<MajorEvent>) => void;
  deleteMajorEvent: (id: string) => void;

  // Deployments
  addDeployment: (deployment: Omit<DeploymentEntry, 'id'>) => void;
  updateDeployment: (id: string, deployment: Partial<DeploymentEntry>) => void;
  deleteDeployment: (id: string) => void;

  // Buddy Contacts
  addBuddyContact: (contact: Omit<BuddyContact, 'id'>) => void;
  updateBuddyContact: (id: string, contact: Partial<BuddyContact>) => void;
  deleteBuddyContact: (id: string) => void;

  // Document checklist
  updateDocument: (id: string, doc: Partial<DocumentItem>) => void;

  // Separation Date
  setSeparationDate: (date: string | null) => void;

  // Migraines
  addMigraine: (migraine: Omit<MigraineEntry, 'id'>) => void;
  updateMigraine: (id: string, migraine: Partial<MigraineEntry>) => void;
  deleteMigraine: (id: string) => void;

  // Uploaded Documents
  addUploadedDocument: (doc: Omit<UploadedDocument, 'id'>) => void;
  deleteUploadedDocument: (id: string) => void;

  // Sleep Entries
  addSleepEntry: (entry: Omit<SleepEntry, 'id'>) => void;
  updateSleepEntry: (id: string, entry: Partial<SleepEntry>) => void;
  deleteSleepEntry: (id: string) => void;

  // PTSD Symptoms
  addPTSDSymptom: (symptom: Omit<PTSDSymptomEntry, 'id'>) => void;
  updatePTSDSymptom: (id: string, symptom: Partial<PTSDSymptomEntry>) => void;
  deletePTSDSymptom: (id: string) => void;

  // Claim Conditions
  addClaimCondition: (condition: Omit<ClaimCondition, 'id'>) => void;
  updateClaimCondition: (id: string, condition: Partial<ClaimCondition>) => void;
  deleteClaimCondition: (id: string) => void;

  // Document scan disclaimer
  setDocumentScanDisclaimerShown: (shown: boolean) => void;

  // Quick Logs
  addQuickLog: (log: Omit<QuickLogEntry, 'id'>) => void;
  deleteQuickLog: (id: string) => void;

  // Deadlines
  addDeadline: (deadline: Omit<Deadline, 'id'>) => void;
  updateDeadline: (id: string, deadline: Partial<Deadline>) => void;
  deleteDeadline: (id: string) => void;

  // Milestones
  addMilestone: (milestone: string) => void;

  // Approved Conditions
  addApprovedCondition: (condition: Omit<ApprovedCondition, 'id'>) => void;
  updateApprovedCondition: (id: string, condition: Partial<ApprovedCondition>) => void;
  deleteApprovedCondition: (id: string) => void;

  // Journey Progress
  setJourneyProgress: (progress: Partial<JourneyProgress>) => void;

  // Duty Stations
  addDutyStation: (station: Omit<DutyStation, 'id'>) => void;
  removeDutyStation: (id: string) => void;

  // ========== USER CONDITIONS METHODS ==========

  addUserCondition: (condition: UserCondition) => void;
  removeUserCondition: (id: string) => void;
  updateUserCondition: (id: string, updates: Partial<UserCondition>) => void;
  clearAllUserConditions: () => void;

  // ========== EVIDENCE DOCUMENT METHODS ==========

  addEvidenceDocument: (doc: Omit<EvidenceDocument, 'id' | 'storageType'>) => Promise<string>;
  updateEvidenceDocument: (id: string, updates: Partial<EvidenceDocument>) => Promise<void>;
  deleteEvidenceDocument: (id: string) => Promise<void>;
  linkToEntry: (docId: string, entryType: AttachableEntryType, entryId: string) => void;
  unlinkFromEntry: (docId: string, entryType: AttachableEntryType, entryId: string) => void;
  setAllEvidenceDocuments: (docs: EvidenceDocument[]) => void;
  _hydrateEvidenceDocuments: () => Promise<void>;

  // ========== CLAIM DOCUMENT METHODS ==========

  addClaimDocument: (doc: Omit<ClaimDocument, 'id' | 'storageType'>) => Promise<string>;
  deleteClaimDocument: (id: string) => Promise<void>;
  _hydrateClaimDocuments: () => Promise<void>;

  // ========== GLOBAL ==========

  resetAllData: () => void;
}

// ===== HELPER =====

const generateId = () => crypto.randomUUID();

// ===== INITIAL STATE =====

const initialState = {
  // Claims data
  medicalVisits: [] as MedicalVisit[],
  exposures: [] as Exposure[],
  symptoms: [] as SymptomEntry[],
  medications: [] as Medication[],
  serviceHistory: [] as ServiceEntry[],
  combatHistory: [] as CombatEntry[],
  majorEvents: [] as MajorEvent[],
  deployments: [] as DeploymentEntry[],
  buddyContacts: [] as BuddyContact[],
  documents: defaultDocuments,
  migraines: [] as MigraineEntry[],
  sleepEntries: [] as SleepEntry[],
  ptsdSymptoms: [] as PTSDSymptomEntry[],
  separationDate: null as string | null,
  uploadedDocuments: [] as UploadedDocument[],
  claimConditions: [] as ClaimCondition[],
  quickLogs: [] as QuickLogEntry[],
  deadlines: [] as Deadline[],
  documentScanDisclaimerShown: false,
  milestonesAchieved: [] as string[],
  approvedConditions: [] as ApprovedCondition[],
  journeyProgress: { currentPhase: 0, completedChecklist: {} } as JourneyProgress,
  dutyStations: [] as DutyStation[],

  // User conditions
  userConditions: [] as UserCondition[],

  // Evidence documents
  evidenceDocuments: [] as EvidenceDocument[],
  _evidenceLoading: new Set<string>(),

  // Claim documents
  claimDocuments: [] as ClaimDocument[],
  _claimDocLoading: new Set<string>(),
};

// ===== THE ONE STORE =====

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========== CLAIMS DATA METHODS ==========

      // Medical Visits
      addMedicalVisit: (visit) => set((s) => ({
        medicalVisits: [...s.medicalVisits, { ...visit, id: generateId() }],
      })),
      updateMedicalVisit: (id, visit) => set((s) => ({
        medicalVisits: s.medicalVisits.map((v) => v.id === id ? { ...v, ...visit } : v),
      })),
      deleteMedicalVisit: (id) => set((s) => ({
        medicalVisits: s.medicalVisits.filter((v) => v.id !== id),
      })),

      // Exposures
      addExposure: (exposure) => set((s) => ({
        exposures: [...s.exposures, { ...exposure, id: generateId() }],
      })),
      updateExposure: (id, exposure) => set((s) => ({
        exposures: s.exposures.map((e) => e.id === id ? { ...e, ...exposure } : e),
      })),
      deleteExposure: (id) => set((s) => ({
        exposures: s.exposures.filter((e) => e.id !== id),
      })),

      // Symptoms
      addSymptom: (symptom) => set((s) => ({
        symptoms: [...s.symptoms, { ...symptom, id: generateId() }],
      })),
      updateSymptom: (id, symptom) => set((s) => ({
        symptoms: s.symptoms.map((sym) => sym.id === id ? { ...sym, ...symptom } : sym),
      })),
      deleteSymptom: (id) => set((s) => ({
        symptoms: s.symptoms.filter((sym) => sym.id !== id),
      })),

      // Medications
      addMedication: (medication) => set((s) => ({
        medications: [...s.medications, { ...medication, id: generateId() }],
      })),
      updateMedication: (id, medication) => set((s) => ({
        medications: s.medications.map((m) => m.id === id ? { ...m, ...medication } : m),
      })),
      deleteMedication: (id) => set((s) => ({
        medications: s.medications.filter((m) => m.id !== id),
      })),

      // Service History
      addServiceEntry: (entry) => set((s) => ({
        serviceHistory: [...s.serviceHistory, { ...entry, id: generateId() }],
      })),
      updateServiceEntry: (id, entry) => set((s) => ({
        serviceHistory: s.serviceHistory.map((e) => e.id === id ? { ...e, ...entry } : e),
      })),
      deleteServiceEntry: (id) => set((s) => ({
        serviceHistory: s.serviceHistory.filter((e) => e.id !== id),
      })),

      // Combat History
      addCombatEntry: (entry) => set((s) => ({
        combatHistory: [...(s.combatHistory || []), { ...entry, id: generateId() }],
      })),
      updateCombatEntry: (id, entry) => set((s) => ({
        combatHistory: (s.combatHistory || []).map((c) => c.id === id ? { ...c, ...entry } : c),
      })),
      deleteCombatEntry: (id) => set((s) => ({
        combatHistory: (s.combatHistory || []).filter((c) => c.id !== id),
      })),

      // Major Events
      addMajorEvent: (event) => set((s) => ({
        majorEvents: [...(s.majorEvents || []), { ...event, id: generateId() }],
      })),
      updateMajorEvent: (id, event) => set((s) => ({
        majorEvents: (s.majorEvents || []).map((e) => e.id === id ? { ...e, ...event } : e),
      })),
      deleteMajorEvent: (id) => set((s) => ({
        majorEvents: (s.majorEvents || []).filter((e) => e.id !== id),
      })),

      // Deployments
      addDeployment: (deployment) => set((s) => ({
        deployments: [...(s.deployments || []), { ...deployment, id: generateId() }],
      })),
      updateDeployment: (id, deployment) => set((s) => ({
        deployments: (s.deployments || []).map((d) => d.id === id ? { ...d, ...deployment } : d),
      })),
      deleteDeployment: (id) => set((s) => ({
        deployments: (s.deployments || []).filter((d) => d.id !== id),
      })),

      // Buddy Contacts
      addBuddyContact: (contact) => set((s) => ({
        buddyContacts: [...s.buddyContacts, { ...contact, id: generateId() }],
      })),
      updateBuddyContact: (id, contact) => set((s) => ({
        buddyContacts: s.buddyContacts.map((c) => c.id === id ? { ...c, ...contact } : c),
      })),
      deleteBuddyContact: (id) => set((s) => ({
        buddyContacts: s.buddyContacts.filter((c) => c.id !== id),
      })),

      // Document checklist
      updateDocument: (id, doc) => set((s) => ({
        documents: s.documents.map((d) => d.id === id ? { ...d, ...doc } : d),
      })),

      // Separation Date
      setSeparationDate: (date) => set({ separationDate: date }),

      // Migraines
      addMigraine: (migraine) => set((s) => ({
        migraines: [...s.migraines, { ...migraine, id: generateId() }],
      })),
      updateMigraine: (id, migraine) => set((s) => ({
        migraines: s.migraines.map((m) => m.id === id ? { ...m, ...migraine } : m),
      })),
      deleteMigraine: (id) => set((s) => ({
        migraines: s.migraines.filter((m) => m.id !== id),
      })),

      // Uploaded Documents
      addUploadedDocument: (doc) => set((s) => ({
        uploadedDocuments: [...s.uploadedDocuments, { ...doc, id: generateId() }],
      })),
      deleteUploadedDocument: (id) => set((s) => ({
        uploadedDocuments: s.uploadedDocuments.filter((d) => d.id !== id),
      })),

      // Sleep Entries
      addSleepEntry: (entry) => set((s) => ({
        sleepEntries: [...(s.sleepEntries || []), { ...entry, id: generateId() }],
      })),
      updateSleepEntry: (id, entry) => set((s) => ({
        sleepEntries: (s.sleepEntries || []).map((e) => e.id === id ? { ...e, ...entry } : e),
      })),
      deleteSleepEntry: (id) => set((s) => ({
        sleepEntries: (s.sleepEntries || []).filter((e) => e.id !== id),
      })),

      // PTSD Symptoms
      addPTSDSymptom: (symptom) => set((s) => ({
        ptsdSymptoms: [...(s.ptsdSymptoms || []), { ...symptom, id: generateId() }],
      })),
      updatePTSDSymptom: (id, symptom) => set((s) => ({
        ptsdSymptoms: (s.ptsdSymptoms || []).map((p) => p.id === id ? { ...p, ...symptom } : p),
      })),
      deletePTSDSymptom: (id) => set((s) => ({
        ptsdSymptoms: (s.ptsdSymptoms || []).filter((p) => p.id !== id),
      })),

      // Claim Conditions
      addClaimCondition: (condition) => set((s) => ({
        claimConditions: [...(s.claimConditions || []), { ...condition, id: generateId() }],
      })),
      updateClaimCondition: (id, condition) => set((s) => ({
        claimConditions: (s.claimConditions || []).map((c) => c.id === id ? { ...c, ...condition } : c),
      })),
      deleteClaimCondition: (id) => set((s) => ({
        claimConditions: (s.claimConditions || []).filter((c) => c.id !== id),
      })),

      // Document scan disclaimer
      setDocumentScanDisclaimerShown: (shown) => set({ documentScanDisclaimerShown: shown }),

      // Quick Logs
      addQuickLog: (log) => set((s) => ({
        quickLogs: [...(s.quickLogs || []), { ...log, id: generateId() }],
      })),
      deleteQuickLog: (id) => set((s) => ({
        quickLogs: (s.quickLogs || []).filter((l) => l.id !== id),
      })),

      // Deadlines
      addDeadline: (deadline) => set((s) => ({
        deadlines: [...(s.deadlines || []), { ...deadline, id: generateId() }],
      })),
      updateDeadline: (id, deadline) => set((s) => ({
        deadlines: (s.deadlines || []).map((d) => d.id === id ? { ...d, ...deadline } : d),
      })),
      deleteDeadline: (id) => set((s) => ({
        deadlines: (s.deadlines || []).filter((d) => d.id !== id),
      })),

      // Milestones
      addMilestone: (milestone) => set((s) => ({
        milestonesAchieved: [...new Set([...(s.milestonesAchieved || []), milestone])],
      })),

      // Approved Conditions
      addApprovedCondition: (condition) => set((s) => ({
        approvedConditions: [...(s.approvedConditions || []), { ...condition, id: generateId() }],
      })),
      updateApprovedCondition: (id, condition) => set((s) => ({
        approvedConditions: (s.approvedConditions || []).map((c) => c.id === id ? { ...c, ...condition } : c),
      })),
      deleteApprovedCondition: (id) => set((s) => ({
        approvedConditions: (s.approvedConditions || []).filter((c) => c.id !== id),
      })),

      // Journey Progress
      setJourneyProgress: (progress) => set((s) => ({
        journeyProgress: { ...(s.journeyProgress || { currentPhase: 0, completedChecklist: {} }), ...progress },
      })),

      // Duty Stations
      addDutyStation: (station) => set((s) => ({
        dutyStations: [...(s.dutyStations || []), { ...station, id: generateId() }],
      })),
      removeDutyStation: (id) => set((s) => ({
        dutyStations: (s.dutyStations || []).filter((d) => d.id !== id),
      })),

      // ========== USER CONDITIONS METHODS ==========

      addUserCondition: (condition) => set((s) => ({
        userConditions: [...s.userConditions, condition],
      })),

      removeUserCondition: (id) => set((s) => {
        const conditionToRemove = s.userConditions.find((c) => c.id === id);
        if (conditionToRemove?.isPrimary) {
          // Also remove linked secondary conditions
          return { userConditions: s.userConditions.filter((c) => c.id !== id && c.linkedPrimaryId !== id) };
        }
        return { userConditions: s.userConditions.filter((c) => c.id !== id) };
      }),

      updateUserCondition: (id, updates) => set((s) => ({
        userConditions: s.userConditions.map((c) => c.id === id ? { ...c, ...updates } : c),
      })),

      clearAllUserConditions: () => set({ userConditions: [] }),

      // ========== EVIDENCE DOCUMENT METHODS ==========

      addEvidenceDocument: async (doc) => {
        const id = generateId();
        const fileSize = doc.dataUrl.length;
        const useIndexedDB = isIndexedDBAvailable() && fileSize > INDEXEDDB_THRESHOLD;

        if (useIndexedDB) {
          await storeFileData(id, doc.dataUrl);
        }

        const newDoc: EvidenceDocument = {
          ...doc,
          id,
          storageType: useIndexedDB ? 'indexedDB' : 'localStorage',
        };

        set((s) => ({ evidenceDocuments: [...s.evidenceDocuments, newDoc] }));
        return id;
      },

      updateEvidenceDocument: async (id, updates) => {
        const { evidenceDocuments } = get();
        const doc = evidenceDocuments.find((d) => d.id === id);

        if (updates.dataUrl && doc) {
          const newSize = updates.dataUrl.length;
          const shouldUseIndexedDB = isIndexedDBAvailable() && newSize > INDEXEDDB_THRESHOLD;

          if (doc.storageType === 'indexedDB' && !shouldUseIndexedDB) {
            await deleteFileData(id);
          }

          if (shouldUseIndexedDB) {
            await storeFileData(id, updates.dataUrl);
          }

          updates = { ...updates, storageType: shouldUseIndexedDB ? 'indexedDB' : 'localStorage' };
        }

        set((s) => ({
          evidenceDocuments: s.evidenceDocuments.map((d) => d.id === id ? { ...d, ...updates } : d),
        }));
      },

      deleteEvidenceDocument: async (id) => {
        const { evidenceDocuments } = get();
        const doc = evidenceDocuments.find((d) => d.id === id);

        if (doc?.storageType === 'indexedDB') {
          await deleteFileData(id);
        }

        set((s) => ({
          evidenceDocuments: s.evidenceDocuments.filter((d) => d.id !== id),
        }));
      },

      linkToEntry: (docId, entryType, entryId) => set((s) => ({
        evidenceDocuments: s.evidenceDocuments.map((doc) => {
          if (doc.id === docId) {
            const alreadyLinked = doc.linkedEntries.some(
              (link) => link.entryType === entryType && link.entryId === entryId,
            );
            if (alreadyLinked) return doc;
            return {
              ...doc,
              linkedEntries: [...doc.linkedEntries, {
                entryType,
                entryId,
                linkedAt: new Date().toISOString(),
              }],
            };
          }
          return doc;
        }),
      })),

      unlinkFromEntry: (docId, entryType, entryId) => set((s) => ({
        evidenceDocuments: s.evidenceDocuments.map((doc) => {
          if (doc.id === docId) {
            return {
              ...doc,
              linkedEntries: doc.linkedEntries.filter(
                (link) => !(link.entryType === entryType && link.entryId === entryId),
              ),
            };
          }
          return doc;
        }),
      })),

      setAllEvidenceDocuments: (docs) => set({ evidenceDocuments: docs }),

      _hydrateEvidenceDocuments: async () => {
        const { evidenceDocuments } = get();
        const docsNeedingData = evidenceDocuments.filter(
          (doc) => doc.storageType === 'indexedDB' && !doc.dataUrl,
        );

        if (docsNeedingData.length === 0) return;

        const ids = new Set(docsNeedingData.map((d) => d.id));
        set({ _evidenceLoading: ids });

        const updates: Record<string, string> = {};
        for (const doc of docsNeedingData) {
          const data = await getFileData(doc.id);
          if (data) {
            updates[doc.id] = data;
          }
        }

        if (Object.keys(updates).length > 0) {
          set((s) => ({
            evidenceDocuments: s.evidenceDocuments.map((doc) =>
              updates[doc.id] ? { ...doc, dataUrl: updates[doc.id] } : doc,
            ),
          }));
        }

        set({ _evidenceLoading: new Set() });
      },

      // ========== CLAIM DOCUMENT METHODS ==========

      addClaimDocument: async (doc) => {
        const id = generateId();
        const fileSize = doc.dataUrl.length;
        const useIndexedDB = isIndexedDBAvailable() && fileSize > INDEXEDDB_THRESHOLD;

        if (useIndexedDB) {
          await storeFileData(id, doc.dataUrl);
        }

        const newDoc: ClaimDocument = {
          ...doc,
          id,
          storageType: useIndexedDB ? 'indexedDB' : 'localStorage',
        };

        set((s) => ({ claimDocuments: [...s.claimDocuments, newDoc] }));
        return id;
      },

      deleteClaimDocument: async (id) => {
        const { claimDocuments } = get();
        const doc = claimDocuments.find((d) => d.id === id);

        if (doc?.storageType === 'indexedDB') {
          await deleteFileData(id);
        }

        set((s) => ({
          claimDocuments: s.claimDocuments.filter((d) => d.id !== id),
        }));
      },

      _hydrateClaimDocuments: async () => {
        const { claimDocuments } = get();
        const docsNeedingData = claimDocuments.filter(
          (doc) => doc.storageType === 'indexedDB' && !doc.dataUrl,
        );

        if (docsNeedingData.length === 0) return;

        const ids = new Set(docsNeedingData.map((d) => d.id));
        set({ _claimDocLoading: ids });

        const updates: Record<string, string> = {};
        for (const doc of docsNeedingData) {
          const data = await getFileData(doc.id);
          if (data) {
            updates[doc.id] = data;
          }
        }

        if (Object.keys(updates).length > 0) {
          set((s) => ({
            claimDocuments: s.claimDocuments.map((doc) =>
              updates[doc.id] ? { ...doc, dataUrl: updates[doc.id] } : doc,
            ),
          }));
        }

        set({ _claimDocLoading: new Set() });
      },

      // ========== GLOBAL ==========

      resetAllData: () => set({ ...initialState }),
    }),
    {
      name: 'vcs-app-data',
      version: 1,
      partialize: (state) => {
        // Strip non-serializable fields and large dataUrl from IndexedDB docs
        const { _evidenceLoading, _claimDocLoading, ...rest } = state;
        return {
          ...rest,
          evidenceDocuments: state.evidenceDocuments.map((doc) =>
            doc.storageType === 'indexedDB' ? { ...doc, dataUrl: '' } : doc,
          ),
          claimDocuments: state.claimDocuments.map((doc) =>
            doc.storageType === 'indexedDB' ? { ...doc, dataUrl: '' } : doc,
          ),
        };
      },
    },
  ),
);

export default useAppStore;
