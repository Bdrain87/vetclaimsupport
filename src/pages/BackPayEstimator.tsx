import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calculator, DollarSign, Calendar, Users, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/PageContainer';

// ---------------------------------------------------------------------------
// 2024 VA Compensation Rate Table (veteran alone, monthly)
// ---------------------------------------------------------------------------

const BASE_RATES: Record<number, number> = {
  0: 0,
  10: 171,
  20: 338,
  30: 524,
  40: 755,
  50: 1075,
  60: 1361,
  70: 1716,
  80: 1995,
  90: 2241,
  100: 3737,
};

const SPOUSE_ADDITION = 100; // additional per month at 30%+ with spouse
const DEPENDENT_ADDITION = 50; // additional per month per dependent at 30%+

const RATING_OPTIONS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const DEPENDENT_COUNT_OPTIONS = Array.from({ length: 11 }, (_, i) => i);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function calculateMonthlyCompensation(
  rating: number,
  hasSpouse: boolean,
  dependentCount: number
): number {
  const base = BASE_RATES[rating] ?? 0;
  if (rating < 30) return base;
  const spouseAdd = hasSpouse ? SPOUSE_ADDITION : 0;
  const depAdd = dependentCount * DEPENDENT_ADDITION;
  return base + spouseAdd + depAdd;
}

