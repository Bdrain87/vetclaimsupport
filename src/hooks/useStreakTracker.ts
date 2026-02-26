import { useMemo } from 'react';
import useAppStore from '@/store/useAppStore';

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86_400_000;
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / msPerDay,
  );
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  totalLoggingDays: number;
  lastLogDate: string | null;
  streakActive: boolean;
}

export function useStreakTracker(): StreakInfo {
  const symptoms = useAppStore((s) => s.symptoms);
  const quickLogs = useAppStore((s) => s.quickLogs);
  const sleepEntries = useAppStore((s) => s.sleepEntries);
  const migraines = useAppStore((s) => s.migraines);
  const medicalVisits = useAppStore((s) => s.medicalVisits);

  return useMemo(() => {
    const dateSet = new Set<string>();

    for (const s of symptoms) dateSet.add(s.date.slice(0, 10));
    for (const q of quickLogs) dateSet.add(q.date.slice(0, 10));
    for (const sl of sleepEntries) dateSet.add(sl.date.slice(0, 10));
    for (const m of migraines) dateSet.add(m.date.slice(0, 10));
    for (const v of medicalVisits) dateSet.add(v.date.slice(0, 10));

    if (dateSet.size === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalLoggingDays: 0,
        lastLogDate: null,
        streakActive: false,
      };
    }

    const sorted = Array.from(dateSet).sort();
    const today = toDateStr(new Date());
    const yesterday = toDateStr(new Date(Date.now() - 86_400_000));

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 1;

    for (let i = 1; i < sorted.length; i++) {
      if (daysBetween(sorted[i - 1], sorted[i]) === 1) {
        streak++;
      } else {
        longestStreak = Math.max(longestStreak, streak);
        streak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, streak);

    const lastLog = sorted[sorted.length - 1];
    const streakActive = lastLog === today || lastLog === yesterday;

    if (streakActive) {
      currentStreak = 1;
      for (let i = sorted.length - 2; i >= 0; i--) {
        if (daysBetween(sorted[i], sorted[i + 1]) === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    return {
      currentStreak,
      longestStreak,
      totalLoggingDays: dateSet.size,
      lastLogDate: lastLog,
      streakActive,
    };
  }, [symptoms, quickLogs, sleepEntries, migraines, medicalVisits]);
}
