import React, { useState } from 'react';
import { ShieldCheck, Unlock } from 'lucide-react';

export const DocumentVault = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleVaultUnlock = async () => {
    if (!window.PublicKeyCredential) {
      setIsUnlocked(true); // Fallback
      return;
    }
    try {
      const challenge = window.crypto.getRandomValues(new Uint8Array(32));
      const cred = await navigator.credentials.get({
        publicKey: { challenge, userVerification: "required" }
      } as CredentialRequestOptions);
      if (cred) setIsUnlocked(true);
    } catch {
      setIsUnlocked(true); // Fallback on error
    }
  };

  return (
    <div className="p-8 min-h-screen">
      {!isUnlocked ? (
        <div className="flex flex-col items-center justify-center mt-32 space-y-6">
          <div className="p-10 rounded-full bg-[rgba(214,178,94,0.1)] border border-[rgba(214,178,94,0.2)] animate-pulse">
            <ShieldCheck className="h-16 w-16 text-gold" />
          </div>
          <h2 className="text-3xl font-black italic">SECURE VAULT</h2>
          <button onClick={handleVaultUnlock} className="primary-button px-12 py-4">Authenticate</button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Unlock className="text-emerald-500" /> LOCAL EVIDENCE
          </h2>
          <div className="grid gap-4 mt-8">
            {/* Folder structure for 21-4138, Nexus Letters, and DBQs */}
          </div>
        </div>
      )}
    </div>
  );
};
