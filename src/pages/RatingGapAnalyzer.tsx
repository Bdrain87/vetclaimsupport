/**
 * Rating Gap Analyzer (Phase 5A)
 *
 * Compares a veteran's current ratings against the rating criteria they
 * may qualify for based on logged symptoms, medical visits, and evidence.
 * Surfaces actionable gaps and upgrade opportunities.
 */
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, AlertTriangle, ArrowRight, CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { WhatNextCard } from '@/components/shared/WhatNextCard';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useClaims } from '@/hooks/useClaims';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import { getConditionById } from '@/data/vaConditions';
import { resolveLegacyRatingCriteria } from '@/utils/dbqLookup';
import { combineRatings } from '@/utils/vaMath';
import { buildToolLink } from '@/lib/toolRouting';
import type { NextAction } from '@/utils/whatNext';

interface RatingGap {
  conditionName: string;
  conditionId: string;
  currentRating: number;
  potentialRating: number;
  nextLevelCriteria: string;
  evidenceGaps: string[];
  actions: { label: string; route: string }[];
  confidence: 'high' | 'medium' | 'low';
}

function analyzeConditionGap(
  conditionId: string,
  currentRating: number,
  symptomCount: number,
  visitCount: number,
  buddyCount: number,
): RatingGap | null {
  const displayName = getConditionDisplayName({ id: conditionId, conditionId });
  const condition = getConditionById(conditionId);

  const criteria = resolveLegacyRatingCriteria({
    id: conditionId,
    diagnosticCode: condition?.diagnosticCodes?.[0],
    diagnosticCodes: condition?.diagnosticCodes,
  });

  if (!criteria || criteria.ratingLevels.length === 0) return null;

  // Find the next rating level above current
  const sortedLevels = [...criteria.ratingLevels].sort((a, b) => a.percent - b.percent);
  const currentLevelIdx = sortedLevels.findIndex(l => l.percent >= currentRating);
  const nextLevel = currentLevelIdx >= 0 && currentLevelIdx < sortedLevels.length - 1
    ? sortedLevels[currentLevelIdx + 1]
    : null;

  if (!nextLevel) return null; // Already at max rating

  const evidenceGaps: string[] = [];
  const actions: { label: string; route: string }[] = [];

  if (symptomCount < 10) {
    evidenceGaps.push(`Only ${symptomCount} symptom entries logged (10+ recommended for strong evidence)`);
    actions.push({ label: 'Log symptoms', route: buildToolLink('symptoms', { condition: conditionId }) });
  }
  if (visitCount < 2) {
    evidenceGaps.push(`Only ${visitCount} medical visit${visitCount !== 1 ? 's' : ''} recorded (2+ recommended)`);
    actions.push({ label: 'Log medical visit', route: buildToolLink('medical-visits') });
  }
  if (buddyCount === 0) {
    evidenceGaps.push('No buddy statements requested yet');
    actions.push({ label: 'Request buddy statement', route: buildToolLink('buddy-statement', { condition: conditionId }) });
  }

  // Check next level keywords against logged data
  const keywords = nextLevel.keywords || [];
  if (keywords.length > 0) {
    evidenceGaps.push(`Document: ${keywords.slice(0, 3).join(', ')}`);
  }

  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (symptomCount >= 20 && visitCount >= 3) confidence = 'high';
  else if (symptomCount >= 10 || visitCount >= 2) confidence = 'medium';

  return {
    conditionName: displayName,
    conditionId,
    currentRating,
    potentialRating: nextLevel.percent,
    nextLevelCriteria: nextLevel.criteria,
    evidenceGaps,
    actions,
    confidence,
  };
}

