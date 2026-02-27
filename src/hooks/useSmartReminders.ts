import { useMemo } from 'react';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';

export interface SmartReminder {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'logging' | 'evidence' | 'deadline' | 'exam' | 'filing';
}

function daysSince(dateStr: string): number {
  const t = new Date(dateStr).getTime();
  if (isNaN(t)) return Infinity;
  return Math.floor((Date.now() - t) / 86_400_000);
}

function daysUntil(dateStr: string): number {
  const t = new Date(dateStr).getTime();
  if (isNaN(t)) return Infinity;
  return Math.ceil((t - Date.now()) / 86_400_000);
}

export function useSmartReminders(): SmartReminder[] {
  const symptoms = useAppStore((s) => s.symptoms);
  const medicalVisits = useAppStore((s) => s.medicalVisits);
  const medications = useAppStore((s) => s.medications);
  const sleepEntries = useAppStore((s) => s.sleepEntries);
  const migraines = useAppStore((s) => s.migraines);
  const deadlines = useAppStore((s) => s.deadlines);
  const userConditions = useAppStore((s) => s.userConditions);
  const documents = useAppStore((s) => s.documents);

  const separationDate = useProfileStore((s) => s.separationDate);
  const intentToFileDate = useProfileStore((s) => s.intentToFileDate);

  return useMemo(() => {
    const reminders: SmartReminder[] = [];

    const pendingConditions = userConditions.filter(
      (c) => c.claimStatus !== 'approved',
    );

    const lastSymptom = symptoms.length
      ? symptoms.reduce((a, b) => (a.date > b.date ? a : b))
      : null;
    if (pendingConditions.length > 0 && (!lastSymptom || daysSince(lastSymptom.date) > 7)) {
      reminders.push({
        id: 'symptom-gap',
        title: 'Log your symptoms',
        description: lastSymptom && isFinite(daysSince(lastSymptom.date))
          ? `It's been ${daysSince(lastSymptom.date)} days since your last symptom log. The VA looks for consistent frequency documentation.`
          : 'Start logging symptoms to build evidence for your claim.',
        priority: 'high',
        category: 'logging',
      });
    }

    const lastSleep = sleepEntries.length
      ? sleepEntries.reduce((a, b) => (a.date > b.date ? a : b))
      : null;
    const hasSleepCondition = pendingConditions.some(
      (c) => c.conditionId.includes('sleep') || c.conditionId.includes('apnea'),
    );
    if (hasSleepCondition && (!lastSleep || daysSince(lastSleep.date) > 3)) {
      reminders.push({
        id: 'sleep-gap',
        title: 'Log your sleep',
        description: 'You have a sleep-related condition. Regular sleep logs strengthen your rating evidence.',
        priority: 'high',
        category: 'logging',
      });
    }

    const hasMigraineCondition = pendingConditions.some(
      (c) => c.conditionId.includes('migraine') || c.conditionId.includes('headache'),
    );
    const lastMigraine = migraines.length
      ? migraines.reduce((a, b) => (a.date > b.date ? a : b))
      : null;
    if (hasMigraineCondition && (!lastMigraine || daysSince(lastMigraine.date) > 14)) {
      reminders.push({
        id: 'migraine-gap',
        title: 'Update migraine log',
        description: 'Track migraine frequency — the VA requires documentation of prostrating episodes for higher ratings.',
        priority: 'medium',
        category: 'logging',
      });
    }

    if (intentToFileDate) {
      const remaining = daysUntil(intentToFileDate) + 365;
      if (remaining > 0 && remaining <= 60) {
        reminders.push({
          id: 'itf-expiring',
          title: 'Intent to File expiring soon',
          description: `Your Intent to File expires in ~${remaining} days. File your claim before it lapses to preserve your effective date.`,
          priority: 'high',
          category: 'deadline',
        });
      }
    }

    if (separationDate) {
      const daysToSep = daysUntil(separationDate);
      if (daysToSep > 0 && daysToSep <= 180) {
        reminders.push({
          id: 'bdd-window',
          title: 'BDD filing window open',
          description: `You're ${daysToSep} days from separation. File through Benefits Delivery at Discharge (180-90 days before separation) for faster processing.`,
          priority: 'high',
          category: 'filing',
        });
      }
    }

    for (const dl of deadlines) {
      if (dl.date) {
        const remaining = daysUntil(dl.date);
        if (remaining > 0 && remaining <= 30) {
          reminders.push({
            id: `deadline-${dl.id}`,
            title: `Deadline approaching: ${dl.title}`,
            description: `${remaining} days remaining. ${dl.notes || ''}`.trim(),
            priority: remaining <= 7 ? 'high' : 'medium',
            category: 'deadline',
          });
        }
      }
    }

    const missingDocs = documents.filter(
      (d) => d.status === 'Not Started' || d.status === 'In Progress',
    );
    if (missingDocs.length > 0 && pendingConditions.length > 0) {
      reminders.push({
        id: 'missing-docs',
        title: `${missingDocs.length} documents need attention`,
        description: `Complete your document checklist: ${missingDocs.slice(0, 3).map((d) => d.name).join(', ')}${missingDocs.length > 3 ? '...' : ''}`,
        priority: 'medium',
        category: 'evidence',
      });
    }

    const lastVisit = medicalVisits.length
      ? medicalVisits.reduce((a, b) => (a.date > b.date ? a : b))
      : null;
    if (pendingConditions.length > 0 && (!lastVisit || daysSince(lastVisit.date) > 90)) {
      reminders.push({
        id: 'medical-visit',
        title: 'Schedule a medical visit',
        description: 'Current medical evidence within the past 90 days strengthens your claim significantly.',
        priority: 'medium',
        category: 'evidence',
      });
    }

    void medications;

    return reminders.sort((a, b) => {
      const p = { high: 0, medium: 1, low: 2 };
      return p[a.priority] - p[b.priority];
    });
  }, [symptoms, medicalVisits, medications, sleepEntries, migraines, deadlines, userConditions, documents, separationDate, intentToFileDate]);
}
