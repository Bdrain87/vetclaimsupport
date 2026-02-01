import { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { vaDisabilitiesBySystem, type VADisability } from '@/data/vaDisabilities';
import { cn } from '@/lib/utils';
import { Search, FileText } from 'lucide-react';

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

      {/* Dropdown Results */}
      {isOpen && filteredConditions.length > 0 && (
        <div className="absolute z-[100] w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          <ScrollArea className="max-h-[280px]">
            <div ref={listRef} className="p-1">
              {filteredConditions.map((condition, index) => (
                <button
                  key={`${condition.diagnosticCode}-${condition.name}-${index}`}
                  data-condition-item
                  type="button"
                  className={cn(
                    "w-full text-left p-2.5 rounded-md transition-colors",
                    "hover:bg-muted",
                    focusedIndex === index && "bg-muted"
                  )}
                  onClick={() => handleSelectCondition(condition)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {condition.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {condition.description}
                      </p>
                    </div>
                    {showDiagnosticCode && (
                      <Badge variant="outline" className="flex-shrink-0 text-xs font-mono">
                        <FileText className="h-3 w-3 mr-1" />
                        DC {condition.diagnosticCode}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {condition.typicalRatings} • {condition.system}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
          
          {/* Help text */}
          <div className="p-2 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              DC = VA Diagnostic Code (38 CFR Part 4)
            </p>
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && value.length >= 2 && filteredConditions.length === 0 && (
        <div className="absolute z-[100] w-full mt-1 p-4 bg-popover border border-border rounded-lg shadow-lg">
          <p className="text-sm text-muted-foreground text-center">
            No matching conditions found. You can still use "{value}" as a custom condition.
          </p>
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
