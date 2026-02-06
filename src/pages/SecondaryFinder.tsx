import { useState, useMemo, useCallback } from 'react';
import { Link2, Plus, Check, FileSignature, Search, ArrowRight } from 'lucide-react';
import { ConditionAutocomplete } from '@/components/shared/ConditionAutocomplete';
import { useUserConditions } from '@/hooks/useUserConditions';
import { secondaryConditions, type SecondaryConnection } from '@/data/secondaryConditions';
import { vaConditions, type VACondition, getConditionById } from '@/data/vaConditions';
import { Link } from 'react-router-dom';

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
  possible: { label: 'Possible Connection', color: 'text-white/40', bg: 'bg-white/5 border-white/10', dot: 'bg-white/40' },
};

export default function SecondaryFinder() {
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(null);
  const { conditions: userConditions, addCondition, hasCondition } = useUserConditions();

  // Get user's claimed conditions as display chips
  const claimedConditions = useMemo(() => {
    return userConditions
      .map(uc => {
        const details = getConditionById(uc.conditionId);
        return details ? { id: uc.conditionId, name: details.abbreviation || details.name, fullName: details.name } : null;
      })
      .filter(Boolean) as { id: string; name: string; fullName: string }[];
  }, [userConditions]);

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
      c.abbreviation.toLowerCase().includes(secondaryName.toLowerCase()) ||
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
      c.abbreviation.toLowerCase().includes(secondaryName.toLowerCase()) ||
      secondaryName.toLowerCase().includes(c.name.toLowerCase())
    );
    return match ? hasCondition(match.id) : false;
  };

  return (
    <div className="container max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#C8A628]/10 border border-[#C8A628]/20 flex items-center justify-center">
          <Link2 className="h-6 w-6 text-[#C8A628]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Secondary Conditions Finder</h1>
          <p className="text-white/50 text-sm">Discover conditions connected to your primary claims</p>
        </div>
      </div>

      {/* Autocomplete search */}
      <ConditionAutocomplete
        onSelect={handleAutocompleteSelect}
        placeholder="Search any condition..."
        showBodySystem
      />

      {/* Claimed conditions chips */}
      {claimedConditions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Your Claimed Conditions</p>
          <div className="flex flex-wrap gap-2">
            {claimedConditions.map(c => (
              <button
                key={c.id}
                onClick={() => handleChipClick(c.fullName)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPrimary === c.fullName
                    ? 'bg-[#C8A628]/20 text-[#C8A628] border border-[#C8A628]/40'
                    : 'bg-white/[0.06] text-white/70 border border-white/[0.08] hover:border-[#C8A628]/30 hover:text-white'
                }`}
              >
                {c.name} <ArrowRight className="inline h-3 w-3 ml-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {selectedPrimary && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold text-white">
                Secondary Conditions for: <span className="text-[#C8A628]">{selectedPrimary}</span>
              </h2>
              <p className="text-white/40 text-sm">{currentSecondaries.length} connections found</p>
            </div>
            <Link to={`/nexus-letter?primary=${encodeURIComponent(selectedPrimary)}`}>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8A628]/10 border border-[#C8A628]/30 text-[#C8A628] text-sm font-medium hover:bg-[#C8A628]/20 transition-colors">
                <FileSignature className="h-4 w-4" />
                Generate Nexus Letter
              </button>
            </Link>
          </div>

          {currentSecondaries.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p>No secondary connections found for this condition.</p>
              <p className="text-sm mt-1">Try searching for a different condition above.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
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
                        <h3 className="font-bold text-white text-sm">{connection.secondaryCondition}</h3>
                        <p className={`text-xs ${cfg.color} font-medium`}>{cfg.label}</p>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 whitespace-nowrap">
                        {connection.category}
                      </span>
                    </div>

                    <p className="text-xs text-white/50 leading-relaxed mb-4">
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
                        className="flex items-center gap-2 text-xs font-medium text-[#C8A628] hover:text-[#C8A628]/80 transition-colors"
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
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
            <Link2 className="h-8 w-8 text-white/20" />
          </div>
          <h3 className="text-white/70 font-semibold mb-2">Search for a condition to get started</h3>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Type a condition name in the search bar above to discover secondary conditions you may be able to claim.
          </p>
        </div>
      )}

      {/* Info card */}
      {!selectedPrimary && (
        <div className="rounded-2xl p-5 bg-[#C8A628]/5 border border-[#C8A628]/15">
          <h3 className="text-white/90 font-semibold mb-2 text-sm">How Secondary Claims Work</h3>
          <ol className="space-y-1.5 text-xs text-white/50">
            <li>1. Select your already service-connected (primary) condition</li>
            <li>2. Review secondary conditions that are medically linked</li>
            <li>3. Get a nexus letter from your doctor establishing the connection</li>
            <li>4. File the secondary claim with the nexus letter as evidence</li>
          </ol>
        </div>
      )}
    </div>
  );
}
