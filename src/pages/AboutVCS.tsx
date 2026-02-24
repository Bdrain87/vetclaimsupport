import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Info, Shield, AlertCircle, ExternalLink, Heart, Scale, FileText, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/PageContainer';
import { CORE_DISCLAIMERS, ABOUT_COPY, LEGAL_VERSIONS, ADMIN_EMAIL } from '@/data/legalCopy';

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
            <Badge variant="secondary">v{LEGAL_VERSIONS.app}</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {ABOUT_COPY.tagline}
          </p>
        </div>
      </div>

      {/* Mission — 3 short blocks with subheads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {ABOUT_COPY.missionBlocks.map((block) => (
            <div key={block.heading}>
              <h3 className="text-sm font-semibold text-foreground mb-1">{block.heading}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{block.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* What VCS Does — no "submit" or "file" verbs */}
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
            to assist veterans in preparing their VA disability claim evidence:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {ABOUT_COPY.whatVCSDoes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 shrink-0">&#x2713;</span>
                {item}
              </li>
            ))}
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
              {CORE_DISCLAIMERS.mainDisclaimer}
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
                  represent you before the VA.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">&#x2717;</span>
                <span>
                  <strong className="text-foreground">Not legal advice.</strong> Nothing in this app
                  constitutes legal advice.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">&#x2717;</span>
                <span>
                  <strong className="text-foreground">Not medical advice.</strong> VCS does not diagnose
                  conditions or recommend treatments.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">&#x2717;</span>
                <span>
                  <strong className="text-foreground">Not affiliated with the VA.</strong> This app is not
                  affiliated with, endorsed by, or connected to the U.S. Department of
                  Veterans Affairs.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">&#x2717;</span>
                <span>
                  <strong className="text-foreground">Not a guarantee of outcomes.</strong> {CORE_DISCLAIMERS.estimateDisclaimer}
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
            information, service records, and symptom logs, is encrypted and stored
            locally on your device. We do not sell, share, or use your personal information for
            marketing or advertising.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No tracking. No ads. No selling data.
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
            If you encounter a bug, have a feature request, or need help, contact us.
          </p>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            asChild
          >
            <a href={`mailto:${ADMIN_EMAIL}`}>
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
            VCS is built with care for the veteran community.
          </p>

          <Separator />

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Open Source Technologies</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Built with React, TypeScript, TailwindCSS, and other open source libraries.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">VA Public Data</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Rating criteria and claims process information are derived
                from publicly available VA resources including 38 CFR and official VA publications.
              </p>
            </div>
          </div>

          <Separator />

          <p className="text-xs text-muted-foreground text-center">
            Vet Claim Support v{LEGAL_VERSIONS.app}
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
