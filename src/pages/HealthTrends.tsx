import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, Brain, Moon, Activity, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/PageContainer';
import useAppStore from '@/store/useAppStore';

type Period = '30' | '90' | '180';

function useTrendData(period: Period) {
  const symptoms = useAppStore((s) => s.symptoms);
  const migraines = useAppStore((s) => s.migraines);
  const sleepEntries = useAppStore((s) => s.sleepEntries);
  const quickLogs = useAppStore((s) => s.quickLogs);
  const employmentImpact = useAppStore((s) => s.employmentImpactEntries);

  return useMemo(() => {
    const days = parseInt(period);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().slice(0, 10);

    // Build weekly buckets
    const weeks: { start: string; end: string; label: string }[] = [];
    const bucketCount = Math.ceil(days / 7);
    for (let i = bucketCount - 1; i >= 0; i--) {
      const s = new Date();
      s.setDate(s.getDate() - (i + 1) * 7);
      const e = new Date();
      e.setDate(e.getDate() - i * 7);
      weeks.push({
        start: s.toISOString().slice(0, 10),
        end: e.toISOString().slice(0, 10),
        label: `${s.getMonth() + 1}/${s.getDate()}`,
      });
    }

    const inRange = (date: string) => date >= cutoffStr;
    const inWeek = (date: string, week: typeof weeks[0]) => date >= week.start && date < week.end;

    // Pain trend (from symptoms severity + quickLog painLevel)
    const recentSymptoms = symptoms.filter((s) => inRange(s.date));
    const recentQuickLogs = quickLogs.filter((q) => inRange(q.date || q.createdAt));

    const painByWeek = weeks.map((w) => {
      const symSeverities = recentSymptoms
        .filter((s) => inWeek(s.date, w))
        .map((s) => s.severity)
        .filter((v): v is number => typeof v === 'number' && v > 0);
      const qlPain = recentQuickLogs
        .filter((q) => inWeek(q.date || q.createdAt, w))
        .map((q) => q.painLevel ?? q.overallFeeling)
        .filter((v): v is number => typeof v === 'number' && v > 0);
      const all = [...symSeverities, ...qlPain];
      return all.length > 0 ? Math.round((all.reduce((a, b) => a + b, 0) / all.length) * 10) / 10 : null;
    });

    // Migraine frequency
    const recentMigraines = migraines.filter((m) => inRange(m.date));
    const migrainesByWeek = weeks.map((w) => recentMigraines.filter((m) => inWeek(m.date, w)).length);
    const prostratingByWeek = weeks.map((w) =>
      recentMigraines.filter((m) => inWeek(m.date, w) && (m.wasProstrating || m.severity === 'Prostrating' || m.severity === 'Severe')).length,
    );

    // Sleep quality
    const qualityMap: Record<string, number> = { 'Very Poor': 1, Poor: 2, Fair: 3, Good: 4, Excellent: 5 };
    const recentSleep = sleepEntries.filter((s) => inRange(s.date));
    const sleepByWeek = weeks.map((w) => {
      const entries = recentSleep.filter((s) => inWeek(s.date, w));
      if (entries.length === 0) return null;
      const avg = entries.reduce((sum, e) => sum + (qualityMap[e.quality] || 3), 0) / entries.length;
      return Math.round(avg * 10) / 10;
    });

    const sleepHoursByWeek = weeks.map((w) => {
      const entries = recentSleep.filter((s) => inWeek(s.date, w));
      if (entries.length === 0) return null;
      return Math.round((entries.reduce((sum, e) => sum + e.hoursSlept, 0) / entries.length) * 10) / 10;
    });

    // Flare-ups
    const flaresByWeek = weeks.map((w) =>
      recentQuickLogs.filter((q) => inWeek(q.date || q.createdAt, w) && q.hadFlareUp).length,
    );

    // Employment impact
    const recentEmployment = employmentImpact.filter((e) => inRange(e.date));
    const hoursLostByWeek = weeks.map((w) =>
      recentEmployment.filter((e) => inWeek(e.date, w)).reduce((sum, e) => sum + e.hoursLost, 0),
    );

    // Trend calculation helper
    const calcTrend = (values: (number | null)[]): 'up' | 'down' | 'stable' | 'no-data' => {
      const filled = values.filter((v): v is number => v !== null);
      if (filled.length < 2) return 'no-data';
      const half = Math.floor(filled.length / 2);
      const first = filled.slice(0, half);
      const second = filled.slice(half);
      const avg1 = first.reduce((a, b) => a + b, 0) / first.length;
      const avg2 = second.reduce((a, b) => a + b, 0) / second.length;
      const diff = avg2 - avg1;
      if (Math.abs(diff) < 0.3) return 'stable';
      return diff > 0 ? 'up' : 'down';
    };

    // Summary stats
    const totalSymptomEntries = recentSymptoms.length;
    const totalMigraines = recentMigraines.length;
    const totalProstrating = recentMigraines.filter((m) => m.wasProstrating || m.severity === 'Prostrating' || m.severity === 'Severe').length;
    const totalFlareUps = recentQuickLogs.filter((q) => q.hadFlareUp).length;
    const totalHoursLost = recentEmployment.reduce((sum, e) => sum + e.hoursLost, 0);

    return {
      weeks: weeks.map((w) => w.label),
      pain: { values: painByWeek, trend: calcTrend(painByWeek) },
      migraines: { values: migrainesByWeek, trend: calcTrend(migrainesByWeek) },
      prostrating: { values: prostratingByWeek, trend: calcTrend(prostratingByWeek) },
      sleep: { values: sleepByWeek, trend: calcTrend(sleepByWeek) },
      sleepHours: { values: sleepHoursByWeek, trend: calcTrend(sleepHoursByWeek) },
      flares: { values: flaresByWeek, trend: calcTrend(flaresByWeek) },
      hoursLost: { values: hoursLostByWeek, trend: calcTrend(hoursLostByWeek) },
      stats: { totalSymptomEntries, totalMigraines, totalProstrating, totalFlareUps, totalHoursLost },
    };
  }, [symptoms, migraines, sleepEntries, quickLogs, employmentImpact, period]);
}

