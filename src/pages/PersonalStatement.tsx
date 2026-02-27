import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Loader2,
  Stethoscope,
  Activity,
  Pill,
  Briefcase,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { AIContentBadge } from '@/components/ui/AIContentBadge';
import { ConditionSelector } from '@/components/shared/ConditionSelector';
import { useAIGenerate } from '@/hooks/useAIGenerate';
import { PageContainer } from '@/components/PageContainer';
import { useProfileStore } from '@/store/useProfileStore';
import { useClaims } from '@/hooks/useClaims';
import { cn } from '@/lib/utils';
import { exportPersonalStatement } from '@/utils/pdfExport';
import { PrefillBadge } from '@/components/ui/PrefillBadge';
import { DraftRestoredBanner } from '@/components/ui/DraftRestoredBanner';
import { useToolDraft } from '@/hooks/useToolDraft';
import {
  getConditionSymptoms,
  getConditionMedications,
  buildSymptomSummary,
  buildMedicationSummary,
  buildFunctionalImpactSummary,
} from '@/utils/prefillHelpers';
import type { VACondition } from '@/data/vaConditions';
import { getConditionById, searchConditions } from '@/data/vaConditions';

interface PersonalStatementFormData {
  condition: VACondition | null;
  serviceConnection: string;
  currentSymptoms: string;
  treatmentHistory: string;
  dailyImpact: string;
}

const initialFormData: PersonalStatementFormData = {
  condition: null,
  serviceConnection: '',
  currentSymptoms: '',
  treatmentHistory: '',
  dailyImpact: '',
};

const steps = [
  {
    id: 1,
    title: 'Select Condition',
    description: 'Choose the condition this statement is for',
    icon: Stethoscope,
  },
  {
    id: 2,
    title: 'Service Connection',
    description: 'How did this condition start during service?',
    icon: Activity,
  },
  {
    id: 3,
    title: 'Current Symptoms',
    description: 'Describe your current symptoms',
    icon: AlertCircle,
  },
  {
    id: 4,
    title: 'Treatment History',
    description: 'What treatment have you received?',
    icon: Pill,
  },
  {
    id: 5,
    title: 'Daily Impact',
    description: 'How does this affect your daily life?',
    icon: Briefcase,
  },
  {
    id: 6,
    title: 'Review',
    description: 'Review and export your personal statement',
    icon: FileText,
  },
];

interface GuidanceTipProps {
  tips: string[];
}

