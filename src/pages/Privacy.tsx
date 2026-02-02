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
          <p className="text-muted-foreground">Vet Claim Support</p>
        </div>
      </div>

      <Card className="data-card">
        <CardContent className="pt-6 space-y-8">
          <p className="text-sm text-muted-foreground">Effective date: February 2026</p>

          {/* Section 1 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Summary</h2>
            <p className="text-muted-foreground">
              Vet Claim Support is designed so your claim-related information stays on your device. 
              We do not collect, store, or sell your personal data.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="text-muted-foreground">
              <strong className="text-foreground">None.</strong> We do not collect names, emails, phone numbers, 
              health data, device identifiers, usage analytics, or uploaded documents.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Information Stored on Your Device</h2>
            <p className="text-muted-foreground">
              The App stores your entries and documents locally in your browser storage (IndexedDB). 
              This data is accessible to anyone who has access to your device and browser profile.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Network Requests</h2>
            <p className="text-muted-foreground">
              The App's code and static files are delivered from hosting so the site can load. 
              We do not transmit your app data, logs, documents, or entries to our servers.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Cookies and Tracking</h2>
            <p className="text-muted-foreground">
              We do not use tracking cookies or advertising pixels.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Third-Party Services</h2>
            <p className="text-muted-foreground">
              We do not embed analytics, ads, trackers, or third-party SDKs that collect user data.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Data Retention</h2>
            <p className="text-muted-foreground">
              Because we do not collect your data, we do not retain it on our servers. 
              Your local data remains on your device until you delete it.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Your Choices</h2>
            <p className="text-muted-foreground">
              You can delete your data by clearing your browser data for the site. 
              You control all exports, printing, and sharing.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Security</h2>
            <p className="text-muted-foreground">
              You are responsible for device security, passcodes, OS updates, and secure storage of exported files.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Children's Privacy</h2>
            <p className="text-muted-foreground">
              The App is not intended for children under 13.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Changes</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy. The effective date will be updated when changes are made.
            </p>
          </section>

          {/* Section 12 */}
          <section className="pb-2">
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Contact</h2>
            <p className="text-muted-foreground">
              For questions, visit our website.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
