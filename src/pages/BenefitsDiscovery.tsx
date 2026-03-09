import { useMemo, useState } from 'react';
import { useUserConditions } from '@/hooks/useUserConditions';
import { calculateCombinedRating } from '@/services/vaCompensation';
import { vaBenefits, benefitCategories } from '@/data/vaBenefits';
import type { VABenefit } from '@/data/vaBenefits';
import {
  Gift,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Star,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/PageContainer';

export default function BenefitsDiscovery() {
  const { conditions } = useUserConditions();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('healthcare');

  const approvedRatings = useMemo(
    () =>
      conditions
        .filter((c) => c.claimStatus === 'approved' && typeof c.rating === 'number' && c.rating > 0)
        .map((c) => c.rating as number),
    [conditions],
  );

  const currentCombined = useMemo(() => calculateCombinedRating(approvedRatings), [approvedRatings]);

  const { qualifiedBenefits, futureUnlocks } = useMemo(() => {
    const qualified: VABenefit[] = [];
    const future: VABenefit[] = [];

    for (const benefit of vaBenefits) {
      if (benefit.ratingThreshold <= currentCombined) {
        qualified.push(benefit);
      } else {
        future.push(benefit);
      }
    }

    return { qualifiedBenefits: qualified, futureUnlocks: future };
  }, [currentCombined]);

  const byCategory = useMemo(() => {
    const map = new Map<string, { qualified: VABenefit[]; locked: VABenefit[] }>();
    for (const cat of benefitCategories) {
      map.set(cat.key, {
        qualified: qualifiedBenefits.filter((b) => b.category === cat.key),
        locked: futureUnlocks.filter((b) => b.category === cat.key),
      });
    }
    return map;
  }, [qualifiedBenefits, futureUnlocks]);

  const toggleCategory = (key: string) => {
    setExpandedCategory((prev) => (prev === key ? null : key));
  };

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon bg-gold/10">
          <Gift className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Benefits Discovery</h1>
          <p className="text-muted-foreground text-sm">
            Benefits you may qualify for at {currentCombined}% combined
          </p>
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">Your Combined Rating</p>
            <span className="text-2xl font-bold text-foreground">{currentCombined}%</span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs text-muted-foreground">
                <strong className="text-foreground">{qualifiedBenefits.length}</strong> benefits available
              </span>
            </div>
            {futureUnlocks.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
                <span className="text-xs text-muted-foreground">
                  <strong className="text-foreground">{futureUnlocks.length}</strong> at higher rating
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="space-y-2">
        {benefitCategories.map((cat) => {
          const items = byCategory.get(cat.key);
          if (!items) return null;
          const total = items.qualified.length + items.locked.length;
          if (total === 0) return null;
          const isExpanded = expandedCategory === cat.key;

          return (
            <Card key={cat.key}>
              <button
                type="button"
                onClick={() => toggleCategory(cat.key)}
                className="w-full text-left"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{cat.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {items.qualified.length}/{total}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {items.qualified.map((benefit) => (
                    <BenefitCard key={benefit.id} benefit={benefit} qualified />
                  ))}
                  {items.locked.map((benefit) => (
                    <BenefitCard key={benefit.id} benefit={benefit} qualified={false} />
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* What You Unlock at 100% */}
      {currentCombined < 100 && futureUnlocks.length > 0 && (
        <Card className="border-gold/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gold">At Higher Ratings You Unlock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {[100, 60, 30, 10].map((threshold) => {
                if (threshold <= currentCombined) return null;
                const atThreshold = futureUnlocks.filter((b) => b.ratingThreshold === threshold);
                if (atThreshold.length === 0) return null;
                return (
                  <div key={threshold} className="text-xs">
                    <span className="font-medium text-gold">{threshold}%:</span>{' '}
                    <span className="text-muted-foreground">
                      {atThreshold.map((b) => b.name).join(', ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-muted-foreground/60 text-center px-4">
        Eligibility criteria are approximate. Visit va.gov or consult your VSO for official eligibility determinations.
      </p>
    </PageContainer>
  );
}

function BenefitCard({
  benefit,
  qualified,
}: {
  benefit: VABenefit;
  qualified: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-lg border p-3 ${
        qualified ? 'border-success/20 bg-success/5' : 'border-muted bg-muted/10 opacity-70'
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            {qualified ? (
              <Star className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
            ) : (
              <Lock className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-semibold text-foreground">{benefit.name}</p>
              {!qualified && benefit.ratingThreshold > 0 && (
                <p className="text-[10px] text-muted-foreground">Requires {benefit.ratingThreshold}% rating</p>
              )}
            </div>
          </div>
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-2 pl-5.5 space-y-2">
          <p className="text-[11px] text-muted-foreground leading-relaxed">{benefit.description}</p>
          <div className="bg-muted/30 rounded p-2">
            <p className="text-[10px] font-medium text-foreground mb-0.5">Eligibility</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{benefit.eligibilityCriteria}</p>
          </div>
          <a
            href={benefit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-gold hover:text-gold/80"
          >
            Learn more on VA.gov <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}
