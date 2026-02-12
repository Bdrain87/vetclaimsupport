import * as React from 'react';
import { Check, Medal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { searchAwards, type MilitaryAward } from '@/data/militaryAwards';

interface AwardsComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  allowMultiple?: boolean;
}

export function AwardsCombobox({
  value,
  onValueChange,
  placeholder = "Type award name or abbreviation...",
  allowMultiple = true
}: AwardsComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Parse current value into array of awards
  const selectedAwards = React.useMemo(() => {
    if (!value.trim()) return [];
    return value.split(',').map(a => a.trim()).filter(Boolean);
  }, [value]);

  // Filter based on input
  const filteredAwards = React.useMemo(() => {
    return searchAwards(inputValue);
  }, [inputValue]);

  const handleSelect = (award: MilitaryAward) => {
    if (allowMultiple) {
      // Toggle award in the list
      const awardText = award.abbreviation || award.name;
      if (selectedAwards.includes(awardText)) {
        // Remove
        const newAwards = selectedAwards.filter(a => a !== awardText);
        onValueChange(newAwards.join(', '));
      } else {
        // Add
        const newAwards = [...selectedAwards, awardText];
        onValueChange(newAwards.join(', '));
      }
      setInputValue('');
    } else {
      onValueChange(award.abbreviation || award.name);
      setOpen(false);
    }
    setHighlightedIndex(-1);
  };

  const removeAward = (awardText: string) => {
    const newAwards = selectedAwards.filter(a => a !== awardText);
    onValueChange(newAwards.join(', '));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setOpen(true);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredAwards.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredAwards[highlightedIndex]) {
          handleSelect(filteredAwards[highlightedIndex]);
        } else if (inputValue.trim()) {
          // Accept custom input
          if (allowMultiple) {
            const newAwards = [...selectedAwards, inputValue.trim()];
            onValueChange(newAwards.join(', '));
            setInputValue('');
          } else {
            onValueChange(inputValue.trim());
            setOpen(false);
          }
        }
        break;
      case 'Escape':
        setOpen(false);
        setHighlightedIndex(-1);
        break;
      case 'Backspace':
        if (!inputValue && selectedAwards.length > 0) {
          removeAward(selectedAwards[selectedAwards.length - 1]);
        }
        break;
      case 'Tab':
        setOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-item]');
      items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node) &&
          listRef.current && !listRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <Medal className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <div className={cn(
          "min-h-10 px-10 py-2 rounded-md border border-input bg-background text-sm",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "flex flex-wrap gap-1.5 items-center"
        )}>
          {/* Selected awards as badges */}
          {selectedAwards.map(award => (
            <Badge
              key={award}
              variant="secondary"
              className="gap-1 py-0.5 px-2 text-xs"
            >
              {award}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAward(award);
                }}
                aria-label={`Remove ${award}`}
                className="cursor-pointer hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            placeholder={selectedAwards.length === 0 ? placeholder : "Add more..."}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            autoComplete="off"
            aria-label="Search military awards"
            role="combobox"
            aria-expanded={open && filteredAwards.length > 0}
            aria-autocomplete="list"
          />
        </div>
      </div>

      {open && filteredAwards.length > 0 && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Award suggestions"
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {filteredAwards.map((award, index) => {
            const isSelected = selectedAwards.includes(award.abbreviation) || selectedAwards.includes(award.name);
            return (
              <div
                key={`${award.name}-${index}`}
                data-item
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(award)}
                className={cn(
                  "px-3 py-2 cursor-pointer flex items-start gap-3 border-b border-border/50 last:border-0",
                  highlightedIndex === index ? "bg-accent" : "hover:bg-muted/50",
                  isSelected && "bg-primary/10"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">
                      {award.name}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {award.abbreviation}
                    </Badge>
                    {award.combatRelated && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        Combat
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{award.description}</p>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                )}
              </div>
            );
          })}
          {inputValue.trim() && (
            <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border bg-muted/30">
              Press Enter to add "{inputValue}" as a custom award
            </div>
          )}
        </div>
      )}
    </div>
  );
}
