import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { MILITARY_BASES } from '@/data/militaryBases';
import { searchLocations } from '@/data/deployment-locations/search';

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

export interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (location: string) => void;
  placeholder?: string;
  className?: string;
}

export function LocationAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Search bases/locations...',
  className = '',
}: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const justSelected = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const highlightRef = useRef<HTMLButtonElement>(null);
  const listboxId = useRef(`location-listbox-${Math.random().toString(36).slice(2, 9)}`).current;

  // Fuzzy search: CONUS bases + deployment locations (FOBs, camps, theaters)
  const results = useMemo((): string[] => {
    const q = value.trim().toLowerCase();
    if (q.length < 1) return [];

    const seen = new Set<string>();
    const merged: string[] = [];

    // 1. Search CONUS military bases
    const prefixMatches: string[] = [];
    const containsMatches: string[] = [];

    for (const base of MILITARY_BASES) {
      const lower = base.toLowerCase();
      if (lower.startsWith(q)) {
        prefixMatches.push(base);
      } else if (lower.includes(q)) {
        containsMatches.push(base);
      }
    }

    // Also match on individual words within each base name
    for (const base of MILITARY_BASES) {
      if (prefixMatches.includes(base) || containsMatches.includes(base)) continue;
      const words = base.toLowerCase().split(/[\s,()/-]+/);
      if (words.some(word => word.startsWith(q))) {
        containsMatches.push(base);
      }
    }

    for (const b of [...prefixMatches, ...containsMatches]) {
      const key = b.toLowerCase();
      if (!seen.has(key)) { seen.add(key); merged.push(b); }
    }

    // 2. Search deployment locations database (FOBs, camps, airfields, etc.)
    const deployResults = searchLocations(value.trim(), { limit: 15 });
    for (const loc of deployResults) {
      const label = loc.country ? `${loc.name}, ${loc.country}` : loc.name;
      const key = label.toLowerCase();
      if (!seen.has(key)) { seen.add(key); merged.push(label); }
    }

    return merged.slice(0, 15);
  }, [value]);

  // Open dropdown when there are results (but not right after a selection)
  useEffect(() => {
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }
    if (results.length > 0 && value.trim().length >= 1) {
      setIsOpen(true);
      setHighlightedIndex(0);
    } else if (value.trim().length < 1) {
      setIsOpen(false);
    }
  }, [results, value]);

  // Scroll highlighted into view
  useEffect(() => {
    highlightRef.current?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex]);

  // Scroll input into view when dropdown opens (keyboard may be covering it)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  }, [isOpen]);

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

  const handleSelect = useCallback((location: string) => {
    justSelected.current = true;
    onChange(location);
    onSelect?.(location);
    setIsOpen(false);
    inputRef.current?.blur();
  }, [onChange, onSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      // If dropdown is closed and user presses Enter, treat as custom entry
      if (e.key === 'Enter' && value.trim()) {
        e.preventDefault();
        onSelect?.(value.trim());
      }
      return;
    }

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
        } else if (value.trim()) {
          // Custom entry: close dropdown and notify
          setIsOpen(false);
          onSelect?.(value.trim());
        }
        break;
      case 'Tab':
        if (results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }, [isOpen, results, highlightedIndex, handleSelect, value, onSelect]);

  const handleBlur = useCallback(() => {
    // Delay to allow click events on dropdown items to fire first
    setTimeout(() => {
      if (value.trim() && !isOpen) {
        onSelect?.(value.trim());
      }
    }, 150);
  }, [value, isOpen, onSelect]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={isOpen && results.length > 0 ? `location-option-${highlightedIndex}` : undefined}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
            setTimeout(() => inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-4 bg-muted/50 border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-gold/40 focus:border-gold/50 transition-all"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Military bases and locations"
          className="absolute top-full left-0 right-0 mt-1 z-100 overflow-hidden bg-popover border border-white/[0.14] rounded-xl shadow-2xl shadow-black/20 backdrop-blur-xl max-h-48 sm:max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        >
          {results.length === 0 && value.length > 1 && (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              No bases found for &ldquo;{value}&rdquo; &mdash; press Enter to use custom location
            </div>
          )}

          {results.map((location, i) => (
            <button
              key={location}
              id={`location-option-${i}`}
              role="option"
              aria-selected={i === highlightedIndex}
              ref={i === highlightedIndex ? highlightRef : undefined}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-150 ${
                i === highlightedIndex
                  ? 'bg-gold/15 text-foreground'
                  : 'text-foreground/80 hover:bg-accent'
              } ${i > 0 ? 'border-t border-border/50' : ''}`}
              onClick={() => handleSelect(location)}
              onMouseEnter={() => setHighlightedIndex(i)}
            >
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <HighlightedText text={location} query={value} />
              </div>
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
