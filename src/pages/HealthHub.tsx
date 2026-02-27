import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { Activity, Moon, Brain, Pill, Stethoscope, AlertTriangle, BarChart3, PersonStanding, Clock, Briefcase, TrendingUp } from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { PageContainer } from '@/components/PageContainer';

const healthCards = [
  { label: 'Symptoms', icon: Activity, route: '/health/symptoms', storeKey: 'symptoms' as const },
  { label: 'Body Map', icon: PersonStanding, route: '/claims/body-map', storeKey: 'userConditions' as const },
  { label: 'Sleep', icon: Moon, route: '/health/sleep', storeKey: 'sleepEntries' as const },
  { label: 'Migraines', icon: Brain, route: '/health/migraines', storeKey: 'migraines' as const },
  { label: 'Medications', icon: Pill, route: '/health/medications', storeKey: 'medications' as const },
  { label: 'Medical Visits', icon: Stethoscope, route: '/health/visits', storeKey: 'medicalVisits' as const },
  { label: 'Exposures', icon: AlertTriangle, route: '/health/exposures', storeKey: 'exposures' as const },
  { label: 'Work Impact', icon: Briefcase, route: '/health/work-impact', storeKey: 'employmentImpactEntries' as const },
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
  if (isNaN(d.getTime())) return 'No entries';
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

export default function HealthHub() {
  const navigate = useNavigate();
  const store = useAppStore(
    useShallow((s) => ({
      symptoms: s.symptoms,
      quickLogs: s.quickLogs,
      userConditions: s.userConditions,
      sleepEntries: s.sleepEntries,
      migraines: s.migraines,
      medications: s.medications,
      medicalVisits: s.medicalVisits,
      exposures: s.exposures,
      employmentImpactEntries: s.employmentImpactEntries,
    })),
  );

  // 30-Day Summary Stats
  const thirtyDayStats = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString().slice(0, 10);

    const recentSymptoms = (store.symptoms || []).filter(
      (s) => (s.date || '').slice(0, 10) >= cutoffStr
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
      (q) => q.hadFlareUp && (q.date || q.createdAt || '').slice(0, 10) >= cutoffStr
    ).length;

    return { totalSymptoms, avgPain, flareUps };
  }, [store.symptoms, store.quickLogs]);

  return (
    <PageContainer className="py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Track</h1>
        <p className="text-muted-foreground text-sm mt-1">Log health data to strengthen your VA evidence.</p>
      </div>

      {/* 30-Day Summary Card */}
      <button
        onClick={() => navigate('/health/summary')}
        className="w-full rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <BarChart3 className="h-5 w-5 text-gold" />
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

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => navigate('/health/trends')}
          className="flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors text-left"
        >
          <div className="p-2 rounded-lg bg-gold/10">
            <TrendingUp className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-foreground block truncate">Health Trends</span>
            <span className="text-[10px] text-muted-foreground block truncate">Pain, sleep & migraine trends</span>
          </div>
        </button>
        <button
          onClick={() => navigate('/health/timeline')}
          className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
        >
          <div className="p-2 rounded-lg bg-gold/10">
            <Clock className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-foreground block truncate">Timeline</span>
            <span className="text-[10px] text-muted-foreground block truncate">All health data in one place</span>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {healthCards.map((card) => {
          const entries = (store[card.storeKey] || []) as { date?: string; createdAt?: string; startDate?: string }[];
          const count = entries.length;
          const isEmpty = count === 0;
          const lastEntry = isEmpty ? null : formatLastEntry(entries);
          return (
            <button
              key={card.route}
              onClick={() => navigate(card.route)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-card hover:bg-accent/50 active:scale-[0.98] transition-all text-center"
            >
              <card.icon className={`h-8 w-8 ${isEmpty ? 'text-muted-foreground/40' : 'text-gold'}`} />
              <span className="text-sm font-medium text-foreground">{card.label}</span>
              {isEmpty ? (
                <>
                  <span className="text-xs text-muted-foreground/60">No entries yet</span>
                  <span className="text-[10px] text-gold">Tap to start logging</span>
                </>
              ) : (
                <>
                  <span className="text-xs text-muted-foreground">
                    {count} {count === 1 ? 'entry' : 'entries'}
                  </span>
                  {lastEntry && <span className="text-[10px] text-muted-foreground/70">{lastEntry}</span>}
                </>
              )}
            </button>
          );
        })}
      </div>
    </PageContainer>
  );
}
