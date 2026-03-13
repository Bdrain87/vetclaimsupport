/**
 * Intel Insights Card — Collapsible card showing ClaimIntelligence insights
 * for a specific context (condition, page, etc).
 *
 * Data comes from ClaimIntelligence methods (all local, no API calls, instant).
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InsightItem {
  label: string;
  value: string;
  route?: string;
}

interface IntelInsightsCardProps {
  title?: string;
  readinessScore?: number;
  insights: InsightItem[];
  tips?: string[];
  className?: string;
  defaultExpanded?: boolean;
}

export function IntelInsightsCard({
  title = 'Intel Insights',
  readinessScore,
  insights,
  tips,
  className,
  defaultExpanded = false,
}: IntelInsightsCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const navigate = useNavigate();

  if (insights.length === 0 && !tips?.length && readinessScore == null) return null;

  const scoreColor =
    readinessScore != null
      ? readinessScore >= 70
        ? 'text-green-400'
        : readinessScore >= 40
          ? 'text-gold'
          : 'text-red-400'
      : '';

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card overflow-hidden',
        className,
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Brain className="h-4 w-4 text-gold shrink-0" />
          <span className="text-sm font-semibold text-foreground truncate">{title}</span>
          {readinessScore != null && (
            <span className={cn('text-sm font-bold', scoreColor)}>
              {readinessScore}%
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {insights.map((item, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start justify-between gap-2 text-xs',
                item.route && 'cursor-pointer hover:bg-accent/50 -mx-1 px-1 py-1 rounded-lg transition-colors',
              )}
              onClick={item.route ? () => navigate(item.route!) : undefined}
            >
              <span className="text-muted-foreground">{item.label}</span>
              <div className="flex items-center gap-1 text-right shrink-0">
                <span className="text-foreground font-medium">{item.value}</span>
                {item.route && <ArrowRight className="h-3 w-3 text-gold" />}
              </div>
            </div>
          ))}

          {tips && tips.length > 0 && (
            <div className="pt-1 border-t border-border space-y-1">
              {tips.map((tip, i) => (
                <p key={i} className="text-[11px] text-muted-foreground leading-relaxed">
                  💡 {tip}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
