import React, { useState } from 'react';
import { Sparkles, Save, History } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';

export const SymptomJournal = () => {
  const [text, setText] = useState('');
  const { generate, isLoading } = useGemini('VA_SPEAK_TRANSLATOR');

  const handlePolish = async () => {
    if (!text.trim() || isLoading) return;
    const polished = await generate(text);
    if (polished) setText(polished);
  };

  return (
    <div className="glass-card p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black italic text-white uppercase tracking-tight">Symptom Journal</h3>
        <button className="text-white/40 hover:text-[#C8A628] transition-colors"><History size={20} /></button>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 bg-navy-950/50 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/30 outline-none focus:border-[#C8A628]/50 transition-all resize-none font-medium leading-relaxed"
          placeholder="Describe your symptoms in plain language (e.g., 'Knees are popping and hurt while climbing stairs')..."
        />

        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={handlePolish}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#C8A628] text-[#102039] rounded-xl font-black text-[10px] uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
          >
            <Sparkles size={14} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Processing...' : 'VA-Speak Polish'}
          </button>

          <button className="p-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all">
            <Save size={18} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] font-black text-white/50 uppercase mb-1">Last Entry</p>
          <p className="text-xs text-white/60 line-clamp-1">Bilateral patellofemoral crepitus...</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] font-black text-white/50 uppercase mb-1">Vault Status</p>
          <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Encrypted</p>
        </div>
      </div>
    </div>
  );
};
