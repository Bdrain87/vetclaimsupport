/**
 * Migration script: runs once on app load to migrate data from the 4 old
 * localStorage systems into the single `vcs-app-data` Zustand store key.
 *
 * Old keys read (NOT deleted for safety):
 *   - va-claims-tracker-data   (useClaimsData)
 *   - user-va-conditions       (UserConditionsContext)
 *   - va-claim-documents       (useClaimDocuments)
 *   - va-claims-evidence-documents (useEvidenceDocuments)
 *   - vet-evidence-vault       (useClaimStore — calculator entries)
 *
 * Sets `vcs-migration-complete` flag so it only runs once.
 */

const MIGRATION_FLAG = 'vcs-migration-complete';
const NEW_STORE_KEY = 'vcs-app-data';

// Old localStorage keys
const OLD_CLAIMS_DATA_KEY = 'va-claims-tracker-data';
const OLD_USER_CONDITIONS_KEY = 'user-va-conditions';
const OLD_CLAIM_DOCS_KEY = 'va-claim-documents';
const OLD_EVIDENCE_DOCS_KEY = 'va-claims-evidence-documents';
const OLD_CLAIM_STORE_KEY = 'vet-evidence-vault';

function safeJSONParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`[migration] Failed to parse ${key}`);
    return fallback;
  }
}

export function migrateOldDataToAppStore(): void {
  if (typeof window === 'undefined') return;

  // Already migrated?
  if (localStorage.getItem(MIGRATION_FLAG)) return;

  // Already has new store data? Skip migration.
  const existingNew = localStorage.getItem(NEW_STORE_KEY);
  if (existingNew) {
    try {
      const parsed = JSON.parse(existingNew);
      // If there's a state property with data, store is already populated
      if (parsed?.state) {
        localStorage.setItem(MIGRATION_FLAG, new Date().toISOString());
        return;
      }
    } catch {
      // Continue with migration
    }
  }

  // Check if there's any old data to migrate
  const hasOldData =
    localStorage.getItem(OLD_CLAIMS_DATA_KEY) ||
    localStorage.getItem(OLD_USER_CONDITIONS_KEY) ||
    localStorage.getItem(OLD_CLAIM_DOCS_KEY) ||
    localStorage.getItem(OLD_EVIDENCE_DOCS_KEY) ||
    localStorage.getItem(OLD_CLAIM_STORE_KEY);

  if (!hasOldData) {
    // No old data exists, nothing to migrate
    localStorage.setItem(MIGRATION_FLAG, new Date().toISOString());
    return;
  }

  // Migrating old data into unified store

  // 1. Read old claims data (the 554-line hook's data)
  const oldClaimsData = safeJSONParse<Record<string, unknown>>(OLD_CLAIMS_DATA_KEY, {});

  // 2. Read old user conditions
  const oldUserConditions = safeJSONParse<unknown[]>(OLD_USER_CONDITIONS_KEY, []);

  // 3. Read old claim documents
  const oldClaimDocs = safeJSONParse<unknown[]>(OLD_CLAIM_DOCS_KEY, []);

  // 4. Read old evidence documents
  const oldEvidenceDocs = safeJSONParse<unknown[]>(OLD_EVIDENCE_DOCS_KEY, []);

  // 5. Read old claim store (calculator entries)
  const oldClaimStore = safeJSONParse<Record<string, unknown>>(OLD_CLAIM_STORE_KEY, {});
  const oldClaimStoreState = (oldClaimStore as Record<string, unknown>)?.state as Record<string, unknown> | undefined;

  // Build the new unified state
  const migratedState: Record<string, unknown> = {
    // From old claims data
    medicalVisits: Array.isArray(oldClaimsData.medicalVisits) ? oldClaimsData.medicalVisits : [],
    exposures: Array.isArray(oldClaimsData.exposures) ? oldClaimsData.exposures : [],
    symptoms: Array.isArray(oldClaimsData.symptoms) ? oldClaimsData.symptoms : [],
    medications: Array.isArray(oldClaimsData.medications) ? oldClaimsData.medications : [],
    serviceHistory: Array.isArray(oldClaimsData.serviceHistory) ? oldClaimsData.serviceHistory : [],
    combatHistory: Array.isArray(oldClaimsData.combatHistory) ? oldClaimsData.combatHistory : [],
    majorEvents: Array.isArray(oldClaimsData.majorEvents) ? oldClaimsData.majorEvents : [],
    deployments: Array.isArray(oldClaimsData.deployments) ? oldClaimsData.deployments : [],
    buddyContacts: Array.isArray(oldClaimsData.buddyContacts) ? oldClaimsData.buddyContacts : [],
    documents: Array.isArray(oldClaimsData.documents) ? oldClaimsData.documents : [],
    migraines: Array.isArray(oldClaimsData.migraines) ? oldClaimsData.migraines : [],
    sleepEntries: Array.isArray(oldClaimsData.sleepEntries) ? oldClaimsData.sleepEntries : [],
    ptsdSymptoms: Array.isArray(oldClaimsData.ptsdSymptoms) ? oldClaimsData.ptsdSymptoms : [],
    separationDate: oldClaimsData.separationDate ?? null,
    uploadedDocuments: Array.isArray(oldClaimsData.uploadedDocuments) ? oldClaimsData.uploadedDocuments : [],
    claimConditions: Array.isArray(oldClaimsData.claimConditions) ? oldClaimsData.claimConditions : [],
    quickLogs: Array.isArray(oldClaimsData.quickLogs) ? oldClaimsData.quickLogs : [],
    deadlines: Array.isArray(oldClaimsData.deadlines) ? oldClaimsData.deadlines : [],
    documentScanDisclaimerShown: oldClaimsData.documentScanDisclaimerShown ?? false,
    milestonesAchieved: Array.isArray(oldClaimsData.milestonesAchieved) ? oldClaimsData.milestonesAchieved : [],
    approvedConditions: Array.isArray(oldClaimsData.approvedConditions) ? oldClaimsData.approvedConditions : [],
    journeyProgress: oldClaimsData.journeyProgress ?? { currentPhase: 0, completedChecklist: {} },

    // From old user conditions context
    userConditions: Array.isArray(oldUserConditions) ? oldUserConditions : [],

    // From old evidence documents hook
    evidenceDocuments: Array.isArray(oldEvidenceDocs) ? oldEvidenceDocs : [],

    // From old claim documents hook
    claimDocuments: Array.isArray(oldClaimDocs) ? oldClaimDocs : [],
  };

  // Write the migrated data as a Zustand persist-compatible object
  const zustandPayload = {
    state: migratedState,
    version: 1,
  };

  try {
    localStorage.setItem(NEW_STORE_KEY, JSON.stringify(zustandPayload));
    // Data migrated successfully
  } catch (err) {
    console.error('[migration] Failed to write migrated data:', err);
  }

  // Mark migration as complete
  localStorage.setItem(MIGRATION_FLAG, new Date().toISOString());
}
