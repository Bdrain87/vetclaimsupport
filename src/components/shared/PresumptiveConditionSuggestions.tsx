import { useState, useMemo } from 'react';
import { Shield, Plus, Check, AlertTriangle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserConditions } from '@/hooks/useUserConditions';
import useAppStore from '@/store/useAppStore';
import { resolveConditionId } from '@/utils/conditionResolver';
import presumptiveData from '@/data/presumptive-conditions.json';
import { getLegacyDeploymentData } from '@/data/deployment-locations';

interface PresumptiveCondition {
  name: string;
  conditionId?: string;
  category?: string;
}

interface ExposureGroup {
  exposureId: string;
  name: string;
  cfrCitation: string;
  eligibility: string;
  deadline?: string;
  conditions: PresumptiveCondition[];
}

const data = presumptiveData as { exposureGroups: ExposureGroup[] };

interface DeploymentLocation {
  name: string;
  exposureFlags: string[];
  alternateNames?: string[];
}

interface DeploymentRegion {
  name: string;
  locations: DeploymentLocation[];
}

interface DeploymentConflict {
  conflictId: string;
  regions: DeploymentRegion[];
}

const deployments = getLegacyDeploymentData() as { conflicts: DeploymentConflict[] };

/** Build a lookup: "conflictId::locationName" → exposure flags */
function getExposureFlagsForLocation(locationKey: string): string[] {
  const [conflictId, locationName] = locationKey.split('::');
  if (!conflictId || !locationName) return [];
  const conflict = deployments.conflicts.find((c) => c.conflictId === conflictId);
  if (!conflict) return [];
  for (const region of conflict.regions) {
    const loc = region.locations.find((l) => l.name === locationName);
    if (loc) return loc.exposureFlags;
  }
  return [];
}

/** Map exposure flags from deployment locations to presumptive exposure IDs */
const EXPOSURE_FLAG_TO_GROUP: Record<string, string> = {
  burn_pit: 'burn_pit',
  agent_orange: 'agent_orange',
  high_dioxin: 'agent_orange',
  contaminated_water: 'contaminated_water',
  radiation: 'radiation',
  oil_well_fire: 'gulf_war_illness',
  depleted_uranium: 'gulf_war_illness',
  pfas: 'pfas',
  chemical: 'chemical_exposure',
  asbestos: 'burn_pit',
  lead: 'chemical_exposure',
  jet_fuel: 'chemical_exposure',
  munitions: 'chemical_exposure',
  noise: 'noise',
};

/** Map conflict IDs to default exposure group IDs */
const CONFLICT_TO_EXPOSURE: Record<string, string[]> = {
  gulf_war: ['gulf_war_illness', 'burn_pit'],
  oif_iraq: ['burn_pit', 'gulf_war_illness'],
  oef_afghanistan: ['burn_pit', 'gulf_war_illness'],
  vietnam: ['agent_orange'],
  korea_dmz: ['agent_orange'],
  gwot_other: ['burn_pit', 'gulf_war_illness'],
  camp_lejeune: ['contaminated_water'],
  nuclear_radiation: ['radiation'],
  thailand_vietnam_era: ['agent_orange'],
  cold_war_europe: ['chemical_exposure'],
  domestic_toxic: ['pfas', 'chemical_exposure'],
};

interface PresumptiveConditionSuggestionsProps {
  /** Show suggestions for specific exposure IDs, or auto-detect from selected conflicts */
  exposureIds?: string[];
  className?: string;
}

