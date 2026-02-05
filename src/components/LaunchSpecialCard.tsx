import React from 'react';
import { motion } from 'framer-motion';

export const LaunchSpecialCard = () => {
  const LAUNCH_DATE = new Date("2026-02-05T00:00:00");
  const NOW = new Date();
  const diffDays = Math.ceil(Math.abs(NOW.getTime() - LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24));
  const isLaunchWindow = diffDays <= 14;
  const price = isLaunchWindow ? "$4.99" : "$19.99";

  return (
    <div className="p-10 glass-card premium-border relative overflow-hidden">
      {isLaunchWindow && (
        <div className="absolute top-5 right-[-35px] rotate-45 bg-emerald-500 text-[#102039] px-10 py-1 font-black text-[10px] uppercase">
          Founder Special
        </div>
      )}
      <h2 className="text-6xl font-black text-white italic mb-2">{price}</h2>
      <p className="text-[#C8A628] font-bold uppercase tracking-widest text-xs">One-Time Founder's License</p>
      {isLaunchWindow && (
        <p className="text-white/40 text-[10px] mt-4 uppercase">Launch Price ends in {14 - diffDays} Days</p>
      )}
      <button className="w-full mt-8 py-4 gold-button">Unlock Platinum Suite</button>
    </div>
  );
};
