import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Activity, Moon, Brain, Pill, Stethoscope, FileText } from 'lucide-react';
import { impactLight } from '@/lib/haptics';
import { useProfileStore } from '@/store/useProfileStore';

const actions = [
  { label: 'Log Symptom', icon: Activity, path: '/health/symptoms', color: 'text-red-400' },
  { label: 'Log Sleep', icon: Moon, path: '/health/sleep', color: 'text-blue-400' },
  { label: 'Log Migraine', icon: Brain, path: '/health/migraines', color: 'text-purple-400' },
  { label: 'Log Medication', icon: Pill, path: '/health/medications', color: 'text-green-400' },
  { label: 'Medical Visit', icon: Stethoscope, path: '/health/visits', color: 'text-gold' },
  { label: 'Quick Note', icon: FileText, path: '/health/summary', color: 'text-muted-foreground' },
];

export function QuickAddFAB() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const hasOnboarded = useProfileStore((s) => s.hasCompletedOnboarding);

  if (!hasOnboarded) return null;

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
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {open && actions.map((action, i) => (
            <motion.button
              key={action.path}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: i * 0.04 }}
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
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
          style={{ background: 'var(--gold-gradient, linear-gradient(90deg, #C8A020 0%, #ECC440 20%, #FFE566 50%, #ECC440 80%, #C8A020 100%))' }}
          aria-label={open ? 'Close quick add menu' : 'Open quick add menu'}
        >
          <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
            {open ? <X className="h-6 w-6 text-black" /> : <Plus className="h-6 w-6 text-black" />}
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}
