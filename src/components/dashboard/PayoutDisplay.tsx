import React from 'react';
import { COMP_RATES_2026 } from '@/data/compRates2026';
import { DollarSign, TrendingUp } from 'lucide-react';

export const PayoutDisplay = ({ rating }: { rating: number }) => {
  const monthlyPayout = COMP_RATES_2026[rating] || 0;
  const annualPayout = monthlyPayout * 12;

  return (
    <div className="p-8 glass-card border-[rgba(214,178,94,0.2)] bg-gradient-to-br from-[#102039] to-[#1a3a6a]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-black italic text-white uppercase tracking-tight">Est. 2026 Benefit</h3>
          <p className="text-gold text-[10px] font-black uppercase tracking-widest mt-1">Veteran Only Rate</p>
        </div>
        <div className="p-3 bg-[rgba(214,178,94,0.1)] rounded-2xl text-gold">
          <DollarSign size={24} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-5xl font-black text-white italic tracking-tighter">
          ${monthlyPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          <span className="text-sm text-white/50 ml-2 not-italic">/ mo</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <TrendingUp size={14} />
          <span>${annualPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })} / year</span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider leading-tight">
          Calculated based on 2026 COLA Projections. Actual rates may vary based on dependency status.
        </p>
      </div>
    </div>
  );
};
