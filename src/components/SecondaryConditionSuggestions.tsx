import { useMemo, useState } from 'react';
import { Target, Plus, Check, ChevronDown, ChevronUp, Link2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  getConditionById,
  getSecondaryConditions,
  type VACondition,
} from '@/data/vaConditions';
import { useUserConditions } from '@/hooks/useUserConditions';

interface SecondaryConditionSuggestionsProps {
  /** Maximum number of suggestions to show */
  maxSuggestions?: number;
  /** Whether to show as collapsible or expanded */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Custom class name */
  className?: string;
  /** Condition IDs to base suggestions on (uses context if not provided) */
  conditionIds?: string[];
}

interface SuggestionWithParent {
  condition: VACondition;
  parentCondition: VACondition;
  parentConditionId: string;
}

export function SecondaryConditionSuggestions({
  maxSuggestions = 10,
  collapsible = true,
  defaultCollapsed = false,
  className,
  conditionIds,
}: SecondaryConditionSuggestionsProps) {
  const { conditions: userConditions, addCondition, hasCondition } = useUserConditions();
  const [isOpen, setIsOpen] = useState(!defaultCollapsed);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Get condition IDs from context or props
  const currentConditionIds = useMemo(() => {
    if (conditionIds) return conditionIds;
    return userConditions.map(uc => uc.conditionId);
  }, [conditionIds, userConditions]);

  // Generate suggestions based on current conditions
  const suggestions = useMemo((): SuggestionWithParent[] => {
    if (currentConditionIds.length === 0) return [];

    const suggestionMap = new Map<string, SuggestionWithParent>();

    // For each current condition, get its secondary conditions
    currentConditionIds.forEach(conditionId => {
      const parentCondition = getConditionById(conditionId);
      if (!parentCondition) return;

      const secondaries = getSecondaryConditions(conditionId);

      secondaries.forEach(secondary => {
        // Skip if user already has this condition
        if (hasCondition(secondary.id)) return;

        // Skip if already in suggestions (but track first parent)
        if (suggestionMap.has(secondary.id)) return;

        suggestionMap.set(secondary.id, {
          condition: secondary,
          parentCondition,
          parentConditionId: conditionId,
        });
      });
    });

    // Sort by priority (more common secondaries first based on how many primaries link to them)
    const sortedSuggestions = Array.from(suggestionMap.values());

    // Prioritize mental health secondaries if primary is musculoskeletal (cross-system)
    sortedSuggestions.sort((a, b) => {
      const aParentCategory = a.parentCondition.category;
      const bParentCategory = b.parentCondition.category;
      const aCategory = a.condition.category;
      const bCategory = b.condition.category;

      // Boost cross-system suggestions (anti-pyramiding compliant)
      const aIsCrossSystem = aParentCategory !== aCategory;
      const bIsCrossSystem = bParentCategory !== bCategory;

      if (aIsCrossSystem && !bIsCrossSystem) return -1;
      if (!aIsCrossSystem && bIsCrossSystem) return 1;

      // Otherwise sort alphabetically
      return a.condition.abbreviation.localeCompare(b.condition.abbreviation);
    });

    return sortedSuggestions.slice(0, maxSuggestions);
  }, [currentConditionIds, hasCondition, maxSuggestions]);

  // Handle adding a condition as secondary
  const handleAddCondition = (conditionId: string, parentConditionId: string) => {
    const parentUserCondition = userConditions.find(c => c.conditionId === parentConditionId);
    const result = addCondition(conditionId, {
      isPrimary: false,
      linkedPrimaryId: parentUserCondition?.id,
    });
    if (result) {
      setAddedIds(prev => new Set(prev).add(conditionId));
      // Reset after animation
      setTimeout(() => {
        setAddedIds(prev => {
          const next = new Set(prev);
          next.delete(conditionId);
          return next;
        });
      }, 2000);
    }
  };

  // Don't render if no conditions or no suggestions
  if (currentConditionIds.length === 0) {
    return null;
  }

  if (suggestions.length === 0) {
    return null;
  }

  const content = (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Commonly connected conditions based on yours. Must be diagnosed before filing.
      </p>

      <div className="grid gap-2">
        {suggestions.map(({ condition, parentCondition, parentConditionId }) => {
          const isJustAdded = addedIds.has(condition.id);
          const isAlreadyAdded = hasCondition(condition.id);

          return (
            <div
              key={condition.id}
              className={cn(
                "flex items-center justify-between gap-3 p-3 rounded-lg border transition-all",
                isJustAdded
                  ? "border-success bg-success/10"
                  : "border-border bg-muted/30 hover:bg-muted/50"
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{condition.abbreviation}</span>
                  {condition.diagnosticCode && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      DC {condition.diagnosticCode}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {condition.name}
                </p>
                <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
                  <Link2 className="h-3 w-3" />
                  Secondary to {parentCondition.abbreviation}
                </p>
              </div>

              <Button
                variant={isJustAdded ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 px-3 flex-shrink-0 transition-all",
                  isJustAdded && "bg-success hover:bg-success/90"
                )}
                disabled={isAlreadyAdded || isJustAdded}
                onClick={() => handleAddCondition(condition.id, parentConditionId)}
              >
                {isJustAdded ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Secondary conditions must affect different body systems to avoid duplicate ratings
      </p>
    </div>
  );

  if (!collapsible) {
    return (
      <Card className={cn("border-primary/20", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Conditions Worth Exploring
          </CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-primary/20", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-0">
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full text-left">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Conditions Worth Exploring
                <Badge variant="secondary" className="text-xs ml-2">
                  {suggestions.length}
                </Badge>
              </CardTitle>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-3">{content}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

/**
 * Inline version for embedding in other components
 */
export function InlineSecondarySuggestions({
  maxSuggestions = 5,
  className,
}: {
  maxSuggestions?: number;
  className?: string;
}) {
  const { conditions: userConditions, addCondition, hasCondition } = useUserConditions();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const currentConditionIds = userConditions.map(uc => uc.conditionId);

  const suggestions = useMemo(() => {
    if (currentConditionIds.length === 0) return [];

    const seen = new Set<string>();
    const results: VACondition[] = [];

    currentConditionIds.forEach(conditionId => {
      const secondaries = getSecondaryConditions(conditionId);
      secondaries.forEach(secondary => {
        if (!hasCondition(secondary.id) && !seen.has(secondary.id)) {
          seen.add(secondary.id);
          results.push(secondary);
        }
      });
    });

    return results.slice(0, maxSuggestions);
  }, [currentConditionIds, hasCondition, maxSuggestions]);

  const handleAdd = (conditionId: string) => {
    const result = addCondition(conditionId);
    if (result) {
      setAddedIds(prev => new Set(prev).add(conditionId));
      setTimeout(() => {
        setAddedIds(prev => {
          const next = new Set(prev);
          next.delete(conditionId);
          return next;
        });
      }, 2000);
    }
  };

  if (suggestions.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3 text-primary" />
        <span>Related conditions worth exploring:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(condition => {
          const isJustAdded = addedIds.has(condition.id);
          return (
            <Button
              key={condition.id}
              variant={isJustAdded ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs transition-all",
                isJustAdded && "bg-success hover:bg-success/90"
              )}
              disabled={isJustAdded}
              onClick={() => handleAdd(condition.id)}
            >
              {isJustAdded ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  {condition.abbreviation}
                </>
              ) : (
                <>
                  <Plus className="h-3 w-3 mr-1" />
                  {condition.abbreviation}
                </>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
