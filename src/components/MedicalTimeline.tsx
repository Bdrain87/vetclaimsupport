import React from 'react';
import { ChevronRight } from 'lucide-react';

const TimelineEvent = ({ date, title, detail, isLast }: { date: string, title: string, detail: string, isLast?: boolean }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="h-4 w-4 rounded-full bg-[#D6B25E] border-4 border-[#102039] z-10" />
      {!isLast && <div className="w-[2px] h-full bg-white/10 -mt-1" />}
    </div>
    <div className="pb-8">
      <p className="text-[10px] font-black text-[#D6B25E] uppercase tracking-[0.2em] mb-1">{date}</p>
      <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-tighter">{title}</h4>
      <p className="text-xs text-white/40 leading-relaxed max-w-xs">{detail}</p>
    </div>
  </div>
);

export const MedicalTimeline = () => {
  return (
    <div className="glass-card p-8">
      <h3 className="text-xl font-black italic text-white uppercase tracking-tight mb-8">Medical Chronology</h3>
      <div className="relative">
        <TimelineEvent
          date="Oct 2025"
          title="Intent to File"
          detail="Official submission for supplemental evidence regarding knee instability."
        />
        <TimelineEvent
          date="Aug 2024"
          title="Service Treatment Record"
          detail="Entry from Grand Rapids clinic confirming acute patellar subluxation during training."
        />
        <TimelineEvent
          date="May 2012"
          title="In-Service Event"
          detail="Original jump injury recorded in STR during active duty (AFSC 11B)."
          isLast
        />
      </div>
      <button className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-white/50 uppercase hover:text-[#D6B25E] transition-colors">
        View Full History <ChevronRight size={14} />
      </button>
    </div>
  );
};
