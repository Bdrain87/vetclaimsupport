/**
 * Legacy adapter — provides the same { conflicts: ConflictData[] } shape
 * as the old deployment-locations.json for backward compatibility with
 * DeploymentLocationPicker and PresumptiveConditionSuggestions.
 */

import type { EnrichedLocation, LegacyDeploymentData, LegacyConflict, LegacyRegion } from './types';
import { CONFLICT_META } from './types';
import { ALL_LOCATIONS } from './_all';

let _legacyData: LegacyDeploymentData | null = null;

/**
 * Returns legacy-shaped deployment data matching the old JSON structure.
 * Built once, cached thereafter.
 */
export function getLegacyDeploymentData(): LegacyDeploymentData {
  if (_legacyData) return _legacyData;

  // Group locations by conflictId
  const byConflict = new Map<string, EnrichedLocation[]>();
  for (const loc of ALL_LOCATIONS) {
    const existing = byConflict.get(loc.conflictId) ?? [];
    existing.push(loc);
    byConflict.set(loc.conflictId, existing);
  }

  const conflicts: LegacyConflict[] = CONFLICT_META.map((meta) => {
    const locations = byConflict.get(meta.conflictId) ?? [];

    // Group by regionGroup to create legacy regions
    const regionMap = new Map<string, EnrichedLocation[]>();
    for (const loc of locations) {
      const existing = regionMap.get(loc.regionGroup) ?? [];
      existing.push(loc);
      regionMap.set(loc.regionGroup, existing);
    }

    const regions: LegacyRegion[] = Array.from(regionMap.entries()).map(
      ([name, locs]) => ({
        name,
        locations: locs.map((l) => ({
          name: l.name,
          exposureFlags: l.hazards as string[],
          alternateNames: l.alternateNames.length > 0 ? l.alternateNames : undefined,
          notes: l.notes,
        })),
      }),
    );

    return {
      conflictId: meta.conflictId,
      name: meta.name,
      dateRange: meta.dateRange,
      defaultExposures: meta.defaultExposures as string[],
      regions,
    };
  });

  _legacyData = { conflicts };
  return _legacyData;
}
