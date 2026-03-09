/**
 * EvidenceStrengthCard — Per-condition side-by-side comparison:
 * LEFT = "Your documented evidence" (symptom frequency, severity, medications)
 * RIGHT = "VA rating criteria" (from ratingCriteriaData). Keyword matches
 * highlighted green, gaps in amber.
 *
 * Compliance: "Preparation tool showing documented evidence vs published criteria.
 * Ratings determined solely by VA."
 */
import { useEvidenceStrength } from '@/hooks/useEvidenceStrength';
import { cn } from '@/lib/utils';
import { BarChart3, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface Props {
  conditionName: string;
  conditionId?: string;
}

export function EvidenceStrengthCard({ conditionName, conditionId }: Props) {
  const evidence = useEvidenceStrength(conditionName, conditionId);

  if (!evidence.hasRatingCriteria && evidence.dataPoints.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-gold" />
        <h3 className="text-sm font-bold text-foreground">Evidence vs. VA Criteria</h3>
      </div>

      {/* Your Evidence Data */}
      {evidence.dataPoints.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Documented Evidence</p>
          <div className="space-y-1.5">
            {evidence.dataPoints.map((dp, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-foreground">{dp.label}:</span>{' '}
                  <span className="text-muted-foreground">{dp.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Criteria Match */}
      {evidence.hasRatingCriteria && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">VA Rating Criteria Alignment</p>
          <div className="space-y-2">
            {evidence.criteriaMatches
              .filter((cm) => cm.matchStrength !== 'none')
              .slice(0, 3)
              .map((cm, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-2.5 rounded-xl border text-xs',
                    cm.matchStrength === 'strong'
                      ? 'border-green-500/20 bg-green-500/5'
                      : 'border-gold/20 bg-gold/5',
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{cm.percentage}% Level</span>
                    <span
                      className={cn(
                        'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                        cm.matchStrength === 'strong'
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-gold/10 text-gold',
                      )}
                    >
                      {cm.matchStrength === 'strong' ? 'Strong match' : 'Partial match'}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 mb-1.5">{cm.description}</p>
                  {cm.matchedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {cm.matchedKeywords.slice(0, 5).map((kw) => (
                        <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                  {cm.unmatchedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cm.unmatchedKeywords.slice(0, 3).map((kw) => (
                        <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/10 text-gold flex items-center gap-0.5">
                          <AlertCircle className="h-2.5 w-2.5" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
        <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground">
          Preparation tool showing documented evidence vs published criteria. Ratings determined solely by VA.
        </p>
      </div>
    </div>
  );
}