function GuidanceTip({ tips }: GuidanceTipProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-4 w-4 text-gold shrink-0" />
        <span className="text-sm font-medium text-foreground">Writing Tips</span>
      </div>
      <ul className="space-y-1.5">
        {tips.map((tip, index) => (
          <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="text-muted-foreground/60 mt-0.5 shrink-0">&bull;</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PersonalStatement() {
  const [searchParams] = useSearchParams();
  const { firstName, lastName } = useProfileStore();
  const { data: claimsData } = useClaims();
  const { toast } = useToast();
  const {
    formData, updateField: _draftUpdateField, setFormData, currentStep, setCurrentStep,
    draftRestored, clearDraft, lastSaved,
  } = useToolDraft({
    toolId: 'tool:personal-statement',
    initialData: initialFormData,
  });
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [polishedStatement, setPolishedStatement] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState<Record<string, boolean>>({});
  const { generate: aiPolish, isLoading: isPolishing, error: aiError } = useAIGenerate('VA_SPEAK_TRANSLATOR');

  const updateField = useCallback(
    <K extends keyof PersonalStatementFormData>(field: K, value: PersonalStatementFormData[K]) => {
      _draftUpdateField(field, value);
      setPolishedStatement(null);
      // Clear prefill badge for this field if user manually changes it
      if (typeof value === 'string') {
        setPrefilled((prev) => ({ ...prev, [field]: false }));
      }
    },
    [_draftUpdateField]
  );

  // Pre-fill from store when a condition is selected
  const handleConditionSelect = useCallback((condition: VACondition) => {
    const conditionName = condition.name;
    const matchingSymptoms = getConditionSymptoms(conditionName, claimsData.symptoms || []);
    const matchingMeds = getConditionMedications(conditionName, claimsData.medications || []);
    const newPrefilled: Record<string, boolean> = {};

    setFormData((prev) => {
      const next = { ...prev, condition };
      // Only fill empty fields
      if (!prev.currentSymptoms.trim() && matchingSymptoms.length > 0) {
        next.currentSymptoms = buildSymptomSummary(matchingSymptoms);
        newPrefilled.currentSymptoms = true;
      }
      if (!prev.treatmentHistory.trim() && matchingMeds.length > 0) {
        next.treatmentHistory = buildMedicationSummary(matchingMeds);
        newPrefilled.treatmentHistory = true;
      }
      if (!prev.dailyImpact.trim() && matchingSymptoms.length > 0) {
        const impact = buildFunctionalImpactSummary(matchingSymptoms);
        if (impact) {
          next.dailyImpact = impact;
          newPrefilled.dailyImpact = true;
        }
      }
      return next;
    });

    setPrefilled((prev) => ({ ...prev, ...newPrefilled }));
    setPolishedStatement(null);
  }, [claimsData.symptoms, claimsData.medications, setFormData]);

  // Auto-select condition from URL params (e.g., navigating from Conditions page)
  useEffect(() => {
    const urlCondition = searchParams.get('condition');
    if (urlCondition && !formData.condition) {
      const matches = searchConditions(urlCondition);
      if (matches && matches.length > 0) {
        handleConditionSelect(matches[0]);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generateStatement = useCallback((): string => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const sections: string[] = [];

    sections.push('PERSONAL STATEMENT IN SUPPORT OF CLAIM');
    sections.push(`Date: ${today}`);
    if (formData.condition) {
      sections.push(`Condition: ${formData.condition.name}`);
      if (formData.condition.diagnosticCode) {
        sections.push(`Diagnostic Code: ${formData.condition.diagnosticCode}`);
      }
    }
    if (firstName || lastName) {
      sections.push(`Veteran: ${firstName} ${lastName}`.trim());
    }
    sections.push('');
    sections.push('---');
    sections.push('');

    // Service Connection
    sections.push('SERVICE CONNECTION:');
    if (formData.serviceConnection) {
      sections.push(formData.serviceConnection);
    }
    sections.push('');

    // Current Symptoms
    sections.push('CURRENT SYMPTOMS:');
    if (formData.currentSymptoms) {
      sections.push(formData.currentSymptoms);
    }
    sections.push('');

    // Treatment History
    sections.push('TREATMENT HISTORY:');
    if (formData.treatmentHistory) {
      sections.push(formData.treatmentHistory);
    }
    sections.push('');

    // Impact on Daily Life
    sections.push('IMPACT ON DAILY LIFE:');
    if (formData.dailyImpact) {
      sections.push(formData.dailyImpact);
    }
    sections.push('');

    sections.push('---');
    sections.push('');
    sections.push(
      'I certify that the statements made herein are true and correct to the best of my knowledge and belief.'
    );
    sections.push('');
    sections.push('_______________________________');
    sections.push('Signature');
    sections.push('');
    sections.push(`Date: ${today}`);

    return sections.join('\n');
  }, [formData, firstName, lastName]);

  const handleDownload = useCallback(async () => {
    setExporting(true);
    try {
      const statement = polishedStatement || generateStatement();
      const conditionName = formData.condition?.name;
      await exportPersonalStatement(statement, conditionName);
    } catch {
      toast({ title: 'Export failed', description: 'Could not generate PDF. Please try again.', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  }, [generateStatement, polishedStatement, formData.condition, toast]);

  const handleCopy = useCallback(async () => {
    const statement = polishedStatement || generateStatement();
    try {
      await navigator.clipboard.writeText(statement);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = statement;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generateStatement, polishedStatement]);

  const handleAIPolish = useCallback(async () => {
    const raw = generateStatement();
    const prompt = `Please polish and improve the following VA personal statement. Keep all factual content exactly the same but improve the clarity, grammar, and professional tone. Make it more persuasive for a VA disability claim while keeping the veteran's voice authentic. Do not add any information that is not already present.\n\n${raw}`;
    const result = await aiPolish(prompt);
    if (result) {
      setPolishedStatement(result);
    }
  }, [generateStatement, aiPolish]);

  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        return formData.condition !== null;
      case 2:
        return formData.serviceConnection.trim().length > 0;
      case 3:
        return formData.currentSymptoms.trim().length > 0;
      case 4:
        return formData.treatmentHistory.trim().length > 0;
      case 5:
        return formData.dailyImpact.trim().length > 0;
      case 6:
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  const filledSections = [
    formData.condition,
    formData.serviceConnection,
    formData.currentSymptoms,
    formData.treatmentHistory,
    formData.dailyImpact,
  ].filter(Boolean).length;

  const progressPercent = Math.round((filledSections / 5) * 100);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <ConditionSelector
                onSelect={(selected) => {
                  const vaCondition = getConditionById(selected.conditionId);
                  if (vaCondition) {
                    handleConditionSelect(vaCondition);
                  } else {
                    // Fallback for non-DB conditions (MOS/presumptive)
                    setFormData((prev) => ({ ...prev, condition: { id: selected.conditionId || selected.name, name: selected.name, abbreviation: selected.name, category: 'other', diagnosticCode: '', typicalRatings: '', description: '', commonSecondaries: [], keywords: [], bodySystem: '' } as VACondition }));
                    setPolishedStatement(null);
                  }
                }}
                label="Select your condition"
                placeholder="Type to search conditions (e.g., tinnitus, PTSD, sleep apnea)..."
              />
              {formData.condition && (
                <div className="mt-3 p-3 rounded-lg border border-green-500/30 bg-green-500/5">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground break-words">
                        {formData.condition.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {formData.condition.diagnosticCode && (
                          <Badge variant="secondary" className="text-xs">
                            DC {formData.condition.diagnosticCode}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {formData.condition.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs text-muted-foreground"
                    onClick={() => updateField('condition', null)}
                  >
                    Change condition
                  </Button>
                </div>
              )}
            </div>
            <GuidanceTip
              tips={[
                'Select the specific condition you are writing this personal statement for',
                'If you have multiple conditions, create a separate personal statement for each',
                'Use the search to find the official VA name for your condition',
                'If you cannot find your exact condition, select the closest match',
              ]}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceConnection">
                How did this condition start or what event caused it during service?
              </Label>
              <Textarea
                id="serviceConnection"
                placeholder="Describe the in-service event, injury, illness, or exposure that caused or contributed to your condition. Include dates, locations, and circumstances if you remember them..."
                value={formData.serviceConnection}
                onChange={(e) => updateField('serviceConnection', e.target.value)}
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                {formData.serviceConnection.length > 0
                  ? `${formData.serviceConnection.length} characters`
                  : 'Explain the connection between your military service and this condition.'}
              </p>
            </div>
            <GuidanceTip
              tips={[
                'Be specific about the event, duty, or exposure that caused your condition',
                'Include dates (even approximate ones) and locations when possible',
                'Mention your MOS/rate/AFSC if it involved hazardous duties or exposures',
                'If the condition developed gradually during service, describe when you first noticed symptoms',
                'Reference any in-service treatment, sick call visits, or incident reports',
                'For secondary conditions, explain how your service-connected condition caused this one',
              ]}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentSymptoms" className="flex items-center gap-2 flex-wrap">
                Describe your current symptoms and how they affect daily life
                {prefilled.currentSymptoms && (
                  <PrefillBadge onClear={() => { updateField('currentSymptoms', ''); setPrefilled(p => ({ ...p, currentSymptoms: false })); }} />
                )}
              </Label>
              <Textarea
                id="currentSymptoms"
                placeholder="List and describe your current symptoms in detail. How often do they occur? How severe are they? What makes them better or worse? Include both physical and mental/emotional symptoms..."
                value={formData.currentSymptoms}
                onChange={(e) => updateField('currentSymptoms', e.target.value)}
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                {formData.currentSymptoms.length > 0
                  ? `${formData.currentSymptoms.length} characters`
                  : 'Describe your symptoms on your worst days, not just your average days.'}
              </p>
            </div>
            <GuidanceTip
              tips={[
                'Describe your symptoms on your WORST days, not just average days',
                'Include frequency (daily, weekly, constant) and duration of symptoms',
                'Mention specific triggers that worsen your symptoms',
                'Describe both the physical sensations and the emotional toll',
                'Use concrete examples: "I cannot stand for more than 10 minutes" is stronger than "I have pain"',
                'If symptoms have worsened over time, describe that progression',
              ]}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="treatmentHistory" className="flex items-center gap-2 flex-wrap">
                What treatment have you received? Medications? Ongoing care?
                {prefilled.treatmentHistory && (
                  <PrefillBadge onClear={() => { updateField('treatmentHistory', ''); setPrefilled(p => ({ ...p, treatmentHistory: false })); }} />
                )}
              </Label>
              <Textarea
                id="treatmentHistory"
                placeholder="Describe all treatment you have received for this condition, including medications (past and current), therapies, surgeries, VA care, private doctors, physical therapy, assistive devices, etc..."
                value={formData.treatmentHistory}
                onChange={(e) => updateField('treatmentHistory', e.target.value)}
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                {formData.treatmentHistory.length > 0
                  ? `${formData.treatmentHistory.length} characters`
                  : 'Include all treatment -- VA, private, medications, therapy, and home remedies.'}
              </p>
            </div>
            <GuidanceTip
              tips={[
                'List all current medications and dosages for this condition',
                'Include both VA and private/civilian treatment',
                'Mention any surgeries, injections, or procedures you have had',
                'Describe ongoing therapies (physical therapy, counseling, etc.)',
                'Note any assistive devices you use (braces, CPAP, hearing aids, etc.)',
                'If you have tried treatments that did not work, mention those as well',
                'Include the frequency of your medical appointments for this condition',
              ]}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dailyImpact" className="flex items-center gap-2 flex-wrap">
                How does this condition affect work, family, and daily activities?
                {prefilled.dailyImpact && (
                  <PrefillBadge onClear={() => { updateField('dailyImpact', ''); setPrefilled(p => ({ ...p, dailyImpact: false })); }} />
                )}
              </Label>
              <Textarea
                id="dailyImpact"
                placeholder="Describe how this condition impacts your ability to work, take care of yourself, maintain relationships, participate in activities, and perform daily tasks. Be specific about limitations and accommodations..."
                value={formData.dailyImpact}
                onChange={(e) => updateField('dailyImpact', e.target.value)}
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                {formData.dailyImpact.length > 0
                  ? `${formData.dailyImpact.length} characters`
                  : 'Think about what you can no longer do, or what is much harder now.'}
              </p>
            </div>
            <GuidanceTip
              tips={[
                'Describe specific activities you can no longer do or have difficulty with',
                'Explain how this condition affects your ability to work or hold a job',
                'Mention impacts on household tasks (cooking, cleaning, yard work, driving)',
                'Describe effects on family relationships and social activities',
                'Include any hobbies or interests you have had to give up',
                'Note how this condition affects your sleep, concentration, or mood',
                'If you need help from others for daily tasks, describe what kind of help',
              ]}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            {/* Completion Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Statement completeness</span>
                <span className="font-medium text-foreground">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} />
            </div>

            <div className="grid grid-cols-5 gap-1 sm:gap-2 overflow-hidden">
              {steps.slice(0, 5).map((step) => {
                const isComplete = (() => {
                  switch (step.id) {
                    case 1: return formData.condition !== null;
                    case 2: return formData.serviceConnection.trim().length > 0;
                    case 3: return formData.currentSymptoms.trim().length > 0;
                    case 4: return formData.treatmentHistory.trim().length > 0;
                    case 5: return formData.dailyImpact.trim().length > 0;
                    default: return false;
                  }
                })();
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={cn(
                      'flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-colors',
                      isComplete
                        ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="text-[10px] leading-tight sm:text-xs">{step.title}</span>
                  </button>
                );
              })}
            </div>

            {filledSections < 5 && (
              <Card className="border-gold/30 bg-[rgba(240,192,0,0.05)]">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Incomplete Sections</p>
                      <p className="text-muted-foreground">
                        You have filled {filledSections} of 5 sections. A more complete statement
                        strengthens your claim. Tap any section above to go back and add details.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statement Preview */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base min-w-0">Statement Preview</CardTitle>
                  {polishedStatement && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 shrink-0">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Polished
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {polishedStatement && (
                  <AIContentBadge timestamp={new Date().toISOString()} className="mb-3" />
                )}
                <pre className="whitespace-pre-wrap text-sm font-mono text-foreground overflow-auto max-h-96 leading-relaxed break-words">
                  {polishedStatement || generateStatement()}
                </pre>
              </CardContent>
            </Card>

            {/* AI Polish */}
            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-400 mt-0.5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium text-foreground">AI Polish (Optional)</p>
                    <p className="text-xs text-muted-foreground">
                      Use AI to improve the grammar, clarity, and professional tone of your statement.
                      All factual content remains unchanged.
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAIPolish}
                        disabled={isPolishing || filledSections === 0}
                        className="gap-2 border-purple-500/30 hover:bg-purple-500/10"
                      >
                        {isPolishing ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Polishing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5" />
                            {polishedStatement ? 'Re-polish' : 'Polish Statement'}
                          </>
                        )}
                      </Button>
                      {polishedStatement && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPolishedStatement(null)}
                          className="text-xs text-muted-foreground"
                        >
                          Revert to original
                        </Button>
                      )}
                    </div>
                    {aiError && (
                      <p className="text-xs text-red-400">{aiError}</p>
                    )}
                    <AIDisclaimer />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleCopy} className="flex-1 gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
              <Button variant="outline" disabled={exporting} onClick={handleDownload} className="flex-1 gap-2">
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {exporting ? 'Exporting...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer className="space-y-6 animate-fade-in overflow-x-hidden">
      {/* Header */}
      <div className="section-header mb-0">
        <div className="section-icon bg-gold/10">
          <FileText className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Personal Statement Builder</h1>
          <p className="text-muted-foreground text-sm">
            Guided tool for writing a personal statement for your VA claim
          </p>
        </div>
      </div>

      {draftRestored && lastSaved && (
        <DraftRestoredBanner lastSaved={lastSaved} onStartFresh={clearDraft} />
      )}

      {/* AI Disclaimer Banner */}
      <AIDisclaimer variant="banner" />

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/30">
        <CardContent className="pt-6 flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">What is a personal statement?</p>
            <p>
              A personal statement (also called a buddy statement or lay statement when written about yourself)
              is a written account in your own words that explains how your condition is connected to your
              military service and how it affects your daily life. The VA uses this to understand the full
              picture of your disability beyond medical records alone.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/80">
              This tool helps you organize your thoughts into a structured personal statement.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              type="button"
              onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              disabled={step.id > currentStep}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all',
                currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : step.id < currentStep
                  ? 'bg-green-500/20 text-green-500 cursor-pointer hover:bg-green-500/30'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0',
                  currentStep === step.id
                    ? 'bg-primary-foreground text-primary'
                    : step.id < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-muted-foreground/30 text-muted-foreground'
                )}
              >
                {step.id < currentStep ? <Check className="h-3 w-3" /> : step.id}
              </div>
              <span className="hidden sm:inline text-sm font-medium whitespace-nowrap">
                {step.title}
              </span>
            </button>
            {index < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-0.5 sm:mx-1 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const StepIcon = steps[currentStep - 1].icon;
              return <StepIcon className="h-5 w-5 text-primary" />;
            })()}
            Step {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        {currentStep < steps.length && (
          <Button
            onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
            disabled={!canProceed()}
            className="gap-2"
          >
            {currentStep === steps.length - 1 ? 'Review' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

    </PageContainer>
  );
}
