import { useState } from 'react';
import {
  Apple,
  Smartphone,
  Tablet,
  Copy,
  Check,
  FileText,
  Image,
  Video,
  Tag,
  Star,
  MessageSquare,
  Calendar,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// App Store listing content
const APP_STORE_CONTENT = {
  name: 'Vet Claim Support',
  subtitle: 'Win Your VA Disability Claim',
  promotionalText: 'New: PACT Act presumptive conditions database. Know if your condition qualifies for easier approval. Built by veterans, for veterans.',
  keywords: 'VA,disability,claim,veteran,military,rating,C&P,exam,PTSD,benefits,secondary,nexus,DBQ,compensation',
  description: `Get the VA rating you earned.

Every year, thousands of veterans are underrated or denied because they didn't know what the VA was looking for. Claim consultants charge $10,000+ for information that should be free.

Vet Claim Support puts that power in your hands.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KNOW WHAT THEY'RE LOOKING FOR

See the exact criteria the VA uses to rate your conditions. The same DBQ forms and rating schedules that C&P examiners use—now you'll know exactly what symptoms and limitations determine your rating percentage.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DOMINATE YOUR C&P EXAM

Your Compensation & Pension exam is the most important 30 minutes of your claim. Generate a personalized Exam Companion document with:
- Key symptoms to describe for each condition
- What examiners look for in their evaluation
- Common mistakes that hurt ratings
- Specific phrases that align with rating criteria

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DISCOVER SECONDARY CONDITIONS

That knee injury might be connected to your hip pain. Your PTSD could qualify you for sleep apnea. The app identifies potential secondary service connections you may not have considered—conditions that could significantly increase your combined rating.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CALCULATE YOUR TRUE RATING

VA math isn't simple addition. Use the same formula the VA uses to calculate your combined disability rating, including:
- Bilateral factor for paired extremities
- Accurate rounding rules
- 2026 compensation rates by dependents
- See exactly what your rating means in monthly pay

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DOCUMENT YOUR WORST DAYS

The symptom journal captures what the VA needs to see—flare-ups, bad days, and how your conditions actually affect your daily life. Log pain levels, sleep quality, mobility limitations, and medication effects.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORGANIZE YOUR EVIDENCE

Track medical records, service treatment records, buddy statements, and nexus letters. Know exactly what evidence you have and what's missing before you file.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BUILT FOR EVERY VETERAN

- Active Duty: Start documenting now for when you separate
- BDD Filers: File before discharge, get paid Day 1
- Recently Separated: Denied or underrated? Now you'll know why
- Long-Time Veterans: It's never too late. Secondary conditions exist.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR DATA STAYS YOURS

All information is stored locally on your device. We never see your health data, conditions, or personal information. No accounts required. No cloud uploads. Your privacy, protected.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$4.99. No subscriptions. No hidden fees.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DISCLAIMER: This app is for educational purposes only. We are not attorneys, medical professionals, or affiliated with the Department of Veterans Affairs. This app does not provide legal or medical advice. Consult qualified professionals for advice specific to your situation.`,
  whatsNew: `Version 2.0 - Complete Redesign

- Redesigned interface with cleaner, more intuitive navigation
- Enhanced C&P Exam preparation with condition-specific talking points
- New PACT Act presumptive conditions database
- Improved secondary conditions finder
- Updated 2026 VA compensation rates
- Performance improvements and bug fixes

Thank you for your service. We're committed to helping you get the rating you earned.`,
};

const SCREENSHOTS = [
  { id: 1, caption: 'Know your combined VA rating instantly', description: 'Calculator showing combined rating with monthly compensation', page: '/claim-tools' },
  { id: 2, caption: 'Track every service-connected condition', description: 'Conditions list with ratings and secondary connections', page: '/' },
  { id: 3, caption: 'Dominate your C&P exam', description: 'Exam Companion document with condition-specific prep', page: '/cp-exam-prep' },
  { id: 4, caption: 'Discover conditions you didn\'t know about', description: 'Secondary condition suggestions', page: '/secondary-finder' },
  { id: 5, caption: 'Document your worst days', description: 'Journal entry with symptom tracking', page: '/health-log' },
  { id: 6, caption: 'Organize your evidence package', description: 'Evidence checklist with completion status', page: '/documents' },
  { id: 7, caption: 'See exactly what examiners look for', description: 'DBQ information showing rating criteria', page: '/dbq-prep' },
  { id: 8, caption: 'Know what each rating requires', description: 'PTSD or back condition rating criteria breakdown', page: '/condition-guide' },
];

const REVIEW_TEMPLATES = {
  positive: 'Thank you for your service and for sharing your experience. We\'re honored to help veterans navigate the claims process. Best of luck with your claim!',
  constructive: 'Thank you for your feedback. We\'re constantly working to improve the app for veterans like you. We\'ve noted your suggestion and will consider it for future updates. If you have additional ideas, please reach out to support@vetclaimsupport.com.',
  technical: 'We\'re sorry you experienced this issue. Please contact us at support@vetclaimsupport.com with details about what happened, and we\'ll work to resolve it quickly. Thank you for your patience.',
};

const SEASONAL_PROMO = {
  veteransDay: 'This Veterans Day, take control of your claim. Updated with 2026 compensation rates and PACT Act conditions. Thank you for your service.',
  newYear: 'New year, new claim strategy. Start 2026 with the tools to get the rating you earned. Updated compensation rates now available.',
  pactAct: 'PACT Act expanded benefits for millions. Check if your conditions qualify for presumptive status. No nexus letter needed.',
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: 'Copied!', description: `${label} copied to clipboard` });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-2">
      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

