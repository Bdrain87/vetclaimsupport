import { useState, useCallback, useMemo } from 'react';
import useAppStore from '@/store/useAppStore';
import {
  MapPin, Loader2, AlertTriangle, Copy, Check,
  Home, GraduationCap, Briefcase, Car, Trees, Gift, DollarSign, ExternalLink, Shield,
} from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clipboard } from '@capacitor/clipboard';
import { toast } from '@/hooks/use-toast';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { isGeminiConfigured, aiGenerateWithContext } from '@/lib/gemini';
import { useAICacheStore } from '@/store/useAICacheStore';
import {
  CURATED_STATES,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  type StateBenefit,
} from '@/data/stateBenefits';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'District of Columbia', 'Puerto Rico', 'Guam', 'U.S. Virgin Islands',
];

const CATEGORY_ICONS: Record<StateBenefit['category'], React.ElementType> = {
  property_tax: Home,
  income_tax: DollarSign,
  education: GraduationCap,
  employment: Briefcase,
  vehicle: Car,
  recreation: Trees,
  other: Gift,
};

const RATING_COLORS: Record<string, string> = {
  '100% P&T': 'bg-red-500/15 text-red-400 border-red-500/20',
  '90%+': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  '80%+': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  '70%+': 'bg-gold/15 text-gold border-gold/20',
  '50%+': 'bg-gold/10 text-gold/80 border-gold/15',
  '10%+': 'bg-gold/10 text-gold border-gold/20',
  'any rated': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  none: 'bg-gold/15 text-gold border-gold/20',
};

function RatingBadge({ rating }: { rating: string }) {
  const color = RATING_COLORS[rating] || RATING_COLORS['any rated'];
  const label = rating === 'none' ? 'All Veterans' : rating;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${color}`}>
      {label}
    </span>
  );
}

export default function StateBenefits() {
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [copied, setCopied] = useState(false);
  const { getCache, setCache } = useAICacheStore();
  const conditionCount = useAppStore((s) => s.userConditions.length);

  const curatedData = useMemo(
    () => (selectedState ? CURATED_STATES[selectedState] ?? null : null),
    [selectedState],
  );

  const groupedBenefits = useMemo(() => {
    if (!curatedData) return null;
    const groups: Partial<Record<StateBenefit['category'], StateBenefit[]>> = {};
    for (const b of curatedData.benefits) {
      (groups[b.category] ??= []).push(b);
    }
    return groups;
  }, [curatedData]);

  const fetchAIBenefits = useCallback(async () => {
    if (!selectedState || !isGeminiConfigured) return;
    const cacheKey = `state-benefits:${selectedState}:c${conditionCount}`;
    const cached = getCache(cacheKey);
    if (cached) { setAiResult(cached.result); return; }

    setLoading(true);
    setAiResult('');
    try {
      const prompt = `List the VA and veteran-specific state benefits available in ${selectedState}. Include:
1. **Property Tax Exemptions** — what disability rating is required, partial vs full exemption
2. **Income Tax Exemptions** — state income tax on VA disability compensation and/or military retirement pay
3. **Education Benefits** — state tuition waivers, dependent education benefits
4. **Employment** — state hiring preferences, license fee waivers
5. **Vehicle Benefits** — registration fee waivers, special license plates, parking
6. **Recreation** — hunting/fishing license discounts, state park passes
7. **Other Benefits** — homestead exemptions, business licenses, any unique state programs

Be specific with disability rating thresholds (e.g., "100% P&T required" vs "any rated veteran"). If a benefit is NOT offered by this state, say so. Keep it factual and concise.`;

      const { text } = await aiGenerateWithContext({
        prompt,
        feature: 'state-benefits',
        detailLevel: 'minimal',
      });
      setAiResult(text);
      setCache(cacheKey, text, 'state-benefits');
    } catch {
      setAiResult('Unable to load benefits. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedState, conditionCount, getCache, setCache]);

  const handleCopy = async () => {
    let text = '';
    if (curatedData) {
      text = curatedData.benefits.map((b) =>
        `${b.title}${b.ratingRequired ? ` (${b.ratingRequired})` : ''}\n${b.description}`
      ).join('\n\n');
    } else {
      text = aiResult;
    }
    try {
      await Clipboard.write({ string: text });
      setCopied(true);
      toast({ title: 'Copied to clipboard' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setAiResult('');
  };

  const showResults = curatedData || aiResult;

  return (
    <PageContainer className="py-6 space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gold/10 border border-gold/20">
          <MapPin className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">State Benefits Finder</h1>
          <p className="text-muted-foreground text-sm">Discover veteran benefits in your state</p>
        </div>
      </div>

      <AIDisclaimer variant="banner" />

      <div className="px-4 py-3 rounded-xl bg-gold/10 border border-gold/20 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Benefits vary by state and change frequently. Always verify with your state's Department of Veterans Affairs for the most current information.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select Your State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedState} onValueChange={handleStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a state..." />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                  {CURATED_STATES[state] ? ' ✓' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Show "Find Benefits" button only for non-curated states */}
          {selectedState && !curatedData && (
            <Button
              onClick={fetchAIBenefits}
              disabled={loading || !isGeminiConfigured}
              className="w-full bg-gold hover:bg-gold/80 text-black"
              size="lg"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading Benefits...</>
              ) : (
                'Find Benefits'
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Curated results */}
      {curatedData && groupedBenefits && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gold" />
              <span className="text-xs font-medium text-gold">Verified Data</span>
              <span className="text-[10px] text-muted-foreground">
                Last verified {curatedData.lastVerified}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {CATEGORY_ORDER.map((cat) => {
            const benefits = groupedBenefits[cat];
            if (!benefits?.length) return null;
            const Icon = CATEGORY_ICONS[cat];
            return (
              <Card key={cat}>
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gold" />
                    <CardTitle className="text-sm font-semibold">{CATEGORY_LABELS[cat]}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  {benefits.map((b, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{b.title}</p>
                        {b.ratingRequired && <RatingBadge rating={b.ratingRequired} />}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{b.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}

          <a
            href={curatedData.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 text-xs text-gold hover:text-gold/80 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Official {curatedData.state} Veterans Affairs
          </a>
        </div>
      )}

      {/* AI-generated results (non-curated states) */}
      {!curatedData && aiResult && (
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Benefits in {selectedState}</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-3 text-[10px] text-muted-foreground">
              <AlertTriangle className="h-3 w-3" />
              AI-generated — verify with your state DVA
            </div>
            <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {aiResult}
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="text-center py-8 space-y-2">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-gold" />
          <p className="text-sm text-muted-foreground">Loading benefits for {selectedState}...</p>
        </div>
      )}

      {!isGeminiConfigured && selectedState && !curatedData && (
        <p className="text-sm text-muted-foreground text-center">
          Curated data not yet available for {selectedState}. AI features are not configured.
        </p>
      )}
    </PageContainer>
  );
}
