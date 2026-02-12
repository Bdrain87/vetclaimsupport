import React, { useState } from 'react';
import { Navigation } from 'lucide-react';

export const TravelCalculator = () => {
  const [miles, setMiles] = useState(0);
  const RATE_2026 = 0.415; // Estimated 2026 VA Beneficiary Travel Rate

  return (
    <div className="p-8 glass-card border-white/5">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#D6B25E]/10 rounded-2xl text-[#F6E4AA]">
          <Navigation size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">BTMS Evidence</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Travel Pay & Milestone Tracker</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-[10px] font-black text-[#D6B25E] uppercase tracking-widest mb-2 block">Round Trip Mileage</label>
          <input
            type="number"
            onChange={(e) => setMiles(Number(e.target.value))}
            className="w-full bg-navy-950 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#D6B25E]/50"
            placeholder="Enter miles to VA facility..."
          />
        </div>

        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
          <p className="text-white/60 font-bold uppercase text-xs tracking-tight">Estimated Reimbursement</p>
          <p className="text-2xl font-black text-emerald-400">${(miles * RATE_2026).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
