import { useState, useMemo } from 'react';
import { Calculator, Plus, Trash2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

interface RatedCondition {
  id: string;
  name: string;
  rating: number;
}

const commonRatings = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// Monthly compensation rates (2024 rates, approximate)
const monthlyCompensation: Record<number, number> = {
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

function calculateVACombinedRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  if (ratings.length === 1) return ratings[0];

  // Sort descending
  const sorted = [...ratings].sort((a, b) => b - a);
  
  // VA math: Each rating is applied to what's "left" of 100%
  let remaining = 100;
  for (const rating of sorted) {
    remaining = remaining - (remaining * (rating / 100));
  }
  
  const combined = 100 - remaining;
  
  // Round to nearest 10
  return Math.round(combined / 10) * 10;
}

export function RatingCalculator() {
  const [conditions, setConditions] = useState<RatedCondition[]>([]);
  const [newConditionName, setNewConditionName] = useState('');
  const [newConditionRating, setNewConditionRating] = useState<string>('');

  const addCondition = () => {
    if (!newConditionName || !newConditionRating) return;
    
    setConditions([
      ...conditions,
      {
        id: crypto.randomUUID(),
        name: newConditionName,
        rating: parseInt(newConditionRating),
      },
    ]);
    setNewConditionName('');
    setNewConditionRating('');
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const combinedRating = useMemo(() => {
    const ratings = conditions.map((c) => c.rating).filter((r) => r > 0);
    return calculateVACombinedRating(ratings);
  }, [conditions]);

  const exactCombined = useMemo(() => {
    const ratings = conditions.map((c) => c.rating).filter((r) => r > 0);
    if (ratings.length === 0) return 0;
    if (ratings.length === 1) return ratings[0];
    
    const sorted = [...ratings].sort((a, b) => b - a);
    let remaining = 100;
    for (const rating of sorted) {
      remaining = remaining - (remaining * (rating / 100));
    }
    return 100 - remaining;
  }, [conditions]);

  const estimatedCompensation = monthlyCompensation[combinedRating] || 0;

  return (
    <Card className="data-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          VA Rating Calculator
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                The VA uses "VA math" - not simple addition. Each disability is
                applied to what's "left" of 100%, then rounded to nearest 10%.
              </p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Condition */}
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
              {commonRatings.map((r) => (
                <SelectItem key={r} value={r.toString()}>
                  {r}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addCondition} disabled={!newConditionName || !newConditionRating}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Conditions List */}
        {conditions.length > 0 && (
          <div className="space-y-2">
            {conditions.map((condition, idx) => (
              <div
                key={condition.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-mono">
                    #{idx + 1}
                  </span>
                  <span className="font-medium">{condition.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Exact Combined</p>
                <p className="text-2xl font-bold">{exactCombined.toFixed(1)}%</p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Official Rating</p>
                <p className="text-2xl font-bold text-primary">{combinedRating}%</p>
              </div>
            </div>

            <div className="text-center p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Est. Monthly Compensation</p>
              <p className="text-3xl font-bold text-success">
                ${estimatedCompensation.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on 2024 rates for single veteran, no dependents
              </p>
            </div>

            {/* VA Math Explanation */}
            {conditions.length > 1 && (
              <div className="p-3 bg-muted/30 rounded-lg text-sm">
                <p className="font-medium mb-2">How VA Math Works:</p>
                <div className="space-y-1 text-muted-foreground">
                  {conditions
                    .map((c) => c.rating)
                    .filter((r) => r > 0)
                    .sort((a, b) => b - a)
                    .map((rating, idx, arr) => {
                      let remaining = 100;
                      for (let i = 0; i < idx; i++) {
                        remaining = remaining - (remaining * (arr[i] / 100));
                      }
                      const applied = remaining * (rating / 100);
                      return (
                        <p key={idx}>
                          {idx === 0
                            ? `Start with ${rating}% = ${rating}%`
                            : `${rating}% of remaining ${remaining.toFixed(1)}% = +${applied.toFixed(1)}%`}
                        </p>
                      );
                    })}
                  <p className="font-medium text-foreground pt-2">
                    Total: {exactCombined.toFixed(1)}% → Rounds to {combinedRating}%
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {conditions.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add your service-connected conditions to calculate your combined rating
          </p>
        )}
      </CardContent>
    </Card>
  );
}
