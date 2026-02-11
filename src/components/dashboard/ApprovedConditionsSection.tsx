import { useState, useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { ApprovedCondition, BodyPart } from '@/types/claims';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Award, Plus, Trash2, Calendar, TrendingUp, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { secondaryConditions } from '@/data/secondaryConditions';
import { COMP_RATES_2026 } from '@/data/compRates2026';

const commonRatings = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// 2026 VA compensation rates (single veteran, no dependents)
const monthlyCompensation: Record<number, number> = { 0: 0, ...COMP_RATES_2026 };

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



function calculateCombinedRating(conditions: ApprovedCondition[]): { exact: number; official: number } {
  const ratings = conditions.filter(c => c.rating > 0);
  if (ratings.length === 0) return { exact: 0, official: 0 };

  // Find bilateral conditions
  const bilateralConditions: ApprovedCondition[] = [];
  const nonBilateralConditions: ApprovedCondition[] = [];
  const partGroups: Record<string, ApprovedCondition[]> = {};

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

  let bilateralCombined = 0;
  if (bilateralConditions.length > 0) {
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
  return { exact, official };
}

interface ApprovedConditionsSectionProps {
  onNavigateToCalculator?: () => void;
}

export function ApprovedConditionsSection({ onNavigateToCalculator }: ApprovedConditionsSectionProps) {
  const { data, addApprovedCondition, deleteApprovedCondition } = useClaims();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [newCondition, setNewCondition] = useState({
    name: '',
    rating: '',
    effectiveDate: '',
    bodyPart: 'other' as BodyPart,
  });

  const approvedConditions = useMemo(() => data.approvedConditions ?? [], [data.approvedConditions]);

  const { exact, official } = useMemo(() => 
    calculateCombinedRating(approvedConditions), 
    [approvedConditions]
  );

  const monthlyAmount = monthlyCompensation[official] || 0;

  // Get secondary condition suggestions based on approved conditions
  const secondarySuggestions = useMemo(() => {
    const suggestions: { condition: string; primary: string; connection: string; category: string }[] = [];
    const claimedNames = new Set([
      ...approvedConditions.map(c => c.name.toLowerCase()),
      ...(data.claimConditions || []).map(c => c.name.toLowerCase()),
    ]);

    approvedConditions.forEach(approved => {
      const related = secondaryConditions.filter(
        sc => sc.primaryCondition.toLowerCase() === approved.name.toLowerCase() ||
              approved.name.toLowerCase().includes(sc.primaryCondition.toLowerCase())
      );
      
      related.forEach(rel => {
        if (!claimedNames.has(rel.secondaryCondition.toLowerCase()) && 
            !suggestions.some(s => s.condition === rel.secondaryCondition)) {
          suggestions.push({
            condition: rel.secondaryCondition,
            primary: approved.name,
            connection: rel.medicalConnection,
            category: rel.category,
          });
        }
      });
    });

    return suggestions.slice(0, 5);
  }, [approvedConditions, data.claimConditions]);

  const handleAdd = () => {
    if (!newCondition.name || !newCondition.rating || !newCondition.effectiveDate) return;

    addApprovedCondition({
      name: newCondition.name,
      rating: parseInt(newCondition.rating),
      effectiveDate: newCondition.effectiveDate,
      bodyPart: newCondition.bodyPart,
      createdAt: new Date().toISOString(),
    });

    setNewCondition({ name: '', rating: '', effectiveDate: '', bodyPart: 'other' });
    setIsAddOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className={cn(
      "border-success/30 bg-success/5",
      approvedConditions.length === 0 && "border-border bg-card"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-success" />
            My Approved Conditions
          </CardTitle>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1 h-10 min-h-[44px]">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Approved VA Condition</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Condition Name</Label>
                  <Input
                    value={newCondition.name}
                    onChange={(e) => setNewCondition(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., PTSD, Tinnitus, Lumbar Strain"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assigned Rating %</Label>
                  <Select 
                    value={newCondition.rating} 
                    onValueChange={(v) => setNewCondition(prev => ({ ...prev, rating: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
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
                <div className="space-y-2">
                  <Label>Body Part (for bilateral calculation)</Label>
                  <Select 
                    value={newCondition.bodyPart} 
                    onValueChange={(v) => setNewCondition(prev => ({ ...prev, bodyPart: v as BodyPart }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bodyPartOptions.map((bp) => (
                        <SelectItem key={bp.value} value={bp.value}>
                          {bp.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Effective Date</Label>
                  <Input
                    type="date"
                    value={newCondition.effectiveDate}
                    onChange={(e) => setNewCondition(prev => ({ ...prev, effectiveDate: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleAdd} 
                  className="w-full"
                  disabled={!newCondition.name || !newCondition.rating || !newCondition.effectiveDate}
                >
                  Add Condition
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {approvedConditions.length === 0 ? (
          <div className="text-center py-6">
            <Award className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No approved conditions yet</p>
            <p className="text-xs text-muted-foreground mb-4 max-w-[280px] mx-auto">
              Add your VA-approved service-connected conditions to track your combined rating and get secondary claim suggestions.
            </p>
          </div>
        ) : (
          <>
            {/* Current Combined Rating Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-4 bg-success/10 rounded-xl border border-success/20">
                <p className="text-xs text-muted-foreground mb-1">Combined Rating</p>
                <p className="text-3xl font-bold text-success">{official}%</p>
                <p className="text-xs text-muted-foreground">Exact: {exact.toFixed(1)}%</p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-xl border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Monthly Payment</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(monthlyAmount)}</p>
                <p className="text-xs text-muted-foreground">2026 rates</p>
              </div>
            </div>

            {/* Conditions List */}
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="text-sm font-medium">
                {approvedConditions.length} Condition{approvedConditions.length !== 1 ? 's' : ''}
              </span>
              {showDetails ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {showDetails && (
              <div className="space-y-2">
                {approvedConditions.map((condition) => (
                  <div
                    key={condition.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-background"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{condition.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(parseISO(condition.effectiveDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-base px-3 bg-success/10 text-success border-success/20">
                        {condition.rating}%
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteApprovedCondition(condition.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        aria-label="Remove approved condition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Secondary Suggestions */}
            {secondarySuggestions.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Lightbulb className="h-4 w-4 text-warning" />
                  <span>Potential Secondary Claims</span>
                </div>
                <div className="space-y-2">
                  {secondarySuggestions.slice(0, 3).map((suggestion, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="font-medium text-sm min-w-0 truncate">{suggestion.condition}</span>
                        <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20 flex-shrink-0">
                          {suggestion.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        Secondary to <strong>{suggestion.primary}</strong>: {suggestion.connection.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigate to Calculator */}
            {onNavigateToCalculator && (
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={onNavigateToCalculator}
              >
                <TrendingUp className="h-4 w-4" />
                See Impact of Adding New Conditions
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
