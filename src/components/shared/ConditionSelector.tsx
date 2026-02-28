import { useState, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserConditions } from '@/hooks/useUserConditions';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import { ConditionAutocomplete } from './ConditionAutocomplete';
import type { VACondition } from '@/data/vaConditions';

export interface ConditionSelectorProps {
  /** Called when a condition is selected */
  onSelect: (condition: { id: string; conditionId: string; name: string }) => void;
  /** Optional label above the selector */
  label?: string;
  /** Placeholder text for search */
  placeholder?: string;
  /** Additional class names */
  className?: string;
  /** Whether to show the "Add a new condition" option */
  showAddNew?: boolean;
  /** Exclude specific condition IDs from the list */
  excludeIds?: string[];
}

/**
 * Shared ConditionSelector — "Enter Once, Use Everywhere"
 *
 * Shows the user's saved conditions first (sorted by usage),
 * with a search bar to find/add new conditions from the VA database.
 */
export function ConditionSelector({
  onSelect,
  label = 'Which condition is this for?',
  placeholder = 'Search for a different condition...',
  className,
  showAddNew = true,
  excludeIds = [],
}: ConditionSelectorProps) {
  const { conditionsByUsage, addCondition, incrementUsage, getConditionDetails } = useUserConditions();
  const [showSearch, setShowSearch] = useState(false);

  const filteredConditions = conditionsByUsage.filter(
    (c) => !excludeIds.includes(c.id) && !excludeIds.includes(c.conditionId),
  );

  const handleSelectExisting = useCallback(
    (userCondition: typeof conditionsByUsage[0]) => {
      incrementUsage(userCondition.id);
      const details = getConditionDetails(userCondition);
      onSelect({
        id: userCondition.id,
        conditionId: userCondition.conditionId,
        name: userCondition.displayName || details?.abbreviation || details?.name || userCondition.conditionId,
      });
    },
    [incrementUsage, getConditionDetails, onSelect],
  );

  const handleSelectNew = useCallback(
    (vaCondition: VACondition) => {
      // Add to user conditions globally
      const result = addCondition(vaCondition.id, {
        displayName: vaCondition.abbreviation || vaCondition.name,
      });
      if (result) {
        incrementUsage(result.id);
        onSelect({
          id: result.id,
          conditionId: vaCondition.id,
          name: vaCondition.abbreviation || vaCondition.name,
        });
      } else {
        // Already exists — find and select it
        const existing = conditionsByUsage.find((c) => c.conditionId === vaCondition.id);
        if (existing) {
          handleSelectExisting(existing);
        }
      }
      setShowSearch(false);
    },
    [addCondition, incrementUsage, onSelect, conditionsByUsage, handleSelectExisting],
  );

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      {/* User's existing conditions */}
      {filteredConditions.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Your Conditions
          </span>
          <div className="grid gap-1.5">
            {filteredConditions.map((uc) => {
              const details = getConditionDetails(uc);
              const displayName = getConditionDisplayName(uc);
              return (
                <button
                  key={uc.id}
                  type="button"
                  onClick={() => handleSelectExisting(uc)}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg border border-border bg-muted/30 hover:bg-gold/10 hover:border-gold/30 transition-all"
                >
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate flex-1">
                    {displayName}
                  </span>
                  {details?.diagnosticCode && (
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">
                      DC {details.diagnosticCode}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Divider */}
      {filteredConditions.length > 0 && (
        <div className="border-t border-border/50" />
      )}

      {/* Search / Add new */}
      {showSearch ? (
        <div className="space-y-2">
          <ConditionAutocomplete
            onSelect={handleSelectNew}
            placeholder={placeholder}
            autoFocus
            excludeIds={filteredConditions.map((c) => c.conditionId)}
          />
          <button
            type="button"
            onClick={() => setShowSearch(false)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg border border-dashed border-border hover:border-gold/40 hover:bg-gold/5 transition-all text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Search for a different condition</span>
          </button>
          {showAddNew && (
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg border border-dashed border-border hover:border-gold/40 hover:bg-gold/5 transition-all text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">Add a new condition</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
