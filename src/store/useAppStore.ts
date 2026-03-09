import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptedStorage } from '@/lib/encryptedStorage';
import { createDebouncedStorage } from '@/lib/debouncedStorage';
import { logger } from '@/utils/logger';
import { resolveConditionId, isSuspiciousConditionId } from '@/utils/conditionResolver';
import { canAddCondition, canAddHealthLog } from '@/services/entitlements';
import type {
  MedicalVisit, Exposure, SymptomEntry, Medication,
  ServiceEntry, BuddyContact, DocumentItem, MigraineEntry,
  UploadedDocument, SleepEntry, ClaimCondition, QuickLogEntry,
  Deadline, PTSDSymptomEntry, CombatEntry, MajorEvent,
  DeploymentEntry, ApprovedCondition, JourneyProgress,
  EmploymentImpactEntry,
} from '@/types/claims';
import type { EvidenceDocument, AttachableEntryType } from '@/types/documents';
import type { ClaimDocument } from '@/types/claimDocuments';
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
  /** Display name override (for conditions not in VA database) */
  displayName?: string;
  rating?: number;
  serviceConnected: boolean;
  claimStatus: 'pending' | 'approved' | 'denied' | 'appeal';
  isPrimary: boolean;
  linkedPrimaryId?: string;
  notes?: string;
  dateAdded: string;
  bodyPart?: string;
  /** ICD-10 code if known */
  icd10Code?: string;
  /** VA diagnostic code */
  vaDiagnosticCode?: string;
  /** How the condition is connected to service */
  connectionType?: 'direct' | 'secondary' | 'presumptive' | 'aggravation';
  /** Linked exposure type (burn_pit, agent_orange, etc.) */
  linkedExposure?: string;
  /** Linked conflict ID */
  linkedConflict?: string;
  /** ID of primary condition if secondary */
  secondaryTo?: string;
  /** Number of times condition has been selected/used across tools */
  usageCount?: number;
  /** Last time this condition was selected in any tool */
  lastUsed?: string;
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
  { id: '10', name: 'Doctor Summaries', description: 'Doctor statements linking conditions to service', status: 'Not Started', notes: '', count: 0 },
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
  uploadedDocuments: UploadedDocument[];
  claimConditions: ClaimCondition[];
  quickLogs: QuickLogEntry[];
  deadlines: Deadline[];
  documentScanDisclaimerShown: boolean;
  milestonesAchieved: string[];
  approvedConditions: ApprovedCondition[];
  journeyProgress: JourneyProgress;
  dutyStations: DutyStation[];
  employmentImpactEntries: EmploymentImpactEntry[];

  // --- Form Guide Drafts ---
  formDrafts: Record<string, Record<string, string> & { lastModified: string }>;

  // --- Per-Condition Journey Progress ---
  conditionJourneyProgress: Record<string, { completedSteps: string[]; startedAt: string }>;

  // --- User Conditions (from UserConditionsContext) ---
  userConditions: UserCondition[];

  // --- Conflict & Deployment Selections ---
  selectedConflicts: string[];          // conflict IDs from deployment-locations.json
  selectedLocations: string[];          // "conflictId::locationName" composite keys
  customLocations: string[];            // free-text "other" locations

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

  // Form Guide Drafts
  setFormDraft: (formId: string, fieldId: string, value: string) => void;
  clearFormDraft: (formId: string) => void;

  // Per-Condition Journey Progress
  completeConditionJourneyStep: (conditionId: string, stepId: string) => void;
  resetConditionJourney: (conditionId: string) => void;

  // Employment Impact
  addEmploymentImpact: (entry: Omit<EmploymentImpactEntry, 'id'>) => void;
  deleteEmploymentImpact: (id: string) => void;

  // ========== USER CONDITIONS METHODS ==========

  addUserCondition: (condition: UserCondition) => void;
  removeUserCondition: (id: string) => void;
  updateUserCondition: (id: string, updates: Partial<UserCondition>) => void;
  clearAllUserConditions: () => void;
  incrementConditionUsage: (id: string) => void;

  // ========== CONFLICT & DEPLOYMENT METHODS ==========

  toggleConflict: (conflictId: string) => void;
  setSelectedConflicts: (conflictIds: string[]) => void;
  toggleLocation: (conflictId: string, locationName: string) => void;
  setSelectedLocations: (locationKeys: string[]) => void;
  addCustomLocation: (location: string) => void;
  removeCustomLocation: (location: string) => void;

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

  // ========== EVIDENCE CHECKLIST (per condition) ==========

  conditionEvidenceChecks: Record<string, string[]>;
  toggleEvidenceCheck: (conditionId: string, item: string) => void;

  // ========== GLOBAL ==========

  resetAllData: () => void;
}

