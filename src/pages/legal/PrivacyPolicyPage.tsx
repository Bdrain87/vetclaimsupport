import { Shield, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/PageContainer';

export default function PrivacyPolicyPage() {
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
        <div className="p-3 rounded-xl bg-[#D4AF37]/10 shrink-0">
          <Shield className="h-6 w-6 text-[#D4AF37]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground/70 text-sm mt-1">Vet Claim Support &mdash; Last updated: February 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 text-sm leading-relaxed">

        {/* Section 1: Overview */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Overview</h2>
          <p className="text-muted-foreground">
            Vet Claim Support respects your privacy. This Privacy Policy explains what data we collect, how we store it, and your rights regarding that data.
          </p>
        </section>

        {/* Section 2: Data We Collect */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. Data We Collect</h2>
          <p className="text-muted-foreground">
            The following categories of data may be collected based on what you choose to enter:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">Profile Information:</strong> Name, military branch, MOS/AFSC/Rating/NEC/SFSC, service dates, claim type</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">Service History:</strong> Deployments, duty stations, combat history, major events</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">Health Data:</strong> Symptoms (severity, frequency, body area), sleep logs, migraine logs, medications, medical visits, exposures, PTSD symptoms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">Claims Data:</strong> Conditions being claimed, ratings, evidence status, buddy contact info</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">Documents:</strong> User-uploaded evidence files, generated PDFs, form drafts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">AI Interaction Data:</strong> Prompts sent to AI features and responses received (processed in real-time, not stored on our servers)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">Operational Data:</strong> Minimal crash/performance metrics, device/OS type (no PII)</span>
            </li>
          </ul>
        </section>

        {/* Section 3: How Data Is Stored */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. How Data Is Stored</h2>
          <p className="text-muted-foreground">
            <strong className="text-foreground">PRIMARY:</strong> All data is encrypted using AES-256-GCM encryption and stored securely. Set a vault passcode in Settings to enable full encryption on your device. VCS is not a HIPAA-covered entity; however, we treat all health-related data with the same care and apply encryption at rest and in transit.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">OPTIONAL CLOUD SYNC:</strong> If you create an account, data may be synced to our cloud database (Supabase PostgreSQL) for cross-device access. Cloud sync is optional and not required.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">ENCRYPTION:</strong> Data in transit is encrypted via TLS. Cloud data at rest is encrypted on database servers. Access controls are in place to ensure only you can access your data.
          </p>
        </section>

        {/* Section 4: AI Data Processing */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. AI Data Processing</h2>
          <p className="text-muted-foreground">
            When you use AI-powered features, the text you provide is sent to Google Gemini for processing. This data is:
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-0.5">&#x2022;</span>(a) Transmitted over encrypted connections (TLS)</li>
            <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-0.5">&#x2022;</span>(b) Processed in real-time and not stored by VCS on any server</li>
            <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-0.5">&#x2022;</span>(c) Subject to the AI provider&apos;s own data handling policies</li>
            <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-0.5">&#x2022;</span>(d) Never used by VCS for AI model training</li>
          </ul>
          <p className="text-muted-foreground">
            AI features are entirely optional. The app functions fully without an AI API key.
          </p>
        </section>

        {/* Section 5: What We Do NOT Do */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. What We Do NOT Do</h2>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT sell your data to anyone</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT share your data with third parties for marketing</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT use your data for targeted advertising</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT use your data to train AI models</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT track your browsing activity</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do not ask for or require your Social Security Number, date of birth, or financial information (if you voluntarily enter such data in free-text fields, you do so at your own risk)</li>
          </ul>
        </section>

        {/* Section 6: Your Rights */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Your Rights</h2>
          <p className="text-muted-foreground">You have the right to:</p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-foreground">ACCESS</strong> all your data via the Export feature in Settings</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-foreground">DELETE</strong> all local data from your device</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-foreground">DELETE</strong> your cloud account and all associated data</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-foreground">PORT</strong> your data by exporting to PDF or text format</li>
          </ul>
          <p className="text-muted-foreground">
            To exercise these rights, use the Settings page or contact{' '}
            <a href="mailto:blakedrain@gmail.com" className="text-[#D4AF37] hover:underline">blakedrain@gmail.com</a>.
          </p>
        </section>

        {/* Section 7: Privacy Rights */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. Privacy Rights</h2>
          <p className="text-muted-foreground">
            We strive to honor privacy rights under applicable laws. If you are a California resident, you have the right under the California Consumer Privacy Act (CCPA) to request disclosure of the categories and specific pieces of personal information we collect, to request deletion of your personal information, and to opt out of any sale of personal information. We do not sell your personal information. You may exercise your privacy rights (access, deletion, portability) by using the Settings page or contacting{' '}
            <a href="mailto:blakedrain@gmail.com" className="text-[#D4AF37] hover:underline">blakedrain@gmail.com</a>.
          </p>
        </section>

        {/* Section 8: Children's Privacy */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">8. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground">
            The Service is not intended for use by anyone under the age of 18. We do not knowingly collect data from children under 18.
          </p>
        </section>

        {/* Section 9: Data Retention */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">9. Data Retention</h2>
          <p className="text-muted-foreground">
            Local data persists on your device until you delete it. Cloud data persists until you delete your account. Upon account deletion, data is removed from active systems immediately. Encrypted backup remnants may persist for up to 30 days in provider backup systems before automatic purge.
          </p>
        </section>

        {/* Section 10: Third-Party Services */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">10. Third-Party Services</h2>
          <p className="text-muted-foreground">
            The Service uses:
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-0.5">&#x2022;</span><strong className="text-foreground">Supabase</strong> (cloud database, optional)</li>
            <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-0.5">&#x2022;</span><strong className="text-foreground">Google Gemini</strong> (AI features, optional)</li>
            <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-0.5">&#x2022;</span><strong className="text-foreground">Vercel</strong> (web hosting and deployment)</li>
          </ul>
          <p className="text-muted-foreground">
            Each third-party service has its own privacy policy.
          </p>
        </section>

        {/* Section 11: Data Breach Notification */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">11. Data Breach Notification</h2>
          <p className="text-muted-foreground">
            In the event of a data breach affecting your personal information, we will notify affected users as soon as reasonably practicable, in accordance with applicable state laws.
          </p>
        </section>

        {/* Section 12: Changes to This Policy */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">12. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy. Material changes will be communicated through the app. Continued use constitutes acceptance.
          </p>
        </section>

        {/* Section 13: Contact */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">13. Contact</h2>
          <p className="text-muted-foreground">
            Privacy questions:{' '}
            <a href="mailto:blakedrain@gmail.com" className="text-[#D4AF37] hover:underline">
              blakedrain@gmail.com
            </a>
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
