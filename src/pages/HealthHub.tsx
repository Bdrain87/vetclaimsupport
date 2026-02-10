import { useNavigate } from 'react-router-dom';
import { Activity, Moon, Brain, Pill, Stethoscope, AlertTriangle, BarChart3 } from 'lucide-react';
import useAppStore from '@/store/useAppStore';

const healthCards = [
  { label: 'Symptoms', icon: Activity, route: '/health/symptoms', storeKey: 'symptoms' as const },
  { label: 'Sleep', icon: Moon, route: '/health/sleep', storeKey: 'sleepEntries' as const },
  { label: 'Migraines', icon: Brain, route: '/health/migraines', storeKey: 'migraines' as const },
  { label: 'Medications', icon: Pill, route: '/health/medications', storeKey: 'medications' as const },
  { label: 'Medical Visits', icon: Stethoscope, route: '/health/visits', storeKey: 'medicalVisits' as const },
  { label: 'Exposures', icon: AlertTriangle, route: '/health/exposures', storeKey: 'exposures' as const },
];

export default function HealthHub() {
  const navigate = useNavigate();
  const store = useAppStore();

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Health Tracking</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your health for stronger VA evidence.</p>
      </div>

      <button
        onClick={() => navigate('/health/summary')}
        className="w-full flex items-center gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
      >
        <BarChart3 className="h-5 w-5 text-amber-500" />
        <div className="text-left">
          <span className="text-sm font-medium text-foreground">30-Day Summary</span>
          <p className="text-xs text-muted-foreground">View your health tracking overview</p>
        </div>
      </button>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {healthCards.map((card) => {
          const entries = store[card.storeKey] || [];
          const count = entries.length;
          return (
            <button
              key={card.route}
              onClick={() => navigate(card.route)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-center"
            >
              <card.icon className="h-8 w-8 text-amber-500" />
              <span className="text-sm font-medium text-foreground">{card.label}</span>
              <span className="text-xs text-muted-foreground">
                {count} {count === 1 ? 'entry' : 'entries'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