// ===== HELPER =====

const generateId = () => crypto.randomUUID();

// Hydration guards to prevent concurrent _hydrateXxx calls
let _evidenceHydrating = false;
let _claimDocHydrating = false;

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
  uploadedDocuments: [] as UploadedDocument[],
  claimConditions: [] as ClaimCondition[],
  quickLogs: [] as QuickLogEntry[],
  deadlines: [] as Deadline[],
  documentScanDisclaimerShown: false,
  milestonesAchieved: [] as string[],
  approvedConditions: [] as ApprovedCondition[],
  journeyProgress: { currentPhase: 0, completedChecklist: {} } as JourneyProgress,
  dutyStations: [] as DutyStation[],
  employmentImpactEntries: [] as EmploymentImpactEntry[],

  // Form Guide Drafts
  formDrafts: {} as Record<string, Record<string, string> & { lastModified: string }>,

  // Per-Condition Journey Progress
  conditionJourneyProgress: {} as Record<string, { completedSteps: string[]; startedAt: string }>,

  // User conditions
  userConditions: [] as UserCondition[],

  // Conflict & deployment selections
  selectedConflicts: [] as string[],
  selectedLocations: [] as string[],
  customLocations: [] as string[],

  // Evidence documents
  evidenceDocuments: [] as EvidenceDocument[],
  _evidenceLoading: new Set<string>(),

  // Claim documents
  claimDocuments: [] as ClaimDocument[],
  _claimDocLoading: new Set<string>(),

  // Evidence checklist per condition
  conditionEvidenceChecks: {} as Record<string, string[]>,
};

