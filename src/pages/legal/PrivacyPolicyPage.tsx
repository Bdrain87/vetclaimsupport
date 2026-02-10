import { Shield, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-[#3B82F6]/10 shrink-0">
          <Shield className="h-6 w-6 text-[#3B82F6]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/40 text-sm mt-1">Vet Claim Support &mdash; Last updated: February 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 text-sm leading-relaxed">

        {/* Section 1: Overview */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">1. Overview</h2>
          <p className="text-white/60">
            Vet Claim Support respects your privacy. This Privacy Policy explains what data we collect, how we store it, and your rights regarding that data.
          </p>
        </section>

        {/* Section 2: Data We Collect */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">2. Data We Collect</h2>
          <p className="text-white/60">
            The following categories of data may be collected based on what you choose to enter:
          </p>
          <ul className="space-y-2 text-white/60">
            <li className="flex items-start gap-2">
              <span className="text-[#3B82F6] mt-0.5">&#x2022;</span>
              <span><strong className="text-white">Profile Information:</strong> Name, military branch, MOS/AFSC/Rating/NEC/SFSC, service dates, claim type</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3B82F6] mt-0.5">&#x2022;</span>
              <span><strong className="text-white">Service History:</strong> Deployments, duty stations, combat history, major events</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3B82F6] mt-0.5">&#x2022;</span>
              <span><strong className="text-white">Health Data:</strong> Symptoms (severity, frequency, body area), sleep logs, migraine logs, medications, medical visits, exposures, PTSD symptoms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3B82F6] mt-0.5">&#x2022;</span>
              <span><strong className="text-white">Claims Data:</strong> Conditions being claimed, ratings, evidence status, buddy contact info</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3B82F6] mt-0.5">&#x2022;</span>
              <span><strong className="text-white">Documents:</strong> User-uploaded evidence files, generated PDFs, form drafts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3B82F6] mt-0.5">&#x2022;</span>
              <span><strong className="text-white">AI Interaction Data:</strong> Prompts sent to AI features and responses received (processed in real-time, not stored on our servers)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3B82F6] mt-0.5">&#x2022;</span>
              <span><strong className="text-white">Operational Data:</strong> Minimal crash/performance metrics, device/OS type (no PII)</span>
            </li>
          </ul>
        </section>

        {/* Section 3: How Data Is Stored */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">3. How Data Is Stored</h2>
          <p className="text-white/60">
            <strong className="text-white">PRIMARY:</strong> All data is stored locally on your device using browser localStorage and IndexedDB. Files larger than 1MB are automatically stored in IndexedDB.
          </p>
          <p className="text-white/60">
            <strong className="text-white">OPTIONAL CLOUD SYNC:</strong> If you create an account, data may be synced to our cloud database (Supabase PostgreSQL) for cross-device access. Cloud sync is optional and not required.
          </p>
          <p className="text-white/60">
            <strong className="text-white">ENCRYPTION:</strong> Data in transit is encrypted via TLS. Cloud data at rest is encrypted on database servers. Row-level security ensures only you can access your data.
          </p>
        </section>

        {/* Section 4: AI Data Processing */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">4. AI Data Processing</h2>
          <p className="text-white/60">
            When you use AI-powered features, the text you provide is sent to Google&apos;s Gemini API for processing. This data is:
          </p>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>(a) Transmitted over encrypted connections (TLS)</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>(b) Processed in real-time and not stored by VCS on any server</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>(c) Subject to Google&apos;s own data handling policies</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>(d) Never used by VCS for AI model training</li>
          </ul>
          <p className="text-white/60">
            AI features are entirely optional. The app functions fully without an AI API key.
          </p>
        </section>

        {/* Section 5: What We Do NOT Do */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">5. What We Do NOT Do</h2>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT sell your data to anyone</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT share your data with third parties for marketing</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT use your data for targeted advertising</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT use your data to train AI models</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT track your browsing activity</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT collect your Social Security Number, date of birth, or financial information</li>
          </ul>
        </section>

        {/* Section 6: Your Rights */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">6. Your Rights</h2>
          <p className="text-white/60">You have the right to:</p>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-white">ACCESS</strong> all your data via the Export feature in Settings</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-white">DELETE</strong> all local data from your device</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-white">DELETE</strong> your cloud account and all associated data</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-white">PORT</strong> your data by exporting to PDF or text format</li>
          </ul>
          <p className="text-white/60">
            To exercise these rights, use the Settings page or contact{' '}
            <a href="mailto:blakedrain@gmail.com" className="text-[#3B82F6] hover:underline">blakedrain@gmail.com</a>.
          </p>
        </section>

        {/* Section 7: California Residents (CCPA/CPRA) */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">7. California Residents (CCPA/CPRA)</h2>
          <p className="text-white/60">
            If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), including:
          </p>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>The right to know what personal information is collected</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>The right to delete personal information</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>The right to opt-out of the sale of personal information (we do not sell your data)</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>The right to non-discrimination for exercising your privacy rights</li>
          </ul>
          <p className="text-white/60">
            To exercise these rights, contact{' '}
            <a href="mailto:blakedrain@gmail.com" className="text-[#3B82F6] hover:underline">blakedrain@gmail.com</a>.
          </p>
        </section>

        {/* Section 8: Children's Privacy */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">8. Children&apos;s Privacy</h2>
          <p className="text-white/60">
            The Service is not intended for use by anyone under the age of 18. We do not knowingly collect data from children under 18.
          </p>
        </section>

        {/* Section 9: Data Retention */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">9. Data Retention</h2>
          <p className="text-white/60">
            Local data persists on your device until you delete it. Cloud data persists until you delete your account. Upon account deletion, data is removed from active systems immediately. Encrypted backup remnants may persist for up to 30 days in provider backup systems before automatic purge.
          </p>
        </section>

        {/* Section 10: Third-Party Services */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">10. Third-Party Services</h2>
          <p className="text-white/60">
            The Service uses:
          </p>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span><strong className="text-white">Supabase</strong> (cloud database, optional)</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span><strong className="text-white">Google Gemini AI</strong> (AI features, optional)</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span><strong className="text-white">Apple/Google</strong> (authentication and payment processing)</li>
          </ul>
          <p className="text-white/60">
            Each third-party service has its own privacy policy.
          </p>
        </section>

        {/* Section 11: Data Breach Notification */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">11. Data Breach Notification</h2>
          <p className="text-white/60">
            In the event of a data breach affecting your personal information, we will notify affected users via email within 72 hours of discovering the breach, in accordance with applicable state laws.
          </p>
        </section>

        {/* Section 12: Changes to This Policy */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">12. Changes to This Policy</h2>
          <p className="text-white/60">
            We may update this Privacy Policy. Material changes will be communicated through the app. Continued use constitutes acceptance.
          </p>
        </section>

        {/* Section 13: Contact */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">13. Contact</h2>
          <p className="text-white/60">
            Privacy questions:{' '}
            <a href="mailto:blakedrain@gmail.com" className="text-[#3B82F6] hover:underline">
              blakedrain@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
