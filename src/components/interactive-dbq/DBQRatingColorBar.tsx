import { cn } from '@/lib/utils';
import { getRatingColor } from '@/utils/ratingColors';

interface DBQRatingColorBarProps {
  availablePercents: number[];
  activePercent?: number | null;
  confidence?: 'high' | 'medium' | 'low';
}

export function DBQRatingColorBar({ availablePercents, activePercent, confidence }: DBQRatingColorBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {availablePercents.map((pct) => {
          const color = getRatingColor(pct);
          const isActive = activePercent === pct;
          return (
            <div
              key={pct}
              className={cn(
                'flex-1 h-2 rounded-full transition-all duration-300',
                isActive ? 'ring-2 ring-offset-1 ring-offset-background scale-y-150' : 'opacity-30',
                activePercent == null && 'opacity-50',
              )}
              style={{ backgroundColor: color.hex, ...(isActive ? { boxShadow: `0 0 8px ${color.hex}40` } : {}) }}
              title={`${pct}% — ${color.label}`}
            />
          );
        })}
      </div>
      {activePercent != null && (
        <div className="flex items-center justify-between text-xs">
          <span className={getRatingColor(activePercent).textClass}>
            {activePercent}% — {getRatingColor(activePercent).label}
          </span>
          {confidence && (
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded-full',
              confidence === 'high' && 'bg-emerald-500/10 text-emerald-400',
              confidence === 'medium' && 'bg-amber-500/10 text-amber-400',
              confidence === 'low' && 'bg-zinc-500/10 text-zinc-400',
            )}>
              {confidence} confidence
            </span>
          )}
        </div>
      )}
    </div>
  );
}
