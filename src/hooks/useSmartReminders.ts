import { useMemo } from 'react';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';

export interface SmartReminder {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'logging' | 'evidence' | 'deadline' | 'exam' | 'filing' | 'rating-opportunity';
  actionRoute?: string;
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
  const buddyContacts = useAppStore((s) => s.buddyContacts);
  const quickLogs = useAppStore((s) => s.quickLogs);

  const employmentImpact = useAppStore((s) => s.employmentImpactEntries);

  const separationDate = useProfileStore((s) => s.separationDate);
  const intentToFileDate = useProfileStore((s) => s.intentToFileDate);

  return useMemo(() => {
    const reminders: SmartReminder[] = [];

    const pendingConditions = userConditions.filter(
      (c) => c.claimStatus !== 'approved',
    );

    // ── Symptom logging gap ─────────────────────────────────────────────
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
        actionRoute: '/health/symptoms',
      });
    }

    // ── Sleep logging gap ───────────────────────────────────────────────
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
        actionRoute: '/health/sleep',
      });
    }

    // ── Migraine logging gap ────────────────────────────────────────────
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
        actionRoute: '/health/migraines',
      });
    }

    // ── Intent to File expiring ─────────────────────────────────────────
    if (intentToFileDate) {
      const remaining = daysUntil(intentToFileDate) + 365;
      if (remaining > 0 && remaining <= 60) {
        reminders.push({
          id: 'itf-expiring',
          title: 'Intent to File expiring soon',
          description: `Your Intent to File expires in ~${remaining} days. File your claim before it lapses to preserve your effective date.`,
          priority: 'high',
          category: 'deadline',
          actionRoute: '/settings/itf',
        });
      }
    }

    // ── BDD filing window ───────────────────────────────────────────────
    if (separationDate) {
      const daysToSep = daysUntil(separationDate);
      if (daysToSep > 0 && daysToSep <= 180) {
        reminders.push({
          id: 'bdd-window',
          title: 'BDD filing window open',
          description: `You're ${daysToSep} days from separation. File through Benefits Delivery at Discharge (180-90 days before separation) for faster processing.`,
          priority: 'high',
          category: 'filing',
          actionRoute: '/prep/bdd-guide',
        });
      }
    }

    // ── Deadline approaching ────────────────────────────────────────────
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
            actionRoute: '/settings/deadlines',
          });
        }
      }
    }

    // ── Missing documents ───────────────────────────────────────────────
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
        actionRoute: '/claims/checklist',
      });
    }

    // ── Employment impact logging gap ─────────────────────────────────
    if (pendingConditions.length > 0) {
      const lastImpact = employmentImpact.length
        ? employmentImpact.reduce((a, b) => (a.date > b.date ? a : b))
        : null;
      if (!lastImpact || daysSince(lastImpact.date) > 14) {
        reminders.push({
          id: 'work-impact-gap',
          title: 'Log work impact',
          description: lastImpact
            ? `It's been ${daysSince(lastImpact.date)} days since your last work impact entry. Employment documentation is critical for TDIU and increased ratings.`
            : 'Start tracking how your conditions affect work — this is key evidence for TDIU claims and rating increases.',
          priority: 'medium',
          category: 'logging',
          actionRoute: '/health/work-impact',
        });
      }
    }

    // ── Medical visit gap ───────────────────────────────────────────────
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
        actionRoute: '/health/visits',
      });
    }

    // ── Logging streak at risk ──────────────────────────────────────────
    {
      const dateSet = new Set<string>();
      for (const s of symptoms) if (s.date) dateSet.add(s.date.slice(0, 10));
      for (const q of quickLogs) if (q.date) dateSet.add(q.date.slice(0, 10));
      for (const sl of sleepEntries) if (sl.date) dateSet.add(sl.date.slice(0, 10));
      for (const m of migraines) if (m.date) dateSet.add(m.date.slice(0, 10));

      if (dateSet.size > 0) {
        const sorted = Array.from(dateSet).sort();
        const lastLog = sorted[sorted.length - 1];
        const daysSinceLastLog = daysSince(lastLog);

        // Calculate current streak
        let streak = 1;
        for (let i = sorted.length - 2; i >= 0; i--) {
          const diff = Math.round(
            (new Date(sorted[i + 1]).getTime() - new Date(sorted[i]).getTime()) / 86_400_000,
          );
          if (diff === 1) streak++;
          else break;
        }

        // Only warn if they have a meaningful streak (5+ days) that's about to break
        if (streak >= 5 && daysSinceLastLog === 1) {
          reminders.push({
            id: 'streak-at-risk',
            title: `${streak}-day streak — log today to keep it`,
            description: `You've logged health data ${streak} days in a row. Consistent logging builds stronger VA evidence.`,
            priority: 'medium',
            category: 'logging',
            actionRoute: '/health/symptoms',
          });
        }
      }
    }

    // ── Exam prep countdown ─────────────────────────────────────────────
    for (const dl of deadlines) {
      if (!dl.date || dl.type !== 'exam') continue;
      const remaining = daysUntil(dl.date);
      if (remaining <= 0 || remaining > 30) continue;

      let title: string;
      let description: string;
      let priority: SmartReminder['priority'] = 'medium';

      if (remaining <= 1) {
        title = `C&P exam tomorrow`;
        description = `Review your Exam Day Packet. Arrive 15 min early. Describe your worst days, not your best.`;
        priority = 'high';
      } else if (remaining <= 3) {
        title = `C&P exam in ${remaining} days`;
        description = `Review your symptoms list, medications, and talking points. Prepare what to tell the examiner.`;
        priority = 'high';
      } else if (remaining <= 7) {
        title = `C&P exam in ${remaining} days`;
        description = `Review the rating criteria for your conditions and prepare your Exam Day Packet.`;
        priority = 'high';
      } else if (remaining <= 14) {
        title = `C&P exam in ${remaining} days`;
        description = `Start reviewing DBQ forms and rating criteria for your conditions. Know what the examiner will evaluate.`;
        priority = 'medium';
      } else {
        title = `C&P exam in ${remaining} days`;
        description = `Good time to schedule any supporting medical visits and gather recent records.`;
        priority = 'medium';
      }

      reminders.push({
        id: `exam-prep-${dl.id}`,
        title,
        description,
        priority,
        category: 'exam',
        actionRoute: '/prep/exam-day',
      });
    }

    // ── Buddy statement follow-up ───────────────────────────────────────
    for (const buddy of buddyContacts) {
      if (buddy.statementStatus === 'Received' || buddy.statementStatus === 'Submitted') continue;
      if (buddy.statementStatus === 'Not Requested') continue;

      // "Requested" status — check how long ago (we don't store request date,
      // so we flag all Requested buddies as needing follow-up)
      reminders.push({
        id: `buddy-followup-${buddy.id}`,
        title: `Follow up with ${buddy.name}`,
        description: `Buddy statement requested but not received. A gentle reminder can help — service members are busy.`,
        priority: 'medium',
        category: 'evidence',
        actionRoute: '/prep/buddy-statement',
      });
    }

    // ── Migraine rating threshold proximity ─────────────────────────────
    if (hasMigraineCondition && migraines.length > 0) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const cutoffStr = cutoff.toISOString().slice(0, 10);

      const recentMigraines = migraines.filter((m) => m.date >= cutoffStr);
      const prostrating = recentMigraines.filter(
        (m) => m.wasProstrating || m.severity === 'Prostrating' || m.severity === 'Severe',
      );

      // DC 8100: 50% requires "completely prostrating and prolonged attacks productive of severe economic inadaptability"
      // 30% requires "characteristic prostrating attacks occurring on an average once a month"
      if (prostrating.length >= 1 && prostrating.length < 4) {
        reminders.push({
          id: 'migraine-threshold',
          title: `Migraine rating: ${prostrating.length} prostrating episodes this month`,
          description: `The 30% rating requires ~1 prostrating attack per month. The 50% rating requires frequent prostrating attacks with severe economic impact. Keep documenting.`,
          priority: 'medium',
          category: 'rating-opportunity',
          actionRoute: '/claims/evidence-strength',
        });
      }
    }

    // ── Medication not logged recently ───────────────────────────────────
    const activeMeds = medications.filter((m) => m.stillTaking);
    if (activeMeds.length > 0 && pendingConditions.length > 0) {
      const medNames = activeMeds.slice(0, 3).map((m) => m.name).join(', ');
      const hasRecentSymptom = lastSymptom && daysSince(lastSymptom.date) <= 7;
      if (hasRecentSymptom) {
        // Only show med reminder if they're actively logging — don't nag inactive users
        const recentSymptomNotes = symptoms
          .filter((s) => daysSince(s.date) <= 7)
          .map((s) => (s.notes || '').toLowerCase())
          .join(' ');
        const mentionsMed = activeMeds.some((m) =>
          recentSymptomNotes.includes(m.name.toLowerCase()),
        );
        if (!mentionsMed) {
          reminders.push({
            id: 'medication-mention',
            title: 'Mention your medications in logs',
            description: `You take ${medNames}${activeMeds.length > 3 ? '...' : ''}. Noting medication effectiveness in symptom logs strengthens evidence.`,
            priority: 'low',
            category: 'logging',
          });
        }
      }
    }

    return reminders.sort((a, b) => {
      const p = { high: 0, medium: 1, low: 2 };
      return p[a.priority] - p[b.priority];
    });
  }, [symptoms, medicalVisits, medications, sleepEntries, migraines, deadlines, userConditions, documents, buddyContacts, quickLogs, employmentImpact, separationDate, intentToFileDate]);
}
