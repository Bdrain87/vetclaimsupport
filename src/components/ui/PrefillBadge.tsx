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
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C5A442]/10 border border-[#C5A442]/20 text-[10px] text-[#C5A442] font-medium">
      <Database className="h-2.5 w-2.5" />
      Pre-filled from your data
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClear(); }}
        className="ml-0.5 hover:text-[#7A672A] transition-colors"
        aria-label="Clear pre-filled data"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}
