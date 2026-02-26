/**
 * Enriched deployment location types.
 *
 * These replace the flat JSON structure with strongly typed,
 * metadata-rich location data for search, filtering, and display.
 */

export type HazardType =
  | 'burn_pit'
  | 'agent_orange'
  | 'high_dioxin'
  | 'radiation'
  | 'contaminated_water'
  | 'oil_well_fire'
  | 'depleted_uranium'
  | 'pfas'
  | 'chemical'
  | 'noise'
  | 'asbestos'
  | 'lead'
  | 'jet_fuel'
  | 'munitions';

export type ConflictId =
  | 'oif_iraq'
  | 'oef_afghanistan'
  | 'gulf_war'
  | 'vietnam'
  | 'thailand_vietnam_era'
  | 'korea_war'
  | 'korea_dmz'
  | 'gwot_other'
  | 'camp_lejeune'
  | 'nuclear_radiation'
  | 'cold_war_europe'
  | 'domestic_toxic';

export interface EnrichedLocation {
  /** Exact name — must match existing store keys for backward compatibility */
  name: string;
  /** Common nicknames, abbreviations, alternate spellings */
  alternateNames: string[];
  country: string;
  region?: string;
  /** [latitude, longitude] — approximate center */
  coordinates?: [number, number];
  hazards: HazardType[];
  conflictId: ConflictId;
  /** Display group header in the picker UI */
  regionGroup: string;
  /** Whether the location qualifies under the PACT Act */
  pactActEligible?: boolean;
  notes?: string;
}

/** Legacy shape used by existing components */
export interface LegacyLocation {
  name: string;
  exposureFlags: string[];
  alternateNames?: string[];
  notes?: string;
}

export interface LegacyRegion {
  name: string;
  locations: LegacyLocation[];
}

export interface LegacyConflict {
  conflictId: string;
  name: string;
  dateRange: string;
  defaultExposures: string[];
  regions: LegacyRegion[];
}

export interface LegacyDeploymentData {
  conflicts: LegacyConflict[];
}

/** Conflict metadata for grouping */
export interface ConflictMeta {
  conflictId: ConflictId;
  name: string;
  dateRange: string;
  defaultExposures: HazardType[];
}

/** All conflict metadata */
export const CONFLICT_META: ConflictMeta[] = [
  { conflictId: 'oif_iraq', name: 'Operation Iraqi Freedom / New Dawn', dateRange: '2003–2011', defaultExposures: ['burn_pit'] },
  { conflictId: 'oef_afghanistan', name: 'Operation Enduring Freedom — Afghanistan', dateRange: '2001–2021', defaultExposures: ['burn_pit'] },
  { conflictId: 'gulf_war', name: 'Gulf War / Desert Shield / Desert Storm', dateRange: '1990–1991', defaultExposures: ['oil_well_fire', 'depleted_uranium'] },
  { conflictId: 'vietnam', name: 'Vietnam War', dateRange: '1962–1975', defaultExposures: ['agent_orange'] },
  { conflictId: 'thailand_vietnam_era', name: 'Thailand — Military Bases (Vietnam Era)', dateRange: '1961–1976', defaultExposures: ['agent_orange'] },
  { conflictId: 'korea_war', name: 'Korean War', dateRange: '1950–1953', defaultExposures: [] },
  { conflictId: 'korea_dmz', name: 'Korea — DMZ Service', dateRange: '1967–1971', defaultExposures: ['agent_orange'] },
  { conflictId: 'gwot_other', name: 'GWOT — Other Worldwide Locations', dateRange: '2001–present', defaultExposures: ['burn_pit'] },
  { conflictId: 'camp_lejeune', name: 'Camp Lejeune Water Contamination', dateRange: '1953–1987', defaultExposures: ['contaminated_water'] },
  { conflictId: 'nuclear_radiation', name: 'Nuclear/Radiation Exposure', dateRange: '', defaultExposures: ['radiation'] },
  { conflictId: 'cold_war_europe', name: 'Cold War — European Bases', dateRange: '1945–1991', defaultExposures: ['jet_fuel', 'asbestos'] },
  { conflictId: 'domestic_toxic', name: 'Domestic — Toxic Exposure Sites', dateRange: 'Various', defaultExposures: ['pfas', 'chemical'] },
];

/** Human-readable labels for all hazard types */
export const HAZARD_LABELS: Record<HazardType, string> = {
  burn_pit: 'Burn Pit',
  agent_orange: 'Agent Orange',
  high_dioxin: 'HIGH DIOXIN',
  radiation: 'Radiation',
  contaminated_water: 'Contaminated Water',
  oil_well_fire: 'Oil Well Fire',
  depleted_uranium: 'Depleted Uranium',
  pfas: 'PFAS/AFFF',
  chemical: 'Chemical Exposure',
  noise: 'Noise/Hearing',
  asbestos: 'Asbestos',
  lead: 'Lead',
  jet_fuel: 'Jet Fuel/JP-8',
  munitions: 'Munitions',
};
