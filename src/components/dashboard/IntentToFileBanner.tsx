import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, ExternalLink, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProfileStore } from '@/store/useProfileStore';

const ITF_DISMISSED_KEY = 'itf-popup-dismissed';

export function IntentToFileBanner() {
  const { intentToFileDate, intentToFileFiled } = useProfileStore();

  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(ITF_DISMISSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Derive visibility directly from state — no separate useEffect needed
  const shouldShow = !intentToFileDate && !intentToFileFiled && !dismissed;
  const [visible, setVisible] = useState(shouldShow);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync visibility when profile store values change
  useEffect(() => {
    if (shouldShow) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [shouldShow]);

  // Cleanup timer on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(ITF_DISMISSED_KEY, 'true');
    } catch {
      // Storage unavailable
    }
    // Delay state update so exit animation completes before unmounting
    dismissTimerRef.current = setTimeout(() => setDismissed(true), 300);
  };

  // Early return after hooks — if already dismissed or ITF filed, nothing to render
  if (!shouldShow && !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="rounded-xl border-2 border-gold/50 bg-card p-4 relative overflow-hidden">
            {/* Gold accent line (decorative) */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: 'linear-gradient(90deg, #C8A020 0%, #ECC440 20%, #FFE566 50%, #ECC440 80%, #C8A020 100%)' }}
              aria-hidden="true"
            />

            {/* Dismiss button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-3 rounded-lg hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Dismiss intent to file banner"
            >
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </button>

            <div className="flex items-start gap-3 pr-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold/15 border border-gold/30 flex-shrink-0">
                <Shield className="h-5 w-5 text-gold" />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="text-sm font-bold text-foreground">
                  Have you filed your Intent to File?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Filing an Intent to File (ITF) protects your effective date and gives you one year to submit your claim. This is one of the most important first steps.
                </p>
                <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Intent to File actions">
                  <Link
                    to="/settings/itf"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors min-h-[44px]"
                    style={{ background: 'linear-gradient(90deg, #C8A020 0%, #ECC440 20%, #FFE566 50%, #ECC440 80%, #C8A020 100%)', color: '#000' }}
                  >
                    Learn How to File
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                  <a
                    href="https://www.va.gov/disability/how-to-file-claim/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gold/40 text-gold text-xs font-semibold hover:bg-gold/10 transition-colors min-h-[44px]"
                  >
                    File Now on VA.gov
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
