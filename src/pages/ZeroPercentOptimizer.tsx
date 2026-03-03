import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp, ChevronRight, AlertTriangle,
  FileText, Stethoscope, Target, ChevronDown, ChevronUp,
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { getConditionById } from '@/data/vaConditions';
import { conditionRatingCriteria } from '@/data/ratingCriteria';
import { PageContainer } from '@/components/PageContainer';
import { cn } from '@/lib/utils';

function getUpgradePath(conditionId: string, currentRating: number) {
  const criteria = conditionRatingCriteria.find(c => c.conditionId === conditionId);
  if (!criteria) return null;

  const currentLevel = criteria.ratingLevels.find(l => l.percent === currentRating);
  const nextLevels = criteria.ratingLevels
    .filter(l => l.percent > currentRating)
    .sort((a, b) => a.percent - b.percent);

  return {
    conditionName: criteria.conditionName,
    diagnosticCode: criteria.diagnosticCode,
    currentLevel,
    nextLevels,
    examTips: criteria.examTips || [],
    commonMistakes: criteria.commonMistakes || [],
  };
}

function ConditionUpgradeCard({ conditionId, conditionName, currentRating }: {
  conditionId: string;
  conditionName: string;
  currentRating: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const upgradePath = useMemo(() => getUpgradePath(conditionId, currentRating), [conditionId, currentRating]);

  const nextLevel = upgradePath?.nextLevels[0];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base">{conditionName}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">Current: {currentRating}%</Badge>
              {nextLevel && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <Badge className="text-xs bg-success/10 text-success border-success/30">
                    Next: {nextLevel.percent}%
                  </Badge>
                </>
              )}
            </CardDescription>
          </div>
          {upgradePath && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="flex-shrink-0"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>

      {!upgradePath && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">
            Detailed rating criteria not yet available for this condition. Check the VA rating schedule for specific criteria.
          </p>
        </CardContent>
      )}

      {upgradePath && (
        <CardContent className="pt-0 space-y-4">
          {/* Current level criteria */}
          {upgradePath.currentLevel && (
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Why you may be at {currentRating}%</p>
              <p className="text-sm">{upgradePath.currentLevel.criteria}</p>
            </div>
          )}

          {/* Next level preview */}
          {nextLevel && (
            <div className="p-3 rounded-lg bg-success/5 border border-success/20">
              <p className="text-xs font-semibold text-success mb-1">
                What {nextLevel.percent}% looks like
              </p>
              <p className="text-sm">{nextLevel.criteria}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {nextLevel.keywords.map(kw => (
                  <Badge key={kw} variant="outline" className="text-[10px] border-success/30 text-success">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {expanded && (
            <>
              <Separator />

              {/* All higher levels */}
              {upgradePath.nextLevels.length > 1 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold">All rating levels above {currentRating}%</p>
                  {upgradePath.nextLevels.map(level => (
                    <div key={level.percent} className="p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{level.percent}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{level.criteria}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {level.keywords.map(kw => (
                          <Badge key={kw} variant="outline" className="text-[10px]">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Exam tips */}
              {upgradePath.examTips.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    VA Exam Tips
                  </p>
                  <ul className="space-y-1.5">
                    {upgradePath.examTips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common mistakes */}
              {upgradePath.commonMistakes.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Common Mistakes
                  </p>
                  <ul className="space-y-1.5">
                    {upgradePath.commonMistakes.map((mistake, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-warning mt-0.5">•</span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => navigate(`/claims/${conditionId}`)}
            >
              <FileText className="h-4 w-4 mr-2" />
              View Condition
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => navigate('/prep/exam')}
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Exam Prep
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function ZeroPercentOptimizer() {
  const navigate = useNavigate();
  const userConditions = useAppStore((s) => s.userConditions);

  const lowRatedConditions = useMemo(() => {
    return userConditions
      .filter(uc => uc.rating !== undefined && uc.rating <= 10)
      .map(uc => {
        const condition = getConditionById(uc.conditionId);
        return {
          id: uc.conditionId,
          name: condition?.name || uc.displayName || uc.conditionId,
          rating: uc.rating!,
        };
      })
      .sort((a, b) => a.rating - b.rating);
  }, [userConditions]);

  const zeroRated = lowRatedConditions.filter(c => c.rating === 0);
  const tenRated = lowRatedConditions.filter(c => c.rating === 10);

  return (
    <PageContainer className="py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Rating Upgrade Paths</h1>
          <p className="text-muted-foreground">See exactly what it takes to increase your rating</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/70 text-center">
        Based on VA published rating criteria. Actual ratings determined by the VA.
      </p>

      {lowRatedConditions.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center space-y-3">
            <div className="p-4 rounded-full bg-muted inline-flex">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">No conditions to optimize</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Add conditions rated at 0% or 10% to your profile to see upgrade paths with specific criteria,
              evidence recommendations, and exam tips.
            </p>
            <Button variant="outline" onClick={() => navigate('/claims')}>
              Add Conditions
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 0% Conditions */}
          {zeroRated.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Badge variant="destructive" className="text-xs">0%</Badge>
                Conditions Rated at 0%
                <Badge variant="outline" className="ml-auto">{zeroRated.length}</Badge>
              </h2>
              <p className="text-sm text-muted-foreground -mt-2">
                A 0% rating means the VA acknowledges your condition is service-connected but doesn't currently
                meet the criteria for compensable benefits. Here's what each higher rating requires.
              </p>
              {zeroRated.map(c => (
                <ConditionUpgradeCard
                  key={c.id}
                  conditionId={c.id}
                  conditionName={c.name}
                  currentRating={c.rating}
                />
              ))}
            </div>
          )}

          {/* 10% Conditions */}
          {tenRated.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Badge className={cn('text-xs', 'bg-warning/10 text-warning border-warning/30')}>10%</Badge>
                Conditions Rated at 10%
                <Badge variant="outline" className="ml-auto">{tenRated.length}</Badge>
              </h2>
              <p className="text-sm text-muted-foreground -mt-2">
                These conditions contribute minimally to your combined rating. See what evidence could support a higher evaluation.
              </p>
              {tenRated.map(c => (
                <ConditionUpgradeCard
                  key={c.id}
                  conditionId={c.id}
                  conditionName={c.name}
                  currentRating={c.rating}
                />
              ))}
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
