import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Plus, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  vaConditions,
  searchConditions,
  getConditionsByCategory,
  getSecondaryConditions,
  categoryLabels,
  type VACondition,
  type ConditionCategory,
} from '@/data/vaConditions';
import { useUserConditions, type UserCondition } from '@/context/UserConditionsContext';

interface ConditionSelectorProps {
  // Mode: 'add' adds to global context, 'select' just returns the selection
  mode?: 'add' | 'select';
  // Called when a condition is selected (in select mode)
  onSelect?: (condition: VACondition) => void;
  // Filter by category
  category?: ConditionCategory;
  // Show only secondary conditions for a primary
  primaryConditionId?: string;
  // Exclude certain condition IDs
  excludeIds?: string[];
  // Placeholder text
  placeholder?: string;
  // Whether to show the "already added" warning
  showDuplicateWarning?: boolean;
  // Additional class names
  className?: string;
  // Disable the selector
  disabled?: boolean;
  // Compact mode for inline use
  compact?: boolean;
}

export function ConditionSelector({
  mode = 'add',
  onSelect,
  category,
  primaryConditionId,
  excludeIds = [],
  placeholder = 'Search conditions...',
  showDuplicateWarning = true,
  className,
  disabled = false,
  compact = false,
}: ConditionSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { conditions: userConditions, addCondition, hasCondition } = useUserConditions();

  // Get available conditions based on filters
  const availableConditions = useMemo(() => {
    let filtered: VACondition[];

    if (primaryConditionId) {
      // Show secondary conditions for a primary
      filtered = getSecondaryConditions(primaryConditionId);
    } else if (category) {
      // Filter by category
      filtered = getConditionsByCategory(category);
    } else if (searchQuery.trim()) {
      // Search across all conditions
      filtered = searchConditions(searchQuery, excludeIds);
    } else {
      // Show all conditions
      filtered = vaConditions;
    }

    // Apply exclusions
    if (excludeIds.length > 0) {
      filtered = filtered.filter(c => !excludeIds.includes(c.id));
    }

    return filtered;
  }, [category, primaryConditionId, searchQuery, excludeIds]);

  // Group conditions by category for display
  const groupedConditions = useMemo(() => {
    const groups: Partial<Record<ConditionCategory, VACondition[]>> = {};

    for (const condition of availableConditions) {
      if (!groups[condition.category]) {
        groups[condition.category] = [];
      }
      groups[condition.category]!.push(condition);
    }

    // Return non-empty groups sorted by category label
    return Object.entries(groups)
      .filter(([, conditions]) => conditions && conditions.length > 0)
      .sort(([a], [b]) => {
        const labelA = categoryLabels[a as ConditionCategory] || a;
        const labelB = categoryLabels[b as ConditionCategory] || b;
        return labelA.localeCompare(labelB);
      });
  }, [availableConditions]);

  const handleSelect = (condition: VACondition) => {
    if (mode === 'add') {
      const added = addCondition(condition.id);
      if (added) {
        setOpen(false);
        setSearchQuery('');
      }
    } else {
      onSelect?.(condition);
      setOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'justify-between',
            compact ? 'h-9 px-3' : 'w-full',
            className
          )}
        >
          <span className="flex items-center gap-2 text-muted-foreground">
            <Search className="h-4 w-4" />
            {placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 z-[9999]" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type to search..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>
              <div className="py-6 text-center text-sm">
                <p className="text-muted-foreground">No conditions found.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try a different search term
                </p>
              </div>
            </CommandEmpty>

            {groupedConditions.map(([categoryKey, conditions]) => (
              <CommandGroup
                key={categoryKey}
                heading={categoryLabels[categoryKey as ConditionCategory]}
              >
                {conditions.map((condition) => {
                  const isAdded = hasCondition(condition.id);
                  return (
                    <CommandItem
                      key={condition.id}
                      value={condition.id}
                      onSelect={() => handleSelect(condition)}
                      disabled={isAdded && mode === 'add'}
                      className={cn(
                        'flex items-center justify-between',
                        isAdded && mode === 'add' && 'opacity-50'
                      )}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{condition.abbreviation}</span>
                          {condition.diagnosticCode && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0">
                              {condition.diagnosticCode}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {condition.name}
                        </span>
                        {condition.typicalRatings && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            Typical ratings: {condition.typicalRatings}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {isAdded && showDuplicateWarning ? (
                          <Badge variant="secondary" className="text-xs">
                            Added
                          </Badge>
                        ) : mode === 'add' ? (
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Check className={cn(
                            'h-4 w-4',
                            'opacity-0'
                          )} />
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Compact display component for showing selected conditions
interface SelectedConditionsDisplayProps {
  conditions?: UserCondition[];
  onRemove?: (id: string) => void;
  showRating?: boolean;
  showStatus?: boolean;
  compact?: boolean;
  className?: string;
}

export function SelectedConditionsDisplay({
  conditions: propConditions,
  onRemove,
  showRating = true,
  showStatus = false,
  compact = false,
  className,
}: SelectedConditionsDisplayProps) {
  const { conditions: contextConditions, removeCondition, getConditionDetails } = useUserConditions();
  const conditions = propConditions ?? contextConditions;

  if (conditions.length === 0) {
    return (
      <div className={cn('text-sm text-muted-foreground italic', className)}>
        No conditions added yet
      </div>
    );
  }

  const handleRemove = (id: string) => {
    if (onRemove) {
      onRemove(id);
    } else {
      removeCondition(id);
    }
  };

  const statusColors: Record<UserCondition['claimStatus'], string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    denied: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    appeal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {conditions.map((userCondition) => {
        const details = getConditionDetails(userCondition);
        if (!details) return null;

        return (
          <Badge
            key={userCondition.id}
            variant="secondary"
            className={cn(
              'flex items-center gap-1.5 pr-1',
              compact ? 'text-xs py-0.5' : 'text-sm py-1',
              showStatus && statusColors[userCondition.claimStatus]
            )}
          >
            <span className="font-medium">{details.abbreviation}</span>
            {userCondition.bodyPart && (
              <span className="text-muted-foreground">
                ({userCondition.bodyPart})
              </span>
            )}
            {showRating && userCondition.rating !== undefined && (
              <span className="text-muted-foreground">
                {userCondition.rating}%
              </span>
            )}
            {!userCondition.isPrimary && (
              <span className="text-xs text-muted-foreground">(2nd)</span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(userCondition.id)}
              className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {details.name}</span>
            </button>
          </Badge>
        );
      })}
    </div>
  );
}

// Quick add component for common conditions
interface QuickAddConditionsProps {
  conditionIds: string[];
  label?: string;
  className?: string;
}

export function QuickAddConditions({
  conditionIds,
  label = 'Common conditions:',
  className,
}: QuickAddConditionsProps) {
  const { addCondition, hasCondition } = useUserConditions();

  const conditions = conditionIds
    .map(id => vaConditions.find(c => c.id === id))
    .filter((c): c is VACondition => c !== undefined);

  if (conditions.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <p className="text-sm text-muted-foreground">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {conditions.map((condition) => {
          const isAdded = hasCondition(condition.id);
          return (
            <Button
              key={condition.id}
              variant="outline"
              size="sm"
              disabled={isAdded}
              onClick={() => addCondition(condition.id)}
              className={cn(
                'text-xs',
                isAdded && 'opacity-50'
              )}
            >
              <Plus className="h-3 w-3 mr-1" />
              {condition.abbreviation}
              {isAdded && ' (added)'}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export { vaConditions, type VACondition } from '@/data/vaConditions';
