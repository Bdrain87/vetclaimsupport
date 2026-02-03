import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import {
  Calculator, Plus, Trash2, Info, HelpCircle, ChevronDown, ChevronRight,
  Save, Upload, FileDown, AlertTriangle, ArrowRight, Sparkles, Users,
  Copy, Check, RefreshCw
} from 'lucide-react';

// 2026 VA compensation rates (single veteran, no dependents)
const monthlyCompensation: Record<number, number> = {
  0: 0, 10: 175.51, 20: 347.14, 30: 537.32, 40: 773.64,
  50: 1101.71, 60: 1395.07, 70: 1759.14, 80: 2044.74, 90: 2297.14, 100: 3937.04,
};

const commonRatings = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// Bilateral body parts - if left AND right exist, they're bilateral
const bilateralParts = [
  'shoulder', 'elbow', 'wrist', 'hand', 'arm',
  'hip', 'knee', 'ankle', 'foot', 'leg'
];

type Side = 'left' | 'right' | 'none';

interface BodyPartOption {
  value: string;
  label: string;
  side: Side;
  basePart: string;
}

const bodyPartOptions: BodyPartOption[] = [
  { value: 'other', label: 'Other / Non-extremity (Back, Head, etc.)', side: 'none', basePart: 'other' },
  // Arms
  { value: 'left_shoulder', label: 'Left Shoulder', side: 'left', basePart: 'shoulder' },
  { value: 'right_shoulder', label: 'Right Shoulder', side: 'right', basePart: 'shoulder' },
  { value: 'left_elbow', label: 'Left Elbow', side: 'left', basePart: 'elbow' },
  { value: 'right_elbow', label: 'Right Elbow', side: 'right', basePart: 'elbow' },
  { value: 'left_wrist', label: 'Left Wrist', side: 'left', basePart: 'wrist' },
  { value: 'right_wrist', label: 'Right Wrist', side: 'right', basePart: 'wrist' },
  { value: 'left_hand', label: 'Left Hand', side: 'left', basePart: 'hand' },
  { value: 'right_hand', label: 'Right Hand', side: 'right', basePart: 'hand' },
  { value: 'left_arm', label: 'Left Arm (General)', side: 'left', basePart: 'arm' },
  { value: 'right_arm', label: 'Right Arm (General)', side: 'right', basePart: 'arm' },
  // Legs
  { value: 'left_hip', label: 'Left Hip', side: 'left', basePart: 'hip' },
  { value: 'right_hip', label: 'Right Hip', side: 'right', basePart: 'hip' },
  { value: 'left_knee', label: 'Left Knee', side: 'left', basePart: 'knee' },
  { value: 'right_knee', label: 'Right Knee', side: 'right', basePart: 'knee' },
  { value: 'left_ankle', label: 'Left Ankle', side: 'left', basePart: 'ankle' },
  { value: 'right_ankle', label: 'Right Ankle', side: 'right', basePart: 'ankle' },
  { value: 'left_foot', label: 'Left Foot', side: 'left', basePart: 'foot' },
  { value: 'right_foot', label: 'Right Foot', side: 'right', basePart: 'foot' },
  { value: 'left_leg', label: 'Left Leg (General)', side: 'left', basePart: 'leg' },
  { value: 'right_leg', label: 'Right Leg (General)', side: 'right', basePart: 'leg' },
];

interface RatedCondition {
  id: string;
  name: string;
  rating: number;
  bodyPart: string;
}

interface CalculationStep {
  description: string;
  formula?: string;
  result: string;
  type: 'combine' | 'bilateral' | 'final' | 'info';
}

interface CalculationResult {
  exactCombined: number;
  officialRating: number;
  bilateralExact: number;
  bilateralWithFactor: number;
  hasBilateral: boolean;
  bilateralConditions: RatedCondition[];
  nonBilateralConditions: RatedCondition[];
  steps: CalculationStep[];
  monthlyCompensation: number;
  yearlyCompensation: number;
}

