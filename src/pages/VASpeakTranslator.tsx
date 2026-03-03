import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Languages, Sparkles, Loader2, BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAIGenerate } from '@/hooks/useAIGenerate';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { AIContentBadge } from '@/components/ui/AIContentBadge';
import { PageContainer } from '@/components/PageContainer';
import { useToast } from '@/hooks/use-toast';

// ---------------------------------------------------------------------------
// VA Glossary Data
// ---------------------------------------------------------------------------

interface GlossaryEntry {
  term: string;
  definition: string;
  category: 'claims-process' | 'medical' | 'legal' | 'rating' | 'evidence';
}

const VA_GLOSSARY: GlossaryEntry[] = [
  {
    term: 'Service Connection',
    definition:
      'The VA has determined that your condition is linked to your military service. This is the foundation of any VA disability claim.',
    category: 'claims-process',
  },
  {
    term: 'Nexus',
    definition:
      'The medical connection between your current condition and your military service. A doctor\'s opinion letter states this link exists.',
    category: 'medical',
  },
  {
    term: 'At Least as Likely as Not',
    definition:
      'A 50% or greater probability that your condition is related to service. This is the standard of proof the VA uses -- you do not need to prove certainty.',
    category: 'legal',
  },
  {
    term: 'Bilateral',
    definition:
      'Affecting both sides of the body (e.g., both knees, both shoulders). Bilateral conditions receive an extra 10% boost under VA math.',
    category: 'medical',
  },
  {
    term: 'C&P Exam',
    definition:
      'Compensation and Pension examination. A medical exam the VA orders to evaluate the severity of your claimed conditions and verify service connection.',
    category: 'claims-process',
  },
  {
    term: 'DBQ (Disability Benefits Questionnaire)',
    definition:
      'A standardized form doctors fill out to document the severity of your disability. Private doctors can complete these for your claim.',
    category: 'evidence',
  },
  {
    term: 'Diagnostic Code',
    definition:
      'A number the VA assigns to each disability that determines which rating criteria apply. Found in 38 CFR Part 4.',
    category: 'rating',
  },
  {
    term: 'Effective Date',
    definition:
      'The date from which the VA starts paying your benefits. Usually the date you filed your claim or Intent to File, whichever is earlier.',
    category: 'claims-process',
  },
  {
    term: 'Fully Developed Claim (FDC)',
    definition:
      'A claim submitted with all supporting evidence already included. FDCs are processed faster because the VA does not need to gather additional records.',
    category: 'claims-process',
  },
  {
    term: 'Intent to File',
    definition:
      'A notification to the VA that you plan to file a claim. It locks in your effective date for up to one year while you gather evidence.',
    category: 'claims-process',
  },
  {
    term: 'Lay Evidence',
    definition:
      'Non-medical evidence such as personal statements, buddy statements, or family observations about your symptoms and how they affect daily life.',
    category: 'evidence',
  },
  {
    term: 'Doctor Summary (Nexus Letter)',
    definition:
      'A letter from a medical professional stating that your condition is "at least as likely as not" connected to your military service. Often the most critical piece of evidence.',
    category: 'evidence',
  },
  {
    term: 'Prostrating',
    definition:
      'So severe that it forces you to stop all activity and lie down. The VA uses this term for migraines and other conditions to determine higher ratings.',
    category: 'medical',
  },
  {
    term: 'Pyramiding',
    definition:
      'The prohibited practice of rating the same symptoms under multiple diagnostic codes. The VA cannot double-count your symptoms.',
    category: 'rating',
  },
  {
    term: 'Range of Motion (ROM)',
    definition:
      'How far you can move a joint. The VA measures this in degrees and uses it to assign ratings for musculoskeletal conditions.',
    category: 'medical',
  },
  {
    term: 'Secondary Condition',
    definition:
      'A disability caused or permanently worsened by an already service-connected condition. For example, depression caused by chronic back pain.',
    category: 'claims-process',
  },
  {
    term: 'SMC (Special Monthly Compensation)',
    definition:
      'Additional compensation above the standard rating for severe disabilities, such as loss of a limb or the need for aid and attendance.',
    category: 'rating',
  },
  {
    term: 'Supplemental Claim',
    definition:
      'A new claim filed after a denial that includes new and relevant evidence not previously considered by the VA.',
    category: 'claims-process',
  },
  {
    term: 'TDIU (Total Disability Individual Unemployability)',
    definition:
      'Allows veterans rated below 100% to receive 100% compensation if their service-connected disabilities prevent them from holding substantially gainful employment.',
    category: 'rating',
  },
  {
    term: 'VA Math',
    definition:
      'The method the VA uses to calculate combined ratings. Each rating is applied to the remaining "whole person" rather than simply added. For example, 50% + 30% = 65%, not 80%.',
    category: 'rating',
  },
  {
    term: 'Buddy Statement',
    definition:
      'A written statement from someone who witnessed your condition, symptoms, or the event that caused your disability. Fellow service members, family, or friends can provide these.',
    category: 'evidence',
  },
  {
    term: 'Aggravation',
    definition:
      'A pre-existing condition that was permanently worsened beyond its natural progression by military service. The VA rates the degree of worsening.',
    category: 'medical',
  },
  {
    term: 'Flare-up',
    definition:
      'A temporary worsening of symptoms beyond your baseline. Documenting flare-up frequency, duration, and severity is critical for accurate ratings.',
    category: 'medical',
  },
  {
    term: 'Higher-Level Review (HLR)',
    definition:
      'An appeal option where a senior VA reviewer re-examines your claim decision for clear errors, without considering new evidence.',
    category: 'claims-process',
  },
  {
    term: 'Functional Impairment',
    definition:
      'How your disability limits your ability to perform daily activities, work, and social functions. The VA rates based on functional loss, not just diagnosis.',
    category: 'rating',
  },
];

