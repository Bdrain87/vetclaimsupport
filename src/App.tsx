import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { Landing } from './pages/Landing';
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="min-h-screen bg-[#102039] font-sans selection:bg-[#C8A628]/30 overflow-x-hidden">
      {/* Global Notifications for Vault Unlocks/Errors */}
      <Toaster position="top-center" richColors />

      {/* Navigation */}
      <Navbar />

      {/* Main View - Setting Landing as the default */}
      <main className="relative z-10">
        <Landing />
      </main>

      {/* Background Ambient Glow to prevent 'Flat' look */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#C8A628]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-[#C8A628]/5 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}

export default App;
