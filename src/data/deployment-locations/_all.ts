/**
 * Internal module — provides the flat ALL_LOCATIONS array.
 * Imported by search.ts and adapter.ts to avoid circular deps with index.ts.
 */

import type { EnrichedLocation } from './types';
import { IRAQ_LOCATIONS } from './iraq';
import { AFGHANISTAN_LOCATIONS } from './afghanistan';
import { GULF_WAR_LOCATIONS } from './gulf-war';
import { VIETNAM_LOCATIONS } from './vietnam';
import { THAILAND_LOCATIONS } from './thailand';
import { KOREA_WAR_LOCATIONS, KOREA_DMZ_LOCATIONS } from './korea';
import { GWOT_OTHER_LOCATIONS } from './gwot-other';
import { CAMP_LEJEUNE_LOCATIONS, NUCLEAR_RADIATION_LOCATIONS, DOMESTIC_TOXIC_LOCATIONS } from './domestic';
import { EUROPE_LOCATIONS } from './europe';

export const ALL_LOCATIONS: EnrichedLocation[] = [
  ...IRAQ_LOCATIONS,
  ...AFGHANISTAN_LOCATIONS,
  ...GULF_WAR_LOCATIONS,
  ...VIETNAM_LOCATIONS,
  ...THAILAND_LOCATIONS,
  ...KOREA_WAR_LOCATIONS,
  ...KOREA_DMZ_LOCATIONS,
  ...GWOT_OTHER_LOCATIONS,
  ...CAMP_LEJEUNE_LOCATIONS,
  ...NUCLEAR_RADIATION_LOCATIONS,
  ...DOMESTIC_TOXIC_LOCATIONS,
  ...EUROPE_LOCATIONS,
];
