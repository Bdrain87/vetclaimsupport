import React from 'react';
import { useBilateralDetector } from '@/hooks/useBilateralDetector';
import { calculatePlatinumRating } from '@/utils/vaMath';
import { Zap } from 'lucide-react';

export const RatingCard = ({ claims }: { claims: { id: string, rating: number }[] }) => {
  const { bilateralRatings, standardRatings, detectedPairs } = useBilateralDetector(claims);
  const finalRating = calculatePlatinumRating(standardRatings, bilateralRatings);

  return (
    <div className="p-10 glass-card relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Estimated Rating</h3>
        {detectedPairs.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-[#C8A628]/20 border border-[#C8A628]/40 rounded-full animate-pulse">
            <Zap size={10} className="text-[#C8A628]" />
            <span className="text-[#C8A628] text-[9px] font-black uppercase">Bilateral Factor Active</span>
          </div>
        )}
      </div>

      <div className="text-9xl font-black italic text-white leading-none tracking-tighter">
        {finalRating}%
      </div>

      {detectedPairs.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[10px] text-white/30 uppercase font-bold mb-2">Detected Pairs:</p>
          <div className="flex flex-wrap gap-2">
            {detectedPairs.map(name => (
              <span key={name} className="text-[10px] text-white/60 font-medium">
                • {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