function monthsBetween(start: Date, end: Date): number {
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  const totalMonths = years * 12 + months;
  // Include partial month if the end day is past the start day
  const partialAdjust = end.getDate() >= start.getDate() ? 0 : -1;
  return Math.max(0, totalMonths + partialAdjust);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCurrencyExact(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BackPayEstimator() {
  const navigate = useNavigate();

  // Form state
  const [effectiveDate, setEffectiveDate] = useState('');
  const [currentRating, setCurrentRating] = useState<string>('');
  const [newRating, setNewRating] = useState<string>('');
  const [hasSpouse, setHasSpouse] = useState(false);
  const [dependentCount, setDependentCount] = useState<string>('0');

  // Derived calculations
  const calculation = useMemo(() => {
    const currentRatingNum = currentRating ? parseInt(currentRating, 10) : null;
    const newRatingNum = newRating ? parseInt(newRating, 10) : null;

    if (
      !effectiveDate ||
      currentRatingNum === null ||
      newRatingNum === null ||
      newRatingNum <= currentRatingNum
    ) {
      return null;
    }

    const startDate = new Date(effectiveDate + 'T00:00:00');
    const today = new Date();

    if (isNaN(startDate.getTime()) || startDate > today) {
      return null;
    }

    const depCount = parseInt(dependentCount, 10) || 0;
    const months = monthsBetween(startDate, today);

    const monthlyBefore = calculateMonthlyCompensation(currentRatingNum, hasSpouse, depCount);
    const monthlyAfter = calculateMonthlyCompensation(newRatingNum, hasSpouse, depCount);
    const monthlyDifference = monthlyAfter - monthlyBefore;
    const totalBackPay = monthlyDifference * months;

    return {
      monthlyBefore,
      monthlyAfter,
      monthlyDifference,
      totalBackPay,
      months,
      startDate,
    };
  }, [effectiveDate, currentRating, newRating, hasSpouse, dependentCount]);

  const isFormComplete = effectiveDate && currentRating && newRating;
  const hasValidIncrease =
    currentRating && newRating && parseInt(newRating, 10) > parseInt(currentRating, 10);

  return (
    <PageContainer className="py-6 space-y-4 animate-fade-in">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-1">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10 shrink-0">
          <DollarSign className="h-6 w-6 text-emerald-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground">Back Pay Estimator</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Estimate your potential VA disability back pay based on rating changes and effective dates.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-primary" />
            Calculator Inputs
          </CardTitle>
          <CardDescription>
            Enter your claim details to estimate potential back pay.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Effective Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Effective Date
            </Label>
            <p className="text-xs text-muted-foreground">
              The date your claim was filed or entitlement began.
            </p>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={
                'flex h-12 min-h-[48px] w-full items-center rounded-xl px-4 py-3 text-base ' +
                'bg-muted/80 text-foreground border border-border/50 ' +
                'placeholder:text-muted-foreground/50 ' +
                'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 ' +
                'transition-all duration-200'
              }
            />
          </div>

          {/* Rating Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Combined Rating */}
            <div className="space-y-2">
              <Label className="text-foreground">Current Combined Rating</Label>
              <Select value={currentRating} onValueChange={setCurrentRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select current rating" />
                </SelectTrigger>
                <SelectContent>
                  {RATING_OPTIONS.map((rating) => (
                    <SelectItem key={rating} value={String(rating)}>
                      {rating}%{rating === 0 ? ' (No rating)' : ''} &mdash; {formatCurrency(BASE_RATES[rating])}/mo
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* New Expected Combined Rating */}
            <div className="space-y-2">
              <Label className="text-foreground">New Expected Rating</Label>
              <Select value={newRating} onValueChange={setNewRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new rating" />
                </SelectTrigger>
                <SelectContent>
                  {RATING_OPTIONS.map((rating) => (
                    <SelectItem key={rating} value={String(rating)}>
                      {rating}%{rating === 0 ? ' (No rating)' : ''} &mdash; {formatCurrency(BASE_RATES[rating])}/mo
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Validation message for rating selection */}
          {currentRating && newRating && !hasValidIncrease && (
            <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3">
              <Info className="h-4 w-4 shrink-0" />
              New rating must be higher than current rating to calculate back pay.
            </div>
          )}

          {/* Dependent Information */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-foreground">
              <Users className="h-4 w-4 text-muted-foreground" />
              Dependent Information
            </Label>
            <p className="text-xs text-muted-foreground -mt-2">
              Dependents affect compensation at 30% and above.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Spouse checkbox */}
              <div className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-3 border border-border/30">
                <Checkbox
                  id="hasSpouse"
                  checked={hasSpouse}
                  onCheckedChange={(checked) => setHasSpouse(checked === true)}
                />
                <Label
                  htmlFor="hasSpouse"
                  className="text-foreground cursor-pointer select-none"
                >
                  Married (has spouse)
                </Label>
              </div>

              {/* Number of dependents */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Number of Dependents (children)
                </Label>
                <Select value={dependentCount} onValueChange={setDependentCount}>
                  <SelectTrigger>
                    <SelectValue placeholder="0" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPENDENT_COUNT_OPTIONS.map((count) => (
                      <SelectItem key={count} value={String(count)}>
                        {count} {count === 1 ? 'dependent' : 'dependents'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {calculation && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              Estimated Back Pay
            </CardTitle>
            <CardDescription>
              Based on {calculation.months} month{calculation.months !== 1 ? 's' : ''} from{' '}
              {calculation.startDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}{' '}
              to present.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Monthly Before */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border/30 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Monthly Before
                </p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrencyExact(calculation.monthlyBefore)}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {currentRating}% rating
                </Badge>
              </div>

              {/* Monthly After */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border/30 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Monthly After
                </p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrencyExact(calculation.monthlyAfter)}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {newRating}% rating
                </Badge>
              </div>

              {/* Monthly Difference */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border/30 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Monthly Difference
                </p>
                <p className="text-xl font-bold text-emerald-400">
                  +{formatCurrencyExact(calculation.monthlyDifference)}
                </p>
                <p className="text-xs text-muted-foreground">
                  per month increase
                </p>
              </div>

              {/* Months of Back Pay */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border/30 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Months of Back Pay
                </p>
                <p className="text-xl font-bold text-foreground">
                  {calculation.months}
                </p>
                <p className="text-xs text-muted-foreground">
                  months owed
                </p>
              </div>
            </div>

            {/* Total Back Pay - highlighted */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center space-y-2">
              <p className="text-sm text-emerald-400 uppercase tracking-wide font-semibold">
                Total Estimated Back Pay
              </p>
              <p className="text-4xl font-bold text-emerald-400">
                {formatCurrency(calculation.totalBackPay)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCurrencyExact(calculation.monthlyDifference)} &times; {calculation.months} month{calculation.months !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Breakdown Detail */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border/20 space-y-2">
              <p className="text-sm font-medium text-foreground">Calculation Breakdown</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Base rate at {currentRating}%</span>
                  <span>{formatCurrencyExact(BASE_RATES[parseInt(currentRating, 10)] ?? 0)}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Base rate at {newRating}%</span>
                  <span>{formatCurrencyExact(BASE_RATES[parseInt(newRating, 10)] ?? 0)}/mo</span>
                </div>
                {hasSpouse && parseInt(newRating, 10) >= 30 && (
                  <div className="flex justify-between">
                    <span>Spouse addition (30%+)</span>
                    <span>+{formatCurrencyExact(SPOUSE_ADDITION)}/mo</span>
                  </div>
                )}
                {parseInt(dependentCount, 10) > 0 && parseInt(newRating, 10) >= 30 && (
                  <div className="flex justify-between">
                    <span>
                      {dependentCount} dependent{parseInt(dependentCount, 10) !== 1 ? 's' : ''} (30%+)
                    </span>
                    <span>+{formatCurrencyExact(parseInt(dependentCount, 10) * DEPENDENT_ADDITION)}/mo</span>
                  </div>
                )}
                {hasSpouse && parseInt(currentRating, 10) >= 30 && (
                  <div className="flex justify-between text-xs">
                    <span className="italic">Spouse already included at current rating</span>
                    <span>-{formatCurrencyExact(SPOUSE_ADDITION)}/mo</span>
                  </div>
                )}
                {parseInt(dependentCount, 10) > 0 && parseInt(currentRating, 10) >= 30 && (
                  <div className="flex justify-between text-xs">
                    <span className="italic">Dependents already included at current rating</span>
                    <span>-{formatCurrencyExact(parseInt(dependentCount, 10) * DEPENDENT_ADDITION)}/mo</span>
                  </div>
                )}
                <div className="border-t border-border/30 pt-1 mt-1 flex justify-between font-medium text-foreground">
                  <span>Net monthly difference</span>
                  <span>+{formatCurrencyExact(calculation.monthlyDifference)}/mo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state when form is incomplete */}
      {!calculation && isFormComplete && hasValidIncrease && (
        <Card className="bg-card border-border">
          <CardContent className="py-8 text-center">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              Please select a valid effective date in the past to see your estimated back pay.
            </p>
          </CardContent>
        </Card>
      )}

      {!isFormComplete && (
        <Card className="bg-card border-border">
          <CardContent className="py-8 text-center">
            <Calculator className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              Fill in all fields above to see your estimated back pay calculation.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
        <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-amber-400">Disclaimer</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This is an estimate only. Actual back pay amounts are determined by the VA. Rates shown
            are approximate 2024 VA compensation rates. Your actual compensation may differ based on
            specific circumstances, rate changes, withholdings, or other factors. Dependent additions
            are simplified estimates; actual VA rates vary by rating level and number of dependents.
            Consult the VA or a Veterans Service Organization (VSO) for precise amounts.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