function combineRatings(ratings: number[]): { exact: number; steps: string[] } {
  if (ratings.length === 0) return { exact: 0, steps: [] };
  if (ratings.length === 1) return { exact: ratings[0], steps: [`Single rating: ${ratings[0]}%`] };

  // Sort highest to lowest (VA always combines highest first)
  const sorted = [...ratings].sort((a, b) => b - a);
  const steps: string[] = [];

  let remaining = 100;
  sorted.forEach((rating, index) => {
    const beforeRemaining = remaining;
    remaining = remaining - (remaining * (rating / 100));
    if (index === 0) {
      steps.push(`Start: ${rating}% → remaining whole person: ${remaining.toFixed(2)}%`);
    } else {
      steps.push(`${rating}% of ${beforeRemaining.toFixed(2)}% = ${(beforeRemaining * rating / 100).toFixed(2)}% → remaining: ${remaining.toFixed(2)}%`);
    }
  });

  const exact = 100 - remaining;
  return { exact, steps };
}

function calculateWithBilateral(conditions: RatedCondition[]): CalculationResult {
  const steps: CalculationStep[] = [];

  if (conditions.length === 0) {
    return {
      exactCombined: 0,
      officialRating: 0,
      bilateralExact: 0,
      bilateralWithFactor: 0,
      hasBilateral: false,
      bilateralConditions: [],
      nonBilateralConditions: [],
      steps: [],
      monthlyCompensation: 0,
      yearlyCompensation: 0,
    };
  }

  // Group conditions by body part base (shoulder, knee, etc.)
  const partGroups: Record<string, RatedCondition[]> = {};
  const nonBilateralConditions: RatedCondition[] = [];

  for (const condition of conditions) {
    if (condition.rating <= 0) continue;

    const option = bodyPartOptions.find(o => o.value === condition.bodyPart);
    if (!option || option.side === 'none') {
      nonBilateralConditions.push(condition);
      continue;
    }

    const basePart = option.basePart;
    if (!partGroups[basePart]) partGroups[basePart] = [];
    partGroups[basePart].push(condition);
  }

  // Identify bilateral conditions (both left AND right for same part)
  const bilateralConditions: RatedCondition[] = [];

  for (const [basePart, partConditions] of Object.entries(partGroups)) {
    const hasLeft = partConditions.some(c => {
      const opt = bodyPartOptions.find(o => o.value === c.bodyPart);
      return opt?.side === 'left';
    });
    const hasRight = partConditions.some(c => {
      const opt = bodyPartOptions.find(o => o.value === c.bodyPart);
      return opt?.side === 'right';
    });

    if (hasLeft && hasRight) {
      // This is a bilateral pair
      bilateralConditions.push(...partConditions);
    } else {
      // Not bilateral - add to non-bilateral
      nonBilateralConditions.push(...partConditions);
    }
  }

  const hasBilateral = bilateralConditions.length > 0;
  let bilateralExact = 0;
  let bilateralWithFactor = 0;
  let allRatingsForFinal: number[] = [];

  if (hasBilateral) {
    // Step 1: Combine all bilateral conditions using VA math
    steps.push({
      type: 'info',
      description: 'Step 1: Identify Bilateral Conditions',
      result: `Found ${bilateralConditions.length} conditions affecting paired extremities`,
    });

    const bilateralRatings = bilateralConditions.map(c => c.rating);
    const { exact: biExact, steps: biSteps } = combineRatings(bilateralRatings);
    bilateralExact = biExact;

    steps.push({
      type: 'combine',
      description: 'Step 2: Combine Bilateral Ratings (VA Math)',
      formula: bilateralRatings.join('% + ') + '% using VA combined formula',
      result: `Combined bilateral: ${bilateralExact.toFixed(2)}%`,
    });

    // Step 2: Add 10% bilateral factor
    // The 10% is added to the combined value, not multiplied
    bilateralWithFactor = bilateralExact * 1.10;
    // Round to nearest whole number before proceeding
    const bilateralRounded = Math.round(bilateralWithFactor);

    steps.push({
      type: 'bilateral',
      description: 'Step 3: Apply 10% Bilateral Factor',
      formula: `${bilateralExact.toFixed(2)}% × 1.10 = ${bilateralWithFactor.toFixed(2)}% → rounds to ${bilateralRounded}%`,
      result: `Bilateral with factor: ${bilateralRounded}%`,
    });

    // Use the rounded bilateral value for final combination
    allRatingsForFinal = [bilateralRounded];
  }

  // Add non-bilateral ratings
  const nonBilateralRatings = nonBilateralConditions.map(c => c.rating).filter(r => r > 0);
  allRatingsForFinal.push(...nonBilateralRatings);

  if (nonBilateralConditions.length > 0) {
    steps.push({
      type: 'info',
      description: hasBilateral ? 'Step 4: Combine with Non-Bilateral Conditions' : 'Combine All Conditions',
      result: `Non-bilateral conditions: ${nonBilateralConditions.map(c => `${c.name} (${c.rating}%)`).join(', ')}`,
    });
  }

  // Final combination
  const { exact: finalExact, steps: finalSteps } = combineRatings(allRatingsForFinal);

  if (allRatingsForFinal.length > 1) {
    steps.push({
      type: 'combine',
      description: hasBilateral ? 'Step 5: Final Combined Rating' : 'Combined Rating Calculation',
      formula: allRatingsForFinal.join('% + ') + '% using VA combined formula',
      result: `Exact combined: ${finalExact.toFixed(2)}%`,
    });
  }

  // Round DOWN to nearest 10% (VA always rounds down for final rating)
  const officialRating = Math.floor(finalExact / 10) * 10;

  steps.push({
    type: 'final',
    description: 'Final Step: Round DOWN to Nearest 10%',
    formula: `${finalExact.toFixed(2)}% → ${officialRating}%`,
    result: `Official VA Rating: ${officialRating}%`,
  });

  const monthlyComp = monthlyCompensation[officialRating] || 0;

  return {
    exactCombined: finalExact,
    officialRating,
    bilateralExact,
    bilateralWithFactor,
    hasBilateral,
    bilateralConditions,
    nonBilateralConditions,
    steps,
    monthlyCompensation: monthlyComp,
    yearlyCompensation: monthlyComp * 12,
  };
}

