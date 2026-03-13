import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserConditions } from '@/hooks/useUserConditions';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import { calculateCombinedRating, getMonthlyCompensation } from '@/services/vaCompensation';
import useAppStore from '@/store/useAppStore';
import {
  Briefcase,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  XCircle,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/PageContainer';
import { IntelInsightsCard, type InsightItem } from '@/components/shared/IntelInsightsCard';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import { useClaims } from '@/hooks/useClaims';

type TDIUPathway = 'schedular' | 'extraschedular' | 'none';

interface TDIUResult {
  eligible: boolean;
  pathway: TDIUPathway;
  reason: string;
  details: string;
}

function assessTDIU(ratings: { name: string; rating: number }[]): TDIUResult {
  if (ratings.length === 0) {
    return {
      eligible: false,
      pathway: 'none',
      reason: 'No rated conditions found',
      details: 'Add your service-connected conditions with their current VA ratings to check eligibility.',
    };
  }

  const ratingValues = ratings.map((r) => r.rating);
  const combined = calculateCombinedRating(ratingValues);
  const maxSingle = Math.max(...ratingValues);
  const hasOneAt60 = ratingValues.some((r) => r >= 60);
  const hasOneAt40 = ratingValues.some((r) => r >= 40);

  // Schedular TDIU: one condition at 60%+ OR combined 70%+ with one at 40%+
  if (hasOneAt60) {
    const qualifying = ratings.filter((r) => r.rating >= 60);
    return {
      eligible: true,
      pathway: 'schedular',
      reason: 'You meet the schedular TDIU criteria',
      details: `You have ${qualifying.length > 1 ? 'conditions' : 'a condition'} rated at 60% or higher (${qualifying.map((r) => `${r.name}: ${r.rating}%`).join(', ')}). This meets the basic schedular TDIU requirement.`,
    };
  }

  if (combined >= 70 && hasOneAt40) {
    return {
      eligible: true,
      pathway: 'schedular',
      reason: 'You meet the schedular TDIU criteria',
      details: `Your combined rating is ${combined}% (70%+ required) and you have at least one condition rated at 40% or higher. This meets the schedular TDIU requirement.`,
    };
  }

  // Extraschedular: don't meet schedular but may still qualify
  if (combined >= 40) {
    return {
      eligible: false,
      pathway: 'extraschedular',
      reason: 'You may qualify for extraschedular TDIU',
      details: `You don't meet the schedular criteria, but if your service-connected conditions prevent you from maintaining substantially gainful employment, you can apply for extraschedular TDIU through a referral to the Director of Compensation Service.`,
    };
  }

  return {
    eligible: false,
    pathway: 'none',
    reason: 'You do not currently meet TDIU criteria',
    details: `Schedular TDIU requires one condition at 60%+, or a combined rating of 70%+ with one condition at 40%+. Your highest single rating is ${maxSingle}%.`,
  };
}

const EMPLOYMENT_QUESTIONS = [
  'Are you currently unable to work due to your service-connected conditions?',
  'Have you been fired or had to quit a job due to your conditions?',
  'Have you had to take a lower-paying job because of your disabilities?',
  'Do your conditions prevent you from maintaining consistent attendance?',
  'Have you been unable to complete training or education programs due to your conditions?',
];

export default function TDIUChecker() {
  const { conditions } = useUserConditions();
  const { data: claimsData } = useClaims();
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const employmentImpactEntries = useAppStore((s) => s.employmentImpactEntries);

  const approvedWithRatings = useMemo(
    () =>
      conditions
        .filter((c) => c.claimStatus === 'approved' && typeof c.rating === 'number' && c.rating > 0)
        .map((c) => ({ name: getConditionDisplayName(c), rating: c.rating as number })),
    [conditions],
  );

  const result = useMemo(() => assessTDIU(approvedWithRatings), [approvedWithRatings]);

  const tdiu100Monthly = getMonthlyCompensation(100);
  const currentRatings = approvedWithRatings.map((r) => r.rating);
  const currentCombined = calculateCombinedRating(currentRatings);
  const currentMonthly = getMonthlyCompensation(currentCombined);
  const monthlyIncrease = tdiu100Monthly - currentMonthly;

  const yesCount = Object.values(answers).filter(Boolean).length;

  // Intel Insights — aggregate readiness across all rated conditions
  const intelData = useMemo(() => {
    if (approvedWithRatings.length === 0 || !claimsData) return null;
    const conditionReadiness = approvedWithRatings.map((r) =>
      ClaimIntelligence.getConditionReadiness(r.name, claimsData),
    ).filter(Boolean);
    if (conditionReadiness.length === 0) return null;
    const avgScore = Math.round(conditionReadiness.reduce((sum, r) => sum + r!.overallScore, 0) / conditionReadiness.length);
    const allTips = conditionReadiness.flatMap((r) => r!.tips).slice(0, 5);
    const insights: InsightItem[] = [
      { label: 'Avg. evidence readiness', value: `${avgScore}%` },
      { label: 'Conditions rated', value: `${approvedWithRatings.length}` },
      { label: 'Combined rating', value: `${currentCombined}%` },
      { label: 'Work impact entries', value: `${employmentImpactEntries.length}` },
    ];
    return { score: avgScore, insights, tips: allTips };
  }, [approvedWithRatings, claimsData, currentCombined, employmentImpactEntries.length]);

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon bg-gold/10">
          <Briefcase className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">TDIU Eligibility</h1>
          <p className="text-muted-foreground text-sm">Check if you may qualify for unemployability benefits</p>
        </div>
      </div>

      {/* Explanation */}
      <Card className="border-gold/20 bg-gold/5">
        <CardContent className="p-4">
          <div className="space-y-1.5">
            <h3 className="font-semibold text-sm">What is TDIU?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Total Disability Individual Unemployability (TDIU) allows veterans to be compensated at the
              100% rate even if their combined rating is less than 100%, if their service-connected
              conditions prevent them from maintaining substantially gainful employment.
            </p>
            {monthlyIncrease > 0 && (
              <p className="text-xs text-gold font-medium mt-1">
                If approved, your monthly compensation would increase by ${monthlyIncrease.toLocaleString('en-US', { minimumFractionDigits: 2 })} to ${tdiu100Monthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}/mo.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Intel Insights */}
      {intelData && (
        <IntelInsightsCard
          title="TDIU Readiness Intel"
          readinessScore={intelData.score}
          insights={intelData.insights}
          tips={intelData.tips}
          defaultExpanded={false}
        />
      )}

      {/* Eligibility Result */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {result.eligible ? (
              <ShieldCheck className="h-6 w-6 text-success shrink-0" />
            ) : result.pathway === 'extraschedular' ? (
              <AlertTriangle className="h-6 w-6 text-gold shrink-0" />
            ) : (
              <XCircle className="h-6 w-6 text-muted-foreground shrink-0" />
            )}
            <div className="space-y-1">
              <h3 className={`text-sm font-bold ${result.eligible ? 'text-success' : result.pathway === 'extraschedular' ? 'text-gold' : 'text-foreground'}`}>
                {result.reason}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{result.details}</p>
              {result.eligible && (
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Next step:</strong> File VA Form 21-8940 (Veteran's Application for Increased
                  Compensation Based on Unemployability)
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employment Impact Data */}
      {employmentImpactEntries.length > 0 && (
        <Card className="border-gold/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" />
              Your Work Impact Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(() => {
              const now = new Date();
              const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
              const recent = employmentImpactEntries.filter(
                (e) => new Date(e.date) >= ninetyDaysAgo,
              );
              const totalHours = recent.reduce((sum, e) => sum + e.hoursLost, 0);
              const weeklyAvg = totalHours / 13; // 90 days ≈ 13 weeks
              return (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Incidents (last 90 days)</span>
                    <span className="font-bold text-foreground">{recent.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total hours lost</span>
                    <span className="font-bold text-foreground">{totalHours.toFixed(1)} hrs</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Average per week</span>
                    <span className="font-bold text-foreground">{weeklyAvg.toFixed(1)} hrs/week</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-1 border-t border-border">
                    This data from your Work Impact tracker supports your TDIU claim by documenting employment limitations.
                  </p>
                </>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Your Ratings */}
      {approvedWithRatings.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Your Rated Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {approvedWithRatings.map((r) => (
              <div key={r.name} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{r.name}</span>
                <span className={`font-bold ${r.rating >= 60 ? 'text-success' : r.rating >= 40 ? 'text-gold' : 'text-muted-foreground'}`}>
                  {r.rating}%
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">Combined Rating</span>
              <span className="font-bold text-foreground">{currentCombined}%</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">No approved conditions with ratings found.</p>
            <Link to="/claims" className="text-sm text-gold hover:text-gold/80">
              Add your conditions <ChevronRight className="h-3 w-3 inline" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Employment Impact Questions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Employment Impact Screening</CardTitle>
          <p className="text-xs text-muted-foreground">
            Answer these questions to help assess your situation. These are not official VA criteria.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {EMPLOYMENT_QUESTIONS.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setAnswers((a) => ({ ...a, [i]: !a[i] }))}
              className="w-full flex items-start gap-3 text-left"
            >
              {answers[i] ? (
                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
              )}
              <span className={`text-xs ${answers[i] ? 'text-foreground' : 'text-muted-foreground'}`}>
                {q}
              </span>
            </button>
          ))}
          {yesCount >= 3 && (
            <div className="bg-gold/10 border border-gold/20 rounded-lg p-3 mt-2">
              <p className="text-xs text-gold">
                Your answers suggest your conditions may significantly impact your employability.
                Consider discussing TDIU with your VSO or attorney.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* TDIU Requirements Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">TDIU Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2 text-xs">
            <div className="bg-muted/30 rounded-lg p-2.5">
              <p className="font-medium text-foreground">Schedular TDIU</p>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• One SC condition rated 60% or higher, OR</li>
                <li>• Combined rating of 70%+ with one condition at 40%+</li>
                <li>• Unable to maintain substantially gainful employment</li>
              </ul>
            </div>
            <div className="bg-muted/30 rounded-lg p-2.5">
              <p className="font-medium text-foreground">Extraschedular TDIU</p>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• Don't meet schedular criteria but SC conditions prevent employment</li>
                <li>• Requires referral to Director of Compensation Service</li>
                <li>• More difficult but not impossible to obtain</li>
              </ul>
            </div>
            <div className="bg-muted/30 rounded-lg p-2.5">
              <p className="font-medium text-foreground">Key Form</p>
              <p className="mt-1 text-muted-foreground">VA Form 21-8940 — Veteran's Application for Increased Compensation Based on Unemployability</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="px-4 py-3 rounded-lg bg-gold/10 border border-gold/20">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
          <p className="text-xs text-gold/80">
            This screening tool is for educational purposes only. It is not a guarantee of eligibility.
            Consult with your VSO or attorney before filing for TDIU.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
