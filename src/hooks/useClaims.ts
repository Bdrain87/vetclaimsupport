import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import type { ClaimsData } from '@/types/claims';

/**
 * Adapter hook — returns the same shape as the old ClaimsContext / useClaimsData.
 * All consuming components continue to work unchanged.
 *
 * Uses useShallow so the component only re-renders when the specific data
 * slices it subscribes to actually change (not on every store mutation).
 */
export function useClaims() {
  const dataSlice = useAppStore(
    useShallow((s) => ({
      medicalVisits: s.medicalVisits,
      exposures: s.exposures,
      symptoms: s.symptoms,
      medications: s.medications,
      serviceHistory: s.serviceHistory,
      combatHistory: s.combatHistory,
      majorEvents: s.majorEvents,
      deployments: s.deployments,
      buddyContacts: s.buddyContacts,
      documents: s.documents,
      migraines: s.migraines,
      sleepEntries: s.sleepEntries,
      ptsdSymptoms: s.ptsdSymptoms,
      uploadedDocuments: s.uploadedDocuments,
      claimConditions: s.claimConditions,
      quickLogs: s.quickLogs,
      deadlines: s.deadlines,
      documentScanDisclaimerShown: s.documentScanDisclaimerShown,
      milestonesAchieved: s.milestonesAchieved,
      approvedConditions: s.approvedConditions,
      journeyProgress: s.journeyProgress,
    })),
  );

  const separationDate = useProfileStore((s) => s.separationDate) ?? null;

  // Build the `data` object that matches the ClaimsData interface
  const data: ClaimsData = useMemo(() => ({
    ...dataSlice,
    separationDate,
  }), [dataSlice, separationDate]);

  // Actions are stable references from the store — read once and reuse.
  // Using getState() avoids subscribing the component to action identity changes.
  const actions = useMemo(() => {
    const s = useAppStore.getState();
    return {
      // Medical Visits
      addMedicalVisit: s.addMedicalVisit,
      updateMedicalVisit: s.updateMedicalVisit,
      deleteMedicalVisit: s.deleteMedicalVisit,
      // Exposures
      addExposure: s.addExposure,
      updateExposure: s.updateExposure,
      deleteExposure: s.deleteExposure,
      // Symptoms
      addSymptom: s.addSymptom,
      updateSymptom: s.updateSymptom,
      deleteSymptom: s.deleteSymptom,
      // Medications
      addMedication: s.addMedication,
      updateMedication: s.updateMedication,
      deleteMedication: s.deleteMedication,
      // Service History
      addServiceEntry: s.addServiceEntry,
      updateServiceEntry: s.updateServiceEntry,
      deleteServiceEntry: s.deleteServiceEntry,
      // Combat History
      addCombatEntry: s.addCombatEntry,
      updateCombatEntry: s.updateCombatEntry,
      deleteCombatEntry: s.deleteCombatEntry,
      // Major Events
      addMajorEvent: s.addMajorEvent,
      updateMajorEvent: s.updateMajorEvent,
      deleteMajorEvent: s.deleteMajorEvent,
      // Deployments
      addDeployment: s.addDeployment,
      updateDeployment: s.updateDeployment,
      deleteDeployment: s.deleteDeployment,
      // Buddy Contacts
      addBuddyContact: s.addBuddyContact,
      updateBuddyContact: s.updateBuddyContact,
      deleteBuddyContact: s.deleteBuddyContact,
      // Documents checklist
      updateDocument: s.updateDocument,
      // Migraines
      addMigraine: s.addMigraine,
      updateMigraine: s.updateMigraine,
      deleteMigraine: s.deleteMigraine,
      // Uploaded Documents
      addUploadedDocument: s.addUploadedDocument,
      deleteUploadedDocument: s.deleteUploadedDocument,
      // Sleep Entries
      addSleepEntry: s.addSleepEntry,
      updateSleepEntry: s.updateSleepEntry,
      deleteSleepEntry: s.deleteSleepEntry,
      // PTSD Symptoms
      addPTSDSymptom: s.addPTSDSymptom,
      updatePTSDSymptom: s.updatePTSDSymptom,
      deletePTSDSymptom: s.deletePTSDSymptom,
      // Claim Conditions
      addClaimCondition: s.addClaimCondition,
      updateClaimCondition: s.updateClaimCondition,
      deleteClaimCondition: s.deleteClaimCondition,
      // Document scan disclaimer
      setDocumentScanDisclaimerShown: s.setDocumentScanDisclaimerShown,
      // Quick Logs
      addQuickLog: s.addQuickLog,
      deleteQuickLog: s.deleteQuickLog,
      // Deadlines
      addDeadline: s.addDeadline,
      updateDeadline: s.updateDeadline,
      deleteDeadline: s.deleteDeadline,
      // Milestones
      addMilestone: s.addMilestone,
      // Approved Conditions
      addApprovedCondition: s.addApprovedCondition,
      updateApprovedCondition: s.updateApprovedCondition,
      deleteApprovedCondition: s.deleteApprovedCondition,
    };
  }, []);

  return {
    data,
    ...actions,
  };
}
