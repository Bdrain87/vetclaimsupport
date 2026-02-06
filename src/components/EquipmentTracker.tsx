import React from 'react';
import { Package, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const EquipmentTracker = () => {
  const equipment = [
    { name: "Stryker Post-Op Knee Brace", id: "DME-9921", status: "Issued", connection: "High" },
    { name: "ResMed AirSense 11 (CPAP)", id: "DME-4402", status: "Active", connection: "Presumptive" },
  ];

  return (
    <div className="p-8 glass-card">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">DME Evidence Log</h3>
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">VA-Issued Medical Equipment</p>
        </div>
        <Package className="text-[#C8A628]" size={28} />
      </div>

      <div className="space-y-4">
        {equipment.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-[#C8A628]/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#C8A628]/10 flex items-center justify-center text-[#C8A628]">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{item.name}</p>
                <p className="text-white/50 text-[10px] font-mono">{item.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#C8A628] text-[10px] font-black uppercase tracking-widest">{item.connection} Nexus</p>
              <p className="text-white/50 text-[9px] uppercase font-bold">Evidence Verified</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-[#C8A628]/5 border border-[#C8A628]/20 flex gap-3 items-start">
        <AlertCircle className="text-[#C8A628] shrink-0" size={16} />
        <p className="text-[10px] text-white/50 leading-relaxed font-medium italic">
          Professional Note: VA-issued Durable Medical Equipment (DME) is primary evidence of clinical necessity and functional loss during a C&P exam.
        </p>
      </div>
    </div>
  );
};
