/**
 * cfileStoreSeeder - Maps C-File extracted data into the app's existing stores.
 *
 * This is the bridge between AI-extracted C-File data and the app's data model.
 * It writes conditions, medications, visits, service history, and profile data
 * into useAppStore and useProfileStore, with smart merge/dedup logic.
 */

import useAppStore from '@/store/useAppStore';
import type { UserCondition } from '@/store/useAppStore';
import { useProfileStore, type Branch } from '@/store/useProfileStore';
import type { CFileExtractedData } from '@/lib/cfile-prompts';
import { resolveConditionId } from '@/utils/conditionResolver';
import { searchAllConditions } from '@/utils/conditionSearch';
import type { ExposureType } from '@/types/claims';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CFileSeedSection = 'profile' | 'conditions' | 'medications' | 'visits' | 'service' | 'exposures';

export interface ApplyOptions {
  sections: CFileSeedSection[];
  overwriteExisting?: boolean; // false = only fill empty fields
}

export interface ApplyResult {
  conditionsAdded: number;
  conditionsUpdated: number;
  medicationsAdded: number;
  visitsAdded: number;
  dutyStationsAdded: number;
  deploymentsAdded: number;
  exposuresAdded: number;
  majorEventsAdded: number;
  profileUpdated: boolean;
}

// ---------------------------------------------------------------------------
// Branch name normalization
// ---------------------------------------------------------------------------

const BRANCH_MAP: Record<string, Branch> = {
  army: 'army',
  marines: 'marines',
  'marine corps': 'marines',
  usmc: 'marines',
  navy: 'navy',
  'air force': 'air_force',
  usaf: 'air_force',
  'coast guard': 'coast_guard',
  uscg: 'coast_guard',
  'space force': 'space_force',
  ussf: 'space_force',
};

function normalizeBranch(raw?: string): Branch | null {
  if (!raw) return null;
  const key = raw.toLowerCase().trim();
  return BRANCH_MAP[key] ?? null;
}

// ---------------------------------------------------------------------------
// Exposure type normalization
// ---------------------------------------------------------------------------

const VALID_EXPOSURE_TYPES: Set<string> = new Set([
  'Burn pit', 'Jet fuel', 'Chemicals', 'Noise', 'Radiation', 'Asbestos',
  'Extreme temps', 'Diesel exhaust', 'Depleted uranium', 'Sand/dust',
  'Contaminated water (Camp Lejeune)', 'Herbicides', 'Paint fumes',
  'Hydraulic fluid', 'PFAS chemicals', 'Contaminated water', 'Other',
]);

function normalizeExposureType(raw: string): ExposureType {
  // Try exact match
  if (VALID_EXPOSURE_TYPES.has(raw)) return raw as ExposureType;
  // Fuzzy match
  const lower = raw.toLowerCase();
  if (lower.includes('burn pit')) return 'Burn pit';
  if (lower.includes('jet fuel')) return 'Jet fuel';
  if (lower.includes('noise')) return 'Noise';
  if (lower.includes('radiation')) return 'Radiation';
  if (lower.includes('asbestos')) return 'Asbestos';
  if (lower.includes('chemical')) return 'Chemicals';
  if (lower.includes('diesel')) return 'Diesel exhaust';
  if (lower.includes('herbicide') || lower.includes('agent orange')) return 'Herbicides';
  if (lower.includes('uranium')) return 'Depleted uranium';
  if (lower.includes('sand') || lower.includes('dust')) return 'Sand/dust';
  if (lower.includes('lejeune')) return 'Contaminated water (Camp Lejeune)';
  if (lower.includes('water')) return 'Contaminated water';
  if (lower.includes('paint')) return 'Paint fumes';
  if (lower.includes('hydraulic')) return 'Hydraulic fluid';
  if (lower.includes('pfas')) return 'PFAS chemicals';
  if (lower.includes('temp')) return 'Extreme temps';
  return 'Other';
}

// ---------------------------------------------------------------------------
// Fuzzy condition matching
// ---------------------------------------------------------------------------

