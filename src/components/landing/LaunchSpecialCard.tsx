import { useMemo } from 'react';

export function LaunchSpecialCard() {
  const LAUNCH_DATE = new Date('2026-02-05T00:00:00');

  const { isLaunchWindow, daysRemaining, price } = useMemo(() => {
    const now = new Date();
    const diffDays = Math.ceil(
      Math.abs(now.getTime() - LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24)
    );
    const isLaunch = diffDays <= 14;
    return {
      isLaunchWindow: isLaunch,
      daysRemaining: 14 - diffDays,
      price: isLaunch ? '$4.99' : '$19.99',
    };
  }, []);

  return (
    <div className="p-12 rounded-[3rem] bg-navy-800 border-2 border-gold-500 shadow-2xl overflow-hidden relative">
      {isLaunchWindow && (
        <div className="absolute top-4 right-[-45px] rotate-45 bg-emerald-500 text-navy-900 px-12 py-1 font-black text-[10px] uppercase tracking-wider">
          Early Access
        </div>
      )}

      <h2 className="text-5xl font-black text-white italic">{price}</h2>
      <p className="text-gold-500 font-bold tracking-tighter uppercase mt-2">
        One-Time Founder&apos;s License
      </p>

      {isLaunchWindow && daysRemaining > 0 && (
        <p className="text-white/40 text-xs mt-4">
          Special launch pricing ends in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}.
        </p>
      )}

      <button className="w-full mt-8 py-5 bg-gold-500 text-navy-900 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all">
        UNLOCK PRO SUITE
      </button>
    </div>
  );
}
