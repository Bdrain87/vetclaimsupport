import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useUserConditions } from '@/hooks/useUserConditions';
import {
  FileText,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Stethoscope,
  ClipboardList,
  Search,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/PageContainer';

interface GuideStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

export default function NexusGuide() {
  const [searchParams] = useSearchParams();
  const conditionId = searchParams.get('condition');
  const { getCondition } = useUserConditions();
  const condition = conditionId ? getCondition(conditionId) : undefined;

  const [expandedStep, setExpandedStep] = useState<string | null>('what-is');

  const toggleStep = (id: string) => {
    setExpandedStep((prev) => (prev === id ? null : id));
  };

  const steps: GuideStep[] = [
    {
      id: 'what-is',
      icon: <BookOpen className="h-4 w-4" />,
      title: 'What is a Nexus Letter?',
      content: (
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            A nexus letter is a medical opinion from a qualified healthcare provider that establishes
            a connection ("nexus") between your current disability and your military service. It is
            one of the most important pieces of evidence in a VA disability claim.
          </p>
          <p>
            The letter must state that your condition is "at least as likely as not" (50% or greater
            probability) related to your military service. This is the legal standard the VA uses.
          </p>
          <p className="font-medium text-foreground">
            A strong nexus letter can make the difference between a denied claim and an approved one.
          </p>
        </div>
      ),
    },
    {
      id: 'strong-letter',
      icon: <CheckCircle2 className="h-4 w-4" />,
      title: 'What Makes a Strong Nexus Letter',
      content: (
        <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
          <p>VA raters look for four key elements:</p>
          <div className="space-y-2">
            {[
              {
                label: 'Medical rationale',
                desc: 'The doctor explains WHY your condition is connected to service, not just that it is.',
              },
              {
                label: '"At least as likely as not" language',
                desc: 'Uses the correct legal standard (50% or greater probability).',
              },
              {
                label: 'Review of records',
                desc: 'States the provider reviewed your service records, medical records, and/or personal statements.',
              },
              {
                label: 'Provider credentials',
                desc: 'Signed by a licensed physician, psychologist, or relevant specialist with clear credentials.',
              },
            ].map((item) => (
              <div key={item.label} className="bg-muted/30 rounded-lg p-2.5">
                <p className="font-medium text-foreground text-xs">{item.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-gold/10 border border-gold/20 rounded-lg p-2.5 mt-2">
            <p className="text-xs text-gold/80">
              <strong>Red flags:</strong> Generic templates, missing rationale, "possible" or "could be"
              language (too weak), unsigned letters, or letters from providers who didn't review any records.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'finding-provider',
      icon: <Search className="h-4 w-4" />,
      title: 'Finding a Provider',
      content: (
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground">Options for getting a nexus letter:</p>
          <div className="space-y-2">
            <div className="bg-muted/30 rounded-lg p-2.5">
              <p className="font-medium text-foreground text-xs">Your current doctor</p>
              <p className="text-[11px] mt-0.5">
                If you have a good relationship with your provider, ask them directly. Many are willing
                if you provide your service records and explain what you need.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-2.5">
              <p className="font-medium text-foreground text-xs">VA treating physician</p>
              <p className="text-[11px] mt-0.5">
                Your VA doctor can write a nexus letter, though some are reluctant. You have the right
                to ask. Their opinion carries significant weight since they're already treating you.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-2.5">
              <p className="font-medium text-foreground text-xs">Independent Medical Opinion (IMO)</p>
              <p className="text-[11px] mt-0.5">
                Private medical providers who specialize in VA nexus opinions. These are paid services
                (typically $500–$1500) but often produce thorough, well-formatted letters.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-2.5">
              <p className="font-medium text-foreground text-xs">Telehealth providers</p>
              <p className="text-[11px] mt-0.5">
                Several telehealth services offer nexus letter evaluations. Convenient but verify they
                provide thorough evaluations, not just template letters.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'appointment',
      icon: <Stethoscope className="h-4 w-4" />,
      title: 'What to Bring to Your Appointment',
      content: (
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>Bring the following to help your provider write the strongest possible letter:</p>
          <div className="space-y-1.5">
            {[
              'Service treatment records (STRs) showing in-service events or treatment',
              'DD-214 showing dates of service and any relevant MOS/duties',
              'Current medical records documenting your diagnosis',
              'Personal statement describing the connection between service and your condition',
              condition
                ? `Your symptom logs and health data for ${condition.displayName}`
                : 'Any symptom logs, pain journals, or health tracking data',
              'Buddy statements corroborating in-service events',
              'VA decision letters (if this is for an appeal or supplemental claim)',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                <span className="text-[11px]">{item}</span>
              </div>
            ))}
          </div>
          {condition && (
            <div className="bg-gold/10 border border-gold/20 rounded-lg p-2.5 mt-2">
              <p className="text-xs text-gold">
                Preparing for: <strong>{condition.displayName}</strong>
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Make sure to bring any records documenting when this condition started or worsened during service.
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'review',
      icon: <ClipboardList className="h-4 w-4" />,
      title: 'Reviewing Your Letter',
      content: (
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>Before submitting, verify your nexus letter includes:</p>
          <div className="space-y-1.5">
            {[
              'Your full name and identifying information',
              '"At least as likely as not" opinion language',
              'Clear medical rationale (not just a conclusion)',
              'Statement that records were reviewed (list what was reviewed)',
              'Provider\'s full name, credentials, license number, and signature',
              'Date of the letter and examination (if applicable)',
              'The specific condition being opined on',
              'Reference to your in-service event, injury, or exposure',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                <span className="text-[11px]">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2.5 mt-2">
            <p className="text-xs text-destructive/80">
              <strong>If your letter is weak:</strong> Ask the provider to add more rationale, cite specific
              medical literature, or reference specific records they reviewed. You are paying for this service
              — don't settle for a template.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nexus Letter Guide</h1>
          <p className="text-muted-foreground text-sm">
            {condition
              ? `Guide for ${condition.displayName}`
              : 'Step-by-step guide to getting a strong nexus letter'}
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-3 rounded-lg bg-gold/10 border border-gold/20">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
          <p className="text-xs text-gold/80">
            This guide is for educational purposes only. It does not constitute legal or medical advice.
            Consult with your VSO or attorney for guidance specific to your claim.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, index) => (
          <Card key={step.id}>
            <button
              type="button"
              onClick={() => toggleStep(step.id)}
              className="w-full text-left"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{step.icon}</span>
                      <span className="text-sm font-semibold text-foreground">{step.title}</span>
                    </div>
                  </div>
                  {expandedStep === step.id ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                {expandedStep === step.id && <div className="mt-3 pl-9">{step.content}</div>}
              </CardContent>
            </button>
          </Card>
        ))}
      </div>

      {/* Related Tools */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Related Tools</p>
          <Link
            to="/prep/doctor-summary"
            className="flex items-center justify-between py-2 text-sm text-foreground hover:text-gold transition-colors"
          >
            <span>Doctor Summary Outline</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            to="/prep/personal-statement"
            className="flex items-center justify-between py-2 text-sm text-foreground hover:text-gold transition-colors"
          >
            <span>Personal Statement Builder</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            to="/prep/buddy-statement"
            className="flex items-center justify-between py-2 text-sm text-foreground hover:text-gold transition-colors"
          >
            <span>Buddy Statement Builder</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-[11px] text-muted-foreground/60 text-center px-4">
        This tool is for educational purposes only. Consult with your VSO or attorney
        for guidance specific to your situation.
      </p>
    </PageContainer>
  );
}
