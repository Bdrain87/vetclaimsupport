import * as React from 'react';
import { Check, Pill, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { commonMedications, type MedicationOption } from '@/data/commonMedications';
import { Badge } from '@/components/ui/badge';

interface MedicationComboboxProps {
  value: string;
  onValueChange: (value: string, prescribedFor?: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function MedicationCombobox({
  value,
  onValueChange,
  placeholder = "Type or search medication name...",
  required
}: MedicationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Filter based on input - flatten for easier keyboard navigation
  const filteredMedications = React.useMemo(() => {
    if (!inputValue.trim()) {
      return commonMedications.slice(0, 20); // Show first 20 when empty
    }
    
    const lowerInput = inputValue.toLowerCase();
    return commonMedications.filter(med =>
      med.name.toLowerCase().includes(lowerInput) ||
      med.commonlyPrescribedFor.toLowerCase().includes(lowerInput)
    ).slice(0, 20); // Limit results for performance
  }, [inputValue]);

  const handleSelect = (medication: MedicationOption) => {
    setInputValue(medication.name);
    onValueChange(medication.name, medication.commonlyPrescribedFor);
    setOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange(newValue); // Always update with typed value
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
          prev < filteredMedications.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredMedications[highlightedIndex]) {
          handleSelect(filteredMedications[highlightedIndex]);
        } else {
          // Accept custom input
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

  // Sync external value changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-medication-item]');
      items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Pain': return 'bg-gold/10 text-gold border-gold/20';
      case 'Mental Health': return 'bg-gold/10 text-gold border-gold/20';
      case 'Sleep': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'Muscle Relaxant': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      case 'GI': return 'bg-gold/10 text-gold border-gold/20';
      case 'Blood Pressure': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Diabetes': return 'bg-gold/10 text-gold border-gold/20';
      case 'Cholesterol': return 'bg-success/10 text-success border-success/20';
      case 'Antibiotic': return 'bg-success/10 text-success border-success/20';
      case 'Allergy': return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      case 'Respiratory': return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
      case 'Topical': return 'bg-gold/10 text-gold border-gold/20';
      case 'Migraine': return 'bg-gold/10 text-gold border-gold/20';
      case 'Thyroid': return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
      case 'Bone Health': return 'bg-stone-500/10 text-stone-600 border-stone-500/20';
      case 'Urology': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      case 'Eye': return 'bg-lime-500/10 text-lime-600 border-lime-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Pill className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-9"
          autoComplete="off"
          required={required}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-label="Search medications"
        />
      </div>
      
      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Medication suggestions"
          className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-[300px] overflow-y-auto"
        >
          {filteredMedications.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm font-medium text-foreground">No matching medications</p>
              <p className="text-xs text-muted-foreground mt-1">
                "{inputValue}" will be used as a custom medication
              </p>
            </div>
          ) : (
            <div className="py-1">
              {inputValue.trim() && !filteredMedications.some(m => m.name.toLowerCase() === inputValue.toLowerCase()) && (
                <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border bg-muted/30">
                  <Lightbulb className="h-3 w-3 inline text-primary" /> Showing suggestions. Press Enter to use "{inputValue}" as custom.
                </div>
              )}
              {filteredMedications.map((med, index) => (
                <div
                  key={med.name}
                  data-medication-item
                  role="option"
                  aria-selected={inputValue === med.name}
                  onClick={() => handleSelect(med)}
                  className={cn(
                    "flex items-start gap-2 px-3 py-2 cursor-pointer transition-colors",
                    highlightedIndex === index ? "bg-accent" : "hover:bg-accent/50",
                    inputValue === med.name && "bg-accent/30"
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 mt-0.5 shrink-0",
                      inputValue === med.name ? "opacity-100 text-primary" : "opacity-0"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{med.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {med.commonlyPrescribedFor}
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-xs shrink-0", getCategoryColor(med.category))}>
                    {med.category}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
