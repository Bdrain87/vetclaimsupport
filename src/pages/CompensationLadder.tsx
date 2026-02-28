import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useClaims } from '@/hooks/useClaims';
import {
  calculateCombinedRating,
  getMonthlyCompensation,
  projectRatingIncrease,
} from '@/services/vaCompensation';
import type { DependentInfo } from '@/services/vaCompensation';
import {
  DollarSign,
  TrendingUp,
  ChevronRight,
  Users,
  Calculator,
  ArrowUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/PageContainer';

const RATING_TIERS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const WHAT_IF_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function CompensationLadder() {
  const { conditions } = useUserConditions();
  const { data } = useClaims();

  const [dependents, setDependents] = useState<DependentInfo>({
    spouse: false,
    children: 0,
    parents: 0,
  });
  const [whatIfRating, setWhatIfRating] = useState<number>(30);

  const approvedRatings = useMemo(
    () =>
      conditions
        .filter((c) => c.claimStatus === 'approved' && typeof c.rating === 'number' && c.rating > 0)
        .map((c) => c.rating as number),
    [conditions],
  );

  const currentCombined = useMemo(() => calculateCombinedRating(approvedRatings), [approvedRatings]);
  const currentMonthly = useMemo(
    () => getMonthlyCompensation(currentCombined, dependents),
    [currentCombined, dependents],
  );

  const projection = useMemo(
    () => projectRatingIncrease(approvedRatings, whatIfRating),
    [approvedRatings, whatIfRating],
  );
  const projectedMonthly = useMemo(
    () => getMonthlyCompensation(projection.projectedCombined, dependents),
    [projection.projectedCombined, dependents],
  );

  const monthlyIncrease = projectedMonthly - currentMonthly;

  return (
    <PageContainer className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon bg-emerald-500/10">
          <DollarSign className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compensation Ladder</h1>
          <p className="text-muted-foreground text-sm">Understand your VA rating and monthly pay</p>
        </div>
      </div>

      {/* Current Rating */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-muted-foreground">Your Combined Rating</p>
            <span className="text-3xl font-bold text-foreground">{currentCombined}%</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Estimated Monthly</p>
            <span className="text-xl font-bold text-emerald-400">
              ${currentMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {approvedRatings.length === 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              No approved conditions with ratings yet.{' '}
              <Link to="/claims" className="text-gold hover:text-gold/80">
                Add your conditions
              </Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dependents */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">Dependents</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">Affects compensation at 30% and above</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">Spouse</span>
            <button
              type="button"
              onClick={() => setDependents((d) => ({ ...d, spouse: !d.spouse }))}
              className={`w-10 h-6 rounded-full transition-colors ${
                dependents.spouse ? 'bg-gold' : 'bg-muted'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  dependents.spouse ? 'translate-x-[18px]' : 'translate-x-[2px]'
                }`}
              />
            </button>
          </label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Children (under 18)</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDependents((d) => ({ ...d, children: Math.max(0, (d.children ?? 0) - 1) }))}
                className="w-7 h-7 rounded-full bg-muted text-foreground text-sm flex items-center justify-center"
              >
                -
              </button>
              <span className="text-sm font-medium w-4 text-center">{dependents.children ?? 0}</span>
              <button
                type="button"
                onClick={() => setDependents((d) => ({ ...d, children: Math.min(10, (d.children ?? 0) + 1) }))}
                className="w-7 h-7 rounded-full bg-muted text-foreground text-sm flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Dependent Parents</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDependents((d) => ({ ...d, parents: Math.max(0, (d.parents ?? 0) - 1) }))}
                className="w-7 h-7 rounded-full bg-muted text-foreground text-sm flex items-center justify-center"
              >
                -
              </button>
              <span className="text-sm font-medium w-4 text-center">{dependents.parents ?? 0}</span>
              <button
                type="button"
                onClick={() => setDependents((d) => ({ ...d, parents: Math.min(2, (d.parents ?? 0) + 1) }))}
                className="w-7 h-7 rounded-full bg-muted text-foreground text-sm flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Ladder */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">Rating Tiers</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {RATING_TIERS.map((tier) => {
              const monthly = getMonthlyCompensation(tier, dependents);
              const isCurrent = tier === currentCombined;
              return (
                <div
                  key={tier}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    isCurrent
                      ? 'bg-gold/15 border border-gold/30'
                      : tier < currentCombined
                        ? 'text-muted-foreground/60'
                        : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCurrent && <ArrowUp className="h-3 w-3 text-gold" />}
                    <span className={isCurrent ? 'font-bold text-gold' : 'font-medium'}>
                      {tier}%
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] text-gold/80 uppercase tracking-wide">
                        You are here
                      </span>
                    )}
                  </div>
                  <span className={isCurrent ? 'font-bold text-gold' : 'text-muted-foreground'}>
                    ${monthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}/mo
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* What If Calculator */}
      <Card className="border-emerald-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-emerald-400" />
            <CardTitle className="text-sm">What If Calculator</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">See what happens if you add another rated condition</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">New condition rating:</p>
            <div className="flex flex-wrap gap-1.5">
              {WHAT_IF_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setWhatIfRating(r)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    whatIfRating === r
                      ? 'bg-emerald-500 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current combined</span>
              <span className="font-medium">{currentCombined}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">+ {whatIfRating}% condition</span>
              <span className="font-bold text-emerald-400">{projection.projectedCombined}%</span>
            </div>
            <div className="border-t border-emerald-500/20 pt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">New monthly</span>
              <span className="font-bold text-emerald-400">
                ${projectedMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            {monthlyIncrease > 0 && (
              <p className="text-xs text-emerald-400">
                +${monthlyIncrease.toLocaleString('en-US', { minimumFractionDigits: 2 })}/mo (${(monthlyIncrease * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}/yr)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Note about VA math */}
      <Card className="border-muted">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-1.5">How VA Math Works</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The VA doesn't add ratings together. Instead, each rating is applied to the remaining
            "non-disabled" portion of your body. For example, a 50% and a 30% doesn't equal 80% — it
            equals 65% (rounded to 70%). The first rating (50%) is applied to 100%, leaving 50%. The
            second rating (30%) is applied to that remaining 50%, adding 15% for a total of 65%.
          </p>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-[11px] text-muted-foreground/60 text-center px-4">
        Rates shown are 2025 estimates. Actual compensation may vary. Consult the VA for official rates.
      </p>
    </PageContainer>
  );
}
