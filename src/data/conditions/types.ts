/**
 * VA Condition Database — Type Definitions
 * 38 CFR Part 4 — Schedule for Rating Disabilities
 */

export type BodySystem =
  | 'musculoskeletal'
  | 'neurological'
  | 'mental-health'
  | 'cardiovascular'
  | 'respiratory'
  | 'digestive'
  | 'skin'
  | 'endocrine'
  | 'genitourinary'
  | 'hemic-lymphatic'
  | 'infectious'
  | 'dental'
  | 'eye'
  | 'auditory'
  | 'gynecological';

export type ConditionCategory =
  | 'mental-health'
  | 'musculoskeletal'
  | 'neurological'
  | 'respiratory'
  | 'cardiovascular'
  | 'digestive'
  | 'skin'
  | 'endocrine'
  | 'genitourinary'
  | 'hematologic'
  | 'infectious'
  | 'dental'
  | 'eye'
  | 'ear'
  | 'gynecological'
  | 'other';

export interface VACondition {
  /** Unique kebab-case identifier (e.g., 'ptsd', 'lumbar-strain') */
  id: string;
  /** Official VA name */
  name: string;
  /** Short display name (e.g., 'PTSD', 'Tinnitus') */
  abbreviation: string;
  /** Body system category */
  category: ConditionCategory;
  /** Primary diagnostic code (string for display) */
  diagnosticCode: string;
  /** Additional diagnostic codes that may apply */
  diagnosticCodes?: string[];
  /** Typical VA rating range */
  typicalRatings: string;
  /** Brief description of the condition */
  description: string;
  /** Rating criteria from 38 CFR Part 4 */
  ratingCriteria?: string;
  /** IDs of common secondary conditions */
  commonSecondaries: string[];
  /** Display-friendly secondary condition names */
  possibleSecondaries?: string[];
  /** Nexus letter guidance */
  nexusTip?: string;
  /** Search keywords (minimum 8 per condition) */
  keywords: string[];
  /** Common misspellings for fuzzy matching */
  misspellings?: string[];
  /** Body system or anatomical area */
  bodySystem: string;
  /** Sub-region within body system */
  subRegion?: string;
  /** CFR reference for rating criteria */
  cfrReference?: string;
  /** Required DBQ form keys */
  requiredFormKeys?: string[];
  /** Presumptive eligibility categories */
  presumptiveEligibility?: string[];
  /** Common name / layperson term */
  commonName?: string;
}

export interface SecondaryConnection {
  primaryCondition: string;
  secondaryCondition: string;
  medicalConnection: string;
  category: string;
  connectionStrength?: 'strong' | 'moderate' | 'possible';
}

export interface ConditionSecondaryProfile {
  id: string;
  possibleSecondaries: string[];
  nexusTip: string;
}

export interface PresumptiveCondition {
  conditionName: string;
  conditionId?: string;
  program: 'agent-orange' | 'pact-act' | 'gulf-war' | 'camp-lejeune' | 'radiation' | 'pow';
  description: string;
}

/** Category labels for display */
export const categoryLabels: Record<ConditionCategory, string> = {
  'mental-health': 'Mental Health',
  musculoskeletal: 'Musculoskeletal',
  neurological: 'Neurological',
  respiratory: 'Respiratory',
  cardiovascular: 'Cardiovascular',
  digestive: 'Digestive',
  skin: 'Skin',
  endocrine: 'Endocrine',
  genitourinary: 'Genitourinary',
  hematologic: 'Hematologic',
  infectious: 'Infectious Diseases',
  dental: 'Dental & Oral',
  eye: 'Eye Conditions',
  ear: 'Ear & Hearing',
  gynecological: 'Gynecological',
  other: 'Other Conditions',
};
