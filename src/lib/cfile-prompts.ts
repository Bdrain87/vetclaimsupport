/**
 * C-File Intel - AI prompts and response schemas for C-File analysis.
 *
 * Analyzes veteran C-Files to find missed conditions, secondary opportunities,
 * rating discrepancies, and evidence gaps - cross-referenced with their tracked data.
 * Also extracts structured data (conditions, meds, visits, service history) to
 * auto-populate the app stores.
 */

import { AI_ANTI_HALLUCINATION } from './ai-prompts';

// ---------------------------------------------------------------------------
// Existing analysis response types (kept for backwards compat)
// ---------------------------------------------------------------------------

export interface CFileConditionFinding {
  conditionName: string;
  diagnosticCode?: string;
  mentionedInCFile: boolean;
  currentRating?: number;
  suggestedAction: 'add' | 'increase' | 'secondary' | 'review';
  reason: string;
  evidenceInFile: string;
}

export interface CFileSecondaryOpportunity {
  primaryCondition: string;
  secondaryCondition: string;
  medicalBasis: string;
  evidenceInFile: string;
}

export interface CFileEvidenceGap {
  condition: string;
  missingEvidence: string;
  recommendation: string;
}

export interface CFileAnalysisResult {
  summary: string;
  missedConditions: CFileConditionFinding[];
  ratingDiscrepancies: CFileConditionFinding[];
  secondaryOpportunities: CFileSecondaryOpportunity[];
  evidenceGaps: CFileEvidenceGap[];
  actionPlan: string[];
}

// ---------------------------------------------------------------------------
// NEW: Extracted structured data types
// ---------------------------------------------------------------------------

export interface CFileCondition {
  conditionName: string;
  diagnosticCode?: string;
  icd10Code?: string;
  rating?: number;
  claimStatus?: 'pending' | 'approved' | 'denied';
  connectionType?: 'direct' | 'secondary' | 'presumptive' | 'aggravation';
  serviceConnected?: boolean;
  isPrimary?: boolean;
  secondaryTo?: string;
  bodyPart?: string;
}

export interface CFileDutyStation {
  baseName: string;
  startDate?: string;
  endDate?: string;
}

export interface CFileDeployment {
  operationName: string;
  location: string;
  startDate?: string;
  endDate?: string;
  combatDeployment?: boolean;
}

export interface CFileCombatZone {
  location: string;
  startDate?: string;
  endDate?: string;
  combatZoneType?: string;
}

export interface CFileExposure {
  type: string;
  location?: string;
  duration?: string;
  details?: string;
}

export interface CFileMajorEvent {
  date?: string;
  type?: string;
  title: string;
  location?: string;
  description: string;
}

export interface CFileMedication {
  name: string;
  dosage?: string;
  prescribedFor?: string;
  stillTaking?: boolean;
  frequency?: string;
}

export interface CFileMedicalVisit {
  date?: string;
  visitType?: string;
  location?: string;
  reason?: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  relatedCondition?: string;
}

// ---------------------------------------------------------------------------
// Full extraction result: structured data + analysis
// ---------------------------------------------------------------------------

export interface CFileExtractedData {
  // Profile
  branch?: string;
  militarySpecialty?: string;
  specialtyTitle?: string;
  serviceStartDate?: string;
  serviceEndDate?: string;
  separationDate?: string;

  // Conditions (the big one)
  conditions: CFileCondition[];

  // Service history
  dutyStations: CFileDutyStation[];
  deployments: CFileDeployment[];
  combatZones: CFileCombatZone[];
  exposures: CFileExposure[];
  majorEvents: CFileMajorEvent[];

  // Medical
  medications: CFileMedication[];
  medicalVisits: CFileMedicalVisit[];

  // The existing analysis (keep it)
  analysis: CFileAnalysisResult;
}

// ---------------------------------------------------------------------------
// Gemini response schemas
// ---------------------------------------------------------------------------

