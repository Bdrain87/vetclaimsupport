import React from 'react';
import { Menu, User, Bell, Search } from 'lucide-react';

export const PlatinumNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-4">
      <div className="max-w-7xl mx-auto glass-card flex items-center justify-between px-6 py-4 border-white/5">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="h-8 w-8 bg-[#C8A628] rounded-lg flex items-center justify-center font-black text-[#102039] italic transition-transform group-hover:rotate-12">V</div>
            <span className="text-white font-black italic tracking-tighter uppercase relative hidden md:block">
              Vet Claim Support
              <span className="absolute -bottom-4 left-0 text-[8px] text-[#C8A628] opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                v2.0 // Protected by CatJuan
              </span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {['Dashboard', 'Evidence Vault', 'Discovery', 'Calculator'].map(item => (
              <a key={item} href="#" className="text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-[#C8A628] transition-colors">{item}</a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-white/40 hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <button className="relative p-2 text-white/40 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 h-2 w-2 bg-[#C8A628] rounded-full border-2 border-[#102039]" />
          </button>
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-white uppercase leading-none">Blake Drain</p>
              <p className="text-[9px] font-bold text-[#C8A628] uppercase leading-none mt-1">Platinum Member</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/10 border border-white/10 overflow-hidden">
               <div className="w-full h-full flex items-center justify-center bg-[#C8A628]/20 text-[#C8A628] font-black italic">B</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
