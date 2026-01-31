import { useState, useMemo } from 'react';
import { Calculator, Plus, Trash2, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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

type BodyPart = 
  | 'left_arm' | 'right_arm' 
  | 'left_leg' | 'right_leg' 
  | 'left_hand' | 'right_hand'
  | 'left_foot' | 'right_foot'
  | 'left_knee' | 'right_knee'
  | 'left_hip' | 'right_hip'
  | 'left_shoulder' | 'right_shoulder'
  | 'left_elbow' | 'right_elbow'
  | 'left_ankle' | 'right_ankle'
  | 'left_wrist' | 'right_wrist'
  | 'other';

interface RatedCondition {
  id: string;
  name: string;
  rating: number;
  bodyPart: BodyPart;
}

const commonRatings = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const bodyPartOptions: { value: BodyPart; label: string; bilateral: boolean }[] = [
  { value: 'other', label: 'Other / Non-extremity', bilateral: false },
  { value: 'left_arm', label: 'Left Arm', bilateral: true },
  { value: 'right_arm', label: 'Right Arm', bilateral: true },
  { value: 'left_leg', label: 'Left Leg', bilateral: true },
  { value: 'right_leg', label: 'Right Leg', bilateral: true },
  { value: 'left_hand', label: 'Left Hand', bilateral: true },
  { value: 'right_hand', label: 'Right Hand', bilateral: true },
  { value: 'left_foot', label: 'Left Foot', bilateral: true },
  { value: 'right_foot', label: 'Right Foot', bilateral: true },
  { value: 'left_knee', label: 'Left Knee', bilateral: true },
  { value: 'right_knee', label: 'Right Knee', bilateral: true },
  { value: 'left_hip', label: 'Left Hip', bilateral: true },
  { value: 'right_hip', label: 'Right Hip', bilateral: true },
  { value: 'left_shoulder', label: 'Left Shoulder', bilateral: true },
  { value: 'right_shoulder', label: 'Right Shoulder', bilateral: true },
  { value: 'left_elbow', label: 'Left Elbow', bilateral: true },
  { value: 'right_elbow', label: 'Right Elbow', bilateral: true },
  { value: 'left_ankle', label: 'Left Ankle', bilateral: true },
  { value: 'right_ankle', label: 'Right Ankle', bilateral: true },
  { value: 'left_wrist', label: 'Left Wrist', bilateral: true },
  { value: 'right_wrist', label: 'Right Wrist', bilateral: true },
];

// Bilateral pairs for matching
const bilateralPairs: Record<string, string> = {
  'left_arm': 'right_arm', 'right_arm': 'left_arm',
  'left_leg': 'right_leg', 'right_leg': 'left_leg',
  'left_hand': 'right_hand', 'right_hand': 'left_hand',
  'left_foot': 'right_foot', 'right_foot': 'left_foot',
  'left_knee': 'right_knee', 'right_knee': 'left_knee',
  'left_hip': 'right_hip', 'right_hip': 'left_hip',
  'left_shoulder': 'right_shoulder', 'right_shoulder': 'left_shoulder',
  'left_elbow': 'right_elbow', 'right_elbow': 'left_elbow',
  'left_ankle': 'right_ankle', 'right_ankle': 'left_ankle',
  'left_wrist': 'right_wrist', 'right_wrist': 'left_wrist',
};

// 2024 VA compensation rates (single veteran, no dependents)
const monthlyCompensation: Record<number, number> = {
  0: 0,
  10: 171.23,
  20: 338.49,
  30: 524.31,
  40: 755.28,
  50: 1075.16,
  60: 1361.88,
  70: 1716.28,
  80: 1995.01,
  90: 2241.91,
  100: 3737.85,
};

interface CalculationStep {
  description: string;
  rating?: number;
  remaining?: number;
  applied?: number;
  isBilateral?: boolean;
}

interface CalculationResult {
  exactCombined: number;
  officialRating: number;
  bilateralFactor: number;
  steps: CalculationStep[];
  hasBilateral: boolean;
}

function calculateVACombinedRating(conditions: RatedCondition[]): CalculationResult {
  const steps: CalculationStep[] = [];
  const ratings = conditions.filter(c => c.rating > 0);
  
  if (ratings.length === 0) {
    return { exactCombined: 0, officialRating: 0, bilateralFactor: 0, steps: [], hasBilateral: false };
  }

  // Find bilateral conditions (conditions affecting paired extremities)
  const bilateralConditions: RatedCondition[] = [];
  const nonBilateralConditions: RatedCondition[] = [];
  const usedParts = new Set<string>();

  // Group by body part type (e.g., "arm", "leg", "knee")
  const partGroups: Record<string, RatedCondition[]> = {};
  
  for (const condition of ratings) {
    if (condition.bodyPart === 'other') {
      nonBilateralConditions.push(condition);
      continue;
    }
    
    const partType = condition.bodyPart.replace('left_', '').replace('right_', '');
    if (!partGroups[partType]) {
      partGroups[partType] = [];
    }
    partGroups[partType].push(condition);
  }

  // Check each part group for bilateral pairs
  for (const [partType, partConditions] of Object.entries(partGroups)) {
    const hasLeft = partConditions.some(c => c.bodyPart.startsWith('left_'));
    const hasRight = partConditions.some(c => c.bodyPart.startsWith('right_'));
    
    if (hasLeft && hasRight) {
      // This is a bilateral group
      bilateralConditions.push(...partConditions);
    } else {
      // Not bilateral
      nonBilateralConditions.push(...partConditions);
    }
  }

  const hasBilateral = bilateralConditions.length > 0;
  let bilateralFactor = 0;
  let bilateralCombined = 0;

  // Calculate bilateral combined if applicable
  if (hasBilateral) {
    steps.push({ description: '--- BILATERAL CONDITIONS ---' });
    
    const bilateralRatings = bilateralConditions.map(c => c.rating).sort((a, b) => b - a);
    let remaining = 100;
    
    bilateralRatings.forEach((rating, idx) => {
      const applied = remaining * (rating / 100);
      if (idx === 0) {
        steps.push({
          description: `${bilateralConditions.find(c => c.rating === rating)?.name || 'Condition'} (${rating}%)`,
          rating,
          remaining: 100,
          applied: rating,
          isBilateral: true,
        });
      } else {
        steps.push({
          description: `${bilateralConditions[idx]?.name || 'Condition'} (${rating}% of ${remaining.toFixed(1)}%)`,
          rating,
          remaining,
          applied,
          isBilateral: true,
        });
      }
      remaining = remaining - applied;
    });
    
    bilateralCombined = 100 - remaining;
    
    // Apply 10% bilateral factor
    bilateralFactor = bilateralCombined * 0.10;
    const bilateralWithFactor = bilateralCombined + bilateralFactor;
    
    steps.push({
      description: `Bilateral combined: ${bilateralCombined.toFixed(1)}%`,
    });
    steps.push({
      description: `+ 10% bilateral factor: ${bilateralFactor.toFixed(1)}%`,
    });
    steps.push({
      description: `Bilateral total: ${bilateralWithFactor.toFixed(1)}%`,
    });
    
    bilateralCombined = bilateralWithFactor;
  }

  // Combine bilateral result with non-bilateral conditions
  let allRatings: number[] = [];
  
  if (hasBilateral) {
    allRatings.push(bilateralCombined);
    steps.push({ description: '--- COMBINING WITH OTHER CONDITIONS ---' });
  }
  
  allRatings.push(...nonBilateralConditions.map(c => c.rating));
  allRatings = allRatings.sort((a, b) => b - a);

  let remaining = 100;
  let startIdx = 0;
  
  if (hasBilateral && allRatings.length > 0) {
    // Start with bilateral total
    remaining = remaining - (remaining * (bilateralCombined / 100));
    steps.push({
      description: `Start with bilateral total: ${bilateralCombined.toFixed(1)}%`,
      rating: bilateralCombined,
      remaining: 100,
      applied: bilateralCombined,
    });
    startIdx = 1;
  }

  // Process remaining conditions
  const nonBilateralSorted = nonBilateralConditions.sort((a, b) => b.rating - a.rating);
  
  nonBilateralSorted.forEach((condition, idx) => {
    const rating = condition.rating;
    const prevRemaining = remaining;
    const applied = remaining * (rating / 100);
    remaining = remaining - applied;
    
    if (!hasBilateral && idx === 0) {
      steps.push({
        description: `${condition.name} (${rating}%)`,
        rating,
        remaining: 100,
        applied: rating,
      });
    } else {
      steps.push({
        description: `${condition.name} (${rating}% of ${prevRemaining.toFixed(1)}%)`,
        rating,
        remaining: prevRemaining,
        applied,
      });
    }
  });

  const exactCombined = 100 - remaining;
  const officialRating = Math.round(exactCombined / 10) * 10;

  steps.push({ description: '--- FINAL RESULT ---' });
  steps.push({
    description: `Exact combined: ${exactCombined.toFixed(2)}%`,
  });
  steps.push({
    description: `Rounded to nearest 10%: ${officialRating}%`,
  });

  return {
    exactCombined,
    officialRating,
    bilateralFactor,
    steps,
    hasBilateral,
  };
}

export function RatingCalculator() {
  const [conditions, setConditions] = useState<RatedCondition[]>([]);
  const [newConditionName, setNewConditionName] = useState('');
  const [newConditionRating, setNewConditionRating] = useState<string>('');
  const [newConditionBodyPart, setNewConditionBodyPart] = useState<BodyPart>('other');
  const [showSteps, setShowSteps] = useState(true);

  const addCondition = () => {
    if (!newConditionName || !newConditionRating) return;
    
    setConditions([
      ...conditions,
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

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const result = useMemo(() => calculateVACombinedRating(conditions), [conditions]);
  
  const estimatedCompensation = monthlyCompensation[result.officialRating] || 0;

  const getBodyPartLabel = (bodyPart: BodyPart) => {
    return bodyPartOptions.find(bp => bp.value === bodyPart)?.label || 'Other';
  };

  const isBilateralPart = (bodyPart: BodyPart) => {
    if (bodyPart === 'other') return false;
    const pairedPart = bilateralPairs[bodyPart];
    return conditions.some(c => c.bodyPart === pairedPart);
  };

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
                <strong>Bilateral Factor:</strong> If you have disabilities affecting both paired extremities (both arms, both legs, etc.), VA adds 10% to that combined rating before combining with other conditions.
              </p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Condition */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Condition name (e.g., PTSD, Tinnitus)"
              value={newConditionName}
              onChange={(e) => setNewConditionName(e.target.value)}
              className="flex-1"
            />
            <Select value={newConditionRating} onValueChange={setNewConditionRating}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Rating %" />
              </SelectTrigger>
              <SelectContent>
                {commonRatings.map((r) => (
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
            <Button onClick={addCondition} disabled={!newConditionName || !newConditionRating} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Condition
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Select a body part for extremity conditions to enable the bilateral factor calculation when you have conditions affecting both sides.
          </p>
        </div>

        {/* Conditions List */}
        {conditions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground">Your Conditions ({conditions.length})</h4>
            </div>
            {conditions.map((condition) => (
              <div
                key={condition.id}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  isBilateralPart(condition.bodyPart) ? 'border-purple-500/30 bg-purple-500/5' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{condition.name}</span>
                    {isBilateralPart(condition.bodyPart) && (
                      <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-500 border-purple-500/20">
                        Bilateral
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {getBodyPartLabel(condition.bodyPart)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-base px-3">
                    {condition.rating}%
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCondition(condition.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {conditions.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            {/* Rating Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Exact Combined</p>
                <p className="text-2xl font-bold">{result.exactCombined.toFixed(2)}%</p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Official VA Rating</p>
                <p className="text-3xl font-bold text-primary">{result.officialRating}%</p>
              </div>
            </div>

            {/* Bilateral Factor Notice */}
            {result.hasBilateral && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-sm font-medium text-purple-500 flex items-center gap-2">
                  ✓ Bilateral Factor Applied (+{result.bilateralFactor.toFixed(1)}%)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You have conditions affecting both paired extremities, so the VA adds 10% to your bilateral combined rating before combining with other conditions.
                </p>
              </div>
            )}

            {/* Monthly Compensation */}
            <div className="text-center p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Est. Monthly Compensation</p>
              <p className="text-3xl font-bold text-success">
                ${estimatedCompensation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on 2024 rates for single veteran, no dependents
              </p>
              <p className="text-xs text-muted-foreground">
                Annual: ${(estimatedCompensation * 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Step-by-Step Calculation */}
            {result.steps.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-sm">Step-by-Step Calculation</span>
                  {showSteps ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                
                {showSteps && (
                  <div className="p-3 space-y-2 text-sm bg-muted/10">
                    {result.steps.map((step, idx) => (
                      <div 
                        key={idx} 
                        className={`${
                          step.description.startsWith('---') 
                            ? 'font-semibold text-foreground pt-2 border-t mt-2 first:border-t-0 first:pt-0 first:mt-0' 
                            : step.isBilateral
                              ? 'text-purple-500 pl-4'
                              : 'text-muted-foreground pl-4'
                        }`}
                      >
                        {step.description.startsWith('---') 
                          ? step.description.replace(/---/g, '').trim()
                          : step.applied !== undefined 
                            ? `${step.description} = +${step.applied.toFixed(2)}%`
                            : step.description
                        }
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center italic">
              This calculator provides estimates only. Actual VA ratings may vary based on individual circumstances. 
              Compensation rates may be higher with dependents.
            </p>
          </div>
        )}

        {conditions.length === 0 && (
          <div className="text-center py-6 space-y-2">
            <p className="text-muted-foreground">
              Add your service-connected conditions to calculate your combined rating
            </p>
            <p className="text-xs text-muted-foreground">
              For extremity conditions (arms, legs, etc.), select the specific body part to enable bilateral factor calculation
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