export const CFILE_RESPONSE_SCHEMA = {
  type: 'OBJECT' as const,
  properties: {
    // --- Profile ---
    branch: { type: 'STRING' as const, description: 'Branch of service (army, marines, navy, air_force, coast_guard, space_force)' },
    militarySpecialty: { type: 'STRING' as const, description: 'Military job code (MOS, AFSC, Rating, etc.)' },
    specialtyTitle: { type: 'STRING' as const, description: 'Military job title' },
    serviceStartDate: { type: 'STRING' as const, description: 'Service start date (YYYY-MM format)' },
    serviceEndDate: { type: 'STRING' as const, description: 'Service end date (YYYY-MM format)' },
    separationDate: { type: 'STRING' as const, description: 'Separation/discharge date (YYYY-MM-DD or YYYY-MM)' },

    // --- Conditions ---
    conditions: {
      type: 'ARRAY' as const,
      description: 'All medical conditions found in the C-File',
      items: {
        type: 'OBJECT' as const,
        properties: {
          conditionName: { type: 'STRING' as const },
          diagnosticCode: { type: 'STRING' as const, description: 'VA diagnostic code if present' },
          icd10Code: { type: 'STRING' as const, description: 'ICD-10 code if present' },
          rating: { type: 'NUMBER' as const, description: 'Current VA rating percentage if assigned' },
          claimStatus: { type: 'STRING' as const, enum: ['pending', 'approved', 'denied'] },
          connectionType: { type: 'STRING' as const, enum: ['direct', 'secondary', 'presumptive', 'aggravation'] },
          serviceConnected: { type: 'BOOLEAN' as const },
          isPrimary: { type: 'BOOLEAN' as const },
          secondaryTo: { type: 'STRING' as const, description: 'Name of primary condition if this is secondary' },
          bodyPart: { type: 'STRING' as const, description: 'Affected body part/area' },
        },
        required: ['conditionName'],
      },
    },

    // --- Service history ---
    dutyStations: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          baseName: { type: 'STRING' as const },
          startDate: { type: 'STRING' as const },
          endDate: { type: 'STRING' as const },
        },
        required: ['baseName'],
      },
    },
    deployments: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          operationName: { type: 'STRING' as const },
          location: { type: 'STRING' as const },
          startDate: { type: 'STRING' as const },
          endDate: { type: 'STRING' as const },
          combatDeployment: { type: 'BOOLEAN' as const },
        },
        required: ['operationName', 'location'],
      },
    },
    combatZones: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          location: { type: 'STRING' as const },
          startDate: { type: 'STRING' as const },
          endDate: { type: 'STRING' as const },
          combatZoneType: { type: 'STRING' as const },
        },
        required: ['location'],
      },
    },
    exposures: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          type: { type: 'STRING' as const, description: 'Exposure type (Burn pit, Jet fuel, Chemicals, Noise, Radiation, Asbestos, etc.)' },
          location: { type: 'STRING' as const },
          duration: { type: 'STRING' as const },
          details: { type: 'STRING' as const },
        },
        required: ['type'],
      },
    },
    majorEvents: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          date: { type: 'STRING' as const },
          type: { type: 'STRING' as const, description: 'Injury, Accident, Assault/MST, TBI Event, Traumatic Event, etc.' },
          title: { type: 'STRING' as const },
          location: { type: 'STRING' as const },
          description: { type: 'STRING' as const },
        },
        required: ['title', 'description'],
      },
    },

    // --- Medical ---
    medications: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          name: { type: 'STRING' as const },
          dosage: { type: 'STRING' as const },
          prescribedFor: { type: 'STRING' as const },
          stillTaking: { type: 'BOOLEAN' as const },
          frequency: { type: 'STRING' as const },
        },
        required: ['name'],
      },
    },
    medicalVisits: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          date: { type: 'STRING' as const },
          visitType: { type: 'STRING' as const },
          location: { type: 'STRING' as const },
          reason: { type: 'STRING' as const },
          diagnosis: { type: 'STRING' as const },
          treatment: { type: 'STRING' as const },
          provider: { type: 'STRING' as const },
          relatedCondition: { type: 'STRING' as const },
        },
        required: ['date'],
      },
    },

    // --- Analysis (existing) ---
    analysis: {
      type: 'OBJECT' as const,
      properties: {
        summary: { type: 'STRING' as const, description: 'Brief 2-3 sentence summary of C-File analysis findings' },
        missedConditions: {
          type: 'ARRAY' as const,
          items: {
            type: 'OBJECT' as const,
            properties: {
              conditionName: { type: 'STRING' as const },
              diagnosticCode: { type: 'STRING' as const },
              mentionedInCFile: { type: 'BOOLEAN' as const },
              currentRating: { type: 'NUMBER' as const },
              suggestedAction: { type: 'STRING' as const, enum: ['add', 'increase', 'secondary', 'review'] },
              reason: { type: 'STRING' as const },
              evidenceInFile: { type: 'STRING' as const },
            },
            required: ['conditionName', 'mentionedInCFile', 'suggestedAction', 'reason', 'evidenceInFile'],
          },
        },
        ratingDiscrepancies: {
          type: 'ARRAY' as const,
          items: {
            type: 'OBJECT' as const,
            properties: {
              conditionName: { type: 'STRING' as const },
              diagnosticCode: { type: 'STRING' as const },
              currentRating: { type: 'NUMBER' as const },
              suggestedAction: { type: 'STRING' as const, enum: ['increase', 'review'] },
              reason: { type: 'STRING' as const },
              evidenceInFile: { type: 'STRING' as const },
            },
            required: ['conditionName', 'suggestedAction', 'reason', 'evidenceInFile'],
          },
        },
        secondaryOpportunities: {
          type: 'ARRAY' as const,
          items: {
            type: 'OBJECT' as const,
            properties: {
              primaryCondition: { type: 'STRING' as const },
              secondaryCondition: { type: 'STRING' as const },
              medicalBasis: { type: 'STRING' as const },
              evidenceInFile: { type: 'STRING' as const },
            },
            required: ['primaryCondition', 'secondaryCondition', 'medicalBasis', 'evidenceInFile'],
          },
        },
        evidenceGaps: {
          type: 'ARRAY' as const,
          items: {
            type: 'OBJECT' as const,
            properties: {
              condition: { type: 'STRING' as const },
              missingEvidence: { type: 'STRING' as const },
              recommendation: { type: 'STRING' as const },
            },
            required: ['condition', 'missingEvidence', 'recommendation'],
          },
        },
        actionPlan: {
          type: 'ARRAY' as const,
          items: { type: 'STRING' as const },
          description: 'Prioritized list of recommended next steps',
        },
      },
      required: ['summary', 'missedConditions', 'ratingDiscrepancies', 'secondaryOpportunities', 'evidenceGaps', 'actionPlan'],
    },
  },
  required: ['conditions', 'dutyStations', 'deployments', 'combatZones', 'exposures', 'majorEvents', 'medications', 'medicalVisits', 'analysis'],
};

