import { useState, useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { BodyPart } from '@/types/claims';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Calculator, Plus, Trash2, Info, AlertTriangle, Award, ArrowRight, DollarSign, Sparkles } from 'lucide-react';
import { format, differenceInMonths, parseISO, subYears } from 'date-fns';
import { COMP_RATES_2026 } from '@/data/compRates2026';

// 2026 VA compensation rates (single veteran, no dependents)
const monthlyCompensation: Record<number, number> = { 0: 0, ...COMP_RATES_2026 };

const commonRatings = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const bodyPartOptions: { value: BodyPart; label: string }[] = [
  { value: 'other', label: 'Other / Non-extremity' },
  { value: 'left_arm', label: 'Left Arm' },
  { value: 'right_arm', label: 'Right Arm' },
  { value: 'left_leg', label: 'Left Leg' },
  { value: 'right_leg', label: 'Right Leg' },
  { value: 'left_hand', label: 'Left Hand' },
  { value: 'right_hand', label: 'Right Hand' },
  { value: 'left_foot', label: 'Left Foot' },
  { value: 'right_foot', label: 'Right Foot' },
  { value: 'left_knee', label: 'Left Knee' },
  { value: 'right_knee', label: 'Right Knee' },
  { value: 'left_hip', label: 'Left Hip' },
  { value: 'right_hip', label: 'Right Hip' },
  { value: 'left_shoulder', label: 'Left Shoulder' },
  { value: 'right_shoulder', label: 'Right Shoulder' },
  { value: 'left_elbow', label: 'Left Elbow' },
  { value: 'right_elbow', label: 'Right Elbow' },
  { value: 'left_ankle', label: 'Left Ankle' },
  { value: 'right_ankle', label: 'Right Ankle' },
  { value: 'left_wrist', label: 'Left Wrist' },
  { value: 'right_wrist', label: 'Right Wrist' },
];

interface RatedCondition {
  id: string;
  name: string;
  rating: number;
  bodyPart: BodyPart;
}

function calculateCombinedRating(conditions: RatedCondition[]): { exact: number; official: number; hasBilateral: boolean } {
  const ratings = conditions.filter(c => c.rating > 0);
  if (ratings.length === 0) return { exact: 0, official: 0, hasBilateral: false };

  // Find bilateral conditions
  const bilateralConditions: RatedCondition[] = [];
  const nonBilateralConditions: RatedCondition[] = [];
  const partGroups: Record<string, RatedCondition[]> = {};

  for (const condition of ratings) {
    if (condition.bodyPart === 'other') {
      nonBilateralConditions.push(condition);
      continue;
    }
    const partType = condition.bodyPart.replace('left_', '').replace('right_', '');
    if (!partGroups[partType]) partGroups[partType] = [];
    partGroups[partType].push(condition);
  }

  for (const [_partType, partConditions] of Object.entries(partGroups)) {
    const hasLeft = partConditions.some(c => c.bodyPart.startsWith('left_'));
    const hasRight = partConditions.some(c => c.bodyPart.startsWith('right_'));
    if (hasLeft && hasRight) {
      bilateralConditions.push(...partConditions);
    } else {
      nonBilateralConditions.push(...partConditions);
    }
  }

  const hasBilateral = bilateralConditions.length > 0;
  let bilateralCombined = 0;

  if (hasBilateral) {
    const bilateralRatings = bilateralConditions.map(c => c.rating).sort((a, b) => b - a);
    let remaining = 100;
    bilateralRatings.forEach(rating => {
      remaining = remaining - (remaining * (rating / 100));
    });
    bilateralCombined = (100 - remaining) * 1.10; // 10% bilateral factor
  }

  // Combine all ratings
  let allRatings = bilateralCombined > 0 ? [bilateralCombined] : [];
  allRatings.push(...nonBilateralConditions.map(c => c.rating));
  allRatings = allRatings.sort((a, b) => b - a);

  let remaining = 100;
  allRatings.forEach(rating => {
    remaining = remaining - (remaining * (rating / 100));
  });

  const exact = 100 - remaining;
  const official = Math.round(exact / 10) * 10;
  return { exact, official, hasBilateral };
}

