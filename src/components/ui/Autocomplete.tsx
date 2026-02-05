import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface AutocompleteProps<T> {
  items: T[];
  getLabel: (item: T) => string;
  getKey: (item: T) => string;
  onSelect: (item: T) => void;
  placeholder?: string;
  maxResults?: number;
  className?: string;
}

export function Autocomplete<T>({
  items,
  getLabel,
  getKey,
  onSelect,
  placeholder = 'Search...',
  maxResults = 10,
  className = ''
}: AutocompleteProps<T>) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = query.trim()
    ? items
        .filter(item =>
          getLabel(item).toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, maxResults)
    : [];

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filteredItems[highlightedIndex]) {
      e.preventDefault();
      onSelect(filteredItems[highlightedIndex]);
      setQuery('');
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-[#1e2844] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && filteredItems.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-[#1e2844] border border-gray-700 rounded-lg shadow-lg">
          {filteredItems.map((item, index) => (
            <li
              key={getKey(item)}
              onClick={() => {
                onSelect(item);
                setQuery('');
                setIsOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer ${
                index === highlightedIndex
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {getLabel(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
