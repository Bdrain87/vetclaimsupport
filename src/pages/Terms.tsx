import { FileText, AlertTriangle, Scale, Shield, CreditCard, BookOpen, RefreshCw, Mail, Gavel, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Terms() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="section-header">
        <div className="section-icon">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground">Vet Claim Support</p>
        </div>
      </div>

      <Card className="data-card">
        <CardContent className="pt-6 space-y-8">
          <p className="text-sm text-muted-foreground">Last Updated: February 2026</p>

          {/* Agreement to Terms */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Agreement to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By downloading, installing, or using Vet Claim Support ("the App"),
              you agree to be bound by these Terms of Service ("Terms"). If you do
              not agree to these Terms, do not use the App.
            </p>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Description of Service
            </h2>
            <p className="text-muted-foreground mb-3">Vet Claim Support is a mobile application that provides:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                Educational information about VA disability claims
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                Tools to organize evidence and medical records
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                Rating calculators based on VA published criteria
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                C&P exam preparation resources
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                Symptom tracking and journaling features
              </li>
            </ul>
          </section>

          {/* Important Disclaimers */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Important Disclaimers
            </h2>

            <div className="space-y-4">
              <Alert className="border-warning/50 bg-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-foreground">
                  <strong>Not Legal Advice</strong>
                </AlertDescription>
              </Alert>
              <p className="text-muted-foreground">
                <strong className="text-foreground">THE APP DOES NOT PROVIDE LEGAL ADVICE.</strong> The information
                and tools provided are for educational and organizational purposes only.
                We are not attorneys, and using this app does not create an
                attorney-client relationship.
              </p>

              <Alert className="border-warning/50 bg-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-foreground">
                  <strong>Not Medical Advice</strong>
                </AlertDescription>
              </Alert>
              <p className="text-muted-foreground">
                <strong className="text-foreground">THE APP DOES NOT PROVIDE MEDICAL ADVICE.</strong> Information
                about medical conditions is for educational purposes. Always consult
                qualified healthcare providers for medical decisions.
              </p>

              <Alert className="border-warning/50 bg-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-foreground">
                  <strong>Not VA Affiliated</strong>
                </AlertDescription>
              </Alert>
              <p className="text-muted-foreground">
                <strong className="text-foreground">WE ARE NOT AFFILIATED WITH THE DEPARTMENT OF VETERANS AFFAIRS.</strong>{' '}
                This is an independent application. The VA has not endorsed, approved,
                or reviewed this app.
              </p>

              <Alert className="border-warning/50 bg-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-foreground">
                  <strong>No Guarantee of Results</strong>
                </AlertDescription>
              </Alert>
              <p className="text-muted-foreground">
                <strong className="text-foreground">WE DO NOT GUARANTEE ANY SPECIFIC CLAIM OUTCOMES.</strong> VA claim
                decisions are made solely by the VA based on their evaluation of evidence.
                Using this app does not guarantee approval, rating increases, or any
                particular result.
              </p>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Responsibilities
            </h2>
            <p className="text-muted-foreground mb-3">By using the App, you agree to:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                Provide accurate information about your service and conditions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                Not use the App for fraudulent purposes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                Not misrepresent information to the VA
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                Take responsibility for all claim submissions you make
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                Verify all information with official VA sources before filing
              </li>
            </ul>
          </section>

          {/* Payment and Refunds */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment and Refunds
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Purchase Price</h3>
                <p className="text-muted-foreground">
                  The App is available for a one-time purchase of $4.99 USD (price
                  subject to change).
                </p>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">Refunds</h3>
                <p className="text-muted-foreground">
                  Refund requests are handled through Apple's App Store according to
                  their refund policies. We also offer a 30-day money-back guarantee
                  through our support team.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">No Subscriptions</h3>
                <p className="text-muted-foreground">
                  There are no recurring subscription fees. Your purchase grants lifetime
                  access to the current version of the App.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">Future Updates</h3>
                <p className="text-muted-foreground">
                  Major feature updates may be offered as separate purchases. Bug fixes
                  and minor improvements are included with your purchase.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground mb-3 font-medium">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1.5">•</span>
                THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1.5">•</span>
                WE ARE NOT LIABLE FOR ANY DAMAGES ARISING FROM YOUR USE OF THE APP
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1.5">•</span>
                WE ARE NOT LIABLE FOR VA CLAIM DECISIONS OR OUTCOMES
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1.5">•</span>
                WE ARE NOT LIABLE FOR ANY LOSS OF DATA
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1.5">•</span>
                OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE APP
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Intellectual Property
            </h2>
            <p className="text-muted-foreground mb-3">
              The App, including all content, features, and functionality, is owned
              by Vet Claim Support and protected by copyright, trademark, and other
              intellectual property laws.
            </p>
            <p className="text-muted-foreground mb-2">You may not:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1.5">✕</span>
                Copy, modify, or distribute the App
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1.5">✕</span>
                Reverse engineer or decompile the App
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1.5">✕</span>
                Use the App for commercial purposes without permission
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1.5">✕</span>
                Remove any copyright or proprietary notices
              </li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              Governing Law
            </h2>
            <p className="text-muted-foreground">
              These Terms are governed by the laws of the State of Michigan, without
              regard to conflict of laws principles.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Changes to Terms
            </h2>
            <p className="text-muted-foreground">
              We may modify these Terms at any time. Continued use of the App after
              changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact */}
          <section className="pb-2">
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Contact
            </h2>
            <p className="text-muted-foreground mb-2">For questions about these Terms:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                Email: legal@vetclaimsupport.com
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                Website: vetclaimsupport.com/contact
              </li>
            </ul>
          </section>

          {/* Effective Date */}
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground italic">
              These Terms of Service are effective as of February 2026.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
