import { useState, useMemo } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DollarSign, Calendar, Info, AlertTriangle, TrendingUp, FileText } from 'lucide-react';
import { format, differenceInMonths, parseISO, addDays } from 'date-fns';

// 2026 VA compensation rates (single veteran, no dependents)
const monthlyCompensation: Record<number, number> = {
  0: 0,
  10: 175.51,
  20: 347.14,
  30: 537.32,
  40: 773.64,
  50: 1101.71,
  60: 1395.07,
  70: 1759.14,
  80: 2044.74,
  90: 2297.14,
  100: 3937.04,
};

const commonRatings = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export function BackPayEstimator() {
  const { data } = useClaims();
  const [currentRating, setCurrentRating] = useState<string>('0');
  const [expectedRating, setExpectedRating] = useState<string>('');
  const [effectiveDateType, setEffectiveDateType] = useState<'itf' | 'custom'>('itf');
  const [customDate, setCustomDate] = useState('');

  // Get Intent to File date from deadlines if exists
  const itfDeadline = data.deadlines?.find(d => d.type === 'intent_to_file');
  // ITF deadline is 1 year from filing - calculate the filing date
  const itfDate = itfDeadline?.date 
    ? format(addDays(parseISO(itfDeadline.date), -365), 'yyyy-MM-dd')
    : null;

  const calculation = useMemo(() => {
    if (!expectedRating) return null;

    const currentRatingNum = parseInt(currentRating) || 0;
    const projectedRating = parseInt(expectedRating);
    
    const currentMonthly = monthlyCompensation[currentRatingNum] || 0;
    const projectedMonthly = monthlyCompensation[projectedRating] || 0;
    const monthlyDifference = projectedMonthly - currentMonthly;
    
    // Determine effective date
    let effectiveDate: Date | null = null;
    if (effectiveDateType === 'itf' && itfDate) {
      effectiveDate = parseISO(itfDate);
    } else if (effectiveDateType === 'custom' && customDate) {
      effectiveDate = parseISO(customDate);
    }

    if (!effectiveDate) return null;

    // Calculate months from effective date to today
    const today = new Date();
    const monthsOfBackPay = differenceInMonths(today, effectiveDate);
    
    if (monthsOfBackPay <= 0) {
      return {
        effectiveDate,
        currentRating: currentRatingNum,
        currentMonthly,
        projectedRating,
        projectedMonthly,
        monthlyDifference,
        monthsOfBackPay: 0,
        estimatedBackPay: 0,
        yearlyDifference: monthlyDifference * 12,
      };
    }

    // Back pay is based on the DIFFERENCE (what they should have been getting vs what they got)
    const estimatedBackPay = monthlyDifference * monthsOfBackPay;

    return {
      effectiveDate,
      currentRating: currentRatingNum,
      currentMonthly,
      projectedRating,
      projectedMonthly,
      monthlyDifference,
      monthsOfBackPay,
      estimatedBackPay,
      yearlyDifference: monthlyDifference * 12,
    };
  }, [currentRating, expectedRating, effectiveDateType, itfDate, customDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Back Pay Estimator</CardTitle>
              <CardDescription>
                Estimate potential retroactive compensation from your effective date
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p>Your <strong>effective date</strong> is typically your Intent to File (ITF) date or claim submission date. Back pay covers the period from your effective date to your decision date.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Calculate Estimate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Rating */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Current VA Rating
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Your current combined VA disability rating. Select 0% if you have no service-connected rating yet.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Select value={currentRating} onValueChange={setCurrentRating}>
              <SelectTrigger>
                <SelectValue placeholder="Select current rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0% - No current rating</SelectItem>
                {commonRatings.map((r) => (
                  <SelectItem key={r} value={r.toString()}>
                    {r}% - {formatCurrency(monthlyCompensation[r])}/month
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expected Rating */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Projected Combined Rating
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Your expected combined rating after adding new conditions. Use the Rating Calculator to estimate this.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Select value={expectedRating} onValueChange={setExpectedRating}>
              <SelectTrigger>
                <SelectValue placeholder="Select projected rating" />
              </SelectTrigger>
              <SelectContent>
                {commonRatings.filter(r => r > parseInt(currentRating || '0')).map((r) => (
                  <SelectItem key={r} value={r.toString()}>
                    {r}% - {formatCurrency(monthlyCompensation[r])}/month
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Effective Date Type */}
          <div className="space-y-2">
            <Label>Effective Date Source</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={effectiveDateType === 'itf' ? 'default' : 'outline'}
                onClick={() => setEffectiveDateType('itf')}
                className="justify-start gap-2"
                disabled={!itfDate}
              >
                <FileText className="h-4 w-4" />
                <div className="text-left">
                  <p className="text-sm font-medium">Intent to File</p>
                  {itfDate ? (
                    <p className="text-xs opacity-70">{format(parseISO(itfDate), 'MMM d, yyyy')}</p>
                  ) : (
                    <p className="text-xs opacity-70">Not set</p>
                  )}
                </div>
              </Button>
              <Button
                type="button"
                variant={effectiveDateType === 'custom' ? 'default' : 'outline'}
                onClick={() => setEffectiveDateType('custom')}
                className="justify-start gap-2"
              >
                <Calendar className="h-4 w-4" />
                <div className="text-left">
                  <p className="text-sm font-medium">Custom Date</p>
                  <p className="text-xs opacity-70">Enter manually</p>
                </div>
              </Button>
            </div>
          </div>

          {/* Custom Date Input */}
          {effectiveDateType === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customDate">Claim/ITF Filing Date</Label>
              <Input
                id="customDate"
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
          )}

          {/* No ITF Warning */}
          {effectiveDateType === 'itf' && !itfDate && (
            <Alert className="border-warning/30 bg-warning/5">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-sm">
                No Intent to File date found. Add one in <strong>Deadlines & Reminders</strong> on the Dashboard, or use a custom date.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {calculation && (
        <Card className="border-success/30 bg-success/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Compensation Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current vs Projected Comparison */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-xs text-muted-foreground mb-1">Current Monthly ({calculation.currentRating}%)</p>
                <p className="text-xl font-semibold text-foreground">
                  {formatCurrency(calculation.currentMonthly)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Projected Monthly ({calculation.projectedRating}%)</p>
                <p className="text-xl font-semibold text-primary">
                  {formatCurrency(calculation.projectedMonthly)}
                </p>
              </div>
            </div>

            {/* Monthly Difference Highlight */}
            <div className="text-center p-4 bg-success/10 rounded-xl border border-success/20">
              <p className="text-sm text-muted-foreground mb-1">Monthly Increase</p>
              <p className="text-3xl font-bold text-success">
                +{formatCurrency(calculation.monthlyDifference)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                +{formatCurrency(calculation.yearlyDifference)}/year
              </p>
            </div>

            {/* Back Pay Estimate */}
            <div className="text-center p-6 bg-background rounded-xl border">
              <p className="text-sm text-muted-foreground mb-2">Estimated Back Pay</p>
              <p className="text-4xl font-bold text-success">
                {formatCurrency(calculation.estimatedBackPay)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Based on {calculation.monthsOfBackPay} month{calculation.monthsOfBackPay !== 1 ? 's' : ''} × {formatCurrency(calculation.monthlyDifference)} difference
              </p>
            </div>

            {/* Breakdown */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-xs text-muted-foreground mb-1">Effective Date</p>
                <p className="text-lg font-semibold">
                  {format(calculation.effectiveDate, 'MMM d, yyyy')}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-xs text-muted-foreground mb-1">Months of Back Pay</p>
                <p className="text-lg font-semibold">
                  {calculation.monthsOfBackPay} month{calculation.monthsOfBackPay !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <Alert className="border-warning/50 bg-warning/10">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-sm">
                <strong>ESTIMATE ONLY</strong> - Actual back pay depends on your final VA rating, official effective date, and any deductions. This uses 2026 single veteran rates without dependents. Your situation may differ.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Compensation Table Reference */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">2026 Compensation Rates</CardTitle>
          <CardDescription>Single veteran, no dependents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {commonRatings.map((rating) => (
              <div
                key={rating}
                className={`p-3 rounded-lg border text-center ${
                  expectedRating === rating.toString()
                    ? 'bg-primary/10 border-primary'
                    : 'bg-muted/30'
                }`}
              >
                <p className="text-sm font-semibold">{rating}%</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(monthlyCompensation[rating])}/mo
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Rates increase with dependents. Visit <a href="https://www.va.gov/disability/compensation-rates/" target="_blank" rel="noopener noreferrer" className="text-primary underline">VA.gov</a> for full rate tables.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