// ===== THE ONE STORE =====

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========== CLAIMS DATA METHODS ==========

      // Medical Visits
      addMedicalVisit: (visit) => {
        const s = get();
        const totalLogs = s.medicalVisits.length + s.symptoms.length + s.medications.length + s.sleepEntries.length + s.migraines.length + s.exposures.length;
        if (!canAddHealthLog(totalLogs)) { logger.warn('[useAppStore] Free-tier health log limit reached'); return; }
        set((st) => ({ medicalVisits: [...st.medicalVisits, { id: generateId(), ...visit }] }));
      },
      updateMedicalVisit: (id, visit) => set((s) => ({
        medicalVisits: s.medicalVisits.map((v) => v.id === id ? { ...v, ...visit } : v),
      })),
      deleteMedicalVisit: (id) => set((s) => ({
        medicalVisits: s.medicalVisits.filter((v) => v.id !== id),
      })),

      // Exposures
      addExposure: (exposure) => {
        const s = get();
        const totalLogs = s.medicalVisits.length + s.symptoms.length + s.medications.length + s.sleepEntries.length + s.migraines.length + s.exposures.length;
        if (!canAddHealthLog(totalLogs)) { logger.warn('[useAppStore] Free-tier health log limit reached'); return; }
        set((st) => ({ exposures: [...st.exposures, { id: generateId(), ...exposure }] }));
      },
      updateExposure: (id, exposure) => set((s) => ({
        exposures: s.exposures.map((e) => e.id === id ? { ...e, ...exposure } : e),
      })),
      deleteExposure: (id) => set((s) => ({
        exposures: s.exposures.filter((e) => e.id !== id),
      })),

      // Symptoms
      addSymptom: (symptom) => {
        const s = get();
        const totalLogs = s.medicalVisits.length + s.symptoms.length + s.medications.length + s.sleepEntries.length + s.migraines.length + s.exposures.length;
        if (!canAddHealthLog(totalLogs)) { logger.warn('[useAppStore] Free-tier health log limit reached'); return; }
        set((st) => ({ symptoms: [...st.symptoms, { id: generateId(), ...symptom }] }));
      },
      updateSymptom: (id, symptom) => set((s) => ({
        symptoms: s.symptoms.map((sym) => sym.id === id ? { ...sym, ...symptom } : sym),
      })),
      deleteSymptom: (id) => set((s) => ({
        symptoms: s.symptoms.filter((sym) => sym.id !== id),
      })),

      // Medications
      addMedication: (medication) => {
        const s = get();
        const totalLogs = s.medicalVisits.length + s.symptoms.length + s.medications.length + s.sleepEntries.length + s.migraines.length + s.exposures.length;
        if (!canAddHealthLog(totalLogs)) { logger.warn('[useAppStore] Free-tier health log limit reached'); return; }
        set((st) => ({ medications: [...st.medications, { id: generateId(), ...medication }] }));
      },
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
        combatHistory: [...s.combatHistory, { ...entry, id: generateId() }],
      })),
      updateCombatEntry: (id, entry) => set((s) => ({
        combatHistory: s.combatHistory.map((c) => c.id === id ? { ...c, ...entry } : c),
      })),
      deleteCombatEntry: (id) => set((s) => ({
        combatHistory: s.combatHistory.filter((c) => c.id !== id),
      })),

      // Major Events
      addMajorEvent: (event) => set((s) => ({
        majorEvents: [...s.majorEvents, { ...event, id: generateId() }],
      })),
      updateMajorEvent: (id, event) => set((s) => ({
        majorEvents: s.majorEvents.map((e) => e.id === id ? { ...e, ...event } : e),
      })),
      deleteMajorEvent: (id) => set((s) => ({
        majorEvents: s.majorEvents.filter((e) => e.id !== id),
      })),

      // Deployments
      addDeployment: (deployment) => set((s) => ({
        deployments: [...s.deployments, { ...deployment, id: generateId() }],
      })),
      updateDeployment: (id, deployment) => set((s) => ({
        deployments: s.deployments.map((d) => d.id === id ? { ...d, ...deployment } : d),
      })),
      deleteDeployment: (id) => set((s) => ({
        deployments: s.deployments.filter((d) => d.id !== id),
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

      // Migraines
      addMigraine: (migraine) => {
        const s = get();
        const totalLogs = s.medicalVisits.length + s.symptoms.length + s.medications.length + s.sleepEntries.length + s.migraines.length + s.exposures.length;
        if (!canAddHealthLog(totalLogs)) { logger.warn('[useAppStore] Free-tier health log limit reached'); return; }
        set((st) => ({ migraines: [...st.migraines, { id: generateId(), ...migraine }] }));
      },
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
      addSleepEntry: (entry) => {
        const s = get();
        const totalLogs = s.medicalVisits.length + s.symptoms.length + s.medications.length + s.sleepEntries.length + s.migraines.length + s.exposures.length;
        if (!canAddHealthLog(totalLogs)) { logger.warn('[useAppStore] Free-tier health log limit reached'); return; }
        set((st) => ({ sleepEntries: [...st.sleepEntries, { id: generateId(), ...entry }] }));
      },
      updateSleepEntry: (id, entry) => set((s) => ({
        sleepEntries: s.sleepEntries.map((e) => e.id === id ? { ...e, ...entry } : e),
      })),
      deleteSleepEntry: (id) => set((s) => ({
        sleepEntries: s.sleepEntries.filter((e) => e.id !== id),
      })),

      // PTSD Symptoms
      addPTSDSymptom: (symptom) => set((s) => ({
        ptsdSymptoms: [...s.ptsdSymptoms, { ...symptom, id: generateId() }],
      })),
      updatePTSDSymptom: (id, symptom) => set((s) => ({
        ptsdSymptoms: s.ptsdSymptoms.map((p) => p.id === id ? { ...p, ...symptom } : p),
      })),
      deletePTSDSymptom: (id) => set((s) => ({
        ptsdSymptoms: s.ptsdSymptoms.filter((p) => p.id !== id),
      })),

      // Claim Conditions
      addClaimCondition: (condition) => {
        if (!condition.name || typeof condition.name !== 'string' || !condition.name.trim()) {
          logger.warn('[useAppStore] addClaimCondition called with empty name — skipping');
          return;
        }
        const trimmedName = condition.name.trim();
        set((s) => ({
          claimConditions: [...s.claimConditions, { ...condition, name: trimmedName, id: (condition as { id?: string }).id || generateId() }],
        }));

        // Also ensure a matching userCondition exists (keeps both stores in sync)
        const state = get();
        const nameLower = trimmedName.toLowerCase();
        const hasUserCondition = state.userConditions.some(
          (uc) => (uc.displayName || uc.conditionId).toLowerCase() === nameLower
        );
        if (!hasUserCondition && canAddCondition(state.userConditions.length)) {
          const resolved = resolveConditionId(trimmedName);
          const newUC = {
            id: (condition as { id?: string }).id || generateId(),
            conditionId: resolved.conditionId || trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            displayName: resolved.displayName || trimmedName,
            serviceConnected: true,
            claimStatus: 'pending' as const,
            isPrimary: true,
            dateAdded: new Date().toISOString(),
          };
          set((s) => ({
            userConditions: [...s.userConditions, newUC],
          }));
        }
      },
      updateClaimCondition: (id, condition) => {
        if (!id || typeof id !== 'string') return;
        if (condition.name !== undefined && (!condition.name || !condition.name.trim())) {
          logger.warn('[useAppStore] updateClaimCondition called with empty name — skipping');
          return;
        }
        set((s) => ({
          claimConditions: s.claimConditions.map((c) => c.id === id ? { ...c, ...condition } : c),
        }));
      },
      deleteClaimCondition: (id) => set((s) => ({
        claimConditions: s.claimConditions.filter((c) => c.id !== id),
        symptoms: s.symptoms.map((sym) => ({
          ...sym,
          conditionTags: sym.conditionTags?.filter((t) => t !== id) ?? [],
        })),
        medications: s.medications.map((m) => ({
          ...m,
          conditionTags: (m as Record<string, unknown>).conditionTags
            ? ((m as Record<string, unknown>).conditionTags as string[]).filter((t: string) => t !== id)
            : undefined,
          prescribedFor: m.prescribedFor === id ? '' : m.prescribedFor,
        })),
      })),

      // Document scan disclaimer
      setDocumentScanDisclaimerShown: (shown) => set({ documentScanDisclaimerShown: shown }),

      // Quick Logs
      addQuickLog: (log) => set((s) => ({
        quickLogs: [...s.quickLogs, { ...log, id: generateId() }],
      })),
      deleteQuickLog: (id) => set((s) => ({
        quickLogs: s.quickLogs.filter((l) => l.id !== id),
      })),

      // Deadlines
      addDeadline: (deadline) => set((s) => ({
        deadlines: [...s.deadlines, { ...deadline, id: generateId() }],
      })),
      updateDeadline: (id, deadline) => set((s) => ({
        deadlines: s.deadlines.map((d) => d.id === id ? { ...d, ...deadline } : d),
      })),
      deleteDeadline: (id) => set((s) => ({
        deadlines: s.deadlines.filter((d) => d.id !== id),
      })),

      // Milestones
      addMilestone: (milestone) => set((s) => ({
        milestonesAchieved: s.milestonesAchieved.includes(milestone)
          ? s.milestonesAchieved
          : [...s.milestonesAchieved, milestone],
      })),

      // Approved Conditions
      addApprovedCondition: (condition) => set((s) => ({
        approvedConditions: [...s.approvedConditions, { ...condition, id: generateId() }],
      })),
      updateApprovedCondition: (id, condition) => set((s) => ({
        approvedConditions: s.approvedConditions.map((c) => c.id === id ? { ...c, ...condition } : c),
      })),
      deleteApprovedCondition: (id) => set((s) => ({
        approvedConditions: s.approvedConditions.filter((c) => c.id !== id),
      })),

      // Journey Progress
      setJourneyProgress: (progress) => set((s) => ({
        journeyProgress: { ...s.journeyProgress, ...progress },
      })),

      // Duty Stations
      addDutyStation: (station) => set((s) => ({
        dutyStations: [...s.dutyStations, { ...station, id: generateId() }],
      })),
      removeDutyStation: (id) => set((s) => ({
        dutyStations: s.dutyStations.filter((d) => d.id !== id),
      })),

      // Form Guide Drafts
      setFormDraft: (formId, fieldId, value) => set((s) => ({
        formDrafts: {
          ...s.formDrafts,
          [formId]: {
            ...(s.formDrafts[formId] || {}),
            [fieldId]: value,
            lastModified: new Date().toISOString(),
          },
        },
      })),
      clearFormDraft: (formId) => set((s) => {
        const { [formId]: _, ...rest } = s.formDrafts;
        return { formDrafts: rest };
      }),

      // Per-Condition Journey Progress
      completeConditionJourneyStep: (conditionId, stepId) => set((s) => {
        const existing = s.conditionJourneyProgress[conditionId] || {
          completedSteps: [],
          startedAt: new Date().toISOString(),
        };
        if (existing.completedSteps.includes(stepId)) return {};
        return {
          conditionJourneyProgress: {
            ...s.conditionJourneyProgress,
            [conditionId]: {
              ...existing,
              completedSteps: [...existing.completedSteps, stepId],
            },
          },
        };
      }),
      resetConditionJourney: (conditionId) => set((s) => {
        const { [conditionId]: _, ...rest } = s.conditionJourneyProgress;
        return { conditionJourneyProgress: rest };
      }),

      // Employment Impact
      addEmploymentImpact: (entry) => set((s) => ({
        employmentImpactEntries: [...s.employmentImpactEntries, { ...entry, id: generateId() }],
      })),
      deleteEmploymentImpact: (id) => set((s) => ({
        employmentImpactEntries: s.employmentImpactEntries.filter((e) => e.id !== id),
      })),

      // ========== USER CONDITIONS METHODS ==========

      addUserCondition: (condition) => {
        const current = get().userConditions;
        if (!canAddCondition(current.length)) {
          logger.warn('[useAppStore] Free-tier condition limit reached — blocking addUserCondition');
          return;
        }
        set((s) => ({
          userConditions: [...s.userConditions, condition],
        }));
      },

      removeUserCondition: (id) => set((s) => {
        const conditionToRemove = s.userConditions.find((c) => c.id === id);
        const idsToRemove = [id];
        if (conditionToRemove?.isPrimary) {
          // Collect linked secondary condition IDs for cleanup
          s.userConditions.forEach((c) => {
            if (c.linkedPrimaryId === id) idsToRemove.push(c.id);
          });
        }

        // Clean up conditionEvidenceChecks for removed conditions
        const newChecks = { ...s.conditionEvidenceChecks };
        idsToRemove.forEach((rid) => { delete newChecks[rid]; });

        // Cascade: remove from claimConditions
        const claimConditions = s.claimConditions.filter(
          (c) => !idsToRemove.includes(c.id),
        );

        // Cascade: remove conditionId from symptom tags
        const symptoms = s.symptoms.map((sym) => ({
          ...sym,
          conditionTags: sym.conditionTags?.filter((t) => !idsToRemove.includes(t)) ?? [],
        }));

        // Cascade: clear prescribedFor and conditionTags references in medications
        const medications = s.medications.map((m) => ({
          ...m,
          prescribedFor: idsToRemove.includes(m.prescribedFor) ? '' : m.prescribedFor,
          conditionTags: m.conditionTags?.filter((t) => !idsToRemove.includes(t)) ?? [],
        }));

        // Cascade: remove associated form drafts
        const formDrafts = Object.fromEntries(
          Object.entries(s.formDrafts).filter(
            ([key]) => !idsToRemove.some((rid) => key.includes(rid)),
          ),
        ) as typeof s.formDrafts;

        // Cascade: remove associated evidence documents
        const evidenceDocuments = s.evidenceDocuments.filter(
          (d) => !d.linkedEntries.some(
            (link) => idsToRemove.includes(link.entryId),
          ),
        );

        // Cascade: remove claim documents linked to the removed condition
        // ClaimDocument.condition stores a plain-text name (e.g. "PTSD").
        // Collect all possible name variants for the removed conditions.
        const removedConditionNames = new Set<string>();
        for (const rid of idsToRemove) {
          const uc = s.userConditions.find((c) => c.id === rid);
          if (uc?.displayName) removedConditionNames.add(uc.displayName.toLowerCase());
          // Also match against claimConditions name (may differ from displayName)
          const cc = s.claimConditions.find((c) => c.id === rid);
          if (cc?.name) removedConditionNames.add(cc.name.toLowerCase());
        }
        const claimDocuments = removedConditionNames.size > 0
          ? s.claimDocuments.filter(
              (d) => !removedConditionNames.has(d.condition.toLowerCase()),
            )
          : s.claimDocuments;

        return {
          userConditions: s.userConditions.filter((c) => !idsToRemove.includes(c.id)),
          conditionEvidenceChecks: newChecks,
          claimConditions,
          symptoms,
          medications,
          formDrafts,
          evidenceDocuments,
          claimDocuments,
        };
      }),

      updateUserCondition: (id, updates) => set((s) => ({
        userConditions: s.userConditions.map((c) => c.id === id ? { ...c, ...updates } : c),
      })),

      clearAllUserConditions: () => set({ userConditions: [], conditionEvidenceChecks: {} }),

      incrementConditionUsage: (id) => set((s) => ({
        userConditions: s.userConditions.map((c) =>
          c.id === id
            ? { ...c, usageCount: (c.usageCount ?? 0) + 1, lastUsed: new Date().toISOString() }
            : c
        ),
      })),

      // ========== CONFLICT & DEPLOYMENT METHODS ==========

      toggleConflict: (conflictId) => set((s) => ({
        selectedConflicts: s.selectedConflicts.includes(conflictId)
          ? s.selectedConflicts.filter((id) => id !== conflictId)
          : [...s.selectedConflicts, conflictId],
      })),

      setSelectedConflicts: (conflictIds) => set({ selectedConflicts: conflictIds }),

      toggleLocation: (conflictId, locationName) => {
        const key = `${conflictId}::${locationName}`;
        set((s) => ({
          selectedLocations: s.selectedLocations.includes(key)
            ? s.selectedLocations.filter((k) => k !== key)
            : [...s.selectedLocations, key],
        }));
      },

      setSelectedLocations: (locationKeys) => set({ selectedLocations: locationKeys }),

      addCustomLocation: (location) => set((s) => ({
        customLocations: s.customLocations.includes(location)
          ? s.customLocations
          : [...s.customLocations, location],
      })),

      removeCustomLocation: (location) => set((s) => ({
        customLocations: s.customLocations.filter((l) => l !== location),
      })),

      // ========== EVIDENCE DOCUMENT METHODS ==========

      addEvidenceDocument: async (doc) => {
        const id = generateId();
        const fileSize = doc.dataUrl.length;
        let useIndexedDB = isIndexedDBAvailable() && fileSize > INDEXEDDB_THRESHOLD;

        if (useIndexedDB) {
          try {
            await storeFileData(id, doc.dataUrl);
          } catch (error) {
            logger.error('[addEvidenceDocument] IndexedDB write failed, falling back to localStorage:', error);
            useIndexedDB = false;
          }
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
        if (_evidenceHydrating) return;
        _evidenceHydrating = true;
        try {
          const { evidenceDocuments } = get();
          const docsNeedingData = evidenceDocuments.filter(
            (doc) => doc.storageType === 'indexedDB' && !doc.dataUrl,
          );

          if (docsNeedingData.length === 0) {
            set({ _evidenceLoading: new Set() });
            return;
          }

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
        } finally {
          set({ _evidenceLoading: new Set() });
          _evidenceHydrating = false;
        }
      },

      // ========== CLAIM DOCUMENT METHODS ==========

      addClaimDocument: async (doc) => {
        const id = generateId();
        const fileSize = doc.dataUrl.length;
        let useIndexedDB = isIndexedDBAvailable() && fileSize > INDEXEDDB_THRESHOLD;

        if (useIndexedDB) {
          try {
            await storeFileData(id, doc.dataUrl);
          } catch (error) {
            logger.error('[addClaimDocument] IndexedDB write failed, falling back to localStorage:', error);
            useIndexedDB = false;
          }
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
        if (_claimDocHydrating) return;
        _claimDocHydrating = true;
        try {
          const { claimDocuments } = get();
          const docsNeedingData = claimDocuments.filter(
            (doc) => doc.storageType === 'indexedDB' && !doc.dataUrl,
          );

          if (docsNeedingData.length === 0) {
            return;
          }

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
        } finally {
          set({ _claimDocLoading: new Set() });
          _claimDocHydrating = false;
        }
      },

      // ========== EVIDENCE CHECKLIST ==========

      toggleEvidenceCheck: (conditionId, item) => set((s) => {
        const current = s.conditionEvidenceChecks[conditionId] || [];
        const updated = current.includes(item)
          ? current.filter((i) => i !== item)
          : [...current, item];
        return {
          conditionEvidenceChecks: {
            ...s.conditionEvidenceChecks,
            [conditionId]: updated,
          },
        };
      }),

      // ========== GLOBAL ==========

      resetAllData: () => set({ ...initialState, _evidenceLoading: new Set<string>(), _claimDocLoading: new Set<string>() }),
    }),
    {
      name: 'vcs-app-data',
      version: 6,
      storage: createJSONStorage(() => createDebouncedStorage(encryptedStorage, 300)),
      migrate: (persistedState: unknown, version: number) => {
        let state = persistedState as Record<string, unknown>;
        if (version < 2) {
          state = { ...state, formDrafts: {} };
        }
        if (version < 3) {
          // separationDate moved to useProfileStore as single source of truth
          const { separationDate: _, ...rest } = state;
          state = rest;
        }
        if (version < 4) {
          // Fix bad conditionIds (slugified names like "gerd-(gastroesophageal-reflux-disease)")
          const ucs = state.userConditions as UserCondition[] | undefined;
          if (Array.isArray(ucs)) {
            state = {
              ...state,
              userConditions: ucs.map((uc) => {
                if (!isSuspiciousConditionId(uc.conditionId)) return uc;
                const resolved = resolveConditionId(uc.displayName || uc.conditionId);
                return {
                  ...uc,
                  conditionId: resolved.conditionId,
                  displayName: uc.displayName || resolved.displayName,
                };
              }),
            };
          }
        }
        // v5: Extended Medication fields (dosage, frequency, prescriber, etc.)
        // All new fields are optional with defaults — no data transform needed.
        if (version < 6) {
          state = { ...state, conditionJourneyProgress: {} };
        }
        return state;
      },
      onRehydrateStorage: () => {
        return (_state, error) => {
          if (error) {
            logger.error('useAppStore hydration failed:', error);
          }
        };
      },
      skipHydration: true,
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
