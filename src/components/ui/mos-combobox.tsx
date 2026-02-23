import * as React from 'react';
import { Check, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { searchMilitaryJobs, type MilitaryJobCode } from '@/data/militaryMOS';
import { saveMOS, getSavedMOS } from '@/utils/veteranProfile';

interface MOSComboboxProps {
  value: string;
  onValueChange: (code: string, jobInfo?: MilitaryJobCode) => void;
  onHazardsSuggested?: (hazards: string[]) => void;
  placeholder?: string;
  branch?: 'Army' | 'Air Force' | 'Navy' | 'Marines' | 'Coast Guard';
  persistToStorage?: boolean;
}

export function MOSCombobox({
  value,
  onValueChange,
  onHazardsSuggested,
  placeholder = "Type your service job code or title...",
  branch,
  persistToStorage = true
}: MOSComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Load saved MOS on mount if no value provided
  React.useEffect(() => {
    if (!value && persistToStorage) {
      const saved = getSavedMOS();
      if (saved.mos) {
        setInputValue(saved.mos);
        onValueChange(saved.mos);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only: restores saved MOS value
  }, []);

  // Filter based on input
  const filteredJobs = React.useMemo(() => {
    return searchMilitaryJobs(inputValue, branch);
  }, [inputValue, branch]);

  const handleSelect = (job: MilitaryJobCode) => {
    setInputValue(job.code);
    onValueChange(job.code, job);

    // Save to localStorage for persistence across pages
    if (persistToStorage) {
      saveMOS(job.code, job.branch);
    }

    // Suggest hazards if callback provided
    if (onHazardsSuggested && job.commonHazards) {
      onHazardsSuggested(job.commonHazards);
    }

    setOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange(newValue);
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
          prev < filteredJobs.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredJobs[highlightedIndex]) {
          handleSelect(filteredJobs[highlightedIndex]);
        } else {
          setOpen(false);
        }
        break;
      case 'Escape':
        setOpen(false);
        setHighlightedIndex(-1);
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

  // Sync external value changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

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

  const getBranchColor = (branch: string) => {
    switch (branch) {
      case 'Army': return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30';
      case 'Air Force': return 'bg-gold/20 text-[#A88828] dark:text-gold-hl border-gold/30';
      case 'Navy': return 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border-indigo-500/30';
      case 'Marines': return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30';
      case 'Coast Guard': return 'bg-gold/20 text-[#A88828] dark:text-gold-hl border-gold/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="pl-10"
          autoComplete="off"
          role="combobox"
          aria-expanded={open && filteredJobs.length > 0}
          aria-autocomplete="list"
          aria-label="Search military job codes"
        />
      </div>

      {open && filteredJobs.length > 0 && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Job code suggestions"
          className="absolute z-[9999] w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-[400px] min-h-[200px] overflow-y-auto"
        >
          {filteredJobs.map((job, index) => (
            <div
              key={`${job.branch}-${job.code}`}
              data-item
              role="option"
              aria-selected={job.code === value}
              onClick={() => handleSelect(job)}
              className={cn(
                "px-3 py-2 cursor-pointer flex items-start gap-3 border-b border-border/50 last:border-0",
                highlightedIndex === index ? "bg-accent" : "hover:bg-muted/50",
                job.code === value && "bg-primary/10"
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-sm text-foreground">
                    {job.code}
                  </span>
                  <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", getBranchColor(job.branch))}>
                    {job.branch}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{job.title}</p>
                <p className="text-xs text-muted-foreground/70 truncate">{job.category}</p>
              </div>
              {job.code === value && (
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
              )}
            </div>
          ))}
          {inputValue.trim() && (
            <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border bg-muted/30">
              Can't find it? Press Enter to use "{inputValue}" as-is
            </div>
          )}
        </div>
      )}
    </div>
  );
}