function findExistingCondition(
  existingConditions: UserCondition[],
  name: string,
  diagnosticCode?: string,
): UserCondition | null {
  const lower = name.toLowerCase().trim();

  // Match by diagnostic code first (most reliable)
  if (diagnosticCode) {
    const byCode = existingConditions.find(
      (c) => c.vaDiagnosticCode === diagnosticCode,
    );
    if (byCode) return byCode;
  }

  // Match by exact condition ID or display name
  for (const c of existingConditions) {
    const existingName = (c.displayName ?? c.conditionId).toLowerCase().trim();
    if (existingName === lower) return c;
    // Substring match for common abbreviations
    if (lower.includes(existingName) || existingName.includes(lower)) return c;
  }

  // Resolve via VA condition database to catch abbreviation mismatches
  // e.g. "Post-Traumatic Stress Disorder" -> conditionId that matches existing "PTSD"
  const resolved = searchAllConditions(name, { limit: 1 });
  if (resolved.length > 0) {
    const resolvedId = resolved[0].id;
    const byResolvedId = existingConditions.find(
      (c) => c.conditionId === resolvedId,
    );
    if (byResolvedId) return byResolvedId;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main seeder function
// ---------------------------------------------------------------------------

export function applyCFileToStores(
  data: CFileExtractedData,
  options: ApplyOptions,
): ApplyResult {
  const appStore = useAppStore.getState();
  const profileStore = useProfileStore.getState();
  const overwrite = options.overwriteExisting ?? false;

  const result: ApplyResult = {
    conditionsAdded: 0,
    conditionsUpdated: 0,
    medicationsAdded: 0,
    visitsAdded: 0,
    dutyStationsAdded: 0,
    deploymentsAdded: 0,
    exposuresAdded: 0,
    majorEventsAdded: 0,
    profileUpdated: false,
  };

  // ---- Profile ----
  if (options.sections.includes('profile')) {
    const branch = normalizeBranch(data.branch);
    if (branch && (overwrite || !profileStore.branch)) {
      profileStore.setBranch(branch);
      result.profileUpdated = true;
    }
    if (data.militarySpecialty && (overwrite || !profileStore.mosCode)) {
      profileStore.setMOS(data.militarySpecialty, data.specialtyTitle ?? '');
      result.profileUpdated = true;
    }
    if (data.serviceStartDate && data.serviceEndDate && (overwrite || !profileStore.serviceDates)) {
      profileStore.setServiceDates({ start: data.serviceStartDate, end: data.serviceEndDate });
      result.profileUpdated = true;
    }
    if (data.separationDate && (overwrite || !profileStore.separationDate)) {
      profileStore.setSeparationDate(data.separationDate);
      result.profileUpdated = true;
    }
  }

  // ---- Conditions ----
  if (options.sections.includes('conditions') && data.conditions.length > 0) {
    const existingConditions = appStore.userConditions;

    for (const cond of data.conditions) {
      const existing = findExistingCondition(existingConditions, cond.conditionName, cond.diagnosticCode);

      if (existing) {
        // Update with any new info from C-File
        const updates: Partial<UserCondition> = {};
        if (cond.rating != null && (overwrite || existing.rating == null)) updates.rating = cond.rating;
        if (cond.claimStatus && (overwrite || existing.claimStatus === 'pending')) updates.claimStatus = cond.claimStatus;
        if (cond.diagnosticCode && !existing.vaDiagnosticCode) updates.vaDiagnosticCode = cond.diagnosticCode;
        if (cond.icd10Code && !existing.icd10Code) updates.icd10Code = cond.icd10Code;
        if (cond.connectionType && !existing.connectionType) updates.connectionType = cond.connectionType;
        if (cond.serviceConnected != null && !existing.serviceConnected) updates.serviceConnected = cond.serviceConnected;
        if (cond.bodyPart && !existing.bodyPart) updates.bodyPart = cond.bodyPart;

        if (Object.keys(updates).length > 0) {
          appStore.updateUserCondition(existing.id, updates);
          result.conditionsUpdated++;
        }
      } else {
        // Resolve condition ID from VA database
        const matchingConditions = searchAllConditions(cond.conditionName, { limit: 1 });
        const matched = matchingConditions.length > 0 ? matchingConditions[0] : null;
        const resolved = matched
          ? { conditionId: matched.id, displayName: matched.abbreviation || matched.name }
          : resolveConditionId(cond.conditionName);

        appStore.addUserCondition({
          id: crypto.randomUUID(),
          conditionId: resolved.conditionId,
          displayName: resolved.displayName || cond.conditionName,
          rating: cond.rating,
          serviceConnected: cond.serviceConnected ?? false,
          claimStatus: cond.claimStatus ?? 'pending',
          isPrimary: cond.isPrimary ?? (cond.connectionType !== 'secondary'),
          connectionType: cond.connectionType,
          vaDiagnosticCode: cond.diagnosticCode,
          icd10Code: cond.icd10Code,
          bodyPart: cond.bodyPart,
          dateAdded: new Date().toISOString(),
        });
        result.conditionsAdded++;
      }
    }
  }

  // ---- Medications ----
  if (options.sections.includes('medications') && data.medications.length > 0) {
    const existingMeds = appStore.medications;
    // Read freshly-updated conditions (includes any just-seeded above)
    const currentConditions = useAppStore.getState().userConditions;

    for (const med of data.medications) {
      // Deduplicate by name
      const exists = existingMeds.some(
        (m) => m.name.toLowerCase().trim() === med.name.toLowerCase().trim(),
      );
      if (exists) continue;

      // Resolve prescribedFor name to UserCondition UUID for conditionTags
      let resolvedTags: string[] | undefined;
      if (med.prescribedFor) {
        const match = findExistingCondition(currentConditions, med.prescribedFor);
        resolvedTags = match ? [match.id] : undefined;
      }

      appStore.addMedication({
        startDate: '',
        endDate: '',
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        prescribedFor: med.prescribedFor ?? '',
        sideEffects: '',
        stillTaking: med.stillTaking ?? true,
        conditionTags: resolvedTags,
      });
      result.medicationsAdded++;
    }
  }

  // ---- Medical Visits ----
  if (options.sections.includes('visits') && data.medicalVisits.length > 0) {
    const existingVisits = appStore.medicalVisits;

    for (const visit of data.medicalVisits) {
      // Deduplicate by date + provider/location
      const exists = existingVisits.some(
        (v) => v.date === visit.date && v.location === (visit.location ?? ''),
      );
      if (exists) continue;

      const visitType = normalizeVisitType(visit.visitType);

      appStore.addMedicalVisit({
        date: visit.date ?? '',
        visitType,
        location: visit.location ?? '',
        reason: visit.reason ?? '',
        diagnosis: visit.diagnosis ?? '',
        treatment: visit.treatment ?? '',
        provider: visit.provider ?? '',
        gotAfterVisitSummary: false,
        followUp: '',
        notes: '',
        relatedCondition: visit.relatedCondition,
      });
      result.visitsAdded++;
    }
  }

  // ---- Service History (duty stations, deployments, combat zones, major events) ----
  if (options.sections.includes('service')) {
    // Duty Stations
    const existingStations = appStore.dutyStations;
    for (const station of data.dutyStations) {
      const exists = existingStations.some(
        (s) => s.baseName.toLowerCase().trim() === station.baseName.toLowerCase().trim(),
      );
      if (exists) continue;

      appStore.addDutyStation({
        baseName: station.baseName,
        startDate: station.startDate ?? '',
        endDate: station.endDate ?? '',
      });
      result.dutyStationsAdded++;
    }

    // Deployments
    const existingDeploys = appStore.deployments;
    for (const dep of data.deployments) {
      const exists = existingDeploys.some(
        (d) => d.operationName.toLowerCase() === dep.operationName.toLowerCase()
          && d.location.toLowerCase() === dep.location.toLowerCase(),
      );
      if (exists) continue;

      appStore.addDeployment({
        operationName: dep.operationName,
        location: dep.location,
        startDate: dep.startDate ?? '',
        endDate: dep.endDate ?? '',
        combatDeployment: dep.combatDeployment ?? false,
        unit: '',
        role: '',
        hazardsEncountered: '',
        notes: '',
      });
      result.deploymentsAdded++;
    }

    // Combat Zones
    for (const zone of data.combatZones) {
      const exists = appStore.combatHistory.some(
        (c) => c.location.toLowerCase() === zone.location.toLowerCase(),
      );
      if (exists) continue;

      appStore.addCombatEntry({
        startDate: zone.startDate ?? '',
        endDate: zone.endDate ?? '',
        location: zone.location,
        combatZoneType: (zone.combatZoneType as 'Combat Zone' | 'Hostile Fire Area' | 'Imminent Danger Area' | 'Hazardous Duty') ?? 'Combat Zone',
        receivedHostileFirePay: false,
        receivedImmDangerPay: false,
        directCombat: false,
        description: '',
      });
    }

    // Major Events
    for (const evt of data.majorEvents) {
      const exists = appStore.majorEvents.some(
        (e) => e.title.toLowerCase() === evt.title.toLowerCase(),
      );
      if (exists) continue;

      appStore.addMajorEvent({
        date: evt.date ?? '',
        type: normalizeEventType(evt.type),
        title: evt.title,
        location: evt.location ?? '',
        description: evt.description,
        documented: true,
        witnesses: '',
      });
      result.majorEventsAdded++;
    }
  }

  // ---- Exposures ----
  if (options.sections.includes('exposures') && data.exposures.length > 0) {
    const existingExposures = appStore.exposures;

    for (const exp of data.exposures) {
      const normalizedType = normalizeExposureType(exp.type);
      const exists = existingExposures.some(
        (e) => e.type === normalizedType && (e.location ?? '').toLowerCase() === (exp.location ?? '').toLowerCase(),
      );
      if (exists) continue;

      appStore.addExposure({
        date: '',
        type: normalizedType,
        duration: exp.duration ?? '',
        location: exp.location ?? '',
        details: exp.details ?? '',
        ppeProvided: false,
        witnesses: '',
      });
      result.exposuresAdded++;
    }
  }

  // Mark sections as applied
  for (const section of options.sections) {
    appStore.markCFileSectionApplied(section);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeVisitType(raw?: string): 'Sick Call' | 'ER' | 'Mental Health' | 'PT' | 'Dental' | 'Specialist' {
  if (!raw) return 'Sick Call';
  const lower = raw.toLowerCase();
  if (lower.includes('er') || lower.includes('emergency')) return 'ER';
  if (lower.includes('mental') || lower.includes('psych') || lower.includes('behavioral')) return 'Mental Health';
  if (lower.includes('pt') || lower.includes('physical therapy')) return 'PT';
  if (lower.includes('dental')) return 'Dental';
  if (lower.includes('special')) return 'Specialist';
  return 'Sick Call';
}

function normalizeEventType(raw?: string): 'Injury' | 'Accident' | 'Assault/MST' | 'TBI Event' | 'Traumatic Event' | 'Award/Decoration' | 'Line of Duty Investigation' | 'Other' {
  if (!raw) return 'Other';
  const lower = raw.toLowerCase();
  if (lower.includes('injury')) return 'Injury';
  if (lower.includes('accident')) return 'Accident';
  if (lower.includes('assault') || lower.includes('mst')) return 'Assault/MST';
  if (lower.includes('tbi')) return 'TBI Event';
  if (lower.includes('traumatic')) return 'Traumatic Event';
  if (lower.includes('award') || lower.includes('decoration')) return 'Award/Decoration';
  if (lower.includes('line of duty') || lower.includes('lod')) return 'Line of Duty Investigation';
  return 'Other';
}
