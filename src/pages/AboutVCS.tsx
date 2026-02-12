import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Info, Shield, AlertCircle, ExternalLink, Heart, Scale, FileText, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/PageContainer';

const APP_VERSION = '1.0.0';

export default function AboutVCS() {
  const navigate = useNavigate();

  return (
    <PageContainer className="space-y-6 animate-fade-in py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10 shrink-0">
          <Info className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">About Vet Claim Support</h1>
            <Badge variant="secondary">v{APP_VERSION}</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Helping veterans organize and prepare their VA disability claim evidence
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Vet Claim Support (VCS) was created with a single purpose: to help veterans
            organize and prepare the evidence needed for their VA disability claims. We
            believe that every veteran who served our country deserves access to the
            benefits they earned, and that the claims process should not be a barrier to
            receiving them.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Filing a VA disability claim can be overwhelming. Between gathering medical
            records, documenting symptoms, understanding rating criteria, and preparing
            for C&P exams, there is a lot to keep track of. VCS provides a structured,
            guided approach to help you stay organized and informed throughout the process.
          </p>
        </CardContent>
      </Card>

      {/* What VCS Does */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            What VCS Does
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            VCS is an <strong className="text-foreground">educational and organizational tool</strong> designed
            to assist veterans in preparing their VA disability claim evidence. The app helps you:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5 shrink-0">&#x2713;</span>
              Track and document symptoms, medical visits, medications, and sleep patterns over time
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5 shrink-0">&#x2713;</span>
              Organize your service history, exposures, and condition-specific evidence
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5 shrink-0">&#x2713;</span>
              Learn about VA rating criteria, DBQ forms, and the claims process
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5 shrink-0">&#x2713;</span>
              Prepare for C&P examinations with condition-specific guidance
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5 shrink-0">&#x2713;</span>
              Generate exportable summaries to share with your VSO, attorney, or medical provider
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5 shrink-0">&#x2713;</span>
              Identify potential secondary conditions related to your service-connected disabilities
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Prominent Disclaimer */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Important Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm text-foreground font-medium leading-relaxed">
              Vet Claim Support is an independent educational and organizational tool.
              It does not file claims on your behalf, and using this app does not
              establish any professional relationship. Always consult with a qualified
              professional for advice specific to your situation.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">What VCS is NOT:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">&#x2717;</span>
                <span>
                  <strong className="text-foreground">Not VA-accredited.</strong> VCS is not a VA-accredited
                  claims agent, attorney, or Veterans Service Organization (VSO). We cannot
                  represent you before the VA or file claims on your behalf.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">&#x2717;</span>
                <span>
                  <strong className="text-foreground">Not legal advice.</strong> Nothing in this app
                  constitutes legal advice. For legal guidance regarding your VA claim,
                  consult a VA-accredited attorney or claims agent.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">&#x2717;</span>
                <span>
                  <strong className="text-foreground">Not medical advice.</strong> VCS does not diagnose
                  conditions or recommend treatments. Information provided is educational
                  only. Always consult your healthcare provider for medical decisions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">&#x2717;</span>
                <span>
                  <strong className="text-foreground">Not affiliated with the VA.</strong> This app is not
                  affiliated with, endorsed by, or connected to the U.S. Department of
                  Veterans Affairs or any government agency.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">&#x2717;</span>
                <span>
                  <strong className="text-foreground">Not a guarantee of outcomes.</strong> Using this app
                  does not guarantee any particular result for your VA disability claim.
                  Claim decisions are made solely by the VA.
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Data Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Your Data, Your Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your privacy is fundamental to VCS. All personal data, including health
            information, service records, and symptom logs, is stored locally on your
            device using browser storage. We do not collect, transmit, or store your
            personal information on external servers.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No account is required to use VCS. No tracking cookies. No analytics on your
            health data. You maintain full ownership and control of your information at
            all times.
          </p>
        </CardContent>
      </Card>

      {/* Legal Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Legal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link
            to="/settings/privacy"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground text-sm">Privacy Policy</span>
            </div>
            <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
          </Link>

          <Link
            to="/settings/terms"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground text-sm">Terms of Service</span>
            </div>
            <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
          </Link>

          <Link
            to="/settings/disclaimer"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-gold" />
              <span className="font-medium text-foreground text-sm">Disclaimer</span>
            </div>
            <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
          </Link>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you encounter a bug, have a feature request, or need help using VCS,
            please visit our GitHub Issues page. We actively monitor and respond to
            community feedback.
          </p>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            asChild
          >
            <a href="mailto:support@vetclaimsupport.com">
              <ExternalLink className="h-4 w-4 mr-2" />
              Contact Support
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Credits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Credits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            VCS is built with care for the veteran community. We are grateful to
            everyone who has contributed to making this tool better.
          </p>

          <Separator />

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Open Source Technologies</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Built with React, TypeScript, TailwindCSS, and other open source libraries
                that make modern web development possible.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">VA Public Data</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Rating criteria, DBQ references, and claims process information are derived
                from publicly available VA resources including 38 CFR (Code of Federal
                Regulations) and official VA publications.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Veteran Community</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Thank you to the veterans, VSOs, and advocates who have provided feedback,
                reported issues, and helped shape VCS into a more useful tool.
              </p>
            </div>
          </div>

          <Separator />

          <p className="text-xs text-muted-foreground text-center">
            Vet Claim Support v{APP_VERSION}
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
