import { useCallback } from 'react';
import { Shield, Calendar } from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

const CONFLICTS = [
  { id: 'gulf_war', name: 'Gulf War', dateRange: 'Aug 1990 – present' },
  { id: 'oif_iraq', name: 'Operation Iraqi Freedom / New Dawn', dateRange: '2003–2011' },
  { id: 'oef_afghanistan', name: 'Operation Enduring Freedom — Afghanistan', dateRange: '2001–2021' },
  { id: 'vietnam', name: 'Vietnam War', dateRange: '1962–1975' },
  { id: 'korea_dmz', name: 'Korea — DMZ Service', dateRange: '1967–1971' },
  { id: 'korea_war', name: 'Korean War', dateRange: '1950–1953' },
  { id: 'gwot_other', name: 'GWOT — Other Locations', dateRange: 'Djibouti, Qatar, Kuwait, Syria, etc.' },
  { id: 'camp_lejeune', name: 'Camp Lejeune', dateRange: 'Stationed 1953–1987' },
  { id: 'nuclear_radiation', name: 'Nuclear/Radiation Exposure', dateRange: '' },
  { id: 'thailand_vietnam_era', name: 'Thailand — Military Bases', dateRange: 'Vietnam era' },
  { id: 'cold_war_europe', name: 'Cold War — European Bases', dateRange: '1945–1991' },
  { id: 'domestic_toxic', name: 'Domestic — Toxic Exposure Sites', dateRange: 'PFAS, chemical, asbestos' },
  { id: 'other', name: 'Other / Not listed', dateRange: '' },
] as const;

interface ConflictSelectorProps {
  className?: string;
  onConflictChange?: (selectedConflicts: string[]) => void;
}

export function ConflictSelector({ className, onConflictChange }: ConflictSelectorProps) {
  const selectedConflicts = useAppStore((s) => s.selectedConflicts);
  const toggleConflict = useAppStore((s) => s.toggleConflict);

  const handleToggle = useCallback(
    (conflictId: string) => {
      toggleConflict(conflictId);

      // Compute the next selection state so the callback receives the updated list
      const next = selectedConflicts.includes(conflictId)
        ? selectedConflicts.filter((id) => id !== conflictId)
        : [...selectedConflicts, conflictId];

      onConflictChange?.(next);
    },
    [selectedConflicts, toggleConflict, onConflictChange],
  );

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-secondary/50 p-4 space-y-4',
        className,
      )}
    >
      {/* Header */}
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Shield className="h-5 w-5 text-gold" />
          Which conflicts/deployments apply to this service period?
        </h3>
        <p className="text-sm text-muted-foreground">Select all that apply</p>
      </div>

      {/* Conflict list */}
      <div className="space-y-1">
        {CONFLICTS.map((conflict) => {
          const isChecked = selectedConflicts.includes(conflict.id);

          return (
            <label
              key={conflict.id}
              htmlFor={`conflict-${conflict.id}`}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 cursor-pointer transition-colors duration-150',
                isChecked
                  ? 'bg-gold/10 border border-gold/25'
                  : 'border border-transparent hover:bg-accent/60',
              )}
            >
              <Checkbox
                id={`conflict-${conflict.id}`}
                checked={isChecked}
                onCheckedChange={() => handleToggle(conflict.id)}
              />

              <div className="flex-1 min-w-0">
                <span
                  className={cn(
                    'text-sm font-medium block truncate',
                    isChecked ? 'text-gold' : 'text-foreground',
                  )}
                >
                  {conflict.name}
                </span>

                {conflict.dateRange && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Calendar className="h-3 w-3 shrink-0" />
                    {conflict.dateRange}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Selection summary */}
      {selectedConflicts.length > 0 && (
        <p className="text-xs text-muted-foreground border-t border-border/50 pt-3">
          <span className="font-medium text-gold">{selectedConflicts.length}</span>{' '}
          {selectedConflicts.length === 1 ? 'conflict' : 'conflicts'} selected
        </p>
      )}
    </div>
  );
}

export default ConflictSelector;
