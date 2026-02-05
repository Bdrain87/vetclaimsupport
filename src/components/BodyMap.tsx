import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const BodyMap = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const nexusMap: Record<string, string[]> = {
    "tinnitus": ["Migraines", "Anxiety", "Sleep Apnea"],
    "back": ["Sciatica", "Radiculopathy", "Depression"],
    "ptsd": ["GERD", "Hypertension", "Sleep Apnea"]
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 glass-card p-10">
      <div className="flex justify-center bg-black/20 rounded-3xl p-6">
        <svg viewBox="0 0 200 500" className="h-[450px] w-auto">
          <circle
            cx="100" cy="50" r="25"
            onClick={() => setSelected('tinnitus')}
            className={`cursor-pointer transition-all ${selected === 'tinnitus' ? 'fill-[#C8A628] filter blur-[2px]' : 'fill-white/10'}`}
          />
          <rect
            x="85" y="120" width="30" height="150" rx="15"
            onClick={() => setSelected('back')}
            className={`cursor-pointer transition-all ${selected === 'back' ? 'fill-[#C8A628] filter blur-[2px]' : 'fill-white/10'}`}
          />
        </svg>
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-3xl font-black italic mb-4">NEXUS DISCOVERY</h3>
        {selected ? (
          <div className="space-y-4">
            <p className="text-white/40 uppercase text-[10px] font-black tracking-widest">Secondary Paths Found</p>
            {nexusMap[selected]?.map(s => (
              <div key={s} className="p-4 bg-[#C8A628]/10 border border-[#C8A628]/30 rounded-2xl text-[#C8A628] font-bold">
                + {s}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/20 italic">Select a primary rating to reveal secondary connections.</p>
        )}
      </div>
    </div>
  );
};
