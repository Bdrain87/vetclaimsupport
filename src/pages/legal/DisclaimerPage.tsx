import { AlertTriangle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/PageContainer';

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
          <p className="text-muted-foreground/70 text-sm mt-1">Vet Claim Support &mdash; Version 1.1 &mdash; Effective February 18, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 text-sm leading-relaxed">

        {/* Main Disclaimer */}
        <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-5">
          <p className="text-foreground/80 font-medium">
            <strong className="text-foreground">IMPORTANT:</strong> Vet Claim Support is an educational and organizational tool. It is NOT affiliated with, endorsed by, or connected to the U.S. Department of Veterans Affairs.
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
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>NOT legal advice</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>NOT medical advice</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>NOT a VA-accredited representative, attorney, claims agent, or VSO as defined under 38 U.S.C. &sect;&sect; 5901-5905 and 38 C.F.R. Part 14</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>NOT a claims filing service &mdash; VCS does not prepare, present, or prosecute claims on your behalf (38 C.F.R. &sect; 14.629)</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>NOT a substitute for professional consultation</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>NOT a guarantee of any claim outcome</li>
          </ul>
        </div>

        {/* Your Responsibility */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Your Responsibility</h2>
          <div className="rounded-xl bg-gold/5 border border-gold/20 p-4">
            <p className="text-muted-foreground">
              You are solely responsible for the accuracy of all information you enter. You must review and verify ALL content before submitting anything to the VA &mdash; especially AI-generated content. False or misleading statements in VA claims may constitute federal fraud.
            </p>
          </div>
        </div>

        {/* AI-Generated Content Warning */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">AI-Generated Content Warning</h2>
          <div className="rounded-xl bg-[rgba(212,175,55,0.05)] border border-gold/20 p-4 space-y-3">
            <p className="text-muted-foreground">
              This app uses a third-party AI service provider (currently Google Gemini) to generate suggestions and content. AI-generated content may be inaccurate, incomplete, or fabricated. AI-generated case law citations have a documented hallucination rate of 50-88%. <strong className="text-gold">NEVER submit AI-generated legal citations without independent verification.</strong> You assume all risk for reliance on AI-generated content.
            </p>
            <p className="text-muted-foreground">
              The Appeals Guide&apos;s case law database uses curated, verified citations from real court decisions &mdash; not AI-generated content. However, case summaries are simplified and may not reflect every nuance. You must still verify all citations independently and read the full opinion before relying on any case in a filing.
            </p>
          </div>
        </div>

        {/* Professional Consultation */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Professional Consultation</h2>
          <p className="text-muted-foreground">
            We strongly recommend consulting with a VA-accredited Veterans Service Organization (VSO), attorney, or claims agent before filing your claim. Find accredited representatives at{' '}
            <a
              href="https://www.va.gov/ogc/apps/accreditation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              va.gov/ogc/apps/accreditation
            </a>.
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
