import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import { type VACondition, getConditionById } from '@/data/vaConditions';
import { searchAllConditions } from '@/utils/conditionSearch';

// --- Highlighted text ---

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <span className="text-sm font-medium">{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span className="text-sm font-medium">{text}</span>;
  return (
    <span className="text-sm font-medium">
      {text.slice(0, idx)}
      <span className="text-gold font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </span>
  );
}

// --- Main component ---

export interface ConditionAutocompleteProps {
  onSelect: (condition: VACondition) => void;
  placeholder?: string;
  initialValue?: string;
  excludeIds?: string[];
  showBodySystem?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function ConditionAutocomplete({
  onSelect,
  placeholder = 'Search conditions...',
  initialValue = '',
  excludeIds = [],
  showBodySystem = true,
  autoFocus = false,
  className = '',
}: ConditionAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const highlightRef = useRef<HTMLButtonElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced query for search
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 100);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Memoized search results — uses the unified index (800+ conditions)
  const results = useMemo((): VACondition[] => {
    if (debouncedQuery.trim().length < 1) return [];
    const unified = searchAllConditions(debouncedQuery, { excludeIds, limit: 20 });
    // Map unified results back to VACondition objects where possible,
    // falling back to constructing a compatible object for disability-only entries
    return unified.map(sc => {
      const rich = getConditionById(sc.id);
      if (rich) return rich;
      // Build a compatible VACondition-like object for disability-source entries
      return {
        id: sc.id,
        name: sc.name,
        abbreviation: sc.abbreviation || sc.name,
        diagnosticCode: sc.diagnosticCode,
        category: sc.category as VACondition['category'],
        description: sc.description || '',
        typicalRatings: sc.typicalRatings || '',
        keywords: sc.keywords,
        commonSecondaries: sc.commonSecondaries || [],
        bodySystem: sc.bodySystem || sc.category,
      } as VACondition;
    });
  }, [debouncedQuery, excludeIds]);

  // Open dropdown when there are results
  useEffect(() => {
    if (results.length > 0 && query.trim().length >= 1) {
      setIsOpen(true);
      setHighlightedIndex(0);
    } else if (query.trim().length < 1) {
      setIsOpen(false);
    }
  }, [results, query]);

  // Scroll highlighted into view
  useEffect(() => {
    highlightRef.current?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((condition: VACondition) => {
    onSelect(condition);
    setQuery('');
    setIsOpen(false);
    setDebouncedQuery('');
    inputRef.current?.blur();
  }, [onSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Tab':
        if (results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery('');
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, results, highlightedIndex, handleSelect]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
            // Scroll input above keyboard on mobile
            setTimeout(() => inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full h-12 pl-10 pr-4 bg-white/[0.09] border border-white/[0.14] rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,0.4)] focus:border-[rgba(212,175,55,0.5)] transition-all"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[100] overflow-hidden bg-popover border border-white/[0.14] rounded-xl shadow-2xl shadow-black/20 backdrop-blur-xl max-h-48 sm:max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {results.length === 0 && query.length > 1 && (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              No conditions found for &ldquo;{query}&rdquo;
            </div>
          )}

          {results.map((condition, i) => (
            <button
              key={condition.id}
              ref={i === highlightedIndex ? highlightRef : undefined}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-150 ${
                i === highlightedIndex
                  ? 'bg-gold/15 text-foreground'
                  : 'text-foreground/80 hover:bg-accent'
              } ${i > 0 ? 'border-t border-border/50' : ''}`}
              onClick={() => handleSelect(condition)}
              onMouseEnter={() => setHighlightedIndex(i)}
            >
              <div className="flex-1 min-w-0">
                <HighlightedText text={condition.abbreviation !== condition.name ? `${condition.abbreviation} — ${condition.name}` : condition.name} query={query} />
                {condition.diagnosticCode && (
                  <span className="text-xs text-muted-foreground ml-2">DC {condition.diagnosticCode}</span>
                )}
              </div>
              {showBodySystem && condition.bodySystem && (
                <span className="text-xs text-gold/60 whitespace-nowrap flex-shrink-0 max-w-[100px] truncate">
                  {condition.bodySystem}
                </span>
              )}
            </button>
          ))}

          {results.length > 0 && (
            <div className="px-4 py-2 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground/50">
              <span>&uarr;&darr; Navigate</span>
              <span>Enter to select</span>
              <span>Esc to close</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
