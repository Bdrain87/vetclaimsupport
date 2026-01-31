import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="section-header">
        <div className="section-icon">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground">Last Updated: January 31, 2026</p>
        </div>
      </div>

      <Card className="data-card">
        <CardContent className="pt-6 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using Service Evidence Tracker ("the App"), you agree to be bound by these Terms of Service. 
              If you do not agree, do not use this App.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Service Evidence Tracker is a personal organizational tool designed to help users document and track 
              health-related information. The App stores all data locally on your device.
            </p>
          </section>

          {/* Section 3 - Important Notice */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. NOT MEDICAL OR LEGAL ADVICE</h2>
            <Alert className="border-destructive/50 bg-destructive/10 mb-4">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-foreground">
                <strong>IMPORTANT:</strong> This App does NOT provide medical advice, legal advice, or VA claims assistance.
              </AlertDescription>
            </Alert>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Information about VA disabilities, ratings, and secondary conditions is for educational reference only
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                The App does not diagnose conditions or recommend treatments
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Rating calculations are estimates only and may differ from actual VA determinations
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Always consult qualified healthcare providers for medical decisions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Always consult VA-accredited attorneys, claims agents, or Veterans Service Organizations (VSOs) for claims assistance
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. No Warranty</h2>
            <p className="text-muted-foreground">
              <strong className="text-foreground">THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.</strong> We do not 
              guarantee the accuracy, completeness, or usefulness of any information in the App. VA policies, rating criteria, 
              and regulations may change without notice.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-3">
              <strong className="text-foreground">TO THE MAXIMUM EXTENT PERMITTED BY LAW</strong>, we shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Loss of benefits or claims denials
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Decisions made based on App information
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Data loss due to device issues
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Any errors in disability or rating information
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. User Responsibilities</h2>
            <p className="text-muted-foreground mb-3">You are responsible for:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                The accuracy of information you enter
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Backing up your data using the Export feature
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Verifying all information with official sources before making decisions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Maintaining the security of your device
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The App and its original content are protected by copyright and other intellectual property laws. 
              VA disability information is derived from publicly available federal regulations.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may modify these Terms at any time. Continued use after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by the laws of the United States and the State of Michigan, without regard to conflict of law provisions.
            </p>
          </section>

          {/* Section 10 */}
          <section className="pb-2">
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Contact</h2>
            <p className="text-muted-foreground">
              Questions about these Terms? Contact us at:{' '}
              <span className="text-primary font-medium">support@serviceevidencetracker.app</span>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
