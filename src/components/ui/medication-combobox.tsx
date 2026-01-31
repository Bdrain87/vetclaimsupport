import * as React from 'react';
import { Check, ChevronsUpDown, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { commonMedications, medicationCategories, type MedicationOption } from '@/data/commonMedications';
import { Badge } from '@/components/ui/badge';

interface MedicationComboboxProps {
  value: string;
  onValueChange: (value: string, prescribedFor?: string) => void;
  placeholder?: string;
}

export function MedicationCombobox({ 
  value, 
  onValueChange, 
  placeholder = "Search or type medication..." 
}: MedicationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);

  // Group medications by category
  const groupedMedications = React.useMemo(() => {
    const groups: Record<string, MedicationOption[]> = {};
    for (const category of medicationCategories) {
      groups[category] = commonMedications.filter(med => med.category === category);
    }
    return groups;
  }, []);

  // Filter based on input
  const filteredGroups = React.useMemo(() => {
    if (!inputValue.trim()) return groupedMedications;
    
    const lowerInput = inputValue.toLowerCase();
    const filtered: Record<string, MedicationOption[]> = {};
    
    for (const [category, meds] of Object.entries(groupedMedications)) {
      const matchingMeds = meds.filter(med =>
        med.name.toLowerCase().includes(lowerInput) ||
        med.commonlyPrescribedFor.toLowerCase().includes(lowerInput)
      );
      if (matchingMeds.length > 0) {
        filtered[category] = matchingMeds;
      }
    }
    
    return filtered;
  }, [inputValue, groupedMedications]);

  const hasResults = Object.values(filteredGroups).some(group => group.length > 0);

  const handleSelect = (medication: MedicationOption) => {
    setInputValue(medication.name);
    onValueChange(medication.name, medication.commonlyPrescribedFor);
    setOpen(false);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    // Allow custom input
    onValueChange(newValue);
  };

  // Sync external value changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Pain': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Mental Health': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Sleep': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'Muscle Relaxant': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      case 'GI': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'Blood Pressure': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Diabetes': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Cholesterol': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Allergy': return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      case 'Respiratory': return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
      case 'Topical': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Migraine': return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="flex items-center gap-2 truncate">
            <Pill className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {inputValue || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 z-50 bg-popover" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search medications or type custom..." 
            value={inputValue}
            onValueChange={handleInputChange}
          />
          <CommandList className="max-h-[300px]">
            {!hasResults && inputValue.trim() && (
              <CommandEmpty className="py-4 text-center">
                <p className="text-sm text-muted-foreground">No matching medications found.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Press Enter or click outside to use "{inputValue}"
                </p>
              </CommandEmpty>
            )}
            
            {Object.entries(filteredGroups).map(([category, meds]) => (
              meds.length > 0 && (
                <CommandGroup key={category} heading={category}>
                  {meds.map((med) => (
                    <CommandItem
                      key={med.name}
                      value={med.name}
                      onSelect={() => handleSelect(med)}
                      className="flex items-start gap-2 py-2"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4 mt-0.5 flex-shrink-0",
                          inputValue === med.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{med.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {med.commonlyPrescribedFor}
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("text-xs flex-shrink-0", getCategoryColor(category))}>
                        {category}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
