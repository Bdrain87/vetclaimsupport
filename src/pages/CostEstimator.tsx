import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  TrendingUp,
  DollarSign,
  Users,
  Info,
  Calendar,
  Calculator,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PageContainer } from '@/components/PageContainer';
import {
  BASE_RATES,
  DEPENDENCY_THRESHOLD,
  calculateMonthlyCompensation,
  formatCurrency,
} from '@/utils/backPayCalc';

const RATING_OPTIONS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const COUNT_OPTIONS = Array.from({ length: 11 }, (_, i) => i);
const AGE_OPTIONS = Array.from({ length: 71 }, (_, i) => i + 18); // ages 18–88

const PROJECTIONS = [
  { label: '1 Year', months: 12 },
  { label: '5 Years', months: 60 },
  { label: '10 Years', months: 120 },
  { label: '20 Years', months: 240 },
];

export default function CostEstimator() {
  const navigate = useNavigate();

  const [rating, setRating] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [hasSpouse, setHasSpouse] = useState(false);
  const [childrenUnder18, setChildrenUnder18] = useState<string>('0');
  const [childrenInSchool, setChildrenInSchool] = useState<string>('0');
  const [dependentParents, setDependentParents] = useState<string>('0');

  const result = useMemo(() => {
    const ratingNum = rating ? parseInt(rating, 10) : null;
    const ageNum = age ? parseInt(age, 10) : null;

    if (ratingNum === null || ageNum === null) return null;

    const under18 = parseInt(childrenUnder18, 10) || 0;
    const inSchool = parseInt(childrenInSchool, 10) || 0;
    const parents = parseInt(dependentParents, 10) || 0;

    const monthly = calculateMonthlyCompensation(ratingNum, hasSpouse, under18, inSchool, parents);
    const annual = monthly * 12;

    // Use 80 as life expectancy baseline for projections (conservative)
    const lifeExpectancy = 80;
    const yearsRemaining = Math.max(0, lifeExpectancy - ageNum);
    const lifetimeMonths = yearsRemaining * 12;
    const lifetimeTotal = monthly * lifetimeMonths;

    const projections = PROJECTIONS.map(({ label, months }) => ({
      label,
      total: monthly * months,
    }));

    return {
      monthly,
      annual,
      ratingNum,
      ageNum,
      yearsRemaining,
      lifetimeTotal,
      lifetimeMonths,
      projections,
    };
  }, [rating, age, hasSpouse, childrenUnder18, childrenInSchool, dependentParents]);

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
          <TrendingUp className="h-6 w-6 text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground">Lifetime Benefits Estimator</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Project your total VA disability compensation over time based on your current rating and age.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-primary" />
            Your Information
          </CardTitle>
          <CardDescription>
            Enter your current rating and age to see projected lifetime benefits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Current Combined Rating</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {RATING_OPTIONS.map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {r}%{r === 0 ? ' (No rating)' : ''} &mdash; {formatCurrency(BASE_RATES[r] ?? 0)}/mo
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Current Age
              </Label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_OPTIONS.map((a) => (
                    <SelectItem key={a} value={String(a)}>
                      {a} years old
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dependent Information */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-foreground">
              <Users className="h-4 w-4 text-muted-foreground" />
              Dependent Information
            </Label>
            <p className="text-xs text-muted-foreground -mt-2">
              Dependents affect compensation at {DEPENDENCY_THRESHOLD}% and above.
            </p>

            <div className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-3 border border-border/30">
              <Checkbox
                id="hasSpouse"
                checked={hasSpouse}
                onCheckedChange={(checked) => setHasSpouse(checked === true)}
              />
              <Label htmlFor="hasSpouse" className="text-foreground cursor-pointer select-none">
                Married (has spouse)
              </Label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Children under 18</Label>
                <Select value={childrenUnder18} onValueChange={setChildrenUnder18}>
                  <SelectTrigger>
                    <SelectValue placeholder="0" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNT_OPTIONS.map((c) => (
                      <SelectItem key={c} value={String(c)}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Children 18-23 in school</Label>
                <Select value={childrenInSchool} onValueChange={setChildrenInSchool}>
                  <SelectTrigger>
                    <SelectValue placeholder="0" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNT_OPTIONS.map((c) => (
                      <SelectItem key={c} value={String(c)}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Dependent parents</Label>
                <Select value={dependentParents} onValueChange={setDependentParents}>
                  <SelectTrigger>
                    <SelectValue placeholder="0" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNT_OPTIONS.slice(0, 3).map((c) => (
                      <SelectItem key={c} value={String(c)}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          {/* Monthly & Annual Summary */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-gold" />
                Current Compensation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 rounded-xl p-4 border border-border/30 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Monthly</p>
                  <p className="text-2xl font-bold text-gold">{formatCurrency(result.monthly)}</p>
                </div>
                <div className="bg-muted/40 rounded-xl p-4 border border-border/30 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Annual</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(result.annual)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Projections */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-gold" />
                Projected Totals
              </CardTitle>
              <CardDescription>
                Based on {result.ratingNum}% rating at age {result.ageNum}, using 2026 rates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.projections.map(({ label, total }) => (
                <div
                  key={label}
                  className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3 border border-border/30"
                >
                  <span className="text-sm font-medium text-foreground">{label}</span>
                  <span className="text-base font-bold text-foreground">{formatCurrency(total)}</span>
                </div>
              ))}

              {/* Lifetime estimate */}
              <div className="flex items-center justify-between bg-gold/10 rounded-xl px-4 py-3 border border-gold/30">
                <div>
                  <span className="text-sm font-semibold text-gold">Lifetime Estimate</span>
                  <p className="text-xs text-muted-foreground">
                    {result.yearsRemaining} yr{result.yearsRemaining !== 1 ? 's' : ''} remaining (to age 80)
                  </p>
                </div>
                <span className="text-lg font-bold text-gold">{formatCurrency(result.lifetimeTotal)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 text-xs text-muted-foreground bg-muted/30 rounded-xl px-4 py-3 border border-border/30">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Estimates use 2026 VA compensation rates and assume a constant rating. Actual
              payments may vary with COLA adjustments, rating changes, or dependent status
              changes. Lifetime projection assumes benefits through age 80. This tool is for
              planning purposes only — not a guarantee of future payments.
            </p>
          </div>
        </>
      )}
    </PageContainer>
  );
}
