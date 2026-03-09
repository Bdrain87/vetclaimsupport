import { useState, useMemo } from 'react';
import { isNativeApp } from '@/lib/platform';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Scale,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getRatingCriteriaByCondition,
  type RatingLevel,
} from '@/data/vaResources/ratingCriteria';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RatingGuidanceProps {
  conditionId: string;
  conditionName?: string;
}

// ---------------------------------------------------------------------------
// RatingLevelCard
// ---------------------------------------------------------------------------

function RatingLevelCard({
  level,
  isCurrentRating = false,
}: {
  level: RatingLevel;
  isCurrentRating?: boolean;
}) {
  const pct = level.percentage;

  // Determine badge styling based on percentage tier
  const badgeClasses = cn(
    'text-sm font-bold tabular-nums min-w-14 justify-center',
    pct === 0 && 'bg-muted text-muted-foreground',
    pct > 0 && pct < 30 && 'bg-primary/15 text-foreground',
    pct >= 30 && pct < 70 && 'bg-primary/20 text-foreground',
    pct >= 70 &&
      'text-(--gold-dk) bg-(image:--gold-gradient-subtle) shadow-[inset_0_0_0_1px_var(--gold-border-strong)]',
  );

  // Gold accent ring for 70%+ cards
  const cardBorderClass = cn(
    isCurrentRating && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
    pct >= 70 && !isCurrentRating && 'border-(--gold-border-strong)',
  );

  return (
    <Card
      className={cn(
        'bg-card/80 backdrop-blur-xs border-border relative overflow-hidden',
        cardBorderClass,
      )}
    >
      {/* Subtle gold shimmer for 70%+ */}
      {pct >= 70 && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ background: 'var(--gold-gradient)' }}
        />
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Badge className={badgeClasses}>{pct}%</Badge>
          {isCurrentRating && (
            <Badge variant="outline" className="text-xs">
              Current Rating
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Criteria description */}
        <p className="text-sm leading-relaxed text-foreground/90">{level.description}</p>

        {/* Keywords */}
        {level.keywords.length > 0 && (
          <div className="space-y-1.5">
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Key Terms
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {level.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className={cn(
                    'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                    'bg-muted/60 text-muted-foreground',
                    'border border-border/50',
                  )}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Per-level exam tips */}
        {level.examTips && level.examTips.length > 0 && (
          <div className="space-y-1.5">
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              Exam Tips
            </h5>
            <ul className="space-y-1">
              {level.examTips.map((tip, idx) => (
                <li
                  key={idx}
                  className="text-xs text-muted-foreground flex items-start gap-1.5"
                >
                  <CheckCircle2 className="h-3 w-3 text-success mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Per-level common mistakes */}
        {level.commonMistakes && level.commonMistakes.length > 0 && (
          <div className="space-y-1.5">
            <h5 className="text-xs font-medium text-destructive uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Common Mistakes
            </h5>
            <ul className="space-y-1">
              {level.commonMistakes.map((mistake, idx) => (
                <li
                  key={idx}
                  className="text-xs text-muted-foreground flex items-start gap-1.5"
                >
                  <AlertTriangle className="h-3 w-3 text-destructive mt-0.5 shrink-0" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// ExamTipsSection — expandable accordion for general tips
// ---------------------------------------------------------------------------

function ExamTipsSection({ tips }: { tips: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!tips || tips.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-card/80 backdrop-blur-xs border-border">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-success" />
                General Exam Tips
              </CardTitle>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {tips.map((tip, idx) => (
                <li
                  key={idx}
                  className="text-sm flex items-start gap-2 text-foreground/80"
                >
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// ---------------------------------------------------------------------------
// RatingGuidance — Main Component
// ---------------------------------------------------------------------------

export default function RatingGuidance({ conditionId, conditionName }: RatingGuidanceProps) {
  const criteria = useMemo(() => getRatingCriteriaByCondition(conditionId), [conditionId]);

  // Fallback when no data is available
  if (!criteria) {
    return (
      <Card className="bg-card/80 backdrop-blur-xs border-border border-dashed">
        <CardContent className="py-8 text-center space-y-3">
          <Scale className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Rating criteria for{' '}
            <span className="font-medium text-foreground">
              {conditionName || conditionId}
            </span>{' '}
            are not yet available in our database. You can look up the official criteria in the VA
            Schedule for Rating Disabilities (VASRD).
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const url = 'https://www.ecfr.gov/current/title-38/chapter-I/part-4';
              if (isNativeApp) {
                const { Browser } = await import('@capacitor/browser');
                await Browser.open({ url });
              } else {
                window.open(url, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View VASRD on eCFR
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Rating Criteria
          </h3>
          <p className="text-sm text-muted-foreground">
            {criteria.conditionName} &mdash; DC {criteria.diagnosticCode}
            {criteria.bodySystem && (
              <span className="ml-1">({criteria.bodySystem})</span>
            )}
          </p>
        </div>
      </div>

      {/* Rating level cards in bento grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {criteria.ratingLevels.map((level) => (
          <RatingLevelCard key={level.percentage} level={level} />
        ))}
      </div>

      {/* General Exam Tips (expandable) */}
      <ExamTipsSection tips={criteria.generalTips} />

      {/* CFR citation */}
      <div className="flex items-center justify-between gap-4 px-1">
        <a
          href="https://www.ecfr.gov/current/title-38/chapter-I/part-4"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          38 CFR Part 4 &mdash; Schedule for Rating Disabilities
        </a>
      </div>

      {/* Educational note */}
      <p className="text-xs text-muted-foreground/70 text-center">
        Simplified summaries of 38 CFR Part 4. Actual ratings determined by the VA.
      </p>
    </div>
  );
}

export { RatingGuidance, RatingLevelCard, ExamTipsSection };