export default function BilateralCalculator() {
  const [conditions, setConditions] = useState<RatedCondition[]>([]);
  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState('');
  const [newBodyPart, setNewBodyPart] = useState('other');
  const [showSteps, setShowSteps] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);

  const result = useMemo(() => calculateWithBilateral(conditions), [conditions]);

  const addCondition = useCallback(() => {
    if (!newName || !newRating) return;

    const rating = parseInt(newRating);
    if (isNaN(rating) || rating < 0 || rating > 100) return;

    setConditions(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: newName.trim(),
        rating,
        bodyPart: newBodyPart,
      },
    ]);
    setNewName('');
    setNewRating('');
    setNewBodyPart('other');
  }, [newName, newRating, newBodyPart]);

  const removeCondition = useCallback((id: string) => {
    setConditions(prev => prev.filter(c => c.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setConditions([]);
  }, []);

  const loadTestCase = useCallback(() => {
    setConditions([
      { id: '1', name: 'Left Knee Strain', rating: 40, bodyPart: 'left_knee' },
      { id: '2', name: 'Right Knee Arthritis', rating: 30, bodyPart: 'right_knee' },
      { id: '3', name: 'Lower Back DDD', rating: 20, bodyPart: 'other' },
      { id: '4', name: 'Tinnitus', rating: 10, bodyPart: 'other' },
    ]);
  }, []);

  const saveCalculation = useCallback(() => {
    const data = {
      conditions,
      timestamp: new Date().toISOString(),
      result: {
        official: result.officialRating,
        exact: result.exactCombined,
        hasBilateral: result.hasBilateral,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `va-rating-calculation-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [conditions, result]);

  const loadCalculation = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.conditions && Array.isArray(data.conditions)) {
          setConditions(data.conditions);
        }
      } catch (err) {
        console.error('Failed to load calculation:', err);
      }
    };
    input.click();
  }, []);

  const exportPDF = useCallback(() => {
    // Create printable content
    const printContent = `
      <html>
        <head>
          <title>VA Rating Calculation</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #1e40af; margin-bottom: 8px; }
            h2 { color: #374151; margin-top: 24px; }
            .date { color: #6b7280; margin-bottom: 24px; }
            .result-box { background: #eff6ff; border: 2px solid #3b82f6; padding: 24px; border-radius: 12px; margin: 24px 0; }
            .result-number { font-size: 48px; font-weight: bold; color: #1e40af; }
            .condition { padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 8px 0; display: flex; justify-content: space-between; }
            .bilateral { background: #fef3c7; border-color: #f59e0b; }
            .step { padding: 16px; background: #f9fafb; border-radius: 8px; margin: 8px 0; }
            .step-formula { font-family: monospace; background: #e5e7eb; padding: 8px; border-radius: 4px; margin: 8px 0; }
            .compensation { margin-top: 24px; padding: 16px; background: #d1fae5; border-radius: 8px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>VA Combined Rating Calculation</h1>
          <p class="date">Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>

          <div class="result-box">
            <p class="result-number">${result.officialRating}%</p>
            <p>Official VA Combined Rating</p>
            <p style="color: #6b7280;">Exact combined: ${result.exactCombined.toFixed(2)}%</p>
          </div>

          <h2>Conditions (${conditions.length})</h2>
          ${conditions.map(c => {
            const isBilateral = result.bilateralConditions.some(bc => bc.id === c.id);
            return `<div class="condition ${isBilateral ? 'bilateral' : ''}">
              <span>${c.name}</span>
              <span><strong>${c.rating}%</strong> - ${bodyPartOptions.find(o => o.value === c.bodyPart)?.label || 'Other'}${isBilateral ? ' (Bilateral)' : ''}</span>
            </div>`;
          }).join('')}

          ${result.hasBilateral ? `
            <h2>Bilateral Factor Applied</h2>
            <p>The bilateral factor adds 10% to the combined value of conditions affecting both paired extremities (both arms or both legs).</p>
            <p><strong>Bilateral conditions combined:</strong> ${result.bilateralExact.toFixed(2)}%</p>
            <p><strong>After 10% factor:</strong> ${result.bilateralWithFactor.toFixed(2)}% → ${Math.round(result.bilateralWithFactor)}%</p>
          ` : ''}

          <h2>Calculation Steps</h2>
          ${result.steps.map(step => `
            <div class="step">
              <strong>${step.description}</strong>
              ${step.formula ? `<div class="step-formula">${step.formula}</div>` : ''}
              <p>${step.result}</p>
            </div>
          `).join('')}

          <div class="compensation">
            <h2 style="margin-top: 0;">2026 Compensation (Single Veteran)</h2>
            <p><strong>Monthly:</strong> $${result.monthlyCompensation.toLocaleString()}</p>
            <p><strong>Yearly:</strong> $${result.yearlyCompensation.toLocaleString()}</p>
          </div>

          <p style="color: #9ca3af; margin-top: 40px; font-size: 12px;">
            This is an estimate only. Your actual VA rating will be determined by the VA based on your complete medical record and C&P examination findings.
          </p>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }, [conditions, result]);

  const copyResult = useCallback(() => {
    const text = `VA Combined Rating: ${result.officialRating}% (Exact: ${result.exactCombined.toFixed(2)}%)
Monthly Compensation: $${result.monthlyCompensation.toLocaleString()}
${result.hasBilateral ? 'Bilateral Factor Applied: Yes' : ''}
Conditions: ${conditions.map(c => `${c.name} (${c.rating}%)`).join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [conditions, result]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBodyPartLabel = (value: string) => {
    return bodyPartOptions.find(o => o.value === value)?.label || 'Other';
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">VA Bilateral Rating Calculator</h1>
            <p className="text-muted-foreground">Accurate VA math with bilateral factor support</p>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="border-primary/20 bg-primary/5">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription>
          VA uses "whole person" math, not simple addition. The bilateral factor adds 10% when disabilities affect both paired extremities.
          <Dialog open={showExplainer} onOpenChange={setShowExplainer}>
            <DialogTrigger asChild>
              <Button variant="link" className="h-auto p-0 ml-2 text-primary">
                Learn how it works <HelpCircle className="h-3 w-3 ml-1" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Understanding the VA Bilateral Factor
                </DialogTitle>
                <DialogDescription>
                  How VA calculates combined ratings with bilateral conditions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="font-semibold mb-2">What is the Bilateral Factor?</h3>
                  <p className="text-sm text-muted-foreground">
                    When you have disabilities affecting <strong>both arms</strong> OR <strong>both legs</strong> (paired extremities),
                    the VA adds 10% to the combined rating of those bilateral conditions before combining with other disabilities.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Qualifying Body Parts</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-muted rounded-lg">Shoulders (Left + Right)</div>
                    <div className="p-2 bg-muted rounded-lg">Hips (Left + Right)</div>
                    <div className="p-2 bg-muted rounded-lg">Elbows (Left + Right)</div>
                    <div className="p-2 bg-muted rounded-lg">Knees (Left + Right)</div>
                    <div className="p-2 bg-muted rounded-lg">Wrists (Left + Right)</div>
                    <div className="p-2 bg-muted rounded-lg">Ankles (Left + Right)</div>
                    <div className="p-2 bg-muted rounded-lg">Hands (Left + Right)</div>
                    <div className="p-2 bg-muted rounded-lg">Feet (Left + Right)</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Step-by-Step Example</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <p className="font-medium">Conditions:</p>
                      <p>40% Left Knee + 30% Right Knee + 20% Back + 10% Tinnitus</p>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Step 1: Combine bilateral (knees)</p>
                      <code className="block mt-1 text-xs bg-background p-2 rounded">
                        40% + 30% = 1 - (0.60 × 0.70) = 58%
                      </code>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Step 2: Add 10% bilateral factor</p>
                      <code className="block mt-1 text-xs bg-background p-2 rounded">
                        58% × 1.10 = 63.8% → rounds to 64%
                      </code>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Step 3: Combine with non-bilateral</p>
                      <code className="block mt-1 text-xs bg-background p-2 rounded">
                        64% + 20% + 10% (VA math) = 74.08%
                      </code>
                    </div>

                    <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                      <p className="font-medium">Final: Round DOWN to nearest 10%</p>
                      <code className="block mt-1 text-xs bg-background p-2 rounded">
                        74.08% → <strong>70%</strong> Official Rating
                      </code>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-1">Key Points:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Must have conditions on BOTH sides (left AND right)</li>
                    <li>10% is added to the combined bilateral value</li>
                    <li>Bilateral combined is rounded before combining with other conditions</li>
                    <li>Final rating always rounds DOWN to nearest 10%</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add Conditions
            </CardTitle>
            <CardDescription>
              Select body parts to auto-detect bilateral conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Input
                placeholder="Condition name (e.g., PTSD, Knee Strain)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCondition()}
              />

              <div className="grid grid-cols-2 gap-3">
                <Select value={newRating} onValueChange={setNewRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rating %" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonRatings.map(r => (
                      <SelectItem key={r} value={r.toString()}>{r}%</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={newBodyPart} onValueChange={setNewBodyPart}>
                  <SelectTrigger>
                    <SelectValue placeholder="Body Part" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyPartOptions.map(bp => (
                      <SelectItem key={bp.value} value={bp.value}>
                        {bp.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={addCondition} disabled={!newName || !newRating} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add Condition
              </Button>
            </div>

            <Separator />

            {/* Conditions List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Conditions ({conditions.length})</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={loadTestCase} className="h-8 text-xs gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Load Example
                  </Button>
                  {conditions.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 text-xs text-destructive hover:text-destructive">
                      Clear All
                    </Button>
                  )}
                </div>
              </div>

              {conditions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No conditions added yet</p>
                  <p className="text-xs">Add conditions above or load an example</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Bilateral Conditions Group */}
                  {result.bilateralConditions.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-500">
                          Bilateral Conditions (+10% factor)
                        </span>
                      </div>
                      {result.bilateralConditions.map(condition => (
                        <div
                          key={condition.id}
                          className="flex items-center justify-between p-3 bg-background rounded-lg border"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{condition.name}</p>
                            <p className="text-xs text-muted-foreground">{getBodyPartLabel(condition.bodyPart)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="font-mono bg-amber-500/20 text-amber-700 dark:text-amber-400 border-0">
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

                  {/* Non-Bilateral Conditions */}
                  {result.nonBilateralConditions.map(condition => (
                    <div
                      key={condition.id}
                      className="flex items-center justify-between p-3 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{condition.name}</p>
                        <p className="text-xs text-muted-foreground">{getBodyPartLabel(condition.bodyPart)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono">
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
            </div>

            {/* Action Buttons */}
            {conditions.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={saveCalculation} className="gap-1.5">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadCalculation} className="gap-1.5">
                    <Upload className="h-4 w-4" />
                    Load
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportPDF} className="gap-1.5">
                    <FileDown className="h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyResult} className="gap-1.5">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Main Result */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">Combined VA Rating</p>
                {result.hasBilateral && (
                  <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-0 gap-1">
                    <Users className="h-3 w-3" />
                    Bilateral Factor Applied
                  </Badge>
                )}
              </div>

              <div className="flex items-end gap-4">
                <div>
                  <p className="text-6xl font-bold text-primary tabular-nums">
                    {result.officialRating}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Exact: {result.exactCombined.toFixed(2)}%
                  </p>
                </div>
                <div className="flex-1" />
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                    {formatCurrency(result.monthlyCompensation)}
                  </p>
                  <p className="text-xs text-muted-foreground">per month (2026)</p>
                </div>
              </div>
            </div>

            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <p className="text-sm text-muted-foreground">Yearly</p>
                  <p className="text-lg font-bold">{formatCurrency(result.yearlyCompensation)}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <p className="text-sm text-muted-foreground">Conditions</p>
                  <p className="text-lg font-bold">{conditions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Breakdown */}
          {conditions.length > 0 && result.steps.length > 0 && (
            <Card className="border-0 shadow-lg">
              <Collapsible open={showSteps} onOpenChange={setShowSteps}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {showSteps ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      <Sparkles className="h-5 w-5 text-primary" />
                      Calculation Breakdown
                    </CardTitle>
                    <CardDescription>
                      See the step-by-step VA math
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-3">
                    {result.steps.map((step, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border ${
                          step.type === 'bilateral' ? 'bg-amber-500/10 border-amber-500/30' :
                          step.type === 'final' ? 'bg-primary/10 border-primary/30' :
                          'bg-muted/50 border-border'
                        }`}
                      >
                        <p className="font-medium text-sm">{step.description}</p>
                        {step.formula && (
                          <code className="block mt-2 text-xs bg-background/80 p-2 rounded-lg font-mono">
                            {step.formula}
                          </code>
                        )}
                        <p className={`text-sm mt-2 ${step.type === 'final' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                          {step.result}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )}

          {/* Compensation Reference */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">2026 Compensation Reference</CardTitle>
              <CardDescription>Single veteran, no dependents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(rating => (
                  <div
                    key={rating}
                    className={`p-2 rounded-xl text-center transition-all ${
                      result.officialRating === rating
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <p className="font-bold text-sm">{rating}%</p>
                    <p className={`text-xs ${result.officialRating === rating ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      ${monthlyCompensation[rating].toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Alert variant="default" className="border-amber-500/30 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-700 dark:text-amber-500">Estimate Only</AlertTitle>
            <AlertDescription className="text-amber-700/80 dark:text-amber-500/80">
              This calculator shows how VA combined ratings math works. Your actual rating will be determined by the VA based on your complete medical record and C&P examination findings.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
