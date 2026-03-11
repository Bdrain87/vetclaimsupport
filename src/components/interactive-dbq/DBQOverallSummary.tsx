import { getRatingColor } from '@/utils/ratingColors';
import { DBQRatingColorBar } from './DBQRatingColorBar';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OverallAnalysisResult } from '@/lib/interactive-dbq-prompts';

interface DBQOverallSummaryProps {
  result: OverallAnalysisResult;
  conditionName: string;
  availablePercents: number[];
}

export function DBQOverallSummary({ result, conditionName, availablePercents }: DBQOverallSummaryProps) {
  const overallColor = getRatingColor(result.overallAlignedPercent);

  return (
    <div className="space-y-4">
      {/* Overall rating alignment */}
      <div
        className="rounded-2xl border p-4 space-y-3 bg-card"
        style={{ borderColor: `${overallColor.hex}50` }}
      >
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Overall Rating Alignment</p>
          <p className={cn('text-3xl font-bold', overallColor.textClass)}>
            {result.overallAlignedPercent}%
          </p>
          <p className={cn('text-sm', overallColor.textClass)}>
            {overallColor.label} impairment
          </p>
          <p className="text-xs text-muted-foreground">{conditionName}</p>
        </div>

        <DBQRatingColorBar
          availablePercents={availablePercents}
          activePercent={result.overallAlignedPercent}
          confidence={result.overallConfidence}
        />
      </div>

      {/* Strengths */}
      {result.strengths.length > 0 && (
        <div className="rounded-2xl border border-emerald-500/20 bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Strengths
          </h3>
          <ul className="space-y-1">
            {result.strengths.map((s, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-emerald-400 shrink-0">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps */}
      {result.gaps.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Documentation Gaps
          </h3>
          <ul className="space-y-1">
            {result.gaps.map((g, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-amber-400 shrink-0">-</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Steps */}
      {result.nextSteps.length > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Next Steps
          </h3>
          <ul className="space-y-1">
            {result.nextSteps.map((n, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary shrink-0">{i + 1}.</span>
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Per-question breakdown */}
      {result.questionBreakdown.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Question Breakdown</h3>
          <div className="space-y-2">
            {result.questionBreakdown.map((qb) => {
              const qColor = getRatingColor(qb.alignedPercent);
              return (
                <div key={qb.questionIndex} className="flex items-start gap-3 text-sm">
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: qColor.hex, color: qb.alignedPercent <= 10 || qb.alignedPercent >= 60 ? '#000' : '#fff' }}
                  >
                    {qb.alignedPercent}%
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-muted-foreground">{qb.summary}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