const CATEGORY_LABELS: Record<GlossaryEntry['category'], string> = {
  'claims-process': 'Claims Process',
  medical: 'Medical',
  legal: 'Legal Standard',
  rating: 'Rating',
  evidence: 'Evidence',
};

const CATEGORY_COLORS: Record<GlossaryEntry['category'], string> = {
  'claims-process': 'bg-warning/10 text-warning border-warning/20',
  medical: 'bg-success/10 text-success border-success/20',
  legal: 'bg-warning/10 text-warning border-warning/20',
  rating: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  evidence: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function VASpeakTranslator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { generate, isLoading, error } = useAIGenerate('VA_SPEAK_TRANSLATOR');

  // Translator state
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Glossary state
  const [glossarySearch, setGlossarySearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<GlossaryEntry['category'] | 'all'>('all');

  // -------------------------------------------------------------------------
  // Translator logic
  // -------------------------------------------------------------------------

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    setTranslatedText(null);
    setCopied(false);

    const prompt = [
      'Translate the following veteran\'s plain-English symptom description into professional VA clinical terminology.',
      'Use language appropriate for VA Form 21-4138 (Statement in Support of Claim).',
      'Use 38 CFR nomenclature where applicable.',
      'Maintain the truthful meaning -- do not exaggerate or add symptoms.',
      'Return ONLY the translated clinical text, no commentary.',
      '',
      `Veteran's description: "${inputText}"`,
    ].join('\n');

    const result = await generate(prompt);
    if (result) {
      setTranslatedText(result);
    }
  }, [inputText, isLoading, generate]);

  const handleCopy = useCallback(async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: 'Unable to access clipboard.', variant: 'destructive' });
    }
  }, [translatedText, toast]);

  const handleClear = useCallback(() => {
    setInputText('');
    setTranslatedText(null);
    setCopied(false);
  }, []);

  // -------------------------------------------------------------------------
  // Glossary filtering
  // -------------------------------------------------------------------------

  const filteredGlossary = useMemo(() => {
    let entries = VA_GLOSSARY;

    if (activeCategory !== 'all') {
      entries = entries.filter((e) => e.category === activeCategory);
    }

    if (glossarySearch.trim()) {
      const q = glossarySearch.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q),
      );
    }

    return entries.sort((a, b) => a.term.localeCompare(b.term));
  }, [glossarySearch, activeCategory]);

  const categories: Array<GlossaryEntry['category'] | 'all'> = [
    'all',
    'claims-process',
    'medical',
    'legal',
    'rating',
    'evidence',
  ];

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <PageContainer className="py-6 space-y-6 animate-fade-in">
      {/* Back navigation */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-1">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Languages className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">VA-Speak Translator</h1>
          <p className="text-muted-foreground text-sm">
            Translate everyday language into VA-accepted clinical terminology
          </p>
        </div>
      </div>

      {/* AI Disclaimer */}
      <AIDisclaimer variant="banner" />

      {/* ----------------------------------------------------------------- */}
      {/* Translator Section                                                 */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Translate Your Symptoms
          </CardTitle>
          <CardDescription>
            Describe your symptoms the way you would tell a friend, then let AI
            convert them into professional VA clinical terminology for your claim
            paperwork.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input */}
          <div className="space-y-2">
            <label
              htmlFor="symptom-input"
              className="text-sm font-medium text-foreground"
            >
              Your Description
            </label>
            <Textarea
              id="symptom-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={"Example: My back hurts all the time and I can't bend over to tie my shoes. My knees pop and ache going up stairs. I get terrible headaches that make me hide in a dark room."}
              className="min-h-[140px] text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Be as specific as you can about what hurts, when, how often, and how
              it affects your daily life.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isLoading}
              className="flex-1 gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Languages className="h-4 w-4" />
              )}
              {isLoading ? 'Translating...' : 'Translate to VA-Speak'}
            </Button>

            {(inputText || translatedText) && (
              <Button variant="outline" onClick={handleClear} className="gap-2">
                Clear
              </Button>
            )}
          </div>

          {/* Error display */}
          {error && !isLoading && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Translated output */}
          {translatedText && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  VA Clinical Terminology
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs border-success/30 text-success"
                >
                  38 CFR
                </Badge>
              </div>

              <AIContentBadge timestamp={new Date().toISOString()} />
              <div className="rounded-lg border border-success/20 bg-success/5 p-4">
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {translatedText}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="flex-1 gap-2"
                >
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                <strong>Important:</strong> Always verify the translation preserves
                the truthful meaning of your original description. Do not use
                terminology that exaggerates or misrepresents your symptoms.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Glossary Section                                                   */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            VA Terms Glossary
          </CardTitle>
          <CardDescription>
            Common VA claims terms translated into plain English so you know
            exactly what the VA is talking about.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              placeholder="Search terms or definitions..."
              className="pl-10"
              aria-label="Search VA terms"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary/15 text-primary border-primary/40'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                }`}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground">
            {filteredGlossary.length} term{filteredGlossary.length !== 1 ? 's' : ''}
            {glossarySearch && ` matching "${glossarySearch}"`}
          </p>

          {/* Glossary list */}
          {filteredGlossary.length > 0 ? (
            <div className="space-y-3">
              {filteredGlossary.map((entry) => (
                <div
                  key={entry.term}
                  className="rounded-lg border border-border bg-card p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      {entry.term}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 ${CATEGORY_COLORS[entry.category]}`}
                    >
                      {CATEGORY_LABELS[entry.category]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {entry.definition}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <BookOpen className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                No terms found matching your search.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Try a different keyword or clear the filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Tips Card                                                          */}
      {/* ----------------------------------------------------------------- */}
      <Card className="border-gold/20 bg-gold/5">
        <CardContent className="pt-6 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Tips for Describing Your Symptoms
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5 shrink-0">1.</span>
              <span>
                <strong className="text-foreground">Be specific about frequency</strong>
                {' '}&mdash; say "5 times per week" instead of "frequently."
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5 shrink-0">2.</span>
              <span>
                <strong className="text-foreground">Describe your worst days</strong>
                {' '}&mdash; the VA rates based on the impact of flare-ups, not just
                average days.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5 shrink-0">3.</span>
              <span>
                <strong className="text-foreground">Include functional impact</strong>
                {' '}&mdash; explain what you can no longer do (work tasks, hobbies,
                household chores).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5 shrink-0">4.</span>
              <span>
                <strong className="text-foreground">Mention both sides</strong>
                {' '}&mdash; if a condition affects both knees or both shoulders,
                say so explicitly for bilateral consideration.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5 shrink-0">5.</span>
              <span>
                <strong className="text-foreground">Stay truthful</strong>
                {' '}&mdash; clinical language should describe what you actually
                experience, not exaggerate it. Accuracy builds credibility.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
