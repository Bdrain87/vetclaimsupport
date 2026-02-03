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
          <h1 className="text-2xl font-bold text-foreground">Terms of Use</h1>
          <p className="text-muted-foreground">Vet Claim Support</p>
        </div>
      </div>

      <Card className="data-card">
        <CardContent className="pt-6 space-y-8">
          <p className="text-sm text-muted-foreground">Effective date: February 2026</p>

          {/* Section 1 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Agreement</h2>
            <p className="text-muted-foreground">
              By using Vet Claim Support, you agree to these Terms.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Eligibility</h2>
            <p className="text-muted-foreground">
              You must be at least 18 years old to use the App.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Educational Tools Only</h2>
            <Alert className="border-warning/50 bg-warning/10 mb-4">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-foreground">
                The App provides organizational tools and educational content. It does not provide legal, medical, or VA advice.
              </AlertDescription>
            </Alert>
            <p className="text-muted-foreground">
              You are responsible for your decisions and outcomes.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Not Affiliated With the VA</h2>
            <p className="text-muted-foreground">
              The App is not affiliated with, endorsed by, or sponsored by the U.S. Department of Veterans Affairs.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Local Storage and User Responsibility</h2>
            <p className="text-muted-foreground">
              Your data stays on your device. You are responsible for safeguarding your device, browser profile, 
              and exported files. If you clear browser data, you may lose data.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. AI-Powered Features</h2>
            <p className="text-muted-foreground">
              The App includes optional AI-powered document analysis features using Google's Gemini API.
              AI-generated suggestions are for informational purposes only and may contain errors or inaccuracies.
              You are responsible for reviewing and verifying any AI output before use. We make no guarantees
              about the accuracy, completeness, or suitability of AI-generated content. Use of AI features is
              subject to Google's Terms of Service.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Exports and Sharing</h2>
            <p className="text-muted-foreground">
              If you export to PDF or copy text, you control where it is saved or shared.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Acceptable Use</h2>
            <p className="text-muted-foreground mb-3">You agree not to:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Use the App for unlawful purposes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Attempt to reverse engineer or exploit the App
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Upload malicious files
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Misrepresent the App as legal/medical advice or VA-affiliated
              </li>
            </ul>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The App's code, UI, content templates, and educational materials are owned by the App owner.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              <strong className="text-foreground">The App is provided "as is" without warranties of any kind.</strong>
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, we are not liable for indirect, incidental, special, 
              consequential, or punitive damages, lost data, lost profits, or claim outcomes.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless the App owner from claims arising out of your misuse of the App.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">13. Changes</h2>
            <p className="text-muted-foreground">
              We may update the App and these Terms. Continued use means you accept the updated Terms.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">14. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms are governed by the laws of the State of Michigan, without regard to conflict of laws principles.
            </p>
          </section>

          {/* Section 15 */}
          <section className="pb-2">
            <h2 className="text-lg font-semibold text-foreground mb-3">15. Contact</h2>
            <p className="text-muted-foreground">
              For questions, visit our website.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
