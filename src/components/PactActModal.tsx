import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PACT_ACT_DATA } from '@/data/pactAct';
import { ShieldAlert, MapPin, Calendar, X } from 'lucide-react';

export const PactActModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
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
            className="relative w-full max-w-4xl glass-card premium-border p-8 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                  <ShieldAlert size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">PACT Act Discovery</h2>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Presumptive Exposure Mapping</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="text-white/50" />
              </button>
            </div>

            <div className="grid gap-6">
              {PACT_ACT_DATA.map((region, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:border-[#C8A628]/30 transition-all group">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-[#C8A628] shrink-0" size={18} />
                      <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">{region.region}</h3>
                        <p className="text-xs text-white/50 mt-1 leading-relaxed">{region.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-950 h-fit border border-white/5">
                      <Calendar size={14} className="text-[#C8A628]" />
                      <span className="text-[10px] font-black text-white/60 uppercase">{region.dates}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {region.conditions.map(condition => (
                      <span key={condition} className="px-3 py-1.5 bg-[#C8A628]/10 text-[#C8A628] rounded-xl text-[10px] font-black uppercase tracking-tight border border-[#C8A628]/20 group-hover:bg-[#C8A628] group-hover:text-navy-950 transition-all">
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
