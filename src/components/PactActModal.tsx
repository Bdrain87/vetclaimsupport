import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PACT_ACT_CONDITIONS, COVERED_LOCATIONS, getConditionsByExposure } from '@/data/pactActConditions';
import { ShieldAlert, MapPin, Calendar, X } from 'lucide-react';

/**
 * Derives the region-based display data from the canonical pactActConditions.ts source.
 * Previously this component imported a redundant, incomplete PACT_ACT_DATA array from pactAct.ts.
 */
function buildPactActDisplayData() {
  const exposureRegionMap: Record<string, { region: string; dates: string; description: string }> = {
    'Burn Pit Exposure': {
      region: 'Southwest Asia / Burn Pits',
      dates: 'Sep 11, 2001 \u2013 Present',
      description: 'Presumptive exposure for service in Iraq, Kuwait, Saudi Arabia, Afghanistan, and other post-9/11 locations.'
    },
    'Agent Orange': {
      region: 'Agent Orange / Vietnam',
      dates: 'Jan 9, 1962 \u2013 May 7, 1975',
      description: 'Includes Blue Water Navy, Thailand air bases, Korean DMZ, and other herbicide-exposed locations.'
    },
    'Gulf War': {
      region: 'Gulf War / Persian Gulf',
      dates: 'Aug 2, 1990 \u2013 Present',
      description: 'Presumptive conditions for service in the Persian Gulf theater.'
    },
    'Post-9/11': {
      region: 'Post-9/11 Service',
      dates: 'Sep 11, 2001 \u2013 Present',
      description: 'Additional presumptive conditions for all post-9/11 veterans.'
    },
    'Radiation': {
      region: 'Radiation Exposure',
      dates: 'Various',
      description: 'Presumptive conditions for veterans exposed to ionizing radiation during service.'
    }
  };

  const result: { region: string; dates: string; conditions: string[]; description: string }[] = [];

  for (const [exposureType, meta] of Object.entries(exposureRegionMap)) {
    const conditions = getConditionsByExposure(exposureType).map(c => c.condition);
    if (conditions.length > 0) {
      result.push({ ...meta, conditions });
    }
  }

  return result;
}

export const PactActModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const PACT_ACT_DATA = useMemo(() => buildPactActDisplayData(), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pact-act-modal-title"
            className="relative w-full max-w-4xl glass-card premium-border p-8 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                  <ShieldAlert size={28} />
                </div>
                <div>
                  <h2 id="pact-act-modal-title" className="text-3xl font-black italic uppercase tracking-tighter">PACT Act Discovery</h2>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Presumptive Exposure Mapping</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-white/5 rounded-full transition-colors" aria-label="Close">
                <X className="text-white/50" />
              </button>
            </div>

            <div className="grid gap-6">
              {PACT_ACT_DATA.map((region, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:border-[#C5A442]/30 transition-all group">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-[#C5A442] shrink-0" size={18} />
                      <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">{region.region}</h3>
                        <p className="text-xs text-white/50 mt-1 leading-relaxed">{region.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-950 h-fit border border-white/5">
                      <Calendar size={14} className="text-[#C5A442]" />
                      <span className="text-[10px] font-black text-white/60 uppercase">{region.dates}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {region.conditions.map(condition => (
                      <span key={condition} className="px-3 py-1.5 bg-[#C5A442]/10 text-[#C5A442] rounded-xl text-[10px] font-black uppercase tracking-tight border border-[#C5A442]/20 group-hover:bg-[#C5A442] group-hover:text-navy-950 transition-all">
                        + {condition}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
