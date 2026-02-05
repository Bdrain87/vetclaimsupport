import { Shield, Lock, Eye, Database, Trash2, ShieldCheck } from 'lucide-react';

const PolicySection = ({ icon: Icon, number, title, children }: { icon: React.ElementType, number: number, title: string, children: React.ReactNode }) => (
  <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:border-[#C8A628]/30 transition-all group">
    <div className="flex items-start gap-4">
      <div className="p-3 bg-[#C8A628]/10 rounded-xl text-[#C8A628] shrink-0 group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      <div>
        <h2 className="text-lg font-black italic text-white uppercase tracking-tight mb-3">
          <span className="text-[#C8A628] mr-2">{number}.</span>{title}
        </h2>
        <div className="text-sm text-white/50 leading-relaxed font-medium">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8A628]/10 border border-[#C8A628]/20 mb-6">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-[#C8A628] uppercase tracking-[0.2em]">Zero-Knowledge Architecture</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black italic text-white tracking-tighter uppercase mb-4">
          Zero-Knowledge <span className="text-[#C8A628]">Privacy Policy</span>
        </h1>
        <p className="text-white/40 text-sm font-bold uppercase tracking-widest">
          Service Evidence Tracker | Platinum
        </p>
        <p className="text-white/20 text-xs mt-2">Effective: February 2026</p>
      </div>

      {/* Policy Sections */}
      <div className="glass-card premium-border p-8 space-y-6">
        <PolicySection icon={Eye} number={1} title="We Do Not Collect Your Data">
          Service Evidence Tracker is built on a <strong className="text-[#C8A628]">"Local-First" architecture</strong>.
          Unlike traditional apps, we do not maintain a central database. Your medical logs,
          symptoms, and personal claim details never leave your device.
        </PolicySection>

        <PolicySection icon={Lock} number={2} title="Hardware-Level Security">
          All sensitive evidence is protected by your device's native biometric hardware
          (FaceID, TouchID, or Passcode). We do not have access to your biometric data,
          nor do we store a copy of your encryption keys.
        </PolicySection>

        <PolicySection icon={Database} number={3} title="No Cloud, No Liability">
          Because your data is stored exclusively in your browser's secure local storage
          (IndexedDB), it is not accessible to us, the VA, or third-party hackers.{' '}
          <strong className="text-white">You own your data. You control your data.</strong>
        </PolicySection>

        <PolicySection icon={Trash2} number={4} title="Data Deletion">
          If you clear your browser cache or delete this application without exporting your
          evidence, your data will be <strong className="text-white">permanently lost</strong>.
          We cannot recover it for you because we never had it.
        </PolicySection>

        <PolicySection icon={ShieldCheck} number={5} title="HIPAA & Privacy">
          While we are not a "Covered Entity" under HIPAA (as we are a software tool and
          not a healthcare provider), our Zero-Knowledge architecture{' '}
          <strong className="text-[#C8A628]">exceeds industry standards</strong> for medical
          data privacy by removing the possibility of server-side data breaches.
        </PolicySection>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center pb-12">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/5">
          <Shield className="text-[#C8A628]" size={16} />
          <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">
            Built for Veterans. Your data never leaves your device.
          </p>
        </div>
      </div>
    </div>
  );
}
