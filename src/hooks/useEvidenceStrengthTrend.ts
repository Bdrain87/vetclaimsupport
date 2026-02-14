import { useMemo } from 'react';
import useAppStore from '@/store/useAppStore';

export interface WeeklyScore {
  weekLabel: string;
  score: number;
}

function weekKey(dateStr: string): string {
  const d = new Date(dateStr);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86_400_000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function weekLabel(key: string): string {
  const [year, w] = key.split('-W');
  return `W${w} ${year}`;
}

export function useEvidenceStrengthTrend(weeks = 8): WeeklyScore[] {
  const symptoms = useAppStore((s) => s.symptoms);
  const medicalVisits = useAppStore((s) => s.medicalVisits);
  const medications = useAppStore((s) => s.medications);
  const buddyContacts = useAppStore((s) => s.buddyContacts);
  const exposures = useAppStore((s) => s.exposures);
  const sleepEntries = useAppStore((s) => s.sleepEntries);
  const migraines = useAppStore((s) => s.migraines);
  const quickLogs = useAppStore((s) => s.quickLogs);

  return useMemo(() => {
    const weekMap = new Map<string, number>();

    const addPoints = (dateStr: string, pts: number) => {
      const wk = weekKey(dateStr);
      weekMap.set(wk, (weekMap.get(wk) ?? 0) + pts);
    };

    for (const s of symptoms) addPoints(s.date, 3);
    for (const v of medicalVisits) addPoints(v.date, 5);
    for (const m of medications) addPoints(m.startDate || new Date().toISOString(), 2);
    for (const e of exposures) addPoints(e.date, 4);
    for (const sl of sleepEntries) addPoints(sl.date, 2);
    for (const mi of migraines) addPoints(mi.date, 3);
    for (const q of quickLogs) addPoints(q.date, 1);

    void buddyContacts;

    const sorted = Array.from(weekMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-weeks);

    let cumulative = 0;
    return sorted.map(([key, pts]) => {
      cumulative += pts;
      const capped = Math.min(100, cumulative);
      return { weekLabel: weekLabel(key), score: capped };
    });
  }, [symptoms, medicalVisits, medications, buddyContacts, exposures, sleepEntries, migraines, quickLogs, weeks]);
}
