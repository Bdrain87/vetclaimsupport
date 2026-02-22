import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineIndicator() {
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };
    const goOffline = () => {
      setOnline(false);
      setShowReconnected(false);
    };
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-2 py-2 px-4 bg-navy-900/90 backdrop-blur-sm text-gold-hl text-xs font-medium"
          role="status"
          aria-live="polite"
        >
          <WifiOff className="h-3.5 w-3.5" />
          <span>You're offline — AI features unavailable. Your data is saved locally.</span>
        </motion.div>
      )}
      {showReconnected && online && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-2 py-2 px-4 bg-emerald-900/90 backdrop-blur-sm text-emerald-100 text-xs font-medium"
          role="status"
          aria-live="polite"
        >
          <Wifi className="h-3.5 w-3.5" />
          <span>Back online</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
