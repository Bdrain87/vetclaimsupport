import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Privacy() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="section-header">
        <div className="section-icon">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground">Last Updated: January 31, 2026</p>
        </div>
      </div>

      <Card className="data-card">
        <CardContent className="pt-6 space-y-8">
          {/* Commitment Section */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Our Commitment to Your Privacy</h2>
            <p className="text-muted-foreground">
              Service Evidence Tracker ("we," "our," or "the App") is committed to protecting your privacy. 
              This policy explains how we handle your information.
            </p>
          </section>

          {/* Data Collection Section */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Data Collection</h2>
            <p className="text-muted-foreground mb-4">
              <strong className="text-foreground">We do not collect any personal data.</strong> All information you enter into 
              Service Evidence Tracker is stored locally on your device only. We have no servers, no databases, 
              and no way to access your information.
            </p>
            
            <h3 className="text-base font-medium text-foreground mb-2">What This Means</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-success mt-1">✓</span>
                Your medical visits, symptoms, medications, and other entries never leave your device
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-1">✓</span>
                We cannot see, access, or retrieve your data
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-1">✓</span>
                We do not sell, share, or transmit any user information
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-1">✓</span>
                We do not use analytics or tracking tools
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-1">✓</span>
                We do not use cookies or similar technologies
              </li>
            </ul>
          </section>

          {/* Data Storage Section */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Data Storage</h2>
            <p className="text-muted-foreground mb-3">
              All data is stored in your device's local storage. This means:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Your data remains on your device unless you manually export it
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Clearing your browser data or uninstalling the app will delete your stored information
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                We recommend using the Export feature regularly to back up your records
              </li>
            </ul>
          </section>

          {/* Data Security Section */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Data Security</h2>
            <p className="text-muted-foreground mb-3">
              Because your data never leaves your device, security depends on your device's security measures. 
              We recommend:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Using a strong device passcode
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Keeping your device software updated
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Being cautious about who has physical access to your device
              </li>
            </ul>
          </section>

          {/* Children's Privacy Section */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Children's Privacy</h2>
            <p className="text-muted-foreground">
              This App is intended for adults (18+) managing their own health records for benefits purposes. 
              We do not knowingly provide services to children under 18.
            </p>
          </section>

          {/* Changes Section */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify users of any material changes 
              by updating the "Last Updated" date.
            </p>
          </section>

          {/* Contact Section */}
          <section className="pb-2">
            <h2 className="text-lg font-semibold text-foreground mb-3">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at:{' '}
              <span className="text-primary font-medium">support@serviceevidencetracker.app</span>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
