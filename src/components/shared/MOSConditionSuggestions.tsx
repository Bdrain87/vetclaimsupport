import { useState, useMemo } from 'react';
import { Briefcase, Plus, Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useProfileStore } from '@/store/useProfileStore';
import { resolveConditionId } from '@/utils/conditionResolver';
import mosData from '@/data/mos-conditions.json';

interface MOSCategory {
  mosCategory: string;
  label: string;
  matchPatterns: string[];
  conditions: string[];
}

const data = mosData as { mosCategories: MOSCategory[] };

/** Find which MOS categories match a given MOS code */
function findMatchingCategories(mosCode: string): MOSCategory[] {
  if (!mosCode) return [];
  const code = mosCode.toUpperCase().trim();
  return data.mosCategories.filter((cat) =>
    cat.matchPatterns.some((pattern) => {
      const p = pattern.toUpperCase();
      return code.startsWith(p) || code === p || code.includes(p);
    }),
  );
}

interface MOSConditionSuggestionsProps {
  /** Override MOS code (defaults to profile store) */
  mosCode?: string;
  className?: string;
}

export function MOSConditionSuggestions({
  mosCode: mosCodeProp,
  className,
}: MOSConditionSuggestionsProps) {
  const profileMosCode = useProfileStore((s) => s.mosCode);
  const servicePeriods = useProfileStore((s) => s.servicePeriods);
  const { addCondition } = useUserConditions();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  // Collect all MOS codes from profile
  const allMosCodes = useMemo(() => {
    const codes: string[] = [];
    if (mosCodeProp) {
      codes.push(mosCodeProp);
    } else {
      if (profileMosCode) codes.push(profileMosCode);
      servicePeriods.forEach((sp) => {
        if (sp.mos && !codes.includes(sp.mos)) codes.push(sp.mos);
      });
    }
    return codes;
  }, [mosCodeProp, profileMosCode, servicePeriods]);

  // Find matching categories for all MOS codes
  const matchingCategories = useMemo(() => {
    const seen = new Set<string>();
    const results: MOSCategory[] = [];
    for (const code of allMosCodes) {
      for (const cat of findMatchingCategories(code)) {
        if (!seen.has(cat.mosCategory)) {
          seen.add(cat.mosCategory);
          results.push(cat);
        }
      }
    }
    return results;
  }, [allMosCodes]);

  const toggleSelected = (conditionName: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(conditionName)) {
        next.delete(conditionName);
      } else {
        next.add(conditionName);
      }
      return next;
    });
  };

  const handleAddSelected = () => {
    const newlyAdded = new Set<string>();
    for (const conditionName of selectedItems) {
      const resolved = resolveConditionId(conditionName);
      const result = addCondition(resolved.conditionId, {
        connectionType: 'direct',
        displayName: resolved.displayName,
      });
      if (result) {
        newlyAdded.add(conditionName);
      }
    }
    setAddedItems((prev) => new Set([...prev, ...newlyAdded]));
    setSelectedItems(new Set());
  };

  if (allMosCodes.length === 0 || matchingCategories.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">
          MOS-Based Conditions
        </h3>
      </div>

      <div className="rounded-xl p-3 flex items-start gap-3 bg-gold/5 border border-gold/20">
        <AlertTriangle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Based on your MOS ({allMosCodes.join(', ')}), veterans commonly claim these conditions.
          This is for informational purposes only — not medical advice.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {matchingCategories.map((cat) => (
          <div key={cat.mosCategory}>
            <div className="px-4 py-2 bg-muted/30 border-b border-border/50">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {cat.label}
              </span>
            </div>
            <div className="divide-y divide-border/30">
              {cat.conditions.map((conditionName) => {
                const isSelected = selectedItems.has(conditionName);
                const isAdded = addedItems.has(conditionName);

                return (
                  <label
                    key={`${cat.mosCategory}::${conditionName}`}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors',
                      isAdded
                        ? 'bg-success/10'
                        : isSelected
                          ? 'bg-gold/10'
                          : 'hover:bg-muted/40',
                      isAdded && 'opacity-60 cursor-default',
                    )}
                  >
                    <Checkbox
                      checked={isSelected || isAdded}
                      disabled={isAdded}
                      onCheckedChange={() => toggleSelected(conditionName)}
                      className="flex-shrink-0"
                    />
                    <span className="text-sm text-foreground flex-1">
                      {conditionName}
                    </span>
                    {isAdded && (
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

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