// Simple bar chart with percentage-based heights
function MiniBarChart({
  values,
  maxVal,
  color = 'bg-gold',
  emptyColor = 'bg-muted/30',
}: {
  values: (number | null)[];
  maxVal?: number;
  color?: string;
  emptyColor?: string;
}) {
  const max = maxVal ?? Math.max(...values.filter((v): v is number => v !== null), 1);
  return (
    <div className="flex items-end gap-[3px] h-16">
      {values.map((v, i) => {
        const pct = v !== null ? Math.max((v / max) * 100, 4) : 0;
        return (
          <div key={i} className="flex-1 flex flex-col justify-end h-full">
            <div
              className={`rounded-sm transition-all ${v !== null ? color : emptyColor}`}
              style={{ height: v !== null ? `${pct}%` : '4px' }}
            />
          </div>
        );
      })}
    </div>
  );
}

function TrendBadge({ trend, inverted }: { trend: 'up' | 'down' | 'stable' | 'no-data'; inverted?: boolean }) {
  if (trend === 'no-data') return <Badge variant="outline" className="text-[10px]">No data</Badge>;

  // For pain/migraines/flares: up is bad (red), down is good (green)
  // For sleep quality: up is good (green), down is bad (red)
  const isGood = inverted ? trend === 'up' : trend === 'down';
  const isBad = inverted ? trend === 'down' : trend === 'up';

  if (trend === 'stable') {
    return (
      <Badge variant="outline" className="text-[10px] gap-1">
        <Minus className="h-3 w-3" /> Stable
      </Badge>
    );
  }
  if (isGood) {
    return (
      <Badge className="text-[10px] gap-1 bg-success/15 text-success border-success/30">
        {inverted ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} Improving
      </Badge>
    );
  }
  return (
    <Badge className="text-[10px] gap-1 bg-destructive/15 text-destructive border-destructive/30">
      {isBad && (inverted ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />)} Worsening
    </Badge>
  );
}