export default function RatingGapAnalyzer() {
  const navigate = useNavigate();
  const { conditions } = useUserConditions();
  const { data: claimsData } = useClaims();

  const gaps = useMemo(() => {
    const results: RatingGap[] = [];

    for (const uc of conditions) {
      if (typeof uc.rating !== 'number') continue;

      const condSymptoms = (claimsData.symptoms || []).filter(
        s => s.conditionId === uc.conditionId || s.bodyArea?.toLowerCase().includes(uc.conditionId.toLowerCase())
      );
      const condVisits = (claimsData.medicalVisits || []).filter(
        v => v.conditionId === uc.conditionId
      );
      const buddyCount = (claimsData.buddyContacts || []).length;

      const gap = analyzeConditionGap(
        uc.conditionId,
        uc.rating,
        condSymptoms.length,
        condVisits.length,
        buddyCount,
      );
      if (gap) results.push(gap);
    }

    return results.sort((a, b) => (b.potentialRating - b.currentRating) - (a.potentialRating - a.currentRating));
  }, [conditions, claimsData]);

  const currentRatings = conditions
    .filter(c => typeof c.rating === 'number' && c.rating > 0)
    .map(c => c.rating!);
  const currentCombined = combineRatings(currentRatings);

  const potentialRatings = conditions
    .filter(c => typeof c.rating === 'number' && c.rating > 0)
    .map(c => {
      const gap = gaps.find(g => g.conditionId === c.conditionId);
      return gap ? gap.potentialRating : c.rating!;
    });
  const potentialCombined = combineRatings(potentialRatings);

  const ratedConditions = conditions.filter(c => typeof c.rating === 'number');
  const unratedConditions = conditions.filter(c => typeof c.rating !== 'number');

  const nextActions: NextAction[] = [];
  if (gaps.length > 0 && gaps[0].actions.length > 0) {
    nextActions.push({
      label: `Strengthen ${gaps[0].conditionName} evidence`,
      description: gaps[0].evidenceGaps[0] || 'Build stronger documentation for this condition.',
      route: gaps[0].actions[0].route,
      priority: 'high',
    });
  }
  if (unratedConditions.length > 0) {
    nextActions.push({
      label: 'Set ratings for tracked conditions',
      description: `${unratedConditions.length} condition${unratedConditions.length !== 1 ? 's' : ''} need a current rating for gap analysis.`,
      route: buildToolLink('conditions'),
      priority: 'medium',
    });
  }

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon bg-gold/10">
          <TrendingUp className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rating Gap Analyzer</h1>
          <p className="text-muted-foreground text-sm">Find upgrade opportunities based on your evidence</p>
        </div>
      </div>

      {/* Combined Rating Summary */}
      {ratedConditions.length > 0 && (
        <Card className="border-gold/20 bg-gold/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Combined Rating</span>
              {potentialCombined > currentCombined && (
                <Badge variant="outline" className="bg-gold/10 text-gold border-gold/20 text-[10px]">
                  Potential upgrade
                </Badge>
              )}
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-foreground">{currentCombined}%</span>
              {potentialCombined > currentCombined && (
                <>
                  <ArrowRight className="h-5 w-5 text-gold mb-1.5" />
                  <span className="text-4xl font-bold text-gold">{potentialCombined}%</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on {ratedConditions.length} rated condition{ratedConditions.length !== 1 ? 's' : ''}
              {unratedConditions.length > 0 && ` (${unratedConditions.length} unrated)`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {ratedConditions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No rated conditions</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
              Add your conditions and set their current VA ratings to see upgrade opportunities.
            </p>
            <Button onClick={() => navigate(buildToolLink('conditions'))}>
              Add Conditions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Gap Cards */}
      {gaps.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Upgrade Opportunities ({gaps.length})
          </h2>
          {gaps.map((gap) => (
            <Card key={gap.conditionId}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{gap.conditionName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{gap.currentRating}%</Badge>
                      <ArrowRight className="h-3 w-3 text-gold" />
                      <Badge variant="outline" className="text-xs border-gold/30 text-gold">{gap.potentialRating}%</Badge>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      gap.confidence === 'high' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      gap.confidence === 'medium' ? 'bg-gold/10 text-gold border-gold/20' :
                      'bg-muted text-muted-foreground'
                    }
                  >
                    {gap.confidence} confidence
                  </Badge>
                </div>

                {/* Next Level Criteria */}
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Criteria for {gap.potentialRating}%:</p>
                  <p className="text-xs text-foreground leading-relaxed">{gap.nextLevelCriteria}</p>
                </div>

                {/* Evidence Gaps */}
                {gap.evidenceGaps.length > 0 && (
                  <div className="space-y-1.5">
                    {gap.evidenceGaps.map((eg, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <AlertTriangle className="h-3 w-3 text-gold shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{eg}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                {gap.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {gap.actions.slice(0, 2).map((action, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(action.route)}
                        className="text-xs h-8"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Gaps Found */}
      {ratedConditions.length > 0 && gaps.length === 0 && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">No upgrades identified</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Your conditions are either at their maximum rating level or we don't have rating criteria
                data to analyze them. Keep logging symptoms and evidence to strengthen your claims.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="px-4 py-3 rounded-lg bg-gold/10 border border-gold/20">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
          <p className="text-xs text-gold/80">
            This analysis is for educational purposes only and does not guarantee a rating increase.
            Rating decisions are made by VA raters based on the totality of evidence. Consult
            a VA-accredited VSO or attorney for personalized guidance.
          </p>
        </div>
      </div>

      <WhatNextCard actions={nextActions} />
    </PageContainer>
  );
}
