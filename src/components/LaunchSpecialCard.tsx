export const LaunchSpecialCard = () => {
  const LAUNCH_DATE = new Date("2026-02-05T00:00:00");
  const diffDays = Math.ceil(Math.abs(new Date().getTime() - LAUNCH_DATE.getTime()) / (1000 * 3600 * 24));
  const isLaunchWindow = diffDays <= 14;
  const price = isLaunchWindow ? "$4.99" : "$19.99";

  return (
    <div className="p-12 rounded-[3rem] bg-[#102039] border-2 border-[#C8A628] shadow-2xl relative overflow-hidden">
      {isLaunchWindow && (
        <div className="absolute top-4 right-[-40px] rotate-45 bg-emerald-500 text-navy-950 px-12 py-1 font-black text-[10px] uppercase">
          Early Access
        </div>
      )}
      <h2 className="text-6xl font-black text-white italic">{price}</h2>
      <p className="text-[#C8A628] font-bold uppercase tracking-widest mt-2">Launch Price</p>
      <button className="w-full mt-8 py-4 bg-[#C8A628] text-navy-950 font-black rounded-2xl">Unlock Platinum Suite</button>
    </div>
  );
};
