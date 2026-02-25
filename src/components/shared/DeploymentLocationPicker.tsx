import { useState, useMemo } from 'react';
import { Search, AlertTriangle, MapPin, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useAppStore from '@/store/useAppStore';
import deploymentData from '@/data/deployment-locations.json';

// ===== Types =====

interface DeploymentLocation {
  name: string;
  alternateNames?: string[];
  exposureFlags?: string[];
  notes?: string;
}

interface Region {
  name: string;
  locations: DeploymentLocation[];
}

interface ConflictData {
  conflictId: string;
  name: string;
  dateRange: string;
  defaultExposures: string[];
  regions: Region[];
}

interface DeploymentLocationPickerProps {
  conflictId: string;
  className?: string;
}

// ===== Constants =====

const EXPOSURE_LABELS: Record<string, string> = {
  burn_pit: 'Burn Pit',
  agent_orange: 'Agent Orange',
  high_dioxin: 'HIGH DIOXIN',
  radiation: 'Radiation',
  contaminated_water: 'Contaminated Water',
  oil_well_fire: 'Oil Well Fire',
  depleted_uranium: 'Depleted Uranium',
};

const data = deploymentData as { conflicts: ConflictData[] };

// ===== Component =====

export function DeploymentLocationPicker({
  conflictId,
  className,
}: DeploymentLocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');

  const selectedLocations = useAppStore((s) => s.selectedLocations);
  const toggleLocation = useAppStore((s) => s.toggleLocation);
  const addCustomLocation = useAppStore((s) => s.addCustomLocation);
  const removeCustomLocation = useAppStore((s) => s.removeCustomLocation);
  const customLocations = useAppStore((s) => s.customLocations);

  const conflict = useMemo(
    () => data.conflicts.find((c) => c.conflictId === conflictId),
    [conflictId],
  );

  // Filter regions and locations by search query
  const filteredRegions = useMemo(() => {
    if (!conflict) return [];

    const query = searchQuery.trim().toLowerCase();
    if (!query) return conflict.regions;

    return conflict.regions
      .map((region) => ({
        ...region,
        locations: region.locations.filter((loc) => {
          const nameMatch = loc.name.toLowerCase().includes(query);
          const altMatch = loc.alternateNames?.some((alt) =>
            alt.toLowerCase().includes(query),
          );
          return nameMatch || altMatch;
        }),
      }))
      .filter((region) => region.locations.length > 0);
  }, [conflict, searchQuery]);

  // Count selected locations for this conflict
  const selectedCount = useMemo(() => {
    const prefix = `${conflictId}::`;
    return selectedLocations.filter((key) => key.startsWith(prefix)).length;
  }, [selectedLocations, conflictId]);

  // Custom locations that belong to this conflict (prefixed with conflictId)
  const conflictCustomLocations = useMemo(
    () => customLocations.filter((loc) => loc.startsWith(`${conflictId}::`)),
    [customLocations, conflictId],
  );

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    addCustomLocation(`${conflictId}::${trimmed}`);
    setCustomInput('');
  };

  const handleRemoveCustom = (location: string) => {
    removeCustomLocation(location);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  if (!conflict) {
    return (
      <div className={cn('p-4 text-center text-muted-foreground text-sm', className)}>
        Conflict not found.
      </div>
    );
  }

  const totalLocations = filteredRegions.reduce(
    (sum, region) => sum + region.locations.length,
    0,
  );

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-secondary p-4 space-y-4',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-semibold text-foreground">
            Deployment Locations
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {selectedCount} location{selectedCount !== 1 ? 's' : ''} selected
        </span>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 min-h-[40px] bg-muted/50 text-sm"
        />
      </div>

      {/* Scrollable location list */}
      <div className="max-h-96 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-1">
        {totalLocations === 0 && searchQuery.trim() !== '' && (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No locations found for &ldquo;{searchQuery}&rdquo;
          </div>
        )}

        {filteredRegions.map((region) => (
          <div key={region.name} className="space-y-2">
            {/* Region header */}
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">
              {region.name}
            </h4>

            {/* Location checkboxes */}
            <div className="space-y-1">
              {region.locations.map((location) => {
                const locationKey = `${conflictId}::${location.name}`;
                const isChecked = selectedLocations.includes(locationKey);
                const hasHighDioxin = location.exposureFlags?.includes('high_dioxin');

                return (
                  <label
                    key={location.name}
                    className={cn(
                      'flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all',
                      'border border-transparent',
                      'hover:bg-gold/5 hover:border-gold/20',
                      isChecked && 'bg-gold/10 border-gold/30',
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() =>
                        toggleLocation(conflictId, location.name)
                      }
                      className="mt-0.5"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">
                          {location.name}
                        </span>

                        {hasHighDioxin && (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                        )}

                        {location.exposureFlags?.map((flag) => (
                          <span
                            key={flag}
                            className={cn(
                              'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide',
                              flag === 'high_dioxin'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-amber-500/10 text-amber-300/80 border border-amber-500/20',
                            )}
                          >
                            {EXPOSURE_LABELS[flag] || flag}
                          </span>
                        ))}
                      </div>

                      {location.alternateNames &&
                        location.alternateNames.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            ({location.alternateNames.join(', ')})
                          </p>
                        )}

                      {location.notes && (
                        <p className="text-xs text-muted-foreground/70 italic">
                          {location.notes}
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom locations list */}
      {conflictCustomLocations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">
            Custom Locations
          </h4>
          <div className="space-y-1">
            {conflictCustomLocations.map((loc) => {
              const displayName = loc.replace(`${conflictId}::`, '');
              return (
                <div
                  key={loc}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/30 border border-border"
                >
                  <MapPin className="h-3.5 w-3.5 text-gold flex-shrink-0" />
                  <span className="text-sm text-foreground flex-1 min-w-0 truncate">
                    {displayName}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustom(loc)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
                    aria-label={`Remove ${displayName}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add custom location */}
      <div className="border-t border-border/50 pt-3">
        <p className="text-xs text-muted-foreground mb-2">
          Don&apos;t see your location? Add it below.
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Other location..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-10 min-h-[40px] bg-muted/50 text-sm"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCustom}
            disabled={!customInput.trim()}
            className="h-10 px-3 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
