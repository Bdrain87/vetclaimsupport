import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Activity, Moon, Brain, Pill, Stethoscope, FileText, Camera } from 'lucide-react';
import { impactLight } from '@/lib/haptics';
import { useProfileStore } from '@/store/useProfileStore';

const actions = [
  { label: 'Log Symptom', icon: Activity, path: '/health/symptoms', color: 'text-destructive' },
  { label: 'Log Sleep', icon: Moon, path: '/health/sleep', color: 'text-primary' },
  { label: 'Log Migraine', icon: Brain, path: '/health/migraines', color: 'text-gold' },
  { label: 'Log Medication', icon: Pill, path: '/health/medications', color: 'text-success' },
  { label: 'Medical Visit', icon: Stethoscope, path: '/health/visits', color: 'text-gold' },
  { label: 'Quick Note', icon: FileText, path: '/health/summary', color: 'text-muted-foreground' },
  { label: 'Scan Document', icon: Camera, path: '/claims/vault', color: 'text-primary' },
];

/** Paths where the FAB should appear — only screens where adding entries makes sense */
const FAB_VISIBLE_PREFIXES = [
  '/health',
  '/claims',
  '/prep',
];

/** Exact paths where the FAB should also appear */
const FAB_VISIBLE_EXACT = ['/app', '/'];

function shouldShowFAB(pathname: string): boolean {
  if (FAB_VISIBLE_EXACT.includes(pathname)) return true;
  return FAB_VISIBLE_PREFIXES.some((p) => pathname.startsWith(p));
}

export function QuickAddFAB() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hasOnboarded = useProfileStore((s) => s.hasCompletedOnboarding);

  if (!hasOnboarded) return null;
  if (!shouldShowFAB(location.pathname)) return null;

  const handleAction = (path: string) => {
    impactLight();
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            role="presentation"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
          />
        )}
      </AnimatePresence>
      <div className="fixed right-4 z-50 flex flex-col items-end gap-2" style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }} role={open ? 'menu' : undefined} aria-label={open ? 'Quick add actions' : undefined}>
        <AnimatePresence>
          {open && actions.map((action, i) => (
            <motion.button
              key={action.path}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: i * 0.04 }}
              role="menuitem"
              aria-label={action.label}
              onClick={() => handleAction(action.path)}
              className="flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-full bg-card border border-border shadow-lg hover:bg-accent transition-colors"
            >
              <span className="text-sm font-medium text-foreground whitespace-nowrap">{action.label}</span>
              <div className={`w-9 h-9 rounded-full bg-secondary flex items-center justify-center ${action.color}`}>
                <action.icon className="h-4 w-4" />
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { impactLight(); setOpen(!open); }}
          className="w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center bg-gold/15 backdrop-blur-xl border border-gold/30"
          aria-label={open ? 'Close quick add menu' : 'Open quick add menu'}
        >
          <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
            {open ? <X className="h-6 w-6 text-gold" /> : <Plus className="h-6 w-6 text-gold" />}
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}
