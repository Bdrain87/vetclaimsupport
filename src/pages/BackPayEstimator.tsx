import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calculator, DollarSign, Calendar, Users, Info, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { exportBackPayEstimate } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { PageContainer } from '@/components/PageContainer';
import {
  BASE_RATES,
  DEPENDENCY_THRESHOLD,
  calculateMonthlyCompensation,
  monthsBetween,
  formatCurrency,
  formatCurrencyExact,
} from '@/utils/backPayCalc';
import {
  SPOUSE_ADDITION_BY_RATING,
  CHILD_ADDITION_BY_RATING,
  SCHOOL_CHILD_ADDITION_BY_RATING,
  PARENT_ADDITION_BY_RATING,
} from '@/data/compRates2026';

const RATING_OPTIONS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const COUNT_OPTIONS = Array.from({ length: 11 }, (_, i) => i);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BackPayEstimator() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [effectiveDate, setEffectiveDate] = useState('');
  const [currentRating, setCurrentRating] = useState<string>('');
  const [newRating, setNewRating] = useState<string>('');
  const [hasSpouse, setHasSpouse] = useState(false);
  const [childrenUnder18, setChildrenUnder18] = useState<string>('0');
  const [childrenInSchool, setChildrenInSchool] = useState<string>('0');
  const [dependentParents, setDependentParents] = useState<string>('0');
  const [exporting, setExporting] = useState(false);

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

    const under18 = parseInt(childrenUnder18, 10) || 0;
    const inSchool = parseInt(childrenInSchool, 10) || 0;
    const parents = parseInt(dependentParents, 10) || 0;
    const months = monthsBetween(startDate, today);

    const monthlyBefore = calculateMonthlyCompensation(currentRatingNum, hasSpouse, under18, inSchool, parents);
    const monthlyAfter = calculateMonthlyCompensation(newRatingNum, hasSpouse, under18, inSchool, parents);
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
  }, [effectiveDate, currentRating, newRating, hasSpouse, childrenUnder18, childrenInSchool, dependentParents]);

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
        <div className="p-3 rounded-xl bg-gold/10 shrink-0">
          <DollarSign className="h-6 w-6 text-gold" />
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
            <div className="flex items-center gap-2 text-foreground text-sm bg-gold/10 border border-gold/20 rounded-xl px-4 py-3">
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
              Dependents affect compensation at {DEPENDENCY_THRESHOLD}% and above.
            </p>

            {/* Spouse */}
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Children under 18 */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Children under 18
                </Label>
                <Select value={childrenUnder18} onValueChange={setChildrenUnder18}>
                  <SelectTrigger>
                    <SelectValue placeholder="0" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNT_OPTIONS.map((count) => (
                      <SelectItem key={count} value={String(count)}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Children 18-23 in school */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Children 18-23 in school
                </Label>
                <Select value={childrenInSchool} onValueChange={setChildrenInSchool}>
                  <SelectTrigger>
                    <SelectValue placeholder="0" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNT_OPTIONS.map((count) => (
                      <SelectItem key={count} value={String(count)}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dependent parents */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Dependent parents
                </Label>
                <Select value={dependentParents} onValueChange={setDependentParents}>
                  <SelectTrigger>
                    <SelectValue placeholder="0" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNT_OPTIONS.slice(0, 3).map((count) => (
                      <SelectItem key={count} value={String(count)}>
                        {count}
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
              <DollarSign className="h-5 w-5 text-gold" />
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
                <p className="text-xl font-bold text-success">
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
            <div className="bg-success/10 border border-success/20 rounded-xl p-5 text-center space-y-2">
              <p className="text-sm text-success uppercase tracking-wide font-semibold">
                Total Estimated Back Pay
              </p>
              <p className="text-4xl font-bold text-success">
                {formatCurrency(calculation.totalBackPay)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCurrencyExact(calculation.monthlyDifference)} &times; {calculation.months} month{calculation.months !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Download PDF */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="gap-2"
                disabled={exporting}
                onClick={async () => {
                  if (calculation) {
                    setExporting(true);
                    try {
                      await exportBackPayEstimate({
                        currentRating: parseInt(currentRating, 10),
                        newRating: parseInt(newRating, 10),
                        effectiveDate,
                        hasSpouse,
                        dependentCount: (parseInt(childrenUnder18, 10) || 0) + (parseInt(childrenInSchool, 10) || 0) + (parseInt(dependentParents, 10) || 0),
                        monthlyBefore: calculation.monthlyBefore,
                        monthlyAfter: calculation.monthlyAfter,
                        monthlyDifference: calculation.monthlyDifference,
                        totalBackPay: calculation.totalBackPay,
                        months: calculation.months,
                      });
                    } catch {
                      toast({ title: 'Export failed', variant: 'destructive' });
                    } finally {
                      setExporting(false);
                    }
                  }
                }}
              >
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {exporting ? 'Exporting...' : 'Download PDF'}
              </Button>
            </div>

            {/* Breakdown Detail */}
            <BreakdownDetail
              currentRating={parseInt(currentRating, 10)}
              newRating={parseInt(newRating, 10)}
              hasSpouse={hasSpouse}
              childrenUnder18={parseInt(childrenUnder18, 10) || 0}
              childrenInSchool={parseInt(childrenInSchool, 10) || 0}
              dependentParents={parseInt(dependentParents, 10) || 0}
              monthlyDifference={calculation.monthlyDifference}
            />
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

      <p className="text-xs text-muted-foreground/70 text-center">
        Estimate only — actual amounts determined by the VA based on your specific circumstances.
      </p>
    </PageContainer>
  );
}

// ---------------------------------------------------------------------------
// Breakdown sub-component
// ---------------------------------------------------------------------------

function BreakdownDetail({
  currentRating,
  newRating,
  hasSpouse,
  childrenUnder18,
  childrenInSchool,
  dependentParents,
  monthlyDifference,
}: {
  currentRating: number;
  newRating: number;
  hasSpouse: boolean;
  childrenUnder18: number;
  childrenInSchool: number;
  dependentParents: number;
  monthlyDifference: number;
}) {
  const atThreshold = (rating: number) => rating >= DEPENDENCY_THRESHOLD;

  return (
    <div className="bg-muted/30 rounded-xl p-4 border border-border/20 space-y-2">
      <p className="text-sm font-medium text-foreground">Calculation Breakdown</p>
      <div className="space-y-1 text-sm text-muted-foreground">
        <div className="flex justify-between gap-2">
          <span className="min-w-0">Base rate at {currentRating}%</span>
          <span className="shrink-0">{formatCurrencyExact(BASE_RATES[currentRating] ?? 0)}/mo</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="min-w-0">Base rate at {newRating}%</span>
          <span className="shrink-0">{formatCurrencyExact(BASE_RATES[newRating] ?? 0)}/mo</span>
        </div>

        {/* New rating additions */}
        {hasSpouse && atThreshold(newRating) && (
          <div className="flex justify-between gap-2">
            <span className="min-w-0">Spouse addition at {newRating}%</span>
            <span className="shrink-0">+{formatCurrencyExact(SPOUSE_ADDITION_BY_RATING[newRating] ?? 0)}/mo</span>
          </div>
        )}
        {childrenUnder18 > 0 && atThreshold(newRating) && (
          <div className="flex justify-between gap-2">
            <span className="min-w-0">
              {childrenUnder18} child{childrenUnder18 !== 1 ? 'ren' : ''} under 18 at {newRating}%
            </span>
            <span className="shrink-0">+{formatCurrencyExact(childrenUnder18 * (CHILD_ADDITION_BY_RATING[newRating] ?? 0))}/mo</span>
          </div>
        )}
        {childrenInSchool > 0 && atThreshold(newRating) && (
          <div className="flex justify-between gap-2">
            <span className="min-w-0">
              {childrenInSchool} child{childrenInSchool !== 1 ? 'ren' : ''} 18-23 in school at {newRating}%
            </span>
            <span className="shrink-0">+{formatCurrencyExact(childrenInSchool * (SCHOOL_CHILD_ADDITION_BY_RATING[newRating] ?? 0))}/mo</span>
          </div>
        )}
        {dependentParents > 0 && atThreshold(newRating) && (
          <div className="flex justify-between gap-2">
            <span className="min-w-0">
              {dependentParents} dependent parent{dependentParents !== 1 ? 's' : ''} at {newRating}%
            </span>
            <span className="shrink-0">+{formatCurrencyExact(dependentParents * (PARENT_ADDITION_BY_RATING[newRating] ?? 0))}/mo</span>
          </div>
        )}

        {/* Current rating deductions (already included) */}
        {hasSpouse && atThreshold(currentRating) && (
          <div className="flex justify-between gap-2 text-xs">
            <span className="italic min-w-0">Spouse already included at {currentRating}%</span>
            <span className="shrink-0">-{formatCurrencyExact(SPOUSE_ADDITION_BY_RATING[currentRating] ?? 0)}/mo</span>
          </div>
        )}
        {childrenUnder18 > 0 && atThreshold(currentRating) && (
          <div className="flex justify-between gap-2 text-xs">
            <span className="italic min-w-0">Children under 18 already at {currentRating}%</span>
            <span className="shrink-0">-{formatCurrencyExact(childrenUnder18 * (CHILD_ADDITION_BY_RATING[currentRating] ?? 0))}/mo</span>
          </div>
        )}
        {childrenInSchool > 0 && atThreshold(currentRating) && (
          <div className="flex justify-between gap-2 text-xs">
            <span className="italic min-w-0">Children in school already at {currentRating}%</span>
            <span className="shrink-0">-{formatCurrencyExact(childrenInSchool * (SCHOOL_CHILD_ADDITION_BY_RATING[currentRating] ?? 0))}/mo</span>
          </div>
        )}
        {dependentParents > 0 && atThreshold(currentRating) && (
          <div className="flex justify-between gap-2 text-xs">
            <span className="italic min-w-0">Dependent parents already at {currentRating}%</span>
            <span className="shrink-0">-{formatCurrencyExact(dependentParents * (PARENT_ADDITION_BY_RATING[currentRating] ?? 0))}/mo</span>
          </div>
        )}

        <div className="border-t border-border/30 pt-1 mt-1 flex justify-between gap-2 font-medium text-foreground">
          <span className="min-w-0">Net monthly difference</span>
          <span className="shrink-0">+{formatCurrencyExact(monthlyDifference)}/mo</span>
        </div>
      </div>
    </div>
  );
}
