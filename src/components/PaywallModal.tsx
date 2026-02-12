import { useState } from 'react';
import { X, Check, Shield, Cloud, FileText, Stethoscope, Download, Sparkles } from 'lucide-react';
import { purchaseLifetime, restorePurchases } from '@/services/entitlements';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VALUE_BULLETS = [
  { icon: Stethoscope, text: 'Unlimited conditions tracked' },
  { icon: FileText, text: 'Unlimited health logs' },
  { icon: Download, text: 'Upload & manage evidence documents' },
  { icon: Shield, text: 'Export your full claim packet' },
  { icon: Cloud, text: 'Cloud sync across devices' },
  { icon: Sparkles, text: 'VA Form Guide drafting assistance' },
];

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const success = await purchaseLifetime();
      if (!success) {
        alert('In-app purchases are not yet available. Check back soon!');
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const success = await restorePurchases();
      if (!success) {
        alert('No previous purchases found to restore.');
      }
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div role="dialog" aria-modal="true" aria-labelledby="paywall-modal-title" className="relative w-full max-w-md bg-[#1a2d44] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-white/50" />
        </button>

        {/* Header */}
        <div className="px-6 pt-8 pb-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#C5A442] to-[#7A672A] flex items-center justify-center shadow-lg shadow-[#C5A442]/20 mb-4">
            <Shield className="h-8 w-8 text-[#000000]" />
          </div>
          <h2 id="paywall-modal-title" className="text-xl font-bold text-white mb-1">Unlock Lifetime Access</h2>
          <p className="text-white/40 text-sm">One-time purchase. No subscriptions.</p>
        </div>

        {/* Value bullets */}
        <div className="px-6 pb-4 space-y-2">
          {VALUE_BULLETS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.07]">
              <div className="p-1.5 rounded-md bg-[#C5A442]/10">
                <Icon className="h-4 w-4 text-[#C5A442]" />
              </div>
              <span className="text-sm text-white/80">{text}</span>
              <Check className="h-4 w-4 text-emerald-400 ml-auto" />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#C5A442] to-[#7A672A] text-[#000000] font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {purchasing ? 'Processing...' : 'Unlock Lifetime Access'}
          </button>

          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-white/[0.09] border border-white/10 text-white/60 text-sm hover:bg-white/[0.1] transition-all"
          >
            Continue in Preview
          </button>

          <button
            onClick={handleRestore}
            disabled={restoring}
            className="w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors py-1"
          >
            {restoring ? 'Restoring...' : 'Restore Purchases'}
          </button>
        </div>
      </div>
    </div>
  );
}
