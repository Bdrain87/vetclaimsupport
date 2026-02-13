import { useMemo } from 'react';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import type { ClaimsData } from '@/types/claims';

/**
 * Adapter hook — returns the same shape as the old ClaimsContext / useClaimsData.
 * All consuming components continue to work unchanged.
 */
export function useClaims() {
  const store = useAppStore();
  const separationDate = useProfileStore((s) => s.separationDate) ?? null;

  // Build the `data` object that matches the ClaimsData interface
  const data: ClaimsData = useMemo(() => ({
    medicalVisits: store.medicalVisits,
    exposures: store.exposures,
    symptoms: store.symptoms,
    medications: store.medications,
    serviceHistory: store.serviceHistory,
    combatHistory: store.combatHistory,
    majorEvents: store.majorEvents,
    deployments: store.deployments,
    buddyContacts: store.buddyContacts,
    documents: store.documents,
    migraines: store.migraines,
    sleepEntries: store.sleepEntries,
    ptsdSymptoms: store.ptsdSymptoms,
    separationDate,
    uploadedDocuments: store.uploadedDocuments,
    claimConditions: store.claimConditions,
    quickLogs: store.quickLogs,
    deadlines: store.deadlines,
    documentScanDisclaimerShown: store.documentScanDisclaimerShown,
    milestonesAchieved: store.milestonesAchieved,
    approvedConditions: store.approvedConditions,
    journeyProgress: store.journeyProgress,
  }), [
    store.medicalVisits, store.exposures, store.symptoms, store.medications,
    store.serviceHistory, store.combatHistory, store.majorEvents, store.deployments,
    store.buddyContacts, store.documents, store.migraines, store.sleepEntries,
    store.ptsdSymptoms, separationDate, store.uploadedDocuments,
    store.claimConditions, store.quickLogs, store.deadlines,
    store.documentScanDisclaimerShown, store.milestonesAchieved,
    store.approvedConditions, store.journeyProgress,
  ]);

  return {
    data,
    // Medical Visits
    addMedicalVisit: store.addMedicalVisit,
    updateMedicalVisit: store.updateMedicalVisit,
    deleteMedicalVisit: store.deleteMedicalVisit,
    // Exposures
    addExposure: store.addExposure,
    updateExposure: store.updateExposure,
    deleteExposure: store.deleteExposure,
    // Symptoms
    addSymptom: store.addSymptom,
    updateSymptom: store.updateSymptom,
    deleteSymptom: store.deleteSymptom,
    // Medications
    addMedication: store.addMedication,
    updateMedication: store.updateMedication,
    deleteMedication: store.deleteMedication,
    // Service History
    addServiceEntry: store.addServiceEntry,
    updateServiceEntry: store.updateServiceEntry,
    deleteServiceEntry: store.deleteServiceEntry,
    // Combat History
    addCombatEntry: store.addCombatEntry,
    updateCombatEntry: store.updateCombatEntry,
    deleteCombatEntry: store.deleteCombatEntry,
    // Major Events
    addMajorEvent: store.addMajorEvent,
    updateMajorEvent: store.updateMajorEvent,
    deleteMajorEvent: store.deleteMajorEvent,
    // Deployments
    addDeployment: store.addDeployment,
    updateDeployment: store.updateDeployment,
    deleteDeployment: store.deleteDeployment,
    // Buddy Contacts
    addBuddyContact: store.addBuddyContact,
    updateBuddyContact: store.updateBuddyContact,
    deleteBuddyContact: store.deleteBuddyContact,
    // Documents checklist
    updateDocument: store.updateDocument,
    // Migraines
    addMigraine: store.addMigraine,
    updateMigraine: store.updateMigraine,
    deleteMigraine: store.deleteMigraine,
    // Uploaded Documents
    addUploadedDocument: store.addUploadedDocument,
    deleteUploadedDocument: store.deleteUploadedDocument,
    // Sleep Entries
    addSleepEntry: store.addSleepEntry,
    updateSleepEntry: store.updateSleepEntry,
    deleteSleepEntry: store.deleteSleepEntry,
    // PTSD Symptoms
    addPTSDSymptom: store.addPTSDSymptom,
    updatePTSDSymptom: store.updatePTSDSymptom,
    deletePTSDSymptom: store.deletePTSDSymptom,
    // Claim Conditions
    addClaimCondition: store.addClaimCondition,
    updateClaimCondition: store.updateClaimCondition,
    deleteClaimCondition: store.deleteClaimCondition,
    // Document scan disclaimer
    setDocumentScanDisclaimerShown: store.setDocumentScanDisclaimerShown,
    // Quick Logs
    addQuickLog: store.addQuickLog,
    deleteQuickLog: store.deleteQuickLog,
    // Deadlines
    addDeadline: store.addDeadline,
    updateDeadline: store.updateDeadline,
    deleteDeadline: store.deleteDeadline,
    // Milestones
    addMilestone: store.addMilestone,
    // Approved Conditions
    addApprovedCondition: store.addApprovedCondition,
    updateApprovedCondition: store.updateApprovedCondition,
    deleteApprovedCondition: store.deleteApprovedCondition,
  };
}
