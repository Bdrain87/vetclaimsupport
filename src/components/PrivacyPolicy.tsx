import { Shield } from 'lucide-react';

const POLICIES = [
  { title: "Local-First Storage", text: "Vet Claim Support stores your data locally on your device using browser storage (localStorage and IndexedDB). This is the primary data store and works offline." },
  { title: "Optional Cloud Sync", text: "If you create an account, data may be optionally synced to our cloud database for cross-device access. Cloud sync is not required to use the app." },
  { title: "Encryption", text: "Data in transit is encrypted via TLS. Cloud data at rest is encrypted on database servers. Row-level security ensures only you can access your data." },
  { title: "Data Deletion", text: "If you clear your browser cache without exporting, your local data will be permanently lost. Use the Export feature in Settings to back up your data." },
  { title: "Your Data, Your Control", text: "We do not sell your data, share it with third parties for marketing, use it for targeted advertising, or use it to train AI models." }
];

export const PrivacyPolicy = () => (
  <div className="glass-card p-8 space-y-6">
    <div className="flex items-center gap-3 mb-4">
      <Shield className="text-[#D6B25E]" size={24} />
      <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Privacy Overview</h2>
    </div>
    {POLICIES.map((p, i) => (
      <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
        <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1">
          <span className="text-[#D6B25E] mr-2">{i + 1}.</span>{p.title}
        </h3>
        <p className="text-xs text-white/40 leading-relaxed">{p.text}</p>
      </div>
    ))}
  </div>
);