function TrendCard({
  title,
  icon: Icon,
  values,
  trend,
  maxVal,
  summary,
  color,
  inverted,
  vaNote,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  values: (number | null)[];
  trend: 'up' | 'down' | 'stable' | 'no-data';
  maxVal?: number;
  summary: string;
  color: string;
  inverted?: boolean;
  vaNote?: string;
}) {
  const hasData = values.some((v) => v !== null);

  return (
    <Card className="rounded-2xl">
      <CardContent className="py-3 px-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{title}</span>
          </div>
          <TrendBadge trend={trend} inverted={inverted} />
        </div>
        {hasData ? (
          <>
            <MiniBarChart values={values} maxVal={maxVal} color={color} />
            <p className="text-xs text-muted-foreground">{summary}</p>
          </>
        ) : (
          <div className="h-16 flex items-center justify-center">
            <p className="text-xs text-muted-foreground/60">No data in this period</p>
          </div>
        )}
        {vaNote && hasData && (
          <p className="text-[10px] text-gold/80 leading-tight">{vaNote}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function HealthTrends() {
  const [period, setPeriod] = useState<Period>('90');
  const data = useTrendData(period);

  const periodLabel = period === '30' ? '30 Days' : period === '90' ? '90 Days' : '6 Months';

  return (
    <PageContainer className="py-6 space-y-5 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/20">
            <TrendingUp className="h-6 w-6 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Health Trends</h1>
            <p className="text-muted-foreground text-sm">See how your conditions change over time.</p>
          </div>
        </div>
      </div>

      {/* Period Toggle */}
      <div className="flex gap-1.5 p-1 rounded-xl bg-muted/50 w-fit">
        {(['30', '90', '180'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              period === p
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {p === '30' ? '30d' : p === '90' ? '90d' : '6mo'}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="rounded-2xl">
          <CardContent className="py-3 px-3 text-center">
            <p className="text-xl font-bold text-foreground">{data.stats.totalSymptomEntries}</p>
            <p className="text-[10px] text-muted-foreground">Symptoms</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="py-3 px-3 text-center">
            <p className="text-xl font-bold text-foreground">{data.stats.totalFlareUps}</p>
            <p className="text-[10px] text-muted-foreground">Flare-Ups</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="py-3 px-3 text-center">
            <p className="text-xl font-bold text-foreground">{data.stats.totalMigraines}</p>
            <p className="text-[10px] text-muted-foreground">Migraines</p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Charts */}
      <div className="space-y-3">
        <TrendCard
          title="Pain Level"
          icon={Activity}
          values={data.pain.values}
          trend={data.pain.trend}
          maxVal={10}
          summary={`Weekly average severity over ${periodLabel.toLowerCase()}`}
          color="bg-destructive/80"
          vaNote="Worsening pain trends strengthen increased rating claims."
        />

        <TrendCard
          title="Migraines"
          icon={Brain}
          values={data.migraines.values}
          trend={data.migraines.trend}
          summary={`${data.stats.totalMigraines} total (${data.stats.totalProstrating} prostrating) over ${periodLabel.toLowerCase()}`}
          color="bg-purple-500/80"
          vaNote={
            data.stats.totalProstrating > 0
              ? `DC 8100: ${data.stats.totalProstrating} prostrating episodes documented.`
              : undefined
          }
        />

        <TrendCard
          title="Sleep Quality"
          icon={Moon}
          values={data.sleep.values}
          trend={data.sleep.trend}
          maxVal={5}
          summary={`Weekly average quality (1=Very Poor, 5=Excellent) over ${periodLabel.toLowerCase()}`}
          color="bg-primary/80"
          inverted
          vaNote="Consistent poor sleep supports sleep apnea and PTSD rating criteria."
        />

        <TrendCard
          title="Flare-Ups"
          icon={Flame}
          values={data.flares.values}
          trend={data.flares.trend}
          summary={`${data.stats.totalFlareUps} total flare-ups over ${periodLabel.toLowerCase()}`}
          color="bg-warning/80"
          vaNote="Flare-up frequency and duration are key factors in functional loss ratings."
        />

        {data.stats.totalHoursLost > 0 && (
          <TrendCard
            title="Work Hours Lost"
            icon={Calendar}
            values={data.hoursLost.values}
            trend={data.hoursLost.trend}
            summary={`${data.stats.totalHoursLost} total hours lost over ${periodLabel.toLowerCase()}`}
            color="bg-gold/80"
            vaNote="Employment impact documentation is critical for TDIU claims."
          />
        )}
      </div>

      <div className="text-center py-2">
        <p className="text-[10px] text-muted-foreground/60">
          Trends are based on weekly averages from your logged health data.
        </p>
      </div>
    </PageContainer>
  );
}
