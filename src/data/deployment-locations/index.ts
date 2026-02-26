/**
 * Deployment Locations — barrel export
 *
 * Re-exports all types, data, search, adapter, and hazard mapping.
 * ALL_LOCATIONS lives in _all.ts to avoid circular deps.
 */

export type { EnrichedLocation, HazardType, ConflictId, ConflictMeta, LegacyDeploymentData } from './types';
export { CONFLICT_META, HAZARD_LABELS } from './types';
export { searchLocations } from './search';
export { getLegacyDeploymentData } from './adapter';
export { HAZARD_TO_EXPOSURE_GROUP, HAZARD_SECONDARIES } from './hazard-conditions';
export { ALL_LOCATIONS } from './_all';

/** Re-export individual theater arrays for targeted use */
export { IRAQ_LOCATIONS } from './iraq';
export { AFGHANISTAN_LOCATIONS } from './afghanistan';
export { GULF_WAR_LOCATIONS } from './gulf-war';
export { VIETNAM_LOCATIONS } from './vietnam';
export { THAILAND_LOCATIONS } from './thailand';
export { KOREA_WAR_LOCATIONS, KOREA_DMZ_LOCATIONS } from './korea';
export { GWOT_OTHER_LOCATIONS } from './gwot-other';
export { CAMP_LEJEUNE_LOCATIONS, NUCLEAR_RADIATION_LOCATIONS, DOMESTIC_TOXIC_LOCATIONS } from './domestic';
export { EUROPE_LOCATIONS } from './europe';