export function PresumptiveConditionSuggestions({
  exposureIds,
  className,
}: PresumptiveConditionSuggestionsProps) {
  const selectedConflicts = useAppStore((s) => s.selectedConflicts);
  const selectedLocations = useAppStore((s) => s.selectedLocations);
  const { addCondition, hasCondition } = useUserConditions();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Determine which exposure groups to show
  const relevantGroupIds = useMemo(() => {
    if (exposureIds && exposureIds.length > 0) return new Set(exposureIds);

    const ids = new Set<string>();

    // From selected conflicts
    for (const conflictId of selectedConflicts) {
      const mapped = CONFLICT_TO_EXPOSURE[conflictId];
      if (mapped) mapped.forEach((id) => ids.add(id));
    }

    // From selected locations' exposure flags
    for (const locationKey of selectedLocations) {
      const flags = getExposureFlagsForLocation(locationKey);
      for (const flag of flags) {
        const groupId = EXPOSURE_FLAG_TO_GROUP[flag];
        if (groupId) ids.add(groupId);
      }
    }

    return ids;
  }, [exposureIds, selectedConflicts, selectedLocations]);

  const relevantGroups = useMemo(() => {
    return data.exposureGroups.filter((g) => relevantGroupIds.has(g.exposureId));
  }, [relevantGroupIds]);

  const toggleSelected = (key: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleAddSelected = () => {
    const newlyAdded = new Set<string>();
    for (const key of selectedItems) {
      // key format: "groupId::conditionName"
      const [, conditionName] = key.split('::');
      // Find the condition data
      for (const group of relevantGroups) {
        const condition = group.conditions.find((c) => c.name === conditionName);
        if (condition) {
          if (condition.conditionId) {
            const result = addCondition(condition.conditionId, {
              connectionType: 'presumptive',
              linkedExposure: group.exposureId,
              displayName: conditionName,
            });
            if (result) newlyAdded.add(key);
          } else {
            // For conditions without a conditionId, add with display name
            const resolved = resolveConditionId(conditionName);
            const result = addCondition(resolved.conditionId, {
              connectionType: 'presumptive',
              linkedExposure: group.exposureId,
              displayName: resolved.displayName,
            });
            if (result) newlyAdded.add(key);
          }
          break;
        }
      }
    }
    setAddedItems((prev) => new Set([...prev, ...newlyAdded]));
    setSelectedItems(new Set());
  };

  if (relevantGroups.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">
          Presumptive Conditions
        </h3>
      </div>

      <div className="rounded-xl p-3 flex items-start gap-3 bg-gold/5 border border-gold/20">
        <AlertTriangle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Based on your service locations and exposures, you <strong>may be eligible</strong> for
          these presumptive conditions. The VA assumes these are connected to your service.
          This is not a guarantee — always consult a VSO or attorney.
        </p>
      </div>

      {relevantGroups.map((group) => {
        const isExpanded = expandedGroups.has(group.exposureId);
        const conditionsToShow = isExpanded ? group.conditions : group.conditions.slice(0, 5);
        const hasMore = group.conditions.length > 5;

        return (
          <div
            key={group.exposureId}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
              <h4 className="text-sm font-semibold text-foreground">{group.name}</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {group.cfrCitation} — {group.eligibility}
              </p>
              {group.deadline && (
                <div className="mt-2 flex items-center gap-1.5 px-2 py-1 bg-warning/15 border border-warning/30 rounded-lg">
                  <Clock className="h-3.5 w-3.5 text-warning flex-shrink-0" />
                  <span className="text-[11px] font-medium text-warning">
                    {group.deadline}
                  </span>
                </div>
              )}
            </div>

            <div className="divide-y divide-border/30">
              {conditionsToShow.map((condition) => {
                const key = `${group.exposureId}::${condition.name}`;
                const isSelected = selectedItems.has(key);
                const isAdded = addedItems.has(key);
                const alreadyHas = condition.conditionId
                  ? hasCondition(condition.conditionId)
                  : false;

                return (
                  <label
                    key={key}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors',
                      isAdded
                        ? 'bg-success/10'
                        : isSelected
                          ? 'bg-gold/10'
                          : 'hover:bg-muted/40',
                      (alreadyHas || isAdded) && 'opacity-60 cursor-default',
                    )}
                  >
                    <Checkbox
                      checked={isSelected || isAdded || alreadyHas}
                      disabled={alreadyHas || isAdded}
                      onCheckedChange={() => toggleSelected(key)}
                      className="flex-shrink-0"
                    />
                    <span className="text-sm text-foreground flex-1">
                      {condition.name}
                    </span>
                    {condition.category && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 flex-shrink-0">
                        {condition.category}
                      </Badge>
                    )}
                    {isAdded && (
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                    )}
                    {alreadyHas && !isAdded && (
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        Already added
                      </span>
                    )}
                  </label>
                );
              })}
            </div>

            {hasMore && (
              <button
                type="button"
                onClick={() => toggleGroup(group.exposureId)}
                className="w-full px-4 py-2 text-xs text-primary hover:text-primary/80 flex items-center justify-center gap-1 border-t border-border/30 transition-colors"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    Show all {group.conditions.length} conditions <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </div>
        );
      })}

      {selectedItems.size > 0 && (
        <Button
          onClick={handleAddSelected}
          className="w-full"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {selectedItems.size} Selected to My Conditions
        </Button>
      )}
    </div>
  );
}
