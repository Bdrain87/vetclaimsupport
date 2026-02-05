import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { vaConditions } from '@/data/vaConditions';

export const BodyMap = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid lg:grid-cols-2 gap-10 glass-card p-10">
      <div className="bg-navy-950/50 rounded-[2.5rem] p-8 border border-white/5 relative group">
        <svg viewBox="0 0 200 500" className="h-[500px] mx-auto drop-shadow-[0_0_20px_rgba(200,166,40,0.1)]">
          {/* Head - Tinnitus/Migraines */}
          <circle
            cx="100" cy="50" r="22"
            role="button"
            aria-label="Tinnitus and Head Conditions"
            tabIndex={0}
            onClick={() => setSelected('tinnitus')}
            onKeyDown={(e) => e.key === 'Enter' && setSelected('tinnitus')}
            className={`cursor-pointer outline-none focus:ring-2 focus:ring-[#C8A628] ${
              selected === 'tinnitus' ? 'fill-[#C8A628]' : 'fill-white/10'
            }`}
          />
          {/* Spine - Back Strain */}
          <rect
            x="85" y="100" width="30" height="180" rx="15"
            onClick={() => setSelected('lumbosacral-strain')}
            className={`cursor-pointer transition-all duration-700 ${selected === 'lumbosacral-strain' ? 'fill-[#C8A628] drop-shadow-[0_0_10px_#C8A628]' : 'fill-white/10 hover:fill-white/20'}`}
          />
        </svg>
      </div>

      <div className="flex flex-col justify-center">
        <h2 className="text-4xl font-black italic text-white mb-6 uppercase tracking-tighter">Nexus <span className="text-[#C8A628]">Discovery</span></h2>
        {selected ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="p-6 bg-[#C8A628]/10 border border-[#C8A628]/30 rounded-3xl">
              <h4 className="text-[#C8A628] font-black text-xs uppercase tracking-[0.3em] mb-4">Common Secondaries</h4>
              <div className="flex flex-wrap gap-2">
                {vaConditions.find(c => c.id === selected)?.possibleSecondaries?.map(s => (
                  <span key={s} className="px-4 py-2 bg-[#C8A628] text-navy-950 rounded-xl font-black text-[10px] uppercase">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <p className="text-white/20 font-bold uppercase tracking-widest text-sm italic">Select a primary rating on the map to unlock secondary nexus pathways.</p>
        )}
      </div>
    </div>
  );
};
