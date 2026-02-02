import { useState, useMemo } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { ApprovedCondition, BodyPart } from '@/types/claims';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Calculator, Plus, Trash2, Info, AlertTriangle, TrendingUp, Award, ArrowRight, DollarSign } from 'lucide-react';
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

  for (const [partType, partConditions] of Object.entries(partGroups)) {
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
  const approvedConditions = data.approvedConditions || [];
  
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
  const itfDeadline = data.deadlines?.find(d => d.type === 'intent_to_file');
  const itfDate = itfDeadline?.date 
    ? format(addDays(parseISO(itfDeadline.date), -365), 'yyyy-MM-dd')
    : null;
  const backPayMonths = itfDate ? differenceInMonths(new Date(), parseISO(itfDate)) : 0;
  const estimatedBackPay = monthlyIncrease > 0 && backPayMonths > 0 ? monthlyIncrease * backPayMonths : 0;

  const hasApprovedConditions = approvedConditions.length > 0;

  return (
    <Card className="data-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
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
        <CardDescription>
          {hasApprovedConditions 
            ? "See how adding new conditions affects your rating"
            : "Calculate what your combined rating could be"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Disclaimer */}
        <div className="p-3 bg-muted/50 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This calculator shows how VA combined ratings math works. Your actual VA rating will be determined by the VA based on your complete medical record and C&P examination findings.
          </p>
        </div>

        {/* Current Approved Conditions */}
        {hasApprovedConditions && (
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Your Current Rating</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-success">{currentResult.official}%</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(currentMonthly)}/mo</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                {approvedConditions.length} approved condition{approvedConditions.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        )}

        {/* Add New Conditions */}
        <div className="space-y-3">
          <p className="text-sm font-medium flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            {hasApprovedConditions ? "Add Projected New Conditions" : "Add Conditions to Calculate"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Condition name"
              value={newConditionName}
              onChange={(e) => setNewConditionName(e.target.value)}
              className="flex-1"
            />
            <Select value={newConditionRating} onValueChange={setNewConditionRating}>
              <SelectTrigger className="w-full sm:w-[120px]">
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
          
          <div className="flex flex-col sm:flex-row gap-2">
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
            <Button onClick={addNewCondition} disabled={!newConditionName || !newConditionRating} className="gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* New Conditions List */}
        {newConditions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">New conditions to calculate:</p>
            {newConditions.map((condition) => (
              <div
                key={condition.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-primary/5 border-primary/20"
              >
                <div className="flex-1">
                  <span className="font-medium text-sm">{condition.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({bodyPartOptions.find(bp => bp.value === condition.bodyPart)?.label})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono px-2">
                    {condition.rating}%
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeNewCondition(condition.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
          <div className="space-y-4 pt-4 border-t">
            <Alert className="border-warning/50 bg-warning/10">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-sm">
                <strong>ESTIMATE ONLY</strong> - This is NOT an official VA determination.
              </AlertDescription>
            </Alert>

            {hasApprovedConditions ? (
              /* Comparison View */
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Current</p>
                    <p className="text-2xl font-bold">{currentResult.official}%</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-1">Projected</p>
                    <p className="text-2xl font-bold text-primary">{projectedResult.official}%</p>
                  </div>
                </div>

                {monthlyIncrease > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Monthly Increase</p>
                      <p className="text-xl font-bold text-success">+{formatCurrency(monthlyIncrease)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Yearly Increase</p>
                      <p className="text-xl font-bold text-success">+{formatCurrency(monthlyIncrease * 12)}</p>
                    </div>
                  </div>
                )}

                {/* Back Pay Estimate */}
                {estimatedBackPay > 0 && itfDate && (
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Potential Back Pay</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(estimatedBackPay)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on {backPayMonths} months from ITF date ({format(parseISO(itfDate), 'MMM d, yyyy')})
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* New Calculation View */
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Exact Combined</p>
                  <p className="text-2xl font-bold">{projectedResult.exact.toFixed(2)}%</p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Rating</p>
                  <p className="text-3xl font-bold text-primary">{projectedResult.official}%</p>
                </div>
              </div>
            )}

            {/* Compensation Info */}
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm font-medium mb-2">Monthly Compensation (2026 rates)</p>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">At {projectedResult.official}%:</span>
                <span className="font-bold text-lg">{formatCurrency(monthlyCompensation[projectedResult.official] || 0)}/mo</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {newConditions.length === 0 && !hasApprovedConditions && (
          <div className="text-center py-6 text-muted-foreground">
            <Calculator className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Add conditions above to calculate your combined rating</p>
          </div>
        )}

        {/* Reference Table */}
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-3">2026 Compensation Reference</p>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {[10, 30, 50, 70, 100].map((rating) => (
              <div
                key={rating}
                className="p-2 rounded-lg border bg-muted/30 text-center"
              >
                <p className="font-semibold">{rating}%</p>
                <p className="text-muted-foreground">{formatCurrency(monthlyCompensation[rating])}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
