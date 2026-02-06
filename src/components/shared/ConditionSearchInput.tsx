import { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { vaDisabilitiesBySystem, type VADisability } from '@/data/vaDisabilities';
import { cn } from '@/lib/utils';
import { Search, Plus } from 'lucide-react';

interface ConditionSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (condition: VADisability) => void;
  placeholder?: string;
  className?: string;
  showDiagnosticCode?: boolean;
}

export function ConditionSearchInput({
  value,
  onChange,
  onSelect,
  placeholder = "Search conditions (e.g., elbow, tinnitus, PTSD)...",
  className,
  showDiagnosticCode = true,
}: ConditionSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Flatten all conditions for searching
  const allConditions = useMemo(() => {
    const conditions: (VADisability & { system: string })[] = [];
    vaDisabilitiesBySystem.forEach(system => {
      system.conditions.forEach(condition => {
        conditions.push({ ...condition, system: system.name });
      });
    });
    return conditions;
  }, []);

  // Filter conditions based on search
  const filteredConditions = useMemo(() => {
    if (!value.trim() || value.length < 2) return [];
    
    const searchTerms = value.toLowerCase().split(' ').filter(Boolean);
    
    return allConditions
      .filter(condition => {
        const searchText = `${condition.name} ${condition.diagnosticCode} ${condition.description}`.toLowerCase();
        return searchTerms.every(term => searchText.includes(term));
      })
      .slice(0, 15); // Limit results
  }, [value, allConditions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredConditions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredConditions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredConditions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredConditions.length) {
          handleSelectCondition(filteredConditions[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleSelectCondition = (condition: VADisability & { system: string }) => {
    onChange(condition.name);
    setIsOpen(false);
    setFocusedIndex(-1);
    onSelect?.(condition);
  };

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-condition-item]');
      items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  // Close dropdown when clicking outside
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setFocusedIndex(-1);
          }}
          onFocus={() => {
            setIsOpen(true);
            // Mobile keyboard scroll fix
            setTimeout(() => {
              inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>

      {/* Dropdown Results - Prominent Card Design */}
      {isOpen && filteredConditions.length > 0 && (
        <div className="absolute z-[100] w-full mt-2 bg-card border-2 border-primary/30 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border px-4 py-2.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {filteredConditions.length} VA Condition{filteredConditions.length !== 1 ? 's' : ''} Found
              </p>
              <Badge variant="outline" className="text-[10px] bg-background">
                38 CFR Part 4
              </Badge>
            </div>
          </div>
          
          <ScrollArea className="max-h-[340px]">
            <div ref={listRef} className="p-2 space-y-1.5">
              {filteredConditions.map((condition, index) => (
                <button
                  key={`${condition.diagnosticCode}-${condition.name}-${index}`}
                  data-condition-item
                  type="button"
                  className={cn(
                    "group w-full text-left flex items-center gap-3 p-3 rounded-lg transition-all duration-150",
                    "hover:bg-primary/10 hover:border-primary/40",
                    "border-2 border-transparent",
                    focusedIndex === index && "bg-primary/10 border-primary/40"
                  )}
                  onClick={() => handleSelectCondition(condition)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  {/* DC Code Badge - Prominent */}
                  {showDiagnosticCode && (
                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-primary/15 border border-primary/25">
                      <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">DC</span>
                      <span className="text-base font-bold text-primary">{condition.diagnosticCode}</span>
                    </div>
                  )}
                  
                  {/* Condition Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm text-foreground">
                        {condition.name}
                      </h4>
                      {(condition as Record<string, unknown>).isPACTAct && (
                        <Badge className="text-[9px] px-1.5 py-0 h-4 bg-success/15 text-success border-success/30 hover:bg-success/20">
                          PACT Act
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {condition.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {condition.typicalRatings} • {condition.system}
                    </p>
                  </div>

                  {/* Add Action Button */}
                  <div className={cn(
                    "flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all",
                    "bg-primary/10 text-primary border border-primary/20",
                    "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary",
                    focusedIndex === index && "bg-primary text-primary-foreground border-primary"
                  )}>
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
          
          {/* Footer Help Text */}
          <div className="px-4 py-2.5 border-t border-border bg-muted/30">
            <p className="text-[11px] text-muted-foreground text-center">
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] mr-1">↑↓</kbd>
              Navigate
              <span className="mx-2 text-border">•</span>
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] mr-1">Enter</kbd>
              Select
            </p>
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && value.length >= 2 && filteredConditions.length === 0 && (
        <div className="absolute z-[100] w-full mt-2 p-4 bg-card border-2 border-border rounded-xl shadow-lg">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              No matching VA conditions found
            </p>
            <p className="text-xs text-muted-foreground/70">
              You can still use "<span className="font-medium text-foreground">{value}</span>" as a custom condition
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to get diagnostic code for a condition name
export function getDiagnosticCodeForCondition(conditionName: string): { code: string; name: string } | null {
  const lower = conditionName.toLowerCase();
  
  for (const system of vaDisabilitiesBySystem) {
    for (const condition of system.conditions) {
      if (condition.name.toLowerCase() === lower) {
        return { code: condition.diagnosticCode, name: condition.name };
      }
    }
  }
  
  // Fuzzy match
  for (const system of vaDisabilitiesBySystem) {
    for (const condition of system.conditions) {
      if (condition.name.toLowerCase().includes(lower) || lower.includes(condition.name.toLowerCase())) {
        return { code: condition.diagnosticCode, name: condition.name };
      }
    }
  }
  
  return null;
}
