import { AlertTriangle, ChevronLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/PageContainer';
import { CORE_DISCLAIMERS, AI_COPY, LEGAL_VERSIONS, formatLegalDate, ADMIN_EMAIL } from '@/data/legalCopy';

export default function DisclaimerPage() {
  const navigate = useNavigate();

  return (
    <PageContainer className="space-y-6 animate-fade-in py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-gold/10 shrink-0">
          <AlertTriangle className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Important Disclaimer</h1>
          <p className="text-muted-foreground/70 text-sm mt-1">
            Vet Claim Support &mdash; Version {LEGAL_VERSIONS.disclaimer.version} &mdash; Effective {formatLegalDate(LEGAL_VERSIONS.disclaimer.effectiveDate)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 text-sm leading-relaxed">

        {/* Main Disclaimer */}
        <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-5">
          <p className="text-foreground/80 font-medium">
            <strong className="text-foreground">IMPORTANT:</strong> {CORE_DISCLAIMERS.mainDisclaimer}
          </p>
        </div>

        {/* What This App Is */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">What This App Is</h2>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span>An organizational tool to help you prepare and track information related to VA disability claims</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span>An educational resource about VA benefits and processes</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span>A health and symptom logging tool for your personal records</li>
          </ul>
        </div>

        {/* What This App Is NOT */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">What This App Is NOT</h2>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>{CORE_DISCLAIMERS.notLegalAdvice}</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>{CORE_DISCLAIMERS.notMedicalAdvice}</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>{CORE_DISCLAIMERS.notVAAccredited}</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>{CORE_DISCLAIMERS.notClaimsFiling}</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>{CORE_DISCLAIMERS.notSubstitute}</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>{CORE_DISCLAIMERS.notGuarantee}</li>
          </ul>
        </div>

        {/* Your Responsibility */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Your Responsibility</h2>
          <div className="rounded-xl bg-gold/5 border border-gold/20 p-4 space-y-2">
            <p className="text-muted-foreground">
              {CORE_DISCLAIMERS.yourResponsibility}
            </p>
            <p className="text-muted-foreground font-medium">
              {CORE_DISCLAIMERS.fraudWarning}
            </p>
          </div>
        </div>

        {/* AI-Generated Content Warning */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">AI-Generated Content Warning</h2>
          <div className="rounded-xl bg-[rgba(212,175,55,0.05)] border border-gold/20 p-4 space-y-3">
            <p className="text-muted-foreground">
              This app uses a third-party AI service provider (currently Google Gemini) to generate suggestions and content. {AI_COPY.hallucinationWarning}{' '}
              <strong className="text-gold">NEVER submit AI-generated legal citations without independent verification.</strong>{' '}
              You assume all risk for reliance on AI-generated content.
            </p>
            <p className="text-muted-foreground">
              The Appeals Guide&apos;s case law database uses curated, verified citations from real court decisions &mdash; not AI-generated content. However, case summaries are simplified and may not reflect every nuance. You must still verify all citations independently.
            </p>
          </div>
        </div>

        {/* Professional Consultation */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Professional Consultation</h2>
          <p className="text-muted-foreground">
            {CORE_DISCLAIMERS.professionalConsultation} Find accredited representatives at{' '}
            <a
              href={CORE_DISCLAIMERS.vsoFinderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              va.gov/ogc/apps/accreditation
            </a>.
          </p>
        </div>

        {/* Contact & Last Updated */}
        <div className="space-y-3 pt-4 border-t border-border">
          <p className="text-muted-foreground/70 text-xs">
            Last updated: {formatLegalDate(LEGAL_VERSIONS.disclaimer.effectiveDate)}
          </p>
          <p className="text-muted-foreground/70 text-xs flex items-center gap-1">
            <Mail className="h-3 w-3" />
            For legal requests: <a href={`mailto:${ADMIN_EMAIL}`} className="text-gold hover:underline">{ADMIN_EMAIL}</a>
          </p>
        </div>

        {/* Acknowledgment */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-muted-foreground/70 text-xs">
            By using this app, you acknowledge that you have read and understood this disclaimer and agree to be bound by the Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
