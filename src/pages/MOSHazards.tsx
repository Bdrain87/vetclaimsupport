import { useState, useMemo } from 'react';
import { Briefcase, Search, Plus, Check, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageContainer } from '@/components/PageContainer';
import { useProfileStore } from '@/store/useProfileStore';
import { useUserConditions } from '@/hooks/useUserConditions';
import { resolveConditionId } from '@/utils/conditionResolver';
import { militaryJobCodes, type MilitaryJobCode } from '@/data/militaryMOS';
import { hazardConditionMap, getConditionsForHazards, type HazardCondition } from '@/data/hazardConditionMap';

const PREVALENCE_LABELS: Record<HazardCondition['prevalence'], { label: string; color: string }> = {
  very_common: { label: 'Very Common', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  common: { label: 'Common', color: 'bg-gold/10 text-gold border-gold/20' },
  moderate: { label: 'Moderate', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  less_common: { label: 'Less Common', color: 'bg-muted text-muted-foreground border-border' },
};

export default function MOSHazards() {
  const profileMosCode = useProfileStore((s) => s.mosCode);
  const servicePeriods = useProfileStore((s) => s.servicePeriods);
  const { conditions: userConditions, addCondition } = useUserConditions();

  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<MilitaryJobCode | null>(null);

  // Initialize addedConditions from existing userConditions so already-added conditions show as "Added"
  // Uses lowercase for case-insensitive matching against hazard condition names
  const initialAdded = useMemo(() => {
    const names = new Set<string>();
    for (const uc of userConditions) {
      const name = (uc.displayName || uc.conditionId).toLowerCase();
      names.add(name);
    }
    return names;
  }, [userConditions]);
  const [addedConditions, setAddedConditions] = useState<Set<string>>(new Set());
  const [expandedHazards, setExpandedHazards] = useState<Set<string>>(new Set());

  // Auto-select from profile if available
  const profileCodes = useMemo(() => {
    const codes: string[] = [];
    if (profileMosCode) codes.push(profileMosCode);
    servicePeriods.forEach((sp) => {
      if (sp.mos && !codes.includes(sp.mos)) codes.push(sp.mos);
    });
    return codes;
  }, [profileMosCode, servicePeriods]);

  // Search results
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return militaryJobCodes
      .filter(
        (job) =>
          job.code.toLowerCase().includes(q) ||
          job.title.toLowerCase().includes(q) ||
          job.keywords.some((k) => k.toLowerCase().includes(q))
      )
      .slice(0, 20);
  }, [search]);

  // Auto-match from profile
  const profileMatches = useMemo(() => {
    if (selectedJob) return [];
    return profileCodes
      .map((code) => militaryJobCodes.find((j) => j.code.toUpperCase() === code.toUpperCase()))
      .filter(Boolean) as MilitaryJobCode[];
  }, [profileCodes, selectedJob]);

  const activeJob = selectedJob || profileMatches[0] || null;

  // Get hazards and conditions for active job
  const hazardResults = useMemo(() => {
    if (!activeJob) return [];
    return activeJob.hazards
      .map((key) => {
        const category = hazardConditionMap[key];
        if (!category) return null;
        return { key, ...category };
      })
      .filter(Boolean) as (typeof hazardConditionMap[string] & { key: string })[];
  }, [activeJob]);

  const allConditions = useMemo(() => {
    if (!activeJob) return [];
    return getConditionsForHazards(activeJob.hazards);
  }, [activeJob]);

  const handleAddCondition = (condition: HazardCondition) => {
    const resolved = resolveConditionId(condition.conditionName);
    addCondition(resolved.conditionId, {
      connectionType: 'direct',
      displayName: resolved.displayName,
    });
    setAddedConditions((prev) => new Set([...prev, condition.conditionName]));
  };

  const toggleHazard = (key: string) => {
    setExpandedHazards((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <PageContainer className="py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gold/10 border border-gold/20">
          <Briefcase className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Military Job Hazard Identifier</h1>
          <p className="text-muted-foreground text-sm">Find conditions linked to your military job</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-4 py-3 rounded-xl bg-gold/10 border border-gold/20 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Based on hazard data for 500+ military job codes across all branches.
          This is for informational purposes — not medical advice.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by MOS, AFSC, rate, job title, or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 rounded-xl"
        />
      </div>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden max-h-60 overflow-y-auto -mt-4">
          {searchResults.map((job) => (
            <button
              key={`${job.branch}-${job.code}`}
              onClick={() => { setSelectedJob(job); setSearch(''); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border/30 last:border-0"
            >
              <Badge variant="outline" className="text-[10px] shrink-0">{job.branch}</Badge>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-foreground">{job.code}</span>
                <span className="text-xs text-muted-foreground ml-2">{job.title}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Profile MOS Matches */}
      {!selectedJob && profileMatches.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">From Your Profile</p>
          {profileMatches.map((job) => (
            <button
              key={`${job.branch}-${job.code}`}
              onClick={() => setSelectedJob(job)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-2xl border bg-card',
                'hover:bg-accent/50 active:scale-[0.98] transition-all text-left',
                activeJob?.code === job.code ? 'border-gold/30 bg-gold/5' : 'border-border'
              )}
            >
              <div className="p-2 rounded-xl bg-gold/10 shrink-0">
                <Briefcase className="h-4 w-4 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">{job.code} — {job.title}</span>
                <span className="text-xs text-muted-foreground block">{job.branch} · {job.category}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Job Summary */}
      {activeJob && (
        <>
          <Card className="border-gold/30 bg-gold/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{activeJob.branch}</Badge>
                {activeJob.code} — {activeJob.title}
              </CardTitle>
              <CardDescription>{activeJob.category} · {activeJob.hazards.length} hazard categories</CardDescription>
            </CardHeader>
            {selectedJob && (
              <CardContent className="pt-0">
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelectedJob(null)}>
                  Change MOS
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Hazard Categories */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Hazard Exposures ({hazardResults.length})
            </h2>
            {hazardResults.map((hazard) => {
              const isExpanded = expandedHazards.has(hazard.key);
              return (
                <Card key={hazard.key} className="overflow-hidden">
                  <button
                    onClick={() => toggleHazard(hazard.key)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left"
                  >
                    <AlertTriangle className="h-4 w-4 text-gold shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{hazard.name}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight">{hazard.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {hazard.conditions.length}
                    </Badge>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-border/50 divide-y divide-border/30">
                      {hazard.conditions.map((cond) => {
                        const isAdded = addedConditions.has(cond.conditionName) || initialAdded.has(cond.conditionName.toLowerCase());
                        const { label, color } = PREVALENCE_LABELS[cond.prevalence];
                        return (
                          <div key={cond.conditionName} className="flex items-center gap-3 px-4 py-2.5">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground">{cond.conditionName}</p>
                              <p className="text-[11px] text-muted-foreground">{cond.description}</p>
                            </div>
                            <Badge variant="outline" className={cn('text-[10px] shrink-0', color)}>{label}</Badge>
                            <Button
                              size="sm"
                              variant={isAdded ? 'ghost' : 'outline'}
                              className="h-8 shrink-0"
                              disabled={isAdded}
                              onClick={() => handleAddCondition(cond)}
                            >
                              {isAdded ? <Check className="h-4 w-4 text-success" /> : <Plus className="h-4 w-4" />}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* All Conditions Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Related Conditions ({allConditions.length})</CardTitle>
              <CardDescription>Deduplicated and sorted by prevalence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/30">
                {allConditions.map((cond) => {
                  const isAdded = addedConditions.has(cond.conditionName) || initialAdded.has(cond.conditionName.toLowerCase());
                  const { label, color } = PREVALENCE_LABELS[cond.prevalence];
                  return (
                    <div key={`${cond.conditionName}-${cond.diagnosticCode}`} className="flex items-center gap-3 py-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{cond.conditionName}</p>
                        <p className="text-[11px] text-muted-foreground">DC {cond.diagnosticCode} · {cond.category}</p>
                      </div>
                      <Badge variant="outline" className={cn('text-[10px] shrink-0', color)}>{label}</Badge>
                      <Button
                        size="sm"
                        variant={isAdded ? 'ghost' : 'default'}
                        className={cn('h-8 shrink-0', !isAdded && 'bg-gold hover:bg-gold/80 text-black')}
                        disabled={isAdded}
                        onClick={() => handleAddCondition(cond)}
                      >
                        {isAdded ? <><Check className="h-3 w-3 mr-1" /> Added</> : <><Plus className="h-3 w-3 mr-1" /> Add</>}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty state */}
      {!activeJob && searchResults.length === 0 && profileMatches.length === 0 && (
        <div className="py-12 text-center space-y-3">
          <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto" />
          <p className="text-sm text-muted-foreground">Search for your MOS, AFSC, or Rating code above</p>
          <p className="text-xs text-muted-foreground/60">Supports Army MOS, Air Force AFSC, Navy Rating, Marines MOS, Coast Guard, and Space Force</p>
        </div>
      )}
    </PageContainer>
  );
}
