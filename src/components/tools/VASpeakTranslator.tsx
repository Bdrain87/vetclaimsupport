import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DisclaimerNotice } from '@/components/shared/DisclaimerNotice';
import {
  Languages,
  Copy,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Plus,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TranslationEntry {
  id: string;
  plainText: string;
  clinicalText: string;
}

// Comprehensive translation patterns: plain English -> VA clinical terminology
const TRANSLATION_RULES: { pattern: RegExp; replacement: string; category: string }[] = [
  // Pain descriptions
  { pattern: /\b(knees? pop(?:s|ping)?)\b/gi, replacement: 'patellofemoral crepitus', category: 'Musculoskeletal' },
  { pattern: /\b(knee(?:s)? (?:hurt|ache|pain)(?:s|ing)?)\b/gi, replacement: 'bilateral knee pain with functional limitation', category: 'Musculoskeletal' },
  { pattern: /\b(back (?:hurts?|aching|pain))\b/gi, replacement: 'chronic lumbosacral strain with limited range of motion', category: 'Musculoskeletal' },
  { pattern: /\b(neck (?:hurts?|aching|pain|stiff(?:ness)?))\b/gi, replacement: 'cervical spine strain with restricted range of motion', category: 'Musculoskeletal' },
  { pattern: /\b(shoulder (?:hurts?|aching|pain))\b/gi, replacement: 'glenohumeral joint pain with restricted range of motion', category: 'Musculoskeletal' },
  { pattern: /\b(hip (?:hurts?|aching|pain))\b/gi, replacement: 'coxofemoral joint pain with functional impairment', category: 'Musculoskeletal' },
  { pattern: /\b(ankle (?:hurts?|aching|pain|give(?:s)? (?:out|way)))\b/gi, replacement: 'ankle instability with recurrent subluxation', category: 'Musculoskeletal' },
  { pattern: /\b(joints? (?:are |)(stiff|lock(?:ing|s)?|frozen?))\b/gi, replacement: 'joint stiffness with limitation of motion', category: 'Musculoskeletal' },
  { pattern: /\b((?:can'?t|cannot|unable to) (?:bend|touch (?:my )?toes))\b/gi, replacement: 'limited forward flexion of the thoracolumbar spine', category: 'Musculoskeletal' },
  { pattern: /\b((?:can'?t|cannot|unable to) (?:lift|raise) (?:my )?arm)\b/gi, replacement: 'limited range of motion of the shoulder with inability to raise arm above shoulder level', category: 'Musculoskeletal' },
  { pattern: /\b((?:legs?|feet|foot) (?:go(?:es)? numb|numb(?:ness)?|tingle|tingling))\b/gi, replacement: 'lower extremity radiculopathy with paresthesia', category: 'Neurological' },
  { pattern: /\b((?:hands?|fingers?|arms?) (?:go(?:es)? numb|numb(?:ness)?|tingle|tingling))\b/gi, replacement: 'upper extremity peripheral neuropathy with paresthesia', category: 'Neurological' },
  { pattern: /\b(muscle spasm(?:s)?)\b/gi, replacement: 'involuntary muscle spasm with guarding', category: 'Musculoskeletal' },
  { pattern: /\b(bones? (?:crack|pop|grind)(?:s|ing)?)\b/gi, replacement: 'joint crepitus with degenerative changes', category: 'Musculoskeletal' },
  { pattern: /\b(walking (?:hurts?|is (?:hard|difficult|painful)))\b/gi, replacement: 'antalgic gait with weight-bearing limitation', category: 'Musculoskeletal' },

  // Headache / Migraine
  { pattern: /\b(headaches? (?:make me|that make(?:s)? me) (?:miss work|call (?:in|out)|stay home))\b/gi, replacement: 'prostrating migraine attacks resulting in significant occupational impairment', category: 'Neurological' },
  { pattern: /\b(headaches? (?:make me|that make(?:s)? me) (?:hide|lie down|go to bed|lay down|stay in (?:a )?dark))\b/gi, replacement: 'prostrating migraine attacks requiring bed rest in a darkened environment', category: 'Neurological' },
  { pattern: /\b(bad headaches?|terrible headaches?|severe headaches?)\b/gi, replacement: 'characteristic prostrating migraine attacks', category: 'Neurological' },
  { pattern: /\b(headaches? (?:all the time|every day|daily|constant))\b/gi, replacement: 'chronic daily headache disorder with prostrating episodes', category: 'Neurological' },
  { pattern: /\b(light (?:hurts|bothers) (?:my )?eyes?)\b/gi, replacement: 'photophobia', category: 'Neurological' },
  { pattern: /\b(noise (?:hurts|bothers|makes it worse))\b/gi, replacement: 'phonophobia', category: 'Neurological' },

  // Mental Health
  { pattern: /\b((?:can'?t|cannot|don'?t) sleep)\b/gi, replacement: 'chronic insomnia with sleep disturbance', category: 'Mental Health' },
  { pattern: /\b(nightmares?)\b/gi, replacement: 'recurrent distressing dreams related to traumatic events', category: 'Mental Health' },
  { pattern: /\b(flashback(?:s)?)\b/gi, replacement: 'intrusive re-experiencing of traumatic events (flashbacks)', category: 'Mental Health' },
  { pattern: /\b((?:always |)(angry|irritable|short fuse|lose my temper|snap at))\b/gi, replacement: 'persistent irritability and outbursts of anger', category: 'Mental Health' },
  { pattern: /\b((?:don'?t|do not) (?:want to|wanna) (?:go out|leave|see (?:people|anyone)|be around))\b/gi, replacement: 'social withdrawal and avoidance behavior', category: 'Mental Health' },
  { pattern: /\b((?:feel|feeling) (?:hopeless|worthless|empty))\b/gi, replacement: 'persistent depressed mood with feelings of worthlessness', category: 'Mental Health' },
  { pattern: /\b((?:can'?t|cannot) (?:concentrate|focus|pay attention|think straight))\b/gi, replacement: 'impaired concentration and cognitive dysfunction', category: 'Mental Health' },
  { pattern: /\b((?:always |)(jumpy|startle|on edge|on guard|hyper-?alert))\b/gi, replacement: 'hypervigilance with exaggerated startle response', category: 'Mental Health' },
  { pattern: /\b(panic attack(?:s)?)\b/gi, replacement: 'panic attacks with autonomic arousal', category: 'Mental Health' },
  { pattern: /\b((?:can'?t|cannot|trouble) remember(?:ing)?)\b/gi, replacement: 'impaired short-term memory', category: 'Mental Health' },
  { pattern: /\b(avoid(?:ing)? crowds?)\b/gi, replacement: 'agoraphobic avoidance behavior', category: 'Mental Health' },
  { pattern: /\b(mood swings?)\b/gi, replacement: 'affective lability with rapid mood fluctuations', category: 'Mental Health' },

  // Sleep
  { pattern: /\b(snor(?:e|ing) (?:really |very |)(?:loud|bad)(?:ly)?)\b/gi, replacement: 'obstructive sleep-disordered breathing', category: 'Respiratory' },
  { pattern: /\b((?:stop|quit) breathing (?:at night|when (?:I |)(sleep|asleep)))\b/gi, replacement: 'witnessed apneic episodes during sleep', category: 'Respiratory' },
  { pattern: /\b((?:always |)(tired|exhausted|fatigued) (?:during|all|throughout) (?:the )?day)\b/gi, replacement: 'persistent daytime hypersomnolence', category: 'Respiratory' },
  { pattern: /\b((?:use|wear|need) (?:a )?(?:cpap|c-pap|breathing machine))\b/gi, replacement: 'prescribed and compliant with continuous positive airway pressure (CPAP) therapy', category: 'Respiratory' },

  // Hearing
  { pattern: /\b(ringing (?:in (?:my )?ears?|ears?))\b/gi, replacement: 'persistent bilateral tinnitus', category: 'Auditory' },
  { pattern: /\b((?:can'?t|cannot|hard to) hear)\b/gi, replacement: 'sensorineural hearing loss', category: 'Auditory' },
  { pattern: /\b(ears? (?:ring(?:s|ing)?|buzz(?:es|ing)?))\b/gi, replacement: 'persistent tinnitus', category: 'Auditory' },

  // Digestive
  { pattern: /\b((?:acid |)(?:reflux|heartburn|indigestion))\b/gi, replacement: 'gastroesophageal reflux disease (GERD)', category: 'Digestive' },
  { pattern: /\b(stomach (?:hurts?|pain|problems?|issues?))\b/gi, replacement: 'epigastric distress with gastrointestinal dysfunction', category: 'Digestive' },
  { pattern: /\b((?:throw(?:ing)? up|vomit(?:ing)?|nausea) (?:a lot|frequently|often))\b/gi, replacement: 'recurrent nausea and emesis', category: 'Digestive' },

  // Skin
  { pattern: /\b(rash(?:es)? (?:that (?:won'?t|don'?t)|never) (?:go away|heal))\b/gi, replacement: 'chronic dermatitis with persistent lesions', category: 'Skin' },
  { pattern: /\b(skin (?:breaks? out|flares?|itchy|itching))\b/gi, replacement: 'recurrent dermatological flare with pruritus', category: 'Skin' },

  // General
  { pattern: /\b((?:it |this |)((?:makes|causes) me (?:to )?miss work))\b/gi, replacement: 'condition results in significant occupational impairment with lost workdays', category: 'Functional Impact' },
  { pattern: /\b((?:can'?t|cannot) (?:do (?:my )?(?:job|work)|work))\b/gi, replacement: 'condition prevents substantial gainful employment', category: 'Functional Impact' },
  { pattern: /\b(need(?:s)? help (?:getting dressed|bathing|with (?:daily |)(?:stuff|tasks|activities)))\b/gi, replacement: 'requires assistance with activities of daily living (ADLs)', category: 'Functional Impact' },
  { pattern: /\b((?:getting|gets?) worse)\b/gi, replacement: 'progressive worsening of condition', category: 'General' },
  { pattern: /\b(pain every day|daily pain|constant pain|always in pain)\b/gi, replacement: 'chronic persistent pain syndrome', category: 'General' },
  { pattern: /\b(take(?:s|ing)? (?:pills?|medicine|medication) (?:for (?:it|pain|this)))\b/gi, replacement: 'requires ongoing pharmacological management', category: 'General' },
];

// Example translations for reference
const EXAMPLE_TRANSLATIONS = [
  { plain: 'My knees pop and hurt when I walk', clinical: 'Bilateral patellofemoral crepitus with mechanical instability and weight-bearing limitation.' },
  { plain: 'Headaches make me miss work and hide in a dark room', clinical: 'Prostrating migraine attacks resulting in significant occupational impairment and requiring bed rest in a darkened environment.' },
  { plain: "Can't sleep because of nightmares", clinical: 'Chronic insomnia with sleep disturbance secondary to recurrent distressing dreams related to traumatic events.' },
  { plain: 'My back hurts so bad I can\'t bend over', clinical: 'Chronic lumbosacral strain with limited range of motion, specifically limited forward flexion of the thoracolumbar spine.' },
  { plain: 'Always tired during the day, use a CPAP', clinical: 'Persistent daytime hypersomnolence; prescribed and compliant with continuous positive airway pressure (CPAP) therapy.' },
];

function translateText(input: string): { translated: string; matchedCategories: string[] } {
  let result = input;
  const categories = new Set<string>();

  for (const rule of TRANSLATION_RULES) {
    if (rule.pattern.test(result)) {
      categories.add(rule.category);
      result = result.replace(rule.pattern, rule.replacement);
      // Reset lastIndex for global regex
      rule.pattern.lastIndex = 0;
    }
  }

  // Capitalize first letter of sentences
  result = result.replace(/(^|[.!?]\s+)([a-z])/g, (_, prefix, char) => prefix + char.toUpperCase());

  // Ensure it ends with a period
  result = result.trim();
  if (result && !result.endsWith('.') && !result.endsWith('!') && !result.endsWith('?')) {
    result += '.';
  }

  return { translated: result, matchedCategories: Array.from(categories) };
}

export function VASpeakTranslator() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<TranslationEntry[]>([{
    id: crypto.randomUUID(),
    plainText: '',
    clinicalText: '',
  }]);
  const [activeEntryId, setActiveEntryId] = useState(entries[0].id);

  const activeEntry = entries.find(e => e.id === activeEntryId) || entries[0];

  const handleTranslate = () => {
    if (!activeEntry.plainText.trim()) return;

    const { translated } = translateText(activeEntry.plainText);

    setEntries(prev => prev.map(e =>
      e.id === activeEntryId ? { ...e, clinicalText: translated } : e
    ));
  };

  const handleAddEntry = () => {
    const newEntry: TranslationEntry = {
      id: crypto.randomUUID(),
      plainText: '',
      clinicalText: '',
    };
    setEntries(prev => [...prev, newEntry]);
    setActiveEntryId(newEntry.id);
  };

  const handleRemoveEntry = (id: string) => {
    if (entries.length <= 1) return;
    setEntries(prev => prev.filter(e => e.id !== id));
    if (activeEntryId === id) {
      setActiveEntryId(entries.find(e => e.id !== id)?.id || entries[0].id);
    }
  };

  const handleCopyAll = async () => {
    const translatedEntries = entries.filter(e => e.clinicalText);
    if (translatedEntries.length === 0) return;

    const text = translatedEntries
      .map(e => e.clinicalText)
      .join('\n\n');

    await navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: `${translatedEntries.length} translated statement${translatedEntries.length > 1 ? 's' : ''} copied.`,
    });
  };

  const handleCopySingle = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Translation copied to clipboard.',
    });
  };

  const handleReset = () => {
    const newEntry: TranslationEntry = {
      id: crypto.randomUUID(),
      plainText: '',
      clinicalText: '',
    };
    setEntries([newEntry]);
    setActiveEntryId(newEntry.id);
  };

  const translatedCount = entries.filter(e => e.clinicalText).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Languages className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">VA-Speak Translator</CardTitle>
              <CardDescription>
                Convert plain English symptom descriptions into professional VA clinical terminology
                for VA Form 21-4138 (Statement in Support of Claim)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert className="border-primary/30 bg-background">
            <Lightbulb className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              Type how you would naturally describe your symptoms, then translate to see
              the clinical terminology that carries more weight with VA raters. Uses official
              38 CFR nomenclature standards.
            </AlertDescription>
          </Alert>
          <DisclaimerNotice variant="inline" />
        </CardContent>
      </Card>

      {/* Translation Interface */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Side */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              Plain English
              <Badge variant="outline" className="text-xs">Your Words</Badge>
            </CardTitle>
            <CardDescription>
              Describe your symptoms the way you'd tell a friend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Entry tabs when multiple */}
            {entries.length > 1 && (
              <div className="flex flex-wrap gap-1">
                {entries.map((e, i) => (
                  <div key={e.id} className="flex items-center">
                    <Badge
                      variant={activeEntryId === e.id ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setActiveEntryId(e.id)}
                    >
                      #{i + 1}
                      {e.clinicalText && <CheckCircle2 className="h-3 w-3 ml-1" />}
                    </Badge>
                    {entries.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-0.5"
                        onClick={() => handleRemoveEntry(e.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Textarea
              value={activeEntry.plainText}
              onChange={(e) => setEntries(prev => prev.map(entry =>
                entry.id === activeEntryId ? { ...entry, plainText: e.target.value } : entry
              ))}
              placeholder="Example: My knees pop and hurt when I walk up stairs. My back hurts so bad I can't bend over to tie my shoes."
              className="min-h-[150px] text-sm"
            />

            <div className="flex gap-2">
              <Button
                onClick={handleTranslate}
                disabled={!activeEntry.plainText.trim()}
                className="flex-1"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Translate to VA-Speak
              </Button>
              <Button
                variant="outline"
                onClick={handleAddEntry}
                title="Add another symptom"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Side */}
        <Card className={activeEntry.clinicalText ? 'border-success/30' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              VA Clinical Terminology
              <Badge variant="secondary" className="text-xs">38 CFR</Badge>
            </CardTitle>
            <CardDescription>
              Professional language for VA forms and statements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeEntry.clinicalText ? (
              <>
                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <p className="text-sm font-medium leading-relaxed">
                    {activeEntry.clinicalText}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleCopySingle(activeEntry.clinicalText)}
                    className="flex-1 gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  {translatedCount > 1 && (
                    <Button
                      variant="outline"
                      onClick={handleCopyAll}
                      className="flex-1 gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy All ({translatedCount})
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 text-center border border-dashed rounded-lg">
                <Languages className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Translation will appear here
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Enter your symptoms and click translate
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      {translatedCount > 0 && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={handleReset} className="gap-2 text-muted-foreground">
            <RotateCcw className="h-4 w-4" />
            Clear All & Start Over
          </Button>
        </div>
      )}

      {/* Examples Reference */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Translation Examples
          </CardTitle>
          <CardDescription>
            See how everyday language becomes VA clinical terminology
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {EXAMPLE_TRANSLATIONS.map((ex, i) => (
              <div key={i} className="p-3 rounded-lg border bg-muted/30">
                <div className="flex items-start gap-2 mb-2">
                  <Badge variant="outline" className="text-xs flex-shrink-0 mt-0.5">Plain</Badge>
                  <p className="text-sm text-muted-foreground">"{ex.plain}"</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="text-xs flex-shrink-0 mt-0.5">VA</Badge>
                  <p className="text-sm font-medium">{ex.clinical}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Note */}
      <Alert className="border-warning/30 bg-warning/5">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <AlertDescription className="text-sm">
          <strong>Important:</strong> Always maintain the truthful meaning of your original statement.
          The goal is to use precise clinical terminology, not to change or exaggerate what you experience.
          Review all translations for accuracy before using them in VA documents.
        </AlertDescription>
      </Alert>

      <DisclaimerNotice variant="subtle" />
    </div>
  );
}
