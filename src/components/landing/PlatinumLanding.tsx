import React from 'react';
import { motion } from 'framer-motion';
import { LaunchSpecialCard } from '@/components/LaunchSpecialCard';
import { ShieldCheck, Cpu, Database, ChevronRight } from 'lucide-react';

export const PlatinumLanding = () => {
  return (
    <div className="min-h-screen bg-[#102039] selection:bg-[#C8A628]/30 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Platinum Build v2.0 Live</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-7xl md:text-9xl font-black italic text-white tracking-tighter leading-[0.85] mb-8"
        >
          CLAIM THE <br /> <span className="text-[#C8A628]">EVIDENCE.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-12 px-4"
        >
          Professional-grade disability tracking for Veterans. Zero-cloud security, 38 CFR AI intelligence, and high-impact evidence mapping.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <button className="gold-button px-10 py-5 text-lg w-full md:w-auto flex items-center justify-center gap-3">
            START YOUR TRACKER <ChevronRight size={20} />
          </button>
          <button className="px-10 py-5 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all w-full md:w-auto">
            VIEW DEMO
          </button>
        </motion.div>
      </section>

      {/* Trust Pillars */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          { icon: <ShieldCheck />, title: "Local-Only", text: "Your health data never leaves your device. Period." },
          { icon: <Cpu />, title: "38 CFR AI", text: "Proprietary translation engine for VSO-ready evidence." },
          { icon: <Database />, title: "785+ Mappings", text: "Deep-linked nexus discovery for secondary conditions." }
        ].map((pillar, i) => (
          <div key={i} className="glass-card p-10 flex flex-col items-center text-center group hover:premium-border transition-all">
            <div className="p-4 bg-[#C8A628]/10 rounded-2xl text-[#C8A628] mb-6 group-hover:scale-110 transition-transform">
              {pillar.icon}
            </div>
            <h3 className="text-xl font-black italic text-white mb-4 uppercase">{pillar.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed font-medium">{pillar.text}</p>
          </div>
        ))}
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <LaunchSpecialCard />
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
          Built for Veterans. Not affiliated with the Dept. of Veterans Affairs.
        </p>
      </footer>
    </div>
  );
};
