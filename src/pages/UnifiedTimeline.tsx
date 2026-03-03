import { useMemo, useState } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { safeFormatDate } from '@/utils/dateUtils';
import { Calendar, Activity, Moon, Brain, Pill, Stethoscope, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimelineEvent {
  id: string;
  date: string;
  type: 'symptom' | 'sleep' | 'migraine' | 'medication' | 'visit' | 'exposure';
  title: string;
  detail: string;
  severity?: number;
  icon: typeof Activity;
  color: string;
}

const TYPE_META: Record<TimelineEvent['type'], { icon: typeof Activity; color: string; label: string }> = {
  symptom: { icon: Activity, color: 'text-destructive', label: 'Symptom' },
  sleep: { icon: Moon, color: 'text-indigo-400', label: 'Sleep' },
  migraine: { icon: Brain, color: 'text-purple-400', label: 'Migraine' },
  medication: { icon: Pill, color: 'text-success', label: 'Medication' },
  visit: { icon: Stethoscope, color: 'text-primary', label: 'Visit' },
  exposure: { icon: AlertTriangle, color: 'text-gold', label: 'Exposure' },
};

export default function UnifiedTimeline() {
  const { data } = useClaims();
  const [filter, setFilter] = useState<'all' | TimelineEvent['type']>('all');
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const events = useMemo(() => {
    const all: TimelineEvent[] = [];

    (data.symptoms || []).forEach((s) => {
      all.push({
        id: `sym-${s.id}`,
        date: s.date,
        type: 'symptom',
        title: s.symptom || 'Symptom logged',
        detail: `Severity: ${s.severity}/10${s.bodyArea ? ` | ${s.bodyArea}` : ''}${s.notes ? ` | ${s.notes}` : ''}`,
        severity: s.severity,
        icon: TYPE_META.symptom.icon,
        color: TYPE_META.symptom.color,
      });
    });

    (data.sleepEntries || []).forEach((s) => {
      all.push({
        id: `slp-${s.id}`,
        date: s.date,
        type: 'sleep',
        title: `${s.hoursSlept}h sleep - ${s.quality}`,
        detail: `${s.interruptions ? `${s.interruptions} interruptions` : 'No interruptions'}${s.usesCPAP ? ' | CPAP used' : ''}`,
        icon: TYPE_META.sleep.icon,
        color: TYPE_META.sleep.color,
      });
    });

    (data.migraines || []).forEach((m) => {
      all.push({
        id: `mig-${m.id}`,
        date: m.date,
        type: 'migraine',
        title: `${m.prostrating ? 'Prostrating' : 'Non-prostrating'} migraine`,
        detail: `Severity: ${m.severity}/10${m.duration ? ` | ${m.duration}` : ''}${m.economicImpact ? ' | Lost work' : ''}`,
        severity: m.severity,
        icon: TYPE_META.migraine.icon,
        color: TYPE_META.migraine.color,
      });
    });

    (data.medications || []).forEach((m) => {
      all.push({
        id: `med-${m.id}`,
        date: m.startDate || new Date().toISOString().split('T')[0],
        type: 'medication',
        title: m.name,
        detail: `${m.dosage || ''}${m.frequency ? ` | ${m.frequency}` : ''}${m.sideEffects ? ` | Side effects: ${m.sideEffects}` : ''}`,
        icon: TYPE_META.medication.icon,
        color: TYPE_META.medication.color,
      });
    });

    (data.medicalVisits || []).forEach((v) => {
      all.push({
        id: `vis-${v.id}`,
        date: v.date,
        type: 'visit',
        title: `${v.visitType || 'Medical'} visit${v.provider ? ` - ${v.provider}` : ''}`,
        detail: `${v.reason || ''}${v.diagnosis ? ` | Dx: ${v.diagnosis}` : ''}`,
        icon: TYPE_META.visit.icon,
        color: TYPE_META.visit.color,
      });
    });

    (data.exposures || []).forEach((e) => {
      all.push({
        id: `exp-${e.id}`,
        date: e.date,
        type: 'exposure',
        title: e.type || 'Exposure',
        detail: `${e.location || ''}${e.duration ? ` | ${e.duration}` : ''}`,
        icon: TYPE_META.exposure.icon,
        color: TYPE_META.exposure.color,
      });
    });

    return all.sort((a, b) => b.date.localeCompare(a.date));
  }, [data]);

  const filtered = useMemo(
    () => (filter === 'all' ? events : events.filter((e) => e.type === filter)),
    [events, filter],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, TimelineEvent[]>();
    for (const ev of filtered) {
      const day = ev.date.slice(0, 10);
      const arr = map.get(day) || [];
      arr.push(ev);
      map.set(day, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const toggleDay = (day: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  return (
    <PageContainer className="py-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Timeline</h1>
            <p className="text-muted-foreground text-sm">{events.length} events across all trackers</p>
          </div>
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-40" aria-label="Filter by type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(TYPE_META).map(([key, meta]) => (
              <SelectItem key={key} value={key}>{meta.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {grouped.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No events to display. Start logging symptoms, sleep, or visits.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {grouped.map(([day, dayEvents]) => {
            const expanded = expandedDays.has(day) || dayEvents.length <= 3;
            const shown = expanded ? dayEvents : dayEvents.slice(0, 3);
            return (
              <div key={day} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 py-2 bg-secondary/50 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {safeFormatDate(day + 'T00:00:00', day)}
                  </p>
                  <Badge variant="outline" className="text-xs">{dayEvents.length}</Badge>
                </div>
                <div className="divide-y divide-border">
                  {shown.map((ev) => {
                    const Icon = ev.icon;
                    return (
                      <div key={ev.id} className="flex items-start gap-3 px-4 py-3">
                        <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${ev.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-2">{ev.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ev.detail}</p>
                        </div>
                        {ev.severity !== undefined && (
                          <span className={`text-xs font-bold flex-shrink-0 ${ev.severity >= 7 ? 'text-destructive' : ev.severity >= 4 ? 'text-gold' : 'text-success'}`}>
                            {ev.severity}/10
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {dayEvents.length > 3 && !expanded && (
                  <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => toggleDay(day)}>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    {dayEvents.length - 3} more
                  </Button>
                )}
                {dayEvents.length > 3 && expanded && (
                  <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => toggleDay(day)}>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Show less
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
