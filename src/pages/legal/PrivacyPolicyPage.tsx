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
        <div className="p-3 rounded-xl bg-gold/10 shrink-0">
          <Shield className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground/70 text-sm mt-1">Vet Claim Support &mdash; Version 1.2 &mdash; Effective February 19, 2026</p>
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
              <span className="text-gold mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">Profile Information:</strong> Name, military branch, MOS/AFSC/Rating/NEC/SFSC, service dates, claim type</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">Service History:</strong> Deployments, duty stations, combat history, major events</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">Health Data:</strong> Symptoms (severity, frequency, body area), sleep logs, migraine logs, medications, medical visits, exposures, PTSD symptoms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">Claims Data:</strong> Conditions being claimed, ratings, evidence status, buddy contact info</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">Documents:</strong> User-uploaded evidence files, generated PDFs, form drafts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">AI Interaction Data:</strong> Prompts sent to AI features and responses received (processed in real-time, not stored on our servers)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5">&#x2022;</span>
              <span><strong className="text-foreground">Operational Data:</strong> Minimal crash/performance metrics, device/OS type (no PII)</span>
            </li>
          </ul>
        </section>

        {/* Section 3: How Data Is Stored */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. How Data Is Stored</h2>
          <p className="text-muted-foreground">
            <strong className="text-foreground">CLOUD STORAGE:</strong> Your data is stored in our secure cloud database (Supabase PostgreSQL), encrypted at rest and in transit. When you create an account, your data is saved to the cloud to enable cross-device access and reliable data persistence. Access controls are in place to ensure only you can access your data.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">LOCAL CACHING:</strong> VCS may cache data locally on your device using browser localStorage and IndexedDB to improve performance and enable offline access. Local data is encrypted using AES-256-GCM encryption when a vault passcode is set in Settings. Local caching supplements cloud storage but is not the primary storage method.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">ENCRYPTION:</strong> Data in transit is encrypted via TLS. Cloud data at rest is encrypted on database servers. You may additionally enable client-side encryption by setting a vault passcode in Settings.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">HIPAA NOTICE:</strong> VCS is not a HIPAA-covered entity and does not claim compliance with the Health Insurance Portability and Accountability Act (HIPAA). VCS is not a healthcare provider, health plan, or healthcare clearinghouse as defined by HIPAA. While we implement strong security measures including encryption at rest and in transit, role-based access controls, and audit logging, VCS is a self-service educational tool, not a healthcare provider or claims processor. Do not use VCS as your sole repository for protected health information.
          </p>
        </section>

        {/* Section 4: AI Data Processing */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. AI Data Processing</h2>
          <p className="text-muted-foreground">
            When you use AI-powered features, the text you provide is sent to a third-party AI service provider (currently Google Gemini) for processing. This data is:
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(a) Transmitted over encrypted connections (TLS)</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(b) Processed in real-time and not stored by VCS on any server</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(c) Subject to <a href="https://ai.google.dev/terms" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Google&apos;s Gemini API Terms of Service</a></li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(d) Never used by VCS for AI model training</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(e) Under Google&apos;s paid API terms, your data is not used by Google to train or improve their AI models</li>
          </ul>
          <p className="text-muted-foreground">
            <strong className="text-foreground">PHI SAFEGUARDS:</strong> Before sending text to our AI provider, VCS automatically strips detectable personally identifiable information (SSNs, phone numbers, email addresses, dates of birth, and street addresses) using pattern-based sanitization. Veteran names are replaced with placeholders before transmission and restored client-side. However, free-text fields may contain information that automated sanitization cannot detect. While we automatically strip common identifiers before processing, we recommend you do not enter your Social Security number, date of birth, or full legal name into AI-powered features.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">ANONYMOUS USAGE:</strong> If you use AI features without creating an account, an anonymous session is created. Because anonymous sessions are not linked to a known identity, data deletion requests cannot retroactively cover anonymous AI usage. To ensure full control over your data, we recommend creating an account before using AI features.
          </p>
          <p className="text-muted-foreground">
            AI features are entirely optional. The app functions fully without them.
          </p>
        </section>

        {/* Section 5: Payment Processing */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. Payment Processing</h2>
          <p className="text-muted-foreground">
            Premium access ($9.99 one-time purchase) is processed by <strong className="text-foreground">Stripe, Inc.</strong> When you purchase Premium, Stripe collects and processes your payment information directly. VCS does <strong className="text-foreground">not</strong> collect, store, or have access to your full credit card number, debit card number, or bank account details.
          </p>
          <p className="text-muted-foreground">
            The data shared with Stripe includes your email address and a VCS user identifier to link your purchase to your account. Stripe may collect additional information as described in their <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Privacy Policy</a>.
          </p>
          <p className="text-muted-foreground">
            We store the following payment-related data in our database: your Stripe customer ID, purchase date, and entitlement status. This data is used solely to determine your access level and is deleted when you delete your account.
          </p>
        </section>

        {/* Section 6: What We Do NOT Do */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. What We Do NOT Do</h2>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT sell your data to anyone</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT share your data with third parties for marketing</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT use your data for targeted advertising</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT use your data to train AI models</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do NOT track your browsing activity</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do not ask for or require your Social Security Number, date of birth, or financial information (if you voluntarily enter such data in free-text fields, you do so at your own risk)</li>
          </ul>
        </section>

        {/* Section 7: Your Rights */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. Your Rights</h2>
          <p className="text-muted-foreground">You have the right to:</p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-foreground">ACCESS</strong> all your data via the Export feature in Settings</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-foreground">DELETE</strong> all local data from your device</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-foreground">DELETE</strong> your cloud account and all associated data</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-foreground">PORT</strong> your data by exporting to PDF or text format</li>
          </ul>
          <p className="text-muted-foreground">
            To exercise these rights, use the Settings page or contact{' '}
            <a href="mailto:Admin@vetclaimsupport.com" className="text-gold hover:underline">Admin@vetclaimsupport.com</a>.
          </p>
        </section>

        {/* Section 8: Privacy Rights */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">8. Privacy Rights</h2>
          <p className="text-muted-foreground">
            We strive to honor privacy rights under applicable laws. If you are a California resident, you have the right under the California Consumer Privacy Act (CCPA) to request disclosure of the categories and specific pieces of personal information we collect, to request deletion of your personal information, and to opt out of any sale of personal information. We do not sell your personal information. You may exercise your privacy rights (access, deletion, portability) by using the Settings page or contacting{' '}
            <a href="mailto:Admin@vetclaimsupport.com" className="text-gold hover:underline">Admin@vetclaimsupport.com</a>.
          </p>
        </section>

        {/* Section 9: Children's Privacy */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">9. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground">
            The Service is not intended for use by anyone under the age of 18. We do not knowingly collect data from children under 18.
          </p>
        </section>

        {/* Section 10: Data Retention */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">10. Data Retention</h2>
          <p className="text-muted-foreground">
            Local data persists on your device until you delete it. Cloud data persists until you delete your account. Upon account deletion, data is removed from active systems immediately. Encrypted backup remnants may persist for up to 30 days in provider backup systems before automatic purge. Cloud data for accounts inactive for more than 365 days may be automatically deleted as part of our data retention practices.
          </p>
        </section>

        {/* Section 11: Third-Party Services */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">11. Third-Party Services</h2>
          <p className="text-muted-foreground">
            The Service uses:
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span><strong className="text-foreground">Supabase</strong> (cloud database and authentication)</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span><strong className="text-foreground">Third-party AI service provider</strong> (currently Google Gemini — AI features, optional)</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span><strong className="text-foreground">Stripe</strong> (payment processing for Premium purchases)</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span><strong className="text-foreground">Vercel</strong> (web hosting and deployment)</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span><strong className="text-foreground">Apple Sign-In</strong> (authentication, optional)</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span><strong className="text-foreground">Google Sign-In</strong> (authentication, optional)</li>
          </ul>
          <p className="text-muted-foreground">
            Each third-party service has its own privacy policy.
          </p>
        </section>

        {/* Section 12: Data Breach Notification */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">12. Data Breach Notification</h2>
          <p className="text-muted-foreground">
            In the event of a data breach affecting your personal information, we will:
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(a) Investigate the scope and nature of the breach promptly</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(b) Notify affected users without unreasonable delay via email and/or in-app notification</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(c) Provide details about what information was affected and steps you can take to protect yourself</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(d) Report to relevant state authorities as required by applicable breach notification laws, including the Michigan Identity Theft Protection Act</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(e) Document the incident and remediation steps taken</li>
          </ul>
          <p className="text-muted-foreground">
            To report a suspected security incident, contact{' '}
            <a href="mailto:Admin@vetclaimsupport.com" className="text-gold hover:underline">Admin@vetclaimsupport.com</a>.
          </p>
        </section>

        {/* Section 13: Local Storage and Cookies */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">13. Local Storage and Cookies</h2>
          <p className="text-muted-foreground">
            VCS uses browser localStorage and IndexedDB to store your data locally on your device. This is essential for the app to function. We do not use tracking cookies, advertising cookies, or third-party analytics cookies. The local storage is used solely to persist your entered data between sessions. By using the app, you consent to this use of local storage as described in this policy.
          </p>
        </section>

        {/* Section 14: Changes to This Policy */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">14. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy. Each version will be identified by a version number and effective date at the top of this page. Material changes will be communicated through the app and may require re-acceptance of terms. Continued use after notification constitutes acceptance.
          </p>
        </section>

        {/* Section 15: Contact */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">15. Contact</h2>
          <p className="text-muted-foreground">
            Privacy questions:{' '}
            <a href="mailto:Admin@vetclaimsupport.com" className="text-gold hover:underline">
              Admin@vetclaimsupport.com
            </a>
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
