import { AlertTriangle, X, Check, BookOpen, Stethoscope, Scale, Building2, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Disclaimer() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="section-header">
        <div className="section-icon bg-warning/20">
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Important Disclaimer</h1>
          <p className="text-muted-foreground">Vet Claim Support</p>
        </div>
      </div>

      {/* Main Disclaimer Highlight */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-warning/20 p-3 shrink-0">
              <BookOpen className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                This App Is For Educational Purposes Only
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Vet Claim Support is designed to help you understand and organize
                information related to VA disability claims. <strong className="text-foreground">It is not a
                substitute for professional legal or medical advice.</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Disclaimer */}
      <Card className="data-card">
        <CardContent className="pt-6">
          <Alert className="border-primary/30 bg-primary/10 mb-6">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground leading-relaxed">
              Vet Claim Support is an educational tool designed to help veterans understand and navigate the VA disability claims process. This app does not provide legal advice, medical advice, or representation before the Department of Veterans Affairs.
              <br /><br />
              We are not attorneys, accredited claims agents, or affiliated with the U.S. Department of Veterans Affairs in any way.
              <br /><br />
              The information provided is for educational and organizational purposes only. For legal advice regarding your VA claim, please consult with a VA-accredited attorney or claims agent.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* We Are NOT */}
      <Card className="data-card">
        <CardContent className="pt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <X className="h-5 w-5 text-destructive" />
              We Are NOT:
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <Scale className="h-5 w-5 text-destructive shrink-0" />
                <span className="text-foreground">Attorneys or legal professionals</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <Stethoscope className="h-5 w-5 text-destructive shrink-0" />
                <span className="text-foreground">Medical doctors or healthcare providers</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <Building2 className="h-5 w-5 text-destructive shrink-0" />
                <span className="text-foreground">VA-accredited claims agents</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <Building2 className="h-5 w-5 text-destructive shrink-0" />
                <span className="text-foreground">Affiliated with the Department of Veterans Affairs</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* We Do NOT */}
      <Card className="data-card">
        <CardContent className="pt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <X className="h-5 w-5 text-destructive" />
              We Do NOT:
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <X className="h-5 w-5 text-destructive shrink-0" />
                <span className="text-foreground">Guarantee any claim outcomes</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <X className="h-5 w-5 text-destructive shrink-0" />
                <span className="text-foreground">File claims on your behalf</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <X className="h-5 w-5 text-destructive shrink-0" />
                <span className="text-foreground">Provide legal representation</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <X className="h-5 w-5 text-destructive shrink-0" />
                <span className="text-foreground">Provide medical diagnoses</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* What This App Does */}
      <Card className="data-card">
        <CardContent className="pt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-400" />
              What This App Does:
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-foreground">Helps you organize your evidence</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-foreground">Explains VA rating criteria</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-foreground">Calculates estimated combined ratings</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-foreground">Prepares you for C&P exams</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-foreground">Tracks your symptoms over time</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* For Professional Help */}
      <Card className="data-card">
        <CardContent className="pt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              For Professional Help:
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <Scale className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong className="text-foreground">Legal Advice:</strong> Consult a VA-accredited attorney or claims agent
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Stethoscope className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong className="text-foreground">Medical Advice:</strong> Consult your healthcare provider
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong className="text-foreground">Official Information:</strong> Visit{' '}
                  <a
                    href="https://www.va.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    VA.gov
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Your Responsibility */}
      <Card className="data-card">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Your Responsibility</h2>
          <p className="text-muted-foreground leading-relaxed">
            All information you enter and all claims you file are your
            responsibility. Verify all information with official sources before
            submitting any claims to the VA.
          </p>
        </CardContent>
      </Card>

      {/* Acknowledgment */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            By using this app, you acknowledge that you have read and understood
            this disclaimer.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
