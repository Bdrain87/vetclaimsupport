import { X, Database } from 'lucide-react';

interface PrefillBadgeProps {
  onClear: () => void;
}

/**
 * Small indicator shown next to fields that were pre-filled from user data.
 * Includes a clear button to let the user enter data manually instead.
 */
export function PrefillBadge({ onClear }: PrefillBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-[10px] text-gold font-medium">
      <Database className="h-2.5 w-2.5" />
      Pre-filled from your data
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClear(); }}
        className="ml-0.5 hover:text-[#C8A020] transition-colors"
        aria-label="Clear pre-filled data"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}
