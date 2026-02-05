import React from 'react';
import { calculatePlatinumRating } from '@/utils/vaMath';
import { motion } from 'framer-motion';

export const RatingCard = ({ ratings, bilateral }: { ratings: number[], bilateral: number[] }) => {
  const combined = calculatePlatinumRating(ratings, bilateral);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-12 glass-card text-center relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C8A628] to-transparent opacity-50" />
      <h3 className="text-white/40 text-xs font-black uppercase tracking-[0.4em] mb-6">Current Rating Forecast</h3>
      <div className="text-9xl font-black italic text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
        {combined}<span className="text-4xl text-[#C8A628]">%</span>
      </div>
      <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8A628]/10 border border-[#C8A628]/30">
        <div className="h-2 w-2 rounded-full bg-[#C8A628] animate-pulse" />
        <span className="text-[#C8A628] text-[10px] font-black uppercase tracking-widest">
          {100 - combined}% to 100% P&T
        </span>
      </div>
    </motion.div>
  );
};
