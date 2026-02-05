import { Shield, Lock, Eye, Database, UserCheck, Globe, Baby, RefreshCw, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
          <p className="text-sm text-muted-foreground">Last Updated: February 2026</p>

          {/* Introduction */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Vet Claim Support ("we," "our," or "the App") respects your privacy.
              This Privacy Policy explains how we collect, use, and protect your
              information when you use our mobile application.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Information We Collect
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Information You Provide</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong className="text-foreground">Profile Information:</strong> Name, military branch, service dates (stored locally on your device)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong className="text-foreground">Health Information:</strong> Conditions, symptoms, journal entries (stored locally on your device)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong className="text-foreground">Evidence Records:</strong> Document references, buddy statement drafts (stored locally on your device)</span>
                  </li>
                </ul>
              </div>

              <Alert className="border-emerald-500/30 bg-emerald-500/10">
                <Lock className="h-4 w-4 text-emerald-400" />
                <AlertDescription className="text-foreground">
                  <strong>Information We Do NOT Collect:</strong>
                </AlertDescription>
              </Alert>

              <ul className="space-y-2 text-muted-foreground ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  We do NOT collect your Social Security Number
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  We do NOT collect your VA claim numbers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  We do NOT transmit your health data to external servers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  We do NOT sell or share your personal information with third parties
                </li>
              </ul>

              <div>
                <h3 className="font-medium text-foreground mb-2">Automatically Collected Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong className="text-foreground">Analytics:</strong> Anonymous usage statistics (feature usage, crash reports)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong className="text-foreground">Device Information:</strong> Device type, operating system version (for app compatibility)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Storage */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Data Storage
            </h2>

            <Alert className="border-primary/30 bg-primary/10 mb-4">
              <Database className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground font-medium">
                All personal data is stored locally on your device.
              </AlertDescription>
            </Alert>

            <p className="text-muted-foreground mb-4">
              We use on-device storage (localStorage/IndexedDB) to keep your information
              private and under your control.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">What This Means</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    Your data never leaves your device unless YOU choose to export it
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    If you delete the app, your data is deleted with it
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    We cannot access, view, or recover your data
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">Optional Cloud Backup</h3>
                <p className="text-muted-foreground">
                  If you choose to enable iCloud backup for the app, your data will be
                  stored according to Apple's iCloud terms. We do not have access to
                  your iCloud data.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              How We Use Information
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-2">We use the information you provide to:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    Calculate your estimated combined VA rating
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    Suggest potentially related secondary conditions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    Generate C&P exam preparation documents
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    Track your symptom journal entries
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    Organize your evidence for claims
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-muted-foreground mb-2">We do NOT use your information to:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1.5">✕</span>
                    Target advertisements
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1.5">✕</span>
                    Sell to third parties
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1.5">✕</span>
                    Share with government agencies
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1.5">✕</span>
                    Train AI models
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Data Security
            </h2>
            <p className="text-muted-foreground mb-3">We implement industry-standard security measures:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                All data stored locally with device encryption
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                No external database connections for personal data
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                No user accounts required (no password risks)
              </li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Third-Party Services
            </h2>
            <p className="text-muted-foreground mb-3">The app may use:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                <span><strong className="text-foreground">Apple App Store:</strong> For app distribution and in-app purchases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                <span><strong className="text-foreground">Analytics Service:</strong> For anonymous usage statistics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                <span><strong className="text-foreground">Crash Reporting:</strong> To identify and fix app issues</span>
              </li>
            </ul>
            <p className="text-muted-foreground mt-3">These services have their own privacy policies.</p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Baby className="h-5 w-5 text-primary" />
              Children's Privacy
            </h2>
            <p className="text-muted-foreground">
              This app is not intended for use by individuals under 18 years of age.
              We do not knowingly collect information from children.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Your Rights
            </h2>
            <p className="text-muted-foreground mb-3">You have the right to:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                <span><strong className="text-foreground">Access:</strong> View all data stored in the app (it's all on your device)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                <span><strong className="text-foreground">Delete:</strong> Remove any or all data via app settings or by deleting the app</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                <span><strong className="text-foreground">Export:</strong> Download your data in standard formats</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                <span><strong className="text-foreground">Portability:</strong> Your data belongs to you</span>
              </li>
            </ul>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Changes to This Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify
              you of significant changes through the app or our website.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Contact Us
            </h2>
            <p className="text-muted-foreground mb-2">For privacy questions or concerns:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                Email: privacy@vetclaimsupport.com
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                Website: vetclaimsupport.com/contact
              </li>
            </ul>
          </section>

          {/* California Residents */}
          <section className="pb-2">
            <h2 className="text-lg font-semibold text-foreground mb-3">California Residents (CCPA)</h2>
            <p className="text-muted-foreground">
              California residents have additional rights under the California
              Consumer Privacy Act. Since all data is stored locally on your device
              and we do not collect or sell personal information, these rights are
              inherently protected.
            </p>
          </section>

          {/* Effective Date */}
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground italic">
              This privacy policy is effective as of February 2026.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
