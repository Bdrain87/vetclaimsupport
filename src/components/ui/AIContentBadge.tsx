import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AI_COPY } from '@/data/legalCopy';

interface AIContentBadgeProps {
  className?: string;
  timestamp?: string | Date;
  variant?: 'banner' | 'inline';
}

export function AIContentBadge({ className, timestamp, variant = 'banner' }: AIContentBadgeProps) {
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  if (variant === 'inline') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-[11px] text-amber-400/80',
          className,
        )}
      >
        <Sparkles className="h-3 w-3 shrink-0" />
        <span>{AI_COPY.contentBadge}</span>
        {formattedTime && (
          <span className="text-amber-400/50 ml-1">· {formattedTime}</span>
        )}
      </span>
    );
  }

  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-lg px-3 py-2.5',
        'bg-amber-500/[0.08] border border-amber-500/20',
        className,
      )}
    >
      <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-amber-300/90 font-medium leading-relaxed">
          {AI_COPY.contentBadge}
        </p>
        {formattedTime && (
          <p className="text-[10px] text-amber-400/50 mt-0.5">
            Generated {formattedTime}
          </p>
        )}
      </div>
    </div>
  );
}
