import { Shield } from 'lucide-react';

const POLICIES = [
  { title: "We Do Not Collect Your Data", text: "Vet Claim Support is built on a Local-First architecture. Your medical logs, symptoms, and personal claim details never leave your device." },
  { title: "Hardware-Level Security", text: "All sensitive evidence is protected by your device's native biometric hardware (FaceID, TouchID, or Passcode)." },
  { title: "No Cloud, No Liability", text: "Your data is stored exclusively in your browser's secure local storage (IndexedDB). You own your data. You control your data." },
  { title: "Data Deletion", text: "If you clear your browser cache without exporting, your data will be permanently lost. We cannot recover it because we never had it." },
  { title: "HIPAA & Privacy", text: "Our Zero-Knowledge architecture exceeds industry standards for medical data privacy by removing the possibility of server-side breaches." }
];

export const PrivacyPolicy = () => (
  <div className="glass-card p-8 space-y-6">
    <div className="flex items-center gap-3 mb-4">
      <Shield className="text-[#C8A628]" size={24} />
      <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Zero-Knowledge Privacy</h2>
    </div>
    {POLICIES.map((p, i) => (
      <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
        <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1">
          <span className="text-[#C8A628] mr-2">{i + 1}.</span>{p.title}
        </h3>
        <p className="text-xs text-white/40 leading-relaxed">{p.text}</p>
      </div>
    ))}
  </div>
);
