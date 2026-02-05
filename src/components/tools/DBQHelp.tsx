import React from 'react';
import { DBQ_GUIDE_DATA } from '@/data/dbqGuide';
import { BookOpen, AlertCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const DBQHelp = () => {
  return (
    <div className="p-8 glass-card border-white/5">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gold-500/10 rounded-2xl text-[#C8A628]">
          <BookOpen size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">DBQ Insider Guide</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Rater-Ready Documentation Tips</p>
        </div>
      </div>

      <div className="space-y-4">
        {DBQ_GUIDE_DATA.map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 bg-white/5 border border-white/10 rounded-2xl group hover:border-[#C8A628]/30 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black text-[#C8A628] uppercase tracking-widest">{tip.section}</span>
              <div className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-bold text-white/40 uppercase">Insider Edge</div>
            </div>
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <ChevronRight size={14} className="text-[#C8A628]" /> {tip.focus}
            </h4>
            <p className="text-xs text-white/60 leading-relaxed italic">
              "{tip.insiderSecret}"
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-dashed border-white/10 flex gap-4 items-center">
        <AlertCircle className="text-emerald-500 shrink-0" size={20} />
        <p className="text-[10px] text-white/40 leading-tight">
          Professional Note: Use these insights to review your DBQ for accuracy before the examiner submits it to the VA. Missing checkboxes are the #1 cause of 'Remand' or 'Denial.'
        </p>
      </div>
    </div>
  );
};
