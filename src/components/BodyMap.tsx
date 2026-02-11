import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VA_CONDITIONS } from '@/data/vaConditions';
import { AlertCircle, Activity } from 'lucide-react';

export const BodyMap = () => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Memoizing the lookup to prevent re-render lag with 785 items
  const relatedConditions = useMemo(() => {
    if (!selectedZone) return [];
    return VA_CONDITIONS.filter(c => c.category?.toLowerCase() === selectedZone.toLowerCase());
  }, [selectedZone]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 glass-card p-4 sm:p-6 lg:p-10 border-white/5 overflow-hidden">
      {/* Interactive SVG Body */}
      <div className="relative bg-navy-950/40 rounded-2xl sm:rounded-[3rem] p-4 sm:p-8 border border-white/5">
        <svg viewBox="0 0 200 500" className="h-[350px] sm:h-[450px] lg:h-[550px] mx-auto overflow-visible">
          {/* Head & Neck Zone */}
          <circle
            cx="100" cy="60" r="35"
            role="button" aria-label="Head and Neck"
            tabIndex={0}
            onClick={() => setSelectedZone('ear')}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedZone('ear')}
            className={`cursor-pointer outline-none focus:ring-2 focus:ring-[var(--gold-md)] transition-all duration-500 ${selectedZone === 'ear' ? 'fill-gold drop-shadow-[0_0_15px_var(--gold-md)]' : 'fill-white/10 hover:fill-white/20'}`}
          />
          {/* Spine & Back Zone */}
          <rect
            x="85" y="110" width="30" height="200" rx="15"
            role="button" aria-label="Spine and Back"
            tabIndex={0}
            onClick={() => setSelectedZone('musculoskeletal')}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedZone('musculoskeletal')}
            className={`cursor-pointer outline-none focus:ring-2 focus:ring-[var(--gold-md)] transition-all duration-500 ${selectedZone === 'musculoskeletal' ? 'fill-gold drop-shadow-[0_0_15px_var(--gold-md)]' : 'fill-white/10 hover:fill-white/20'}`}
          />
        </svg>
      </div>

      {/* Discovery Feed */}
      <div className="flex flex-col">
        <div className="mb-8">
          <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Nexus <span className="text-gold">Discovery</span></h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Interactive 38 CFR Mapping</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto max-h-[450px] pr-4 custom-scrollbar">
          <AnimatePresence mode="wait">
            {selectedZone ? (
              relatedConditions.map((condition, i) => (
                <motion.div
                  key={condition.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-[rgba(214,178,94,0.4)] transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-black text-sm uppercase tracking-tight break-words">{condition.name}</h4>
                      <p className="text-gold text-[10px] font-mono mt-1">DC: {condition.diagnosticCode}</p>
                    </div>
                    <Activity size={16} className="text-white/40 group-hover:text-gold transition-colors" />
                  </div>
                  {condition.possibleSecondaries && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {condition.possibleSecondaries.map(s => (
                        <span key={s} className="px-2 py-1 bg-[rgba(214,178,94,0.1)] text-gold rounded-md text-[9px] font-black uppercase tracking-tighter border border-[rgba(214,178,94,0.2)] truncate max-w-full">
                          + {s}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                <AlertCircle size={48} className="mb-4" />
                <p className="text-sm font-bold uppercase tracking-[0.2em]">Select a Body Zone<br/>to begin discovery</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
