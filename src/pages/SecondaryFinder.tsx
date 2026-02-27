import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link2, Plus, Check, FileSignature, Search, ArrowRight } from 'lucide-react';
import { ConditionSelector } from '@/components/shared/ConditionSelector';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useClaims } from '@/hooks/useClaims';
import { secondaryConditions, type SecondaryConnection } from '@/data/secondaryConditions';
import { vaConditions, type VACondition, getConditionById, searchConditions } from '@/data/vaConditions';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';

// Connection strength heuristic based on data
function getConnectionStrength(connection: SecondaryConnection): 'strong' | 'moderate' | 'possible' {
  const desc = connection.medicalConnection.toLowerCase();
  if (desc.includes('commonly') || desc.includes('frequently') || desc.includes('direct') || desc.includes('chronic') || desc.includes('progressive')) {
    return 'strong';
  }
  if (desc.includes('can ') || desc.includes('may ') || desc.includes('often') || desc.includes('associated')) {
    return 'moderate';
  }
  return 'possible';
}

const strengthConfig = {
  strong: { label: 'Strong Connection', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', dot: 'bg-emerald-400' },
  moderate: { label: 'Moderate Connection', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', dot: 'bg-amber-400' },
  possible: { label: 'Possible Connection', color: 'text-muted-foreground', bg: 'bg-muted/30 border-border', dot: 'bg-muted-foreground' },
};

export default function SecondaryFinder() {
  const [searchParams] = useSearchParams();
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(null);
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);
  const { conditions: userConditions, addCondition, hasCondition } = useUserConditions();
  const { data: claimsData } = useClaims();

  // Get user's claimed conditions from BOTH state systems (unified view)
  const claimedConditions = useMemo(() => {
    // From UserConditions context (structured with conditionId)
    const fromUserConditions = userConditions
      .map(uc => {
        const details = getConditionById(uc.conditionId);
        return details ? { id: uc.conditionId, name: details.abbreviation || details.name, fullName: details.name } : null;
      })
      .filter(Boolean) as { id: string; name: string; fullName: string }[];

    // From claim conditions in useAppStore (may have conditions not in UserConditions)
    const fromClaimsContext = (claimsData.claimConditions || [])
      .filter(cc => !fromUserConditions.some(uc => uc.fullName.toLowerCase() === cc.name.toLowerCase()))
      .map(cc => {
        const match = searchConditions(cc.name)?.[0];
        return { id: match?.id || cc.id, name: match?.abbreviation || cc.name, fullName: match?.name || cc.name };
      });

    return [...fromUserConditions, ...fromClaimsContext];
  }, [userConditions, claimsData.claimConditions]); // All data sourced from useAppStore via adapter hooks

  // Map user condition names to primary condition names in secondary data
  const findSecondariesForPrimary = useCallback((primaryName: string): (SecondaryConnection & { strength: 'strong' | 'moderate' | 'possible' })[] => {
    const q = primaryName.toLowerCase();
    return secondaryConditions
      .filter(c => c.primaryCondition.toLowerCase().includes(q) || q.includes(c.primaryCondition.toLowerCase()))
      .map(c => ({ ...c, strength: getConnectionStrength(c) }))
      .sort((a, b) => {
        const order = { strong: 0, moderate: 1, possible: 2 };
        return order[a.strength] - order[b.strength];
      });
  }, []);

  // Current secondaries to show
  const currentSecondaries = useMemo(() => {
    if (!selectedPrimary) return [];
    return findSecondariesForPrimary(selectedPrimary);
  }, [selectedPrimary, findSecondariesForPrimary]);

  // Auto-select condition from URL params (e.g., navigating from ConditionDetail)
  useEffect(() => {
    const urlCondition = searchParams.get('condition');
    if (urlCondition && !selectedPrimary) {
      setSelectedPrimary(urlCondition);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle selecting from autocomplete
  const handleAutocompleteSelect = (condition: VACondition) => {
    setSelectedPrimary(condition.name);
  };

  // Handle clicking a chip
  const handleChipClick = (name: string) => {
    setSelectedPrimary(name);
  };

  // Handle adding secondary to claim
  const handleAddToClaim = (secondaryName: string) => {
    const match = vaConditions.find(c =>
      c.name.toLowerCase().includes(secondaryName.toLowerCase()) ||
      c.abbreviation?.toLowerCase().includes(secondaryName.toLowerCase()) ||
      secondaryName.toLowerCase().includes(c.name.toLowerCase())
    );
    if (match) {
      addCondition(match.id);
    }
  };

  // Check if a secondary is already claimed
  const isAlreadyClaimed = (secondaryName: string): boolean => {
    const match = vaConditions.find(c =>
      c.name.toLowerCase().includes(secondaryName.toLowerCase()) ||
      c.abbreviation?.toLowerCase().includes(secondaryName.toLowerCase()) ||
      secondaryName.toLowerCase().includes(c.name.toLowerCase())
    );
    return match ? hasCondition(match.id) : false;
  };

  return (
    <PageContainer className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
          <Link2 className="h-6 w-6 text-gold" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">Secondary Conditions Finder</h1>
          <p className="text-muted-foreground text-sm">Discover conditions connected to your primary claims</p>
        </div>
      </div>

      {/* Disclaimer */}
      {!disclaimerAcknowledged ? (
        <div className="rounded-xl p-4 flex items-start gap-3 bg-[rgba(240,192,0,0.08)] border border-gold/20">
          <AlertTriangle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Educational Tool Only</p>
            <p className="text-xs text-muted-foreground mt-1">
              Secondary conditions must be formally diagnosed by a medical professional before filing.
              This tool is not medical advice. Always consult with a doctor and/or Veterans Service Organization (VSO)
              before adding conditions to your claim.
            </p>
            <button
              onClick={() => setDisclaimerAcknowledged(true)}
              className="mt-2 px-3 py-1.5 rounded-md bg-gold/15 text-foreground text-xs font-medium hover:bg-gold/25 transition-colors"
            >
              I Acknowledge
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setDisclaimerAcknowledged(false)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgba(240,192,0,0.15)] bg-[rgba(240,192,0,0.04)] text-xs text-muted-foreground hover:bg-[rgba(240,192,0,0.08)] transition-colors"
        >
          <AlertTriangle className="h-3.5 w-3.5 text-gold flex-shrink-0" />
          <span>Educational tool disclaimer acknowledged — tap to review</span>
        </button>
      )}

      {/* Autocomplete search */}
      <ConditionSelector
        onSelect={(selected) => {
          const vaCondition = getConditionById(selected.conditionId);
          if (vaCondition) {
            handleAutocompleteSelect(vaCondition);
          } else {
            // Fallback for non-DB conditions (MOS/presumptive)
            setSelectedPrimary(selected.name);
          }
        }}
        label="Search for a primary condition"
        placeholder="Search any condition..."
      />

      {/* Claimed conditions chips */}
      {claimedConditions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your Claimed Conditions</p>
          <div className="flex flex-wrap gap-2">
            {claimedConditions.map(c => (
              <button
                key={c.id}
                onClick={() => handleChipClick(c.fullName)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all max-w-full truncate ${
                  selectedPrimary === c.fullName
                    ? 'bg-gold/20 text-foreground border border-gold/40'
                    : 'bg-muted/50 text-muted-foreground border border-border hover:border-gold/30 hover:text-foreground'
                }`}
              >
                <span className="truncate">{c.name}</span> <ArrowRight className="inline h-3 w-3 ml-1 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {selectedPrimary && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-foreground break-words">
                  Common Secondary Conditions for: <span className="text-gold">{selectedPrimary}</span>
                </h2>
                <p className="text-muted-foreground text-sm">{currentSecondaries.length} medically-linked conditions found</p>
            </div>
            <Link to={`/prep/doctor-summary?primary=${encodeURIComponent(selectedPrimary)}`}>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/30 text-foreground text-sm font-medium hover:bg-gold/20 transition-colors whitespace-nowrap shrink-0">
                <FileSignature className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Build</span> Doctor Summary
              </button>
            </Link>
          </div>

          {currentSecondaries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p>No secondary connections found for this condition.</p>
              <p className="text-sm mt-1">Try searching for a different condition above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentSecondaries.map((connection, idx) => {
                const cfg = strengthConfig[connection.strength];
                const claimed = isAlreadyClaimed(connection.secondaryCondition);

                return (
                  <div
                    key={`${connection.primaryCondition}-${connection.secondaryCondition}-${idx}`}
                    className={`rounded-2xl p-5 border ${cfg.bg} transition-all`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${cfg.dot}`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-sm break-words">{connection.secondaryCondition}</h3>
                        <p className={`text-xs ${cfg.color} font-medium`}>{cfg.label}</p>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 shrink-0 hidden sm:block">
                        {connection.category}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      {connection.medicalConnection}
                    </p>

                    {claimed ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-400/70 font-medium">
                        <Check className="h-4 w-4" />
                        Already Claimed
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToClaim(connection.secondaryCondition)}
                        className="flex items-center gap-2 text-xs font-medium text-gold hover:text-gold/80 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Add to My Claim
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Empty state when nothing selected */}
      {!selectedPrimary && claimedConditions.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-border flex items-center justify-center mx-auto mb-4">
            <Link2 className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-foreground/70 font-semibold mb-2">Search for a condition to get started</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Type a condition name in the search bar above to discover secondary conditions you may be able to claim.
          </p>
        </div>
      )}

      {/* Info card */}
      {!selectedPrimary && (
        <div className="rounded-2xl p-5 bg-[rgba(240,192,0,0.05)] border border-[rgba(240,192,0,0.15)]">
          <h3 className="text-foreground/90 font-semibold mb-2 text-sm">How Secondary Claims Work</h3>
          <ol className="space-y-1.5 text-xs text-muted-foreground">
            <li>1. Select your already service-connected (primary) condition</li>
            <li>2. Review secondary conditions that are medically linked</li>
            <li>3. Get a doctor summary establishing the connection</li>
            <li>4. File the secondary claim with the doctor summary as evidence</li>
          </ol>
        </div>
      )}
    </PageContainer>
  );
}
