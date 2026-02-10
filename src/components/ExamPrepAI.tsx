import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Stethoscope, Sparkles } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';

export const ExamPrepAI = () => {
  const [messages, setMessages] = useState<{ role: 'doc' | 'user', text: string }[]>([
    { role: 'doc', text: "I am your AI C&P Examiner. Which condition are we assessing for your mock exam today?" }
  ]);
  const [input, setInput] = useState('');
  const { generate, isLoading } = useGemini('EXAMINER_PERSONA');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    const aiResponse = await generate(userMsg);
    setMessages(prev => [...prev, { role: 'doc', text: aiResponse }]);
  };

  return (
    <div className="flex flex-col h-[600px] glass-card overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3B82F6] rounded-lg text-[#102039]"><Stethoscope size={20} /></div>
          <h3 className="font-bold italic uppercase tracking-tighter">C&P Prep Simulator</h3>
        </div>
        <Sparkles className="text-[#3B82F6] animate-pulse" size={18} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-[#3B82F6] text-[#102039] font-bold' : 'bg-white/5 border border-white/10 text-white'
            }`}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {isLoading && <div className="text-[#3B82F6] text-xs font-black animate-pulse">EXAMINER IS REVIEWING 38 CFR CRITERIA...</div>}
      </div>

      <div className="p-6 bg-white/5 border-t border-white/10 relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="w-full bg-navy-900/50 border border-white/10 rounded-xl p-4 pr-12 text-white placeholder:text-white/30 outline-none focus:border-[#3B82F6]/50 transition-all"
          placeholder="Type your response..."
        />
        <button
          onClick={handleSend}
          className="absolute right-9 top-1/2 -translate-y-1/2 text-[#3B82F6] hover:scale-110 transition-transform disabled:opacity-50"
          disabled={isLoading}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