function CharacterCount({ text, max }: { text: string; max: number }) {
  const count = text.length;
  const isOver = count > max;
  return (
    <span className={cn('text-xs', isOver ? 'text-destructive' : 'text-muted-foreground')}>
      {count}/{max}
    </span>
  );
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-foreground">{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && <div className="p-4 pt-0 border-t border-border">{children}</div>}
    </div>
  );
}

export default function AppStorePreview() {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <Apple className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">App Store Preview</h1>
          <p className="text-muted-foreground">Review and copy App Store Connect content</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{APP_STORE_CONTENT.name.length}</p>
            <p className="text-xs text-muted-foreground">Name (30 max)</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{APP_STORE_CONTENT.subtitle.length}</p>
            <p className="text-xs text-muted-foreground">Subtitle (30 max)</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{APP_STORE_CONTENT.promotionalText.length}</p>
            <p className="text-xs text-muted-foreground">Promo (170 max)</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{APP_STORE_CONTENT.keywords.length}</p>
            <p className="text-xs text-muted-foreground">Keywords (100 max)</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="listing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="listing" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Listing</span>
          </TabsTrigger>
          <TabsTrigger value="screenshots" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">Screenshots</span>
          </TabsTrigger>
          <TabsTrigger value="responses" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Reviews</span>
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Seasonal</span>
          </TabsTrigger>
        </TabsList>

        {/* Listing Tab */}
        <TabsContent value="listing" className="space-y-4 mt-4">
          {/* App Name */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">App Name</CardTitle>
                <div className="flex items-center gap-2">
                  <CharacterCount text={APP_STORE_CONTENT.name} max={30} />
                  <CopyButton text={APP_STORE_CONTENT.name} label="App Name" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-foreground">{APP_STORE_CONTENT.name}</p>
            </CardContent>
          </Card>

          {/* Subtitle */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Subtitle</CardTitle>
                <div className="flex items-center gap-2">
                  <CharacterCount text={APP_STORE_CONTENT.subtitle} max={30} />
                  <CopyButton text={APP_STORE_CONTENT.subtitle} label="Subtitle" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{APP_STORE_CONTENT.subtitle}</p>
            </CardContent>
          </Card>

          {/* Promotional Text */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Promotional Text</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">No Review Required</Badge>
                  <CharacterCount text={APP_STORE_CONTENT.promotionalText} max={170} />
                  <CopyButton text={APP_STORE_CONTENT.promotionalText} label="Promotional Text" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{APP_STORE_CONTENT.promotionalText}</p>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Keywords
                </CardTitle>
                <div className="flex items-center gap-2">
                  <CharacterCount text={APP_STORE_CONTENT.keywords} max={100} />
                  <CopyButton text={APP_STORE_CONTENT.keywords} label="Keywords" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {APP_STORE_CONTENT.keywords.split(',').map((keyword) => (
                  <Badge key={keyword} variant="secondary">{keyword}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Description</CardTitle>
                <div className="flex items-center gap-2">
                  <CharacterCount text={APP_STORE_CONTENT.description} max={4000} />
                  <CopyButton text={APP_STORE_CONTENT.description} label="Description" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed max-h-96 overflow-y-auto">
                {APP_STORE_CONTENT.description}
              </pre>
            </CardContent>
          </Card>

          {/* What's New */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">What's New</CardTitle>
                <CopyButton text={APP_STORE_CONTENT.whatsNew} label="What's New" />
              </div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">
                {APP_STORE_CONTENT.whatsNew}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Screenshots Tab */}
        <TabsContent value="screenshots" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Screenshot Requirements
              </CardTitle>
              <CardDescription>
                8 screenshots required for each device size
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Device sizes */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  iPhone 6.7" (1290x2796)
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  iPhone 6.5" (1242x2688)
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  iPhone 5.5" (1242x2208)
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Tablet className="h-3 w-3" />
                  iPad 12.9" (2048x2732)
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Tablet className="h-3 w-3" />
                  iPad 11" (1668x2388)
                </Badge>
              </div>

              {/* Screenshot list */}
              <div className="space-y-3">
                {SCREENSHOTS.map((screenshot) => (
                  <div
                    key={screenshot.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold shrink-0">
                      {screenshot.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-medium text-foreground truncate">
                          {screenshot.caption}
                        </p>
                        <CharacterCount text={screenshot.caption} max={45} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {screenshot.description}
                      </p>
                      <a
                        href={screenshot.page}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        View page <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <CopyButton text={screenshot.caption} label={`Screenshot ${screenshot.id} caption`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* App Preview Video */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                App Preview Video
              </CardTitle>
              <CardDescription>15-30 seconds, captured from device</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Open app → Dashboard showing conditions and rating (2s)</li>
                <li>Tap into C&P Exam Prep → Show Exam Companion generating (4s)</li>
                <li>Open Calculator → Enter ratings → Show combined result (4s)</li>
                <li>Browse secondary conditions finder (3s)</li>
                <li>End card: "Get the rating you earned. $4.99" (2s)</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Review Responses Tab */}
        <TabsContent value="responses" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Review Response Templates
              </CardTitle>
              <CardDescription>
                Copy-paste responses for App Store reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CollapsibleSection title="Positive Review Response" defaultOpen>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-muted-foreground">{REVIEW_TEMPLATES.positive}</p>
                  <CopyButton text={REVIEW_TEMPLATES.positive} label="Positive response" />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Constructive Feedback Response">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-muted-foreground">{REVIEW_TEMPLATES.constructive}</p>
                  <CopyButton text={REVIEW_TEMPLATES.constructive} label="Constructive response" />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Technical Issue Response">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-muted-foreground">{REVIEW_TEMPLATES.technical}</p>
                  <CopyButton text={REVIEW_TEMPLATES.technical} label="Technical response" />
                </div>
              </CollapsibleSection>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seasonal Tab */}
        <TabsContent value="seasonal" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Seasonal Promotional Text
              </CardTitle>
              <CardDescription>
                Update promotional text for special occasions (no review required)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CollapsibleSection title="Veterans Day (November)" defaultOpen>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{SEASONAL_PROMO.veteransDay}</p>
                    <CharacterCount text={SEASONAL_PROMO.veteransDay} max={170} />
                  </div>
                  <CopyButton text={SEASONAL_PROMO.veteransDay} label="Veterans Day promo" />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="New Year (January)">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{SEASONAL_PROMO.newYear}</p>
                    <CharacterCount text={SEASONAL_PROMO.newYear} max={170} />
                  </div>
                  <CopyButton text={SEASONAL_PROMO.newYear} label="New Year promo" />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="PACT Act Anniversary">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{SEASONAL_PROMO.pactAct}</p>
                    <CharacterCount text={SEASONAL_PROMO.pactAct} max={170} />
                  </div>
                  <CopyButton text={SEASONAL_PROMO.pactAct} label="PACT Act promo" />
                </div>
              </CollapsibleSection>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            App Store Connect Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Categories</p>
              <div className="flex gap-2">
                <Badge>Primary: Medical</Badge>
                <Badge variant="outline">Secondary: Utilities</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Age Rating</p>
              <Badge variant="destructive">17+</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Privacy Policy</p>
              <code className="text-xs text-muted-foreground">vetclaimsupport.com/privacy</code>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Support URL</p>
              <code className="text-xs text-muted-foreground">vetclaimsupport.com/support</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
