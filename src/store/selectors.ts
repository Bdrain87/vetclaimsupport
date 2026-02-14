import useAppStore from './useAppStore';
import type { UserCondition } from './useAppStore';
import type {
  SymptomEntry, MedicalVisit, Medication, Exposure,
  SleepEntry, MigraineEntry, PTSDSymptomEntry, QuickLogEntry,
  ClaimCondition, Deadline, ApprovedCondition,
} from '@/types/claims';
import type { EvidenceDocument } from '@/types/documents';

export const useSymptoms = () => useAppStore((s) => s.symptoms);
export const useAddSymptom = () => useAppStore((s) => s.addSymptom);
export const useDeleteSymptom = () => useAppStore((s) => s.deleteSymptom);

export const useMedicalVisits = () => useAppStore((s) => s.medicalVisits);
export const useAddMedicalVisit = () => useAppStore((s) => s.addMedicalVisit);
export const useDeleteMedicalVisit = () => useAppStore((s) => s.deleteMedicalVisit);

export const useMedications = () => useAppStore((s) => s.medications);
export const useAddMedication = () => useAppStore((s) => s.addMedication);
export const useDeleteMedication = () => useAppStore((s) => s.deleteMedication);

export const useSleepEntries = () => useAppStore((s) => s.sleepEntries);
export const useAddSleepEntry = () => useAppStore((s) => s.addSleepEntry);
export const useDeleteSleepEntry = () => useAppStore((s) => s.deleteSleepEntry);

export const useMigraines = () => useAppStore((s) => s.migraines);
export const useAddMigraine = () => useAppStore((s) => s.addMigraine);
export const useDeleteMigraine = () => useAppStore((s) => s.deleteMigraine);

export const usePTSDSymptoms = () => useAppStore((s) => s.ptsdSymptoms);
export const useAddPTSDSymptom = () => useAppStore((s) => s.addPTSDSymptom);
export const useDeletePTSDSymptom = () => useAppStore((s) => s.deletePTSDSymptom);

export const useExposures = () => useAppStore((s) => s.exposures);
export const useAddExposure = () => useAppStore((s) => s.addExposure);
export const useDeleteExposure = () => useAppStore((s) => s.deleteExposure);

export const useQuickLogs = () => useAppStore((s) => s.quickLogs);
export const useAddQuickLog = () => useAppStore((s) => s.addQuickLog);

export const useUserConditions = () => useAppStore((s) => s.userConditions);
export const useAddUserCondition = () => useAppStore((s) => s.addUserCondition);
export const useRemoveUserCondition = () => useAppStore((s) => s.removeUserCondition);

export const useClaimConditions = () => useAppStore((s) => s.claimConditions);
export const useApprovedConditions = () => useAppStore((s) => s.approvedConditions);
export const useDeadlines = () => useAppStore((s) => s.deadlines);

export const useEvidenceDocuments = () => useAppStore((s) => s.evidenceDocuments);
export const useAddEvidenceDocument = () => useAppStore((s) => s.addEvidenceDocument);
export const useDeleteEvidenceDocument = () => useAppStore((s) => s.deleteEvidenceDocument);

export type {
  UserCondition,
  SymptomEntry,
  MedicalVisit,
  Medication,
  Exposure,
  SleepEntry,
  MigraineEntry,
  PTSDSymptomEntry,
  QuickLogEntry,
  ClaimCondition,
  Deadline,
  ApprovedCondition,
  EvidenceDocument,
};
