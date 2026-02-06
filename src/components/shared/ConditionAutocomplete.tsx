import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import { vaConditions, type VACondition } from '@/data/vaConditions';

// --- Fuzzy scoring engine ---

function scoreMatch(query: string, condition: VACondition): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const name = condition.name.toLowerCase();
  const abbr = condition.abbreviation.toLowerCase();
  let score = 0;

  // TIER 1: Exact name or abbreviation match (100)
  if (name === q || abbr === q) return 100;

  // TIER 2: Abbreviation starts with query (95)
  if (abbr.startsWith(q)) score = Math.max(score, 95);

  // TIER 3: Name starts with query (90)
  if (name.startsWith(q)) score = Math.max(score, 90);

  // TIER 4: Word in name starts with query (80)
  const nameWords = name.split(/[\s\-/(),]+/).filter(Boolean);
  if (nameWords.some(w => w.startsWith(q))) score = Math.max(score, 80);

  // TIER 5: Acronym match - "ptsd" matches "Post Traumatic Stress Disorder" (75)
  const acronym = nameWords.map(w => w[0] || '').join('').toLowerCase();
  if (acronym.startsWith(q) || acronym === q) score = Math.max(score, 75);

  // TIER 6: Name or abbreviation contains query (60)
  if (name.includes(q)) score = Math.max(score, 60);
  if (abbr.includes(q)) score = Math.max(score, 65);

  // TIER 7: Diagnostic code match (55)
  if (condition.diagnosticCode?.toString().startsWith(q)) score = Math.max(score, 55);

  // TIER 8: Keyword starts with query (50) or contains query (40)
  if (condition.keywords?.some(kw => kw.toLowerCase().startsWith(q))) score = Math.max(score, 50);
  if (condition.keywords?.some(kw => kw.toLowerCase().includes(q))) score = Math.max(score, 40);

  // TIER 9: Body system match (30)
  if ((condition as Record<string, unknown>).bodySystem && String((condition as Record<string, unknown>).bodySystem).toLowerCase().includes(q)) score = Math.max(score, 30);

  // TIER 10: Misspelling match (20)
  const misspellings = (condition as Record<string, unknown>).misspellings as string[] | undefined;
  if (misspellings?.some(ms => ms.toLowerCase().startsWith(q))) score = Math.max(score, 20);

  return score;
}

function searchConditionsScored(query: string, conditions: VACondition[], excludeIds: string[] = []): VACondition[] {
  return conditions
    .filter(c => !excludeIds.includes(c.id))
    .map(c => ({ condition: c, score: scoreMatch(query, c) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score || a.condition.name.localeCompare(b.condition.name))
    .slice(0, 20)
    .map(r => r.condition);
}

// --- Highlighted text ---

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <span className="text-sm font-medium">{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span className="text-sm font-medium">{text}</span>;
  return (
    <span className="text-sm font-medium">
      {text.slice(0, idx)}
      <span className="text-[#C8A628] font-semibold">{text.slice(idx, idx + query.length)}</span>
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

  // Memoized search results
  const results = useMemo(() => {
    if (debouncedQuery.trim().length < 1) return [];
    return searchConditionsScored(debouncedQuery, vaConditions, excludeIds);
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full h-12 pl-10 pr-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C8A628]/40 focus:border-[#C8A628]/50 transition-all"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[100] overflow-hidden bg-[#1a2d44] border border-white/10 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-xl max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {results.length === 0 && query.length > 1 && (
            <div className="px-4 py-8 text-center text-white/40 text-sm">
              No conditions found for &ldquo;{query}&rdquo;
            </div>
          )}

          {results.map((condition, i) => (
            <button
              key={condition.id}
              ref={i === highlightedIndex ? highlightRef : undefined}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-150 ${
                i === highlightedIndex
                  ? 'bg-[#C8A628]/15 text-white'
                  : 'text-white/80 hover:bg-white/5'
              } ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}
              onClick={() => handleSelect(condition)}
              onMouseEnter={() => setHighlightedIndex(i)}
            >
              <div className="flex-1 min-w-0">
                <HighlightedText text={condition.abbreviation !== condition.name ? `${condition.abbreviation} — ${condition.name}` : condition.name} query={query} />
                {condition.diagnosticCode && (
                  <span className="text-xs text-white/30 ml-2">DC {condition.diagnosticCode}</span>
                )}
              </div>
              {showBodySystem && (condition as Record<string, unknown>).bodySystem && (
                <span className="text-xs text-[#C8A628]/60 whitespace-nowrap">
                  {String((condition as Record<string, unknown>).bodySystem)}
                </span>
              )}
            </button>
          ))}

          {results.length > 0 && (
            <div className="px-4 py-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-white/20">
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
