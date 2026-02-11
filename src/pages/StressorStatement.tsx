import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  MapPin,
  Calendar,
  Users,
  Heart,
  Shield,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { cn } from '@/lib/utils';
import { exportStressorStatement } from '@/utils/pdfExport';
import { PageContainer } from '@/components/PageContainer';

interface StressorFormData {
  whatHappened: string;
  whenStart: string;
  whenEnd: string;
  whenDetails: string;
  whereLocation: string;
  whereUnit: string;
  whereDetails: string;
  whoInvolved: string;
  whoWitnesses: string;
  whoReported: string;
  howAffectedImmediate: string;
  howAffectedOngoing: string;
  howAffectedDaily: string;
  howAffectedRelationships: string;
}

const initialFormData: StressorFormData = {
  whatHappened: '',
  whenStart: '',
  whenEnd: '',
  whenDetails: '',
  whereLocation: '',
  whereUnit: '',
  whereDetails: '',
  whoInvolved: '',
  whoWitnesses: '',
  whoReported: '',
  howAffectedImmediate: '',
  howAffectedOngoing: '',
  howAffectedDaily: '',
  howAffectedRelationships: '',
};

const steps = [
  {
    id: 1,
    title: 'What Happened',
    description: 'Describe the stressor event',
    icon: Shield,
  },
  {
    id: 2,
    title: 'When It Happened',
    description: 'Timeline of the event',
    icon: Calendar,
  },
  {
    id: 3,
    title: 'Where It Happened',
    description: 'Location and unit details',
    icon: MapPin,
  },
  {
    id: 4,
    title: 'Who Was Involved',
    description: 'People and witnesses',
    icon: Users,
  },
  {
    id: 5,
    title: 'How It Affected You',
    description: 'Impact on your life',
    icon: Heart,
  },
  {
    id: 6,
    title: 'Review & Export',
    description: 'Review your statement',
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
        <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0" />
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

export default function StressorStatement() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StressorFormData>(initialFormData);
  const [copied, setCopied] = useState(false);

  const updateField = useCallback(
    (field: keyof StressorFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const generateStatement = useCallback((): string => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const sections: string[] = [];

    sections.push('STRESSOR STATEMENT');
    sections.push(`Date: ${today}`);
    sections.push('');
    sections.push('---');
    sections.push('');

    // What happened
    sections.push('DESCRIPTION OF STRESSOR EVENT:');
    if (formData.whatHappened) {
      sections.push(formData.whatHappened);
    }
    sections.push('');

    // When it happened
    sections.push('TIMEFRAME:');
    const timeframeParts: string[] = [];
    if (formData.whenStart) {
      const startDate = new Date(formData.whenStart).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      timeframeParts.push(`Start date: ${startDate}`);
    }
    if (formData.whenEnd) {
      const endDate = new Date(formData.whenEnd).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      timeframeParts.push(`End date: ${endDate}`);
    }
    if (timeframeParts.length > 0) {
      sections.push(timeframeParts.join('\n'));
    }
    if (formData.whenDetails) {
      sections.push(formData.whenDetails);
    }
    sections.push('');

    // Where it happened
    sections.push('LOCATION:');
    if (formData.whereLocation) {
      sections.push(`Location: ${formData.whereLocation}`);
    }
    if (formData.whereUnit) {
      sections.push(`Unit/Assignment: ${formData.whereUnit}`);
    }
    if (formData.whereDetails) {
      sections.push(formData.whereDetails);
    }
    sections.push('');

    // Who was involved
    sections.push('PERSONS INVOLVED:');
    if (formData.whoInvolved) {
      sections.push(`Individuals involved: ${formData.whoInvolved}`);
    }
    if (formData.whoWitnesses) {
      sections.push(`Witnesses: ${formData.whoWitnesses}`);
    }
    if (formData.whoReported) {
      sections.push(`Reported to: ${formData.whoReported}`);
    }
    sections.push('');

    // How it affected you
    sections.push('IMPACT AND EFFECTS:');
    if (formData.howAffectedImmediate) {
      sections.push(`Immediate effects: ${formData.howAffectedImmediate}`);
    }
    if (formData.howAffectedOngoing) {
      sections.push(`\nOngoing symptoms: ${formData.howAffectedOngoing}`);
    }
    if (formData.howAffectedDaily) {
      sections.push(`\nImpact on daily life: ${formData.howAffectedDaily}`);
    }
    if (formData.howAffectedRelationships) {
      sections.push(`\nImpact on relationships: ${formData.howAffectedRelationships}`);
    }
    sections.push('');

    sections.push('---');
    sections.push('');
    sections.push('I certify that the statements made herein are true and correct to the best of my knowledge and belief.');
    sections.push('');
    sections.push('_______________________________');
    sections.push('Signature');
    sections.push('');
    sections.push(`Date: ${today}`);

    return sections.join('\n');
  }, [formData]);

  const handleDownload = useCallback(() => {
    const statement = generateStatement();
    exportStressorStatement(statement);
  }, [generateStatement]);

  const handleCopy = useCallback(async () => {
    const statement = generateStatement();
    try {
      await navigator.clipboard.writeText(statement);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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
  }, [generateStatement]);

  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        return formData.whatHappened.trim().length > 0;
      case 2:
        return formData.whenStart.trim().length > 0 || formData.whenDetails.trim().length > 0;
      case 3:
        return formData.whereLocation.trim().length > 0;
      case 4:
        return formData.whoInvolved.trim().length > 0;
      case 5:
        return formData.howAffectedImmediate.trim().length > 0 || formData.howAffectedOngoing.trim().length > 0;
      case 6:
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  const filledSections = [
    formData.whatHappened,
    formData.whenStart || formData.whenDetails,
    formData.whereLocation,
    formData.whoInvolved,
    formData.howAffectedImmediate || formData.howAffectedOngoing,
  ].filter(Boolean).length;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatHappened">Describe what happened</Label>
              <Textarea
                id="whatHappened"
                placeholder="Describe the traumatic event or stressor in your own words. Include as much detail as you are comfortable sharing..."
                value={formData.whatHappened}
                onChange={(e) => updateField('whatHappened', e.target.value)}
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                {formData.whatHappened.length > 0
                  ? `${formData.whatHappened.length} characters`
                  : 'Take your time with this section. You can always come back and edit.'}
              </p>
            </div>
            <GuidanceTip
              tips={[
                'Write in the first person ("I was..." or "I experienced...")',
                'Be as specific as you can, but only share what you are comfortable with',
                'Focus on the facts of what happened rather than conclusions',
                'If there were multiple incidents, describe the most significant one in detail',
                'You do not need to include every detail -- focus on the key events',
                'It is okay to describe events that are difficult to talk about at your own pace',
              ]}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="whenStart">Approximate start date</Label>
                <Input
                  id="whenStart"
                  type="date"
                  value={formData.whenStart}
                  onChange={(e) => updateField('whenStart', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  An approximate date is acceptable if you do not remember the exact date.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whenEnd">Approximate end date (if applicable)</Label>
                <Input
                  id="whenEnd"
                  type="date"
                  value={formData.whenEnd}
                  onChange={(e) => updateField('whenEnd', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank if this was a single incident.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whenDetails">Additional timeline details</Label>
              <Textarea
                id="whenDetails"
                placeholder="Provide any additional context about when this occurred (e.g., during deployment, time of day, during a specific operation, season or month if exact date is unknown)..."
                value={formData.whenDetails}
                onChange={(e) => updateField('whenDetails', e.target.value)}
                rows={4}
              />
            </div>
            <GuidanceTip
              tips={[
                'If you cannot remember the exact date, provide your best estimate (month/year is acceptable)',
                'Mention the phase of your service (basic training, deployment, etc.)',
                'Reference known events or operations that can help the VA verify the timeframe',
                'If it was an ongoing situation, describe how long it lasted',
                'Seasonal or relative time references ("during monsoon season," "shortly after arriving") are helpful',
              ]}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whereLocation">Location</Label>
              <Input
                id="whereLocation"
                placeholder="e.g., FOB Salerno, Khost Province, Afghanistan"
                value={formData.whereLocation}
                onChange={(e) => updateField('whereLocation', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whereUnit">Unit / Assignment</Label>
              <Input
                id="whereUnit"
                placeholder="e.g., 3rd Battalion, 187th Infantry Regiment, 101st Airborne Division"
                value={formData.whereUnit}
                onChange={(e) => updateField('whereUnit', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whereDetails">Additional location details</Label>
              <Textarea
                id="whereDetails"
                placeholder="Describe the setting in more detail (e.g., on patrol outside the base, in the barracks, at the motor pool, on a convoy route between two locations)..."
                value={formData.whereDetails}
                onChange={(e) => updateField('whereDetails', e.target.value)}
                rows={4}
              />
            </div>
            <GuidanceTip
              tips={[
                'Include the base, camp, or installation name if applicable',
                'Mention the country, province, or region',
                'Include your unit designation, as the VA uses this to verify records',
                'Describe whether this was on-base, off-base, during a patrol, convoy, etc.',
                'If the event occurred at a specific building or area on a base, include that detail',
                'For MST claims: describe the general setting without needing the exact address',
              ]}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whoInvolved">Who was involved?</Label>
              <Textarea
                id="whoInvolved"
                placeholder="List the people involved in the event, including their names, ranks, and roles if known. If you do not remember names, describe their roles (e.g., 'my squad leader,' 'the medic on duty')..."
                value={formData.whoInvolved}
                onChange={(e) => updateField('whoInvolved', e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whoWitnesses">Were there any witnesses?</Label>
              <Textarea
                id="whoWitnesses"
                placeholder="List anyone who may have seen or been aware of the event. Include names, ranks, and contact information if available..."
                value={formData.whoWitnesses}
                onChange={(e) => updateField('whoWitnesses', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whoReported">Did you report the event? To whom?</Label>
              <Textarea
                id="whoReported"
                placeholder="Describe if and when you reported this event, and to whom (e.g., chain of command, chaplain, military police, medical personnel, SARC)..."
                value={formData.whoReported}
                onChange={(e) => updateField('whoReported', e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                If you did not report the event, that is okay. Many stressor events go unreported, and the VA understands this.
              </p>
            </div>
            <GuidanceTip
              tips={[
                'Include names and ranks if you remember them, but descriptions of roles are also helpful',
                'Witnesses do not have to be people who directly saw the event -- they can be people who saw the aftermath',
                'For MST claims: the VA accepts alternative evidence such as changes in behavior, performance reports, or requests for transfer',
                'If you reported to medical, mental health, a chaplain, or SARC, mention that specifically',
                'It is not required that you reported the event at the time it occurred',
              ]}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="howAffectedImmediate">How did it affect you immediately?</Label>
              <Textarea
                id="howAffectedImmediate"
                placeholder="Describe your immediate reaction and any symptoms you experienced right after the event (e.g., fear, shock, difficulty sleeping, nightmares, hypervigilance)..."
                value={formData.howAffectedImmediate}
                onChange={(e) => updateField('howAffectedImmediate', e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="howAffectedOngoing">What ongoing symptoms do you experience?</Label>
              <Textarea
                id="howAffectedOngoing"
                placeholder="Describe symptoms that continue to this day (e.g., nightmares, flashbacks, anxiety, depression, anger, avoidance of certain places or situations, hypervigilance, difficulty trusting others)..."
                value={formData.howAffectedOngoing}
                onChange={(e) => updateField('howAffectedOngoing', e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="howAffectedDaily">How does it impact your daily life?</Label>
              <Textarea
                id="howAffectedDaily"
                placeholder="Describe how your symptoms affect work, daily routines, hobbies, ability to concentrate, sleep quality, appetite, energy levels..."
                value={formData.howAffectedDaily}
                onChange={(e) => updateField('howAffectedDaily', e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="howAffectedRelationships">How has it affected your relationships?</Label>
              <Textarea
                id="howAffectedRelationships"
                placeholder="Describe any changes in your relationships with family, friends, or coworkers (e.g., withdrawal, irritability, difficulty maintaining closeness, trust issues)..."
                value={formData.howAffectedRelationships}
                onChange={(e) => updateField('howAffectedRelationships', e.target.value)}
                rows={4}
              />
            </div>
            <GuidanceTip
              tips={[
                'Be honest about how this has affected you -- do not minimize your symptoms',
                'Describe your worst days, not just your average days',
                'Include changes in behavior that others have noticed',
                'Mention any treatment you have sought (therapy, medication, counseling)',
                'Describe specific examples: "I cannot go to crowded places because..." is stronger than "I have anxiety"',
                'If your symptoms have worsened over time, describe that progression',
              ]}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            {/* Completion Summary */}
            <div className="grid grid-cols-5 gap-2">
              {steps.slice(0, 5).map((step) => {
                const isComplete = (() => {
                  switch (step.id) {
                    case 1: return formData.whatHappened.trim().length > 0;
                    case 2: return (formData.whenStart.trim().length > 0 || formData.whenDetails.trim().length > 0);
                    case 3: return formData.whereLocation.trim().length > 0;
                    case 4: return formData.whoInvolved.trim().length > 0;
                    case 5: return (formData.howAffectedImmediate.trim().length > 0 || formData.howAffectedOngoing.trim().length > 0);
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
              <Card className="border-yellow-500/30 bg-yellow-500/5">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Incomplete Sections</p>
                      <p className="text-muted-foreground">
                        You have filled {filledSections} of 5 sections. A more complete statement strengthens your claim.
                        Tap any section above to go back and add details.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statement Preview */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Statement Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm font-mono text-foreground overflow-auto max-h-96 leading-relaxed">
                  {generateStatement()}
                </pre>
              </CardContent>
            </Card>

            {/* Export Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleCopy} className="flex-1 gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
              <Button variant="outline" onClick={handleDownload} className="flex-1 gap-2">
                <Download className="h-4 w-4" />
                Download PDF
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
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-1">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Header */}
      <div className="section-header mb-0">
        <div className="section-icon bg-red-500/10">
          <Shield className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stressor Statement Builder</h1>
          <p className="text-muted-foreground text-sm">
            Guided tool for writing your PTSD/MST stressor statement
          </p>
        </div>
      </div>

      {/* AI Disclaimer Banner */}
      <AIDisclaimer variant="banner" />

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/30">
        <CardContent className="pt-6 flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">What is a stressor statement?</p>
            <p>
              A stressor statement is a written account of the traumatic event(s) that caused or contributed to
              your PTSD or MST (Military Sexual Trauma). The VA uses this statement to verify your stressor
              and evaluate your claim. This tool helps you organize your thoughts into a clear, structured format.
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
              <span className="hidden sm:inline text-sm font-medium whitespace-nowrap">{step.title}</span>
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

      {/* Disclaimer */}
      <Card className="border-border bg-muted/20">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              This tool provides organizational guidance only. It does not provide legal or medical advice.
              Consult with an accredited VSO or attorney for official guidance.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