export function EnhancedRatingCalculator() {
  const { data } = useClaims();
  const approvedConditions = useMemo(() => data.approvedConditions ?? [], [data.approvedConditions]);
  
  const [newConditions, setNewConditions] = useState<RatedCondition[]>([]);
  const [newConditionName, setNewConditionName] = useState('');
  const [newConditionRating, setNewConditionRating] = useState('');
  const [newConditionBodyPart, setNewConditionBodyPart] = useState<BodyPart>('other');

  // Calculate current rating from approved conditions
  const currentResult = useMemo(() => {
    const asRated = approvedConditions.map(c => ({
      id: c.id,
      name: c.name,
      rating: c.rating,
      bodyPart: c.bodyPart,
    }));
    return calculateCombinedRating(asRated);
  }, [approvedConditions]);

  // Calculate combined with new conditions
  const projectedResult = useMemo(() => {
    const allConditions = [
      ...approvedConditions.map(c => ({
        id: c.id,
        name: c.name,
        rating: c.rating,
        bodyPart: c.bodyPart,
      })),
      ...newConditions,
    ];
    return calculateCombinedRating(allConditions);
  }, [approvedConditions, newConditions]);

  const addNewCondition = () => {
    if (!newConditionName || !newConditionRating) return;
    
    setNewConditions(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: newConditionName,
        rating: parseInt(newConditionRating),
        bodyPart: newConditionBodyPart,
      },
    ]);
    setNewConditionName('');
    setNewConditionRating('');
    setNewConditionBodyPart('other');
  };

  const removeNewCondition = (id: string) => {
    setNewConditions(prev => prev.filter(c => c.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const currentMonthly = monthlyCompensation[currentResult.official] || 0;
  const projectedMonthly = monthlyCompensation[projectedResult.official] || 0;
  const monthlyIncrease = projectedMonthly - currentMonthly;

  // Back pay estimation
  // The stored deadline date is the ITF expiration (1 year after filing).
  // Subtract exactly 1 year to recover the effective filing date.
  const itfDeadline = data.deadlines?.find(d => d.type === 'intent_to_file');
  const itfEffectiveDate = itfDeadline?.date
    ? subYears(parseISO(itfDeadline.date), 1)
    : null;
  const itfDate = itfEffectiveDate ? format(itfEffectiveDate, 'yyyy-MM-dd') : null;
  // Months of back pay = current date minus effective date (positive when effective date is in the past)
  const backPayMonths = itfEffectiveDate ? differenceInMonths(new Date(), itfEffectiveDate) : 0;
  const estimatedBackPay = monthlyIncrease > 0 && backPayMonths > 0 ? monthlyIncrease * backPayMonths : 0;

  const hasApprovedConditions = approvedConditions.length > 0;

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-b from-card to-card/95">
      {/* Premium Header */}
      <CardHeader className="pb-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="calculator-icon">
            <Calculator className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              VA Combined Rating Calculator
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="mb-2">
                    <strong>VA Math:</strong> Each disability is applied to what's "left" of 100%, not simple addition.
                  </p>
                  <p>
                    <strong>Bilateral Factor:</strong> If you have disabilities affecting both paired extremities, VA adds 10% to that combined rating.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription className="mt-0.5">
              {hasApprovedConditions 
                ? "See how adding new conditions affects your rating"
                : "Calculate what your combined rating could be"
              }
            </CardDescription>
          </div>
          <Badge variant="secondary" className="hidden sm:flex gap-1 items-center">
            <Sparkles className="h-3 w-3" />
            2026 Rates
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        {/* Disclaimer */}
        <div className="p-3 bg-muted/50 border border-border rounded-xl">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This calculator shows how VA combined ratings math works. Your actual VA rating will be determined by the VA based on your complete medical record and C&P examination findings.
          </p>
        </div>

        {/* Current Approved Conditions */}
        {hasApprovedConditions && (
          <div className="result-card-success animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-success" />
              <span className="text-sm font-semibold">Your Current Rating</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold result-number-success number-animate">{currentResult.official}%</p>
                <p className="text-sm text-muted-foreground mt-1">{formatCurrency(currentMonthly)}/mo</p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-success/10 border-success/30 text-success">
                  {approvedConditions.length} approved condition{approvedConditions.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Add New Conditions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-semibold">
              {hasApprovedConditions ? "Add Projected New Conditions" : "Add Conditions to Calculate"}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Condition name (e.g., PTSD, Tinnitus)"
              value={newConditionName}
              onChange={(e) => setNewConditionName(e.target.value)}
              className="flex-1"
            />
            <Select value={newConditionRating} onValueChange={setNewConditionRating}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Rating %" />
              </SelectTrigger>
              <SelectContent>
                {commonRatings.filter(r => r > 0).map((r) => (
                  <SelectItem key={r} value={r.toString()}>
                    {r}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={newConditionBodyPart} onValueChange={(v) => setNewConditionBodyPart(v as BodyPart)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Body part (for bilateral)" />
              </SelectTrigger>
              <SelectContent>
                {bodyPartOptions.map((bp) => (
                  <SelectItem key={bp.value} value={bp.value}>
                    {bp.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={addNewCondition} 
              disabled={!newConditionName || !newConditionRating} 
              className="gap-2 min-w-[100px]"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* New Conditions List */}
        {newConditions.length > 0 && (
          <div className="space-y-2 animate-fade-in">
            <p className="text-xs text-muted-foreground font-medium">New conditions to calculate:</p>
            {newConditions.map((condition, index) => (
              <div
                key={condition.id}
                className="flex items-center justify-between p-4 border rounded-xl bg-primary/5 border-primary/20 transition-all duration-200 hover:border-primary/40"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm">{condition.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({bodyPartOptions.find(bp => bp.value === condition.bodyPart)?.label})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="font-mono px-3 bg-primary/20 text-primary border-0">
                    {condition.rating}%
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeNewCondition(condition.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label="Remove condition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projected Result */}
        {(newConditions.length > 0 || !hasApprovedConditions) && (
          <div className="space-y-4 pt-4 border-t border-border result-reveal">
            <Alert className="border-warning/40 bg-gradient-to-br from-warning/10 to-transparent">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-sm">
                <strong>ESTIMATE ONLY</strong> - This is NOT an official VA determination.
              </AlertDescription>
            </Alert>

            {hasApprovedConditions ? (
              /* Comparison View */
              <div className="space-y-4">
                {/* Rating Comparison */}
                <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center">
                  <div className="text-center p-4 bg-muted/50 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Current</p>
                    <p className="text-3xl font-bold number-display">{currentResult.official}%</p>
                  </div>
                  <div className="flex justify-center">
                    <div className="p-2 rounded-full bg-primary/10">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="result-card-primary text-center">
                    <p className="text-xs text-muted-foreground mb-1">Projected</p>
                    <p className="text-3xl font-bold result-number-primary number-animate">{projectedResult.official}%</p>
                  </div>
                </div>

                {monthlyIncrease > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="result-card-success text-center">
                      <p className="text-xs text-muted-foreground mb-1">Monthly Increase</p>
                      <p className="text-2xl font-bold result-number-success number-animate">+{formatCurrency(monthlyIncrease)}</p>
                    </div>
                    <div className="result-card-success text-center">
                      <p className="text-xs text-muted-foreground mb-1">Yearly Increase</p>
                      <p className="text-2xl font-bold result-number-success number-animate">+{formatCurrency(monthlyIncrease * 12)}</p>
                    </div>
                  </div>
                )}

                {/* Back Pay Estimate */}
                {estimatedBackPay > 0 && itfDate && (
                  <div className="result-card-primary">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-primary/20">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold">Potential Back Pay</span>
                    </div>
                    <p className="text-3xl font-bold result-number-primary number-animate">{formatCurrency(estimatedBackPay)}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Based on {backPayMonths} months from ITF date ({format(parseISO(itfDate), 'MMM d, yyyy')})
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* New Calculation View */
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-5 bg-muted/50 rounded-xl border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Exact Combined</p>
                  <p className="text-2xl font-bold number-display">{projectedResult.exact.toFixed(2)}%</p>
                </div>
                <div className="result-card-primary text-center">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Rating</p>
                  <p className="text-4xl font-bold result-number-primary number-animate">{projectedResult.official}%</p>
                </div>
              </div>
            )}

            {/* Compensation Info */}
            <div className="comparison-row">
              <span className="text-muted-foreground">Monthly Compensation at {projectedResult.official}%:</span>
              <span className="font-bold text-lg">{formatCurrency(monthlyCompensation[projectedResult.official] || 0)}/mo</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {newConditions.length === 0 && !hasApprovedConditions && (
          <div className="text-center py-10 text-muted-foreground">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50 mb-4">
              <Calculator className="h-8 w-8 opacity-40" />
            </div>
            <p className="text-sm">Add conditions above to calculate your combined rating</p>
          </div>
        )}

        {/* Reference Table */}
        <div className="pt-5 border-t border-border">
          <p className="text-sm font-semibold mb-3">2026 Compensation Reference</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((rating, index) => (
              <div
                key={rating}
                className={`p-3 rounded-xl border text-center transition-all duration-200 hover:scale-[1.02] cursor-default ${
                  projectedResult.official === rating
                    ? 'result-card-primary border-primary/30'
                    : 'bg-muted/30 border-border hover:border-primary/20'
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <p className="text-sm font-bold">{rating}%</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatCurrency(monthlyCompensation[rating])}/mo
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
