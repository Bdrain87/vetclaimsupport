import React from 'react';
import { Package, ClipboardCheck } from 'lucide-react';

export const EquipmentTracker = () => {
  return (
    <div className="p-8 rounded-[2.5rem] bg-navy-950 border border-gold-500/20 shadow-2xl backdrop-blur-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black text-white italic">VA EQUIPMENT LOG</h3>
        <Package className="text-gold-500" size={24} />
      </div>
      <div className="space-y-4">
        {/* Logic: Map through VA-issued items like CPAP, Stryker braces, Prosthetics */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
          <div>
            <p className="text-xs font-black text-gold-500 uppercase tracking-widest">DME Issued</p>
            <p className="text-white font-bold">Stryker Post-Op Brace</p>
          </div>
          <ClipboardCheck className="text-emerald-500" />
        </div>
        <p className="text-[10px] text-white/30 uppercase font-medium">Note: VA-issued equipment serves as primary evidence of clinical necessity.</p>
      </div>
    </div>
  );
};