// ---------------------------------------------------------------------------
// System prompt builder
// ---------------------------------------------------------------------------

export function buildCFileIntelPrompt(opts: {
  veteranContext: string;
  currentConditions: string[];
  secondaryConnections?: string;
  ratingCriteria?: string;
}): string {
  const conditionList = opts.currentConditions.length > 0
    ? `\nVETERAN'S CURRENT CLAIMED CONDITIONS:\n${opts.currentConditions.map(c => `- ${c}`).join('\n')}`
    : '\nVETERAN HAS NO CONDITIONS CLAIMED YET.';

  return `You are a VA claims research assistant helping a veteran understand their C-File (Claims File).

ROLE: You analyze the C-File document to extract structured data AND identify potential opportunities the veteran may have missed. You are educational - you help veterans understand what's in their file and what it might mean for their claim.

IMPORTANT RULES:
- You are NOT a doctor. Do NOT diagnose conditions.
- You are NOT a legal advisor. Do NOT recommend specific filing actions.
- Frame findings as "your C-File mentions..." and "veterans in similar situations often consider..."
- Do NOT use: "nexus", "at least as likely as not", "more likely than not", "medical nexus", "reasonable medical certainty"
- Use "[CLINICIAN TO EVALUATE]" for any medical opinion areas
- Recommend consulting a VA-accredited VSO, attorney, or claims agent before taking action
- CRITICAL: Extract only factual data present in the document. Do NOT infer or fabricate fields not explicitly stated.

${opts.veteranContext}
${conditionList}
${opts.secondaryConnections ? `\nKNOWN SECONDARY CONNECTIONS:\n${opts.secondaryConnections}` : ''}
${opts.ratingCriteria ? `\nRATING CRITERIA:\n${opts.ratingCriteria}` : ''}

EXTRACTION INSTRUCTIONS (structured data):
1. PROFILE: Extract branch of service, military specialty/job code, service dates, and separation date if present.
2. CONDITIONS: Extract ALL medical conditions mentioned - include diagnostic codes, ICD-10 codes, ratings, claim status, connection type, and whether service-connected. For secondary conditions, note which primary they are secondary to.
3. DUTY STATIONS: Extract all duty station names and date ranges.
4. DEPLOYMENTS: Extract deployment operations, locations, dates, and whether combat deployments.
5. COMBAT ZONES: Extract combat zone entries with locations, dates, and zone types.
6. EXPOSURES: Extract all exposure mentions (burn pits, chemicals, noise, radiation, asbestos, etc.) with locations.
7. MAJOR EVENTS: Extract significant incidents (injuries, accidents, TBI events, traumatic events) with dates and descriptions.
8. MEDICATIONS: Extract all medications with dosages, what they are prescribed for, and frequency.
9. MEDICAL VISITS: Extract medical visit records with dates, types, locations, diagnoses, treatments, and providers.

ANALYSIS INSTRUCTIONS (inside the "analysis" field):
1. MISSED CONDITIONS: Look for diagnoses, treatments, or medical conditions mentioned in the C-File that are NOT in the veteran's current claimed conditions list.
2. RATING DISCREPANCIES: Look for evidence suggesting a condition's severity may exceed its current rating level.
3. SECONDARY OPPORTUNITIES: Identify conditions that could be secondary to currently claimed conditions.
4. EVIDENCE GAPS: For each claimed condition, identify what evidence is present vs what might strengthen the claim.
5. ACTION PLAN: Prioritize findings into actionable next steps.

Respond with structured JSON matching the provided schema.

${AI_ANTI_HALLUCINATION}`;
}
