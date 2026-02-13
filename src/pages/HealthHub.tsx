import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Moon, Brain, Pill, Stethoscope, AlertTriangle, BarChart3 } from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { PageContainer } from '@/components/PageContainer';

const healthCards = [
  { label: 'Symptoms', icon: Activity, route: '/health/symptoms', storeKey: 'symptoms' as const },
  { label: 'Sleep', icon: Moon, route: '/health/sleep', storeKey: 'sleepEntries' as const },
  { label: 'Migraines', icon: Brain, route: '/health/migraines', storeKey: 'migraines' as const },
  { label: 'Medications', icon: Pill, route: '/health/medications', storeKey: 'medications' as const },
  { label: 'Medical Visits', icon: Stethoscope, route: '/health/visits', storeKey: 'medicalVisits' as const },
  { label: 'Exposures', icon: AlertTriangle, route: '/health/exposures', storeKey: 'exposures' as const },
];

function formatLastEntry(entries: { date?: string; createdAt?: string; startDate?: string }[]): string {
  if (!entries || entries.length === 0) return 'No entries';
  const dates = entries
    .map((e) => e.date || e.createdAt || e.startDate || '')
    .filter(Boolean)
    .sort()
    .reverse();
  if (dates.length === 0) return 'No entries';
  const d = new Date(dates[0]);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

export default function HealthHub() {
  const navigate = useNavigate();
  const store = useAppStore();

  // 30-Day Summary Stats
  const thirtyDayStats = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString();

    const recentSymptoms = (store.symptoms || []).filter(
      (s) => (s.date || '') >= cutoffStr
    );
    const totalSymptoms = recentSymptoms.length;

    const painLevels = recentSymptoms
      .map((s) => s.severity)
      .filter((v): v is number => typeof v === 'number' && v > 0);
    const avgPain =
      painLevels.length > 0
        ? Math.round((painLevels.reduce((a, b) => a + b, 0) / painLevels.length) * 10) / 10
        : 0;

    const flareUps = (store.quickLogs || []).filter(
      (q) => q.hadFlareUp && (q.date || q.createdAt || '') >= cutoffStr
    ).length;

    return { totalSymptoms, avgPain, flareUps };
  }, [store.symptoms, store.quickLogs]);

  return (
    <PageContainer className="py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Health Tracking</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your health for stronger VA evidence.</p>
      </div>

      {/* 30-Day Summary Card */}
      <button
        onClick={() => navigate('/health/summary')}
        className="w-full rounded-xl border border-[#C5A442]/30 bg-[#C5A442]/5 hover:bg-[#C5A442]/10 transition-colors p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <BarChart3 className="h-5 w-5 text-[#C5A442]" />
          <span className="text-sm font-medium text-foreground">30-Day Summary</span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-foreground">{thirtyDayStats.totalSymptoms}</p>
            <p className="text-xs text-muted-foreground">Symptom Entries</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">
              {thirtyDayStats.avgPain > 0 ? thirtyDayStats.avgPain : '--'}
            </p>
            <p className="text-xs text-muted-foreground">Avg Pain Level</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{thirtyDayStats.flareUps}</p>
            <p className="text-xs text-muted-foreground">Flare-Ups</p>
          </div>
        </div>
      </button>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {healthCards.map((card) => {
          const entries = (store[card.storeKey] || []) as { date?: string; createdAt?: string; startDate?: string }[];
          const count = entries.length;
          const lastEntry = formatLastEntry(entries);
          return (
            <button
              key={card.route}
              onClick={() => navigate(card.route)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-center"
            >
              <card.icon className="h-8 w-8 text-[#C5A442]" />
              <span className="text-sm font-medium text-foreground">{card.label}</span>
              <span className="text-xs text-muted-foreground">
                {count} {count === 1 ? 'entry' : 'entries'}
              </span>
              <span className="text-[10px] text-muted-foreground/70">{lastEntry}</span>
            </button>
          );
        })}
      </div>
    </PageContainer>
  );
}
