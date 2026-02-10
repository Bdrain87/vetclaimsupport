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
        <div className="p-3 rounded-xl bg-[#C8A628]/10 shrink-0">
          <Shield className="h-6 w-6 text-[#C8A628]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/40 text-sm mt-1">Vet Claim Support &mdash; Effective February 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 text-sm leading-relaxed">

        {/* What We Collect */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">1. What Data We Collect</h2>
          <p className="text-white/60">
            When you use Vet Claim Support, the app stores the following types of information based on what you choose to enter:
          </p>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-start gap-2"><span className="text-[#C8A628] mt-0.5">&#x2022;</span>Profile information (name, military branch, MOS/AFSC)</li>
            <li className="flex items-start gap-2"><span className="text-[#C8A628] mt-0.5">&#x2022;</span>Service history (dates, deployments, duty stations)</li>
            <li className="flex items-start gap-2"><span className="text-[#C8A628] mt-0.5">&#x2022;</span>Conditions you are tracking or claiming</li>
            <li className="flex items-start gap-2"><span className="text-[#C8A628] mt-0.5">&#x2022;</span>Health logs (symptoms, sleep, migraines, medications, medical visits)</li>
            <li className="flex items-start gap-2"><span className="text-[#C8A628] mt-0.5">&#x2022;</span>Evidence metadata (document titles, notes, status)</li>
            <li className="flex items-start gap-2"><span className="text-[#C8A628] mt-0.5">&#x2022;</span>Uploaded documents and files</li>
            <li className="flex items-start gap-2"><span className="text-[#C8A628] mt-0.5">&#x2022;</span>VA form drafts and AI-assisted draft content</li>
          </ul>
        </section>

        {/* Where It's Stored */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">2. Where Your Data Is Stored</h2>
          <p className="text-white/60">
            Your data is stored <strong className="text-white">locally on your device</strong> using browser storage (localStorage and IndexedDB). This is the primary data store and works offline.
          </p>
          <p className="text-white/60">
            When you create an account and sign in, your data is <strong className="text-white">optionally synced to Supabase</strong> (a hosted PostgreSQL database with secure file storage). Cloud sync is a convenience feature that enables backup and multi-device access. It is not required to use the app.
          </p>
        </section>

        {/* Security */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">3. Security</h2>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-start gap-2"><span className="text-[#C8A628] mt-0.5">&#x2022;</span><strong className="text-white">Encryption in transit:</strong> All data transmitted between your device and our cloud services is encrypted using TLS (Transport Layer Security).</li>
            <li className="flex items-start gap-2"><span className="text-[#C8A628] mt-0.5">&#x2022;</span><strong className="text-white">Encryption at rest:</strong> Cloud-stored data is encrypted at rest on the database server.</li>
            <li className="flex items-start gap-2"><span className="text-[#C8A628] mt-0.5">&#x2022;</span><strong className="text-white">Row Level Security:</strong> Database policies ensure that only you can access your own data. No other user or administrator can query your rows.</li>
          </ul>
        </section>

        {/* What We Don't Do */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">4. What We Do Not Do</h2>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do not sell your data to anyone.</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do not show advertisements based on your claim content.</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do not share your data with third parties.</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2717;</span>We do not use your data for AI model training.</li>
          </ul>
        </section>

        {/* User Rights */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">5. Your Rights</h2>
          <p className="text-white/60">You have full control over your data. At any time, you can:</p>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-white">Export all data</strong> &mdash; Download a complete copy in JSON or PDF format.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-white">Delete cloud data</strong> &mdash; Remove all synced data from our servers while keeping local data intact.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-white">Delete your account</strong> &mdash; Permanently remove all data from both cloud and local storage.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#x2713;</span><strong className="text-white">Clear local data</strong> &mdash; Wipe all data from this device without affecting cloud data.</li>
          </ul>
        </section>

        {/* Account & Login */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">6. Account Login Identifiers</h2>
          <p className="text-white/60">
            You may sign in using Apple, Google, or email. These identifiers are used <strong className="text-white">solely for authentication</strong> purposes. We do not access your contacts, photos, or any other data from these providers.
          </p>
        </section>

        {/* Purchase Data */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">7. Purchase Data</h2>
          <p className="text-white/60">
            We store your entitlement status (preview or lifetime access). Purchase transactions are processed by Apple App Store or Google Play Store. We do not store credit card numbers or payment details.
          </p>
        </section>

        {/* Operational Metrics */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">8. Operational Metrics</h2>
          <p className="text-white/60">
            We may collect minimal crash and performance data to improve app stability. This data does not include any claim content, health information, or personally identifiable information beyond basic device and OS details.
          </p>
        </section>

        {/* Data Retention */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">9. Data Retention</h2>
          <p className="text-white/60">
            Your data persists until you delete it. When you delete your account, all data is immediately removed from our active systems. Encrypted remnants may persist briefly in provider backups, but cannot be decrypted because the keys are destroyed.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">10. Contact</h2>
          <p className="text-white/60">
            For privacy-related questions or concerns, contact us at:{' '}
            <a href="mailto:blakedrain@gmail.com" className="text-[#C8A628] hover:underline">
              blakedrain@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
