import { useState, useMemo } from 'react';
import { Search, MapPin, Shield, X, Filter, Plus, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/PageContainer';
import { searchLocations, ALL_LOCATIONS, CONFLICT_META, HAZARD_LABELS } from '@/data/deployment-locations';
import { HAZARD_SECONDARIES } from '@/data/deployment-locations/hazard-conditions';
import { getConditionById } from '@/data/vaConditions';
import type { EnrichedLocation, ConflictId, HazardType } from '@/data/deployment-locations';
import useAppStore from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const HAZARD_DESCRIPTIONS: Partial<Record<HazardType, string>> = {
  burn_pit: 'Open-air burn pits were used to dispose of waste including chemicals, plastics, and medical materials. Veterans exposed may qualify for presumptive conditions under the PACT Act.',
  agent_orange: 'Agent Orange and other tactical herbicides were used for defoliation. The VA presumes certain conditions are service-connected for exposed veterans.',
  high_dioxin: 'Areas with heavy herbicide spraying had elevated dioxin levels. These locations carry the same presumptive conditions as Agent Orange exposure.',
  radiation: 'Veterans exposed to ionizing radiation during nuclear testing, cleanup, or certain occupations may qualify for presumptive conditions.',
  contaminated_water: 'Contaminated drinking water at this location has been linked to specific cancers and other conditions now covered by the VA.',
  oil_well_fire: 'Exposure to oil well fire smoke during the Gulf War is associated with Gulf War Illness and related conditions.',
  depleted_uranium: 'Depleted uranium exposure from military equipment or munitions may cause kidney and respiratory conditions.',
  pfas: 'Per- and polyfluoroalkyl substances (PFAS) in water or fire-fighting foam are linked to thyroid disease and certain cancers.',
  chemical: 'Chemical exposure at this location may qualify for presumptive service connection for neurological and skin conditions.',
  noise: 'Hazardous noise levels from military operations are linked to hearing loss and tinnitus — the #1 and #3 most common VA disabilities.',
  asbestos: 'Asbestos exposure from military buildings, ships, or equipment is linked to respiratory conditions and mesothelioma.',
  lead: 'Lead exposure from military facilities, ammunition, or paint is linked to neurological and kidney conditions.',
  jet_fuel: 'JP-8 and other jet fuel exposure is associated with respiratory and neurological conditions.',
  munitions: 'Exposure to munitions chemicals and byproducts may cause respiratory, neurological, and skin conditions.',
};

type FilterMode = 'all' | 'conflict' | 'hazard';

export default function DeploymentLocations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedConflictFilter, setSelectedConflictFilter] = useState<ConflictId | null>(null);
  const [selectedHazardFilter, setSelectedHazardFilter] = useState<HazardType | null>(null);
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);

  const selectedLocations = useAppStore((s) => s.selectedLocations);
  const toggleLocation = useAppStore((s) => s.toggleLocation);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchLocations(searchQuery, { limit: 50 });
  }, [searchQuery]);

  // Filtered locations (when browsing without search)
  const filteredLocations = useMemo(() => {
    if (searchResults) return null; // search overrides filters

    let locs = [...ALL_LOCATIONS] as EnrichedLocation[];

    if (selectedConflictFilter) {
      locs = locs.filter((l) => l.conflictId === selectedConflictFilter);
    }

    if (selectedHazardFilter) {
      locs = locs.filter((l) => l.hazards.includes(selectedHazardFilter));
    }

    return locs;
  }, [searchResults, selectedConflictFilter, selectedHazardFilter]);

  // Stats
  const totalLocations = ALL_LOCATIONS.length;
  const totalConflicts = CONFLICT_META.length;
  const pactEligible = ALL_LOCATIONS.filter((l) => l.pactActEligible).length;
  const uniqueCountries = new Set(ALL_LOCATIONS.map((l) => l.country)).size;

  const handleAddToProfile = (loc: EnrichedLocation) => {
    toggleLocation(loc.conflictId, loc.name);
  };

  const isLocationSelected = (loc: EnrichedLocation) => {
    return selectedLocations.includes(`${loc.conflictId}::${loc.name}`);
  };

  const clearFilters = () => {
    setSelectedConflictFilter(null);
    setSelectedHazardFilter(null);
    setFilterMode('all');
    setSearchQuery('');
  };

  const displayLocations = searchResults ?? filteredLocations ?? [];

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <MapPin className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Deployment Locations</h1>
          <p className="text-muted-foreground">
            Search {totalLocations.toLocaleString()} military deployment locations across all eras
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{totalLocations.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Locations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{totalConflicts}</div>
            <div className="text-xs text-muted-foreground">Service Eras</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{pactEligible.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">PACT Act Eligible</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{uniqueCountries}</div>
            <div className="text-xs text-muted-foreground">Countries</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder='Search by name, nickname, or abbreviation (e.g., "BAF", "TQ", "Lejeune")...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Search deployment locations"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters (only when not searching) */}
      {!searchQuery.trim() && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterMode === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setFilterMode('all'); clearFilters(); }}
              className="gap-1"
            >
              All
            </Button>
            <Button
              variant={filterMode === 'conflict' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterMode('conflict')}
              className="gap-1"
            >
              <Filter className="h-3.5 w-3.5" />
              By Conflict
            </Button>
            <Button
              variant={filterMode === 'hazard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterMode('hazard')}
              className="gap-1"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              By Hazard
            </Button>
          </div>

          {filterMode === 'conflict' && (
            <div className="flex gap-2 flex-wrap">
              {CONFLICT_META.map((c) => (
                <Button
                  key={c.conflictId}
                  variant={selectedConflictFilter === c.conflictId ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedConflictFilter(
                    selectedConflictFilter === c.conflictId ? null : c.conflictId,
                  )}
                  className="text-xs"
                >
                  {c.name.replace(/ — .*/, '').replace(/ \/ .*/, '')}
                </Button>
              ))}
            </div>
          )}

          {filterMode === 'hazard' && (
            <div className="flex gap-2 flex-wrap">
              {(Object.entries(HAZARD_LABELS) as [HazardType, string][]).map(([key, label]) => (
                <Button
                  key={key}
                  variant={selectedHazardFilter === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedHazardFilter(
                    selectedHazardFilter === key ? null : key,
                  )}
                  className="text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      {(searchQuery.trim() || selectedConflictFilter || selectedHazardFilter) && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {displayLocations.length === 0
              ? 'No locations found'
              : `${displayLocations.length} location${displayLocations.length !== 1 ? 's' : ''} found`}
          </p>
          {(selectedConflictFilter || selectedHazardFilter) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-3.5 w-3.5 mr-1" /> Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Location Results */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-1">
        {displayLocations.slice(0, 100).map((loc) => {
          const isSelected = isLocationSelected(loc);
          const isExpanded = expandedLocation === `${loc.conflictId}::${loc.name}`;
          const conflictMeta = CONFLICT_META.find((c) => c.conflictId === loc.conflictId);

          return (
            <Card
              key={`${loc.conflictId}::${loc.name}`}
              className={cn(
                'cursor-pointer transition-all',
                isSelected && 'border-gold/40 bg-gold/5',
              )}
              onClick={() => setExpandedLocation(
                isExpanded ? null : `${loc.conflictId}::${loc.name}`,
              )}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">
                        {loc.name}
                      </span>
                      {loc.pactActEligible && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-success/10 text-success border-success/30">
                          PACT
                        </Badge>
                      )}
                    </div>

                    {loc.alternateNames.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        aka: {loc.alternateNames.join(', ')}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                        {conflictMeta?.name.replace(/ — .*/, '').replace(/ \/ .*/, '') ?? loc.conflictId}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {loc.country}{loc.region ? `, ${loc.region}` : ''}
                      </span>
                    </div>

                    {/* Hazard badges */}
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {loc.hazards.map((h) => (
                        <span
                          key={h}
                          className={cn(
                            'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide',
                            h === 'high_dioxin'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-amber-500/10 text-amber-300/80 border border-amber-500/20',
                          )}
                        >
                          {HAZARD_LABELS[h] || h}
                        </span>
                      ))}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
                        {loc.notes && (
                          <p className="text-xs text-muted-foreground/70 italic">
                            {loc.notes}
                          </p>
                        )}

                        {/* Hazard details */}
                        {loc.hazards.map((h) => {
                          const desc = HAZARD_DESCRIPTIONS[h];
                          if (!desc) return null;
                          return (
                            <div key={h} className="text-xs text-muted-foreground leading-relaxed">
                              <span className="font-semibold text-foreground">{HAZARD_LABELS[h] || h}:</span>{' '}
                              {desc}
                            </div>
                          );
                        })}

                        {/* Associated conditions */}
                        {(() => {
                          const allConditionIds = new Set<string>();
                          loc.hazards.forEach((h) => {
                            (HAZARD_SECONDARIES[h] || []).forEach((id) => allConditionIds.add(id));
                          });
                          if (allConditionIds.size === 0) return null;
                          const conditions = Array.from(allConditionIds)
                            .map((id) => {
                              const c = getConditionById(id);
                              return c ? (c.abbreviation || c.name) : id.replace(/-/g, ' ');
                            });
                          return (
                            <div>
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                Associated Presumptive Conditions
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {conditions.map((name) => (
                                  <span key={name} className="text-[10px] px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                                    {name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {loc.pactActEligible && (
                          <p className="text-xs text-success/80">
                            This location qualifies under the PACT Act — you do not need to prove a direct connection between service and diagnosis for presumptive conditions.
                          </p>
                        )}

                        <p className="text-[10px] text-muted-foreground/60">
                          If you were stationed or deployed here, add this location to your profile. Conditions must still be diagnosed before filing.
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    className="flex-shrink-0 text-xs gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToProfile(loc);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Shield className="h-3.5 w-3.5" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {displayLocations.length > 100 && (
          <p className="text-center text-xs text-muted-foreground py-4">
            Showing first 100 of {displayLocations.length} results. Use search to narrow down.
          </p>
        )}

        {searchQuery.trim() && displayLocations.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No locations found for &ldquo;{searchQuery}&rdquo;. Try a different search term.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info card */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-2">About This Database</h3>
          <p className="text-sm text-muted-foreground mb-3">
            This database contains {totalLocations.toLocaleString()} military deployment locations across {totalConflicts} service
            eras. Each location includes known toxic exposures and hazards. Use this as a reference
            when filing VA claims — selecting locations helps identify presumptive conditions you may
            be eligible for.
          </p>
          <p className="text-sm text-muted-foreground">
            Search by base name, common nicknames (like &ldquo;BAF&rdquo; for Bagram or &ldquo;TQ&rdquo; for Al Taqaddum),
            country, or conflict era.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
