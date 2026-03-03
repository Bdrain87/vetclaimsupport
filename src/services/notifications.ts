/**
 * Local push notification service for deadline reminders.
 *
 * Schedules notifications from SmartReminders data for critical dates:
 * - ITF expiry: 60, 30, 7, 1 days before
 * - C&P exam: 7, 1 days before
 * - BDD window: opening day, 5 days before close
 * - Logging streak at risk: 20 hours after last log
 * - Symptom gap: after 3-day gap
 */

import { isNativeApp } from '@/lib/platform';
import { logger } from '@/utils/logger';

// Lazy-load to avoid importing native plugin on web
let _plugin: typeof import('@capacitor/local-notifications').LocalNotifications | null = null;

async function getPlugin() {
  if (!isNativeApp) throw new Error('Notifications only available on native');
  if (!_plugin) {
    const mod = await import('@capacitor/local-notifications');
    _plugin = mod.LocalNotifications;
  }
  return _plugin;
}

export type NotificationCategory = 'itf' | 'exam' | 'bdd' | 'streak' | 'gap' | 'deadline';

interface ScheduledNotification {
  id: number;
  title: string;
  body: string;
  scheduleAt: Date;
  category: NotificationCategory;
  /** Deep link route for tap action (e.g. '/claims/deadlines') */
  actionRoute?: string;
}

// Stable ID ranges per category to allow selective clearing
const ID_RANGES: Record<NotificationCategory, number> = {
  itf: 1000,
  exam: 2000,
  bdd: 3000,
  streak: 4000,
  gap: 5000,
  deadline: 6000,
};

let _permissionGranted = false;

/**
 * Check if notification permission has been granted.
 */
export async function hasNotificationPermission(): Promise<boolean> {
  if (!isNativeApp) return false;
  try {
    const plugin = await getPlugin();
    const result = await plugin.checkPermissions();
    _permissionGranted = result.display === 'granted';
    return _permissionGranted;
  } catch {
    return false;
  }
}

/**
 * Request notification permission. Call contextually (after first condition add,
 * after setting ITF date — NOT on cold launch).
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNativeApp) return false;
  try {
    const plugin = await getPlugin();
    const result = await plugin.requestPermissions();
    _permissionGranted = result.display === 'granted';
    return _permissionGranted;
  } catch {
    return false;
  }
}

/**
 * Schedule notifications for critical deadlines.
 * Call on every app launch to keep notifications fresh.
 */
export async function scheduleDeadlineNotifications(params: {
  intentToFileDate?: string;
  examDates?: { conditionName: string; date: string }[];
  separationDate?: string;
  deadlines?: { title: string; dueDate: string }[];
}): Promise<void> {
  if (!isNativeApp) return;

  const hasPermission = await hasNotificationPermission();
  if (!hasPermission) return;

  const notifications: ScheduledNotification[] = [];

  // ITF expiry notifications (365 days from filing)
  if (params.intentToFileDate) {
    const itfDate = new Date(params.intentToFileDate);
    const expiryDate = new Date(itfDate.getTime() + 365 * 86_400_000);
    const now = Date.now();

    [60, 30, 7, 1].forEach((daysBefore, i) => {
      const scheduleAt = new Date(expiryDate.getTime() - daysBefore * 86_400_000);
      if (scheduleAt.getTime() > now) {
        notifications.push({
          id: ID_RANGES.itf + i,
          title: daysBefore === 1
            ? 'Intent to File expires TOMORROW'
            : `Intent to File expires in ${daysBefore} days`,
          body: daysBefore <= 7
            ? 'File your claim now to protect your effective date. After expiry, you lose retroactive benefits.'
            : 'Make sure your claim is filed before your ITF expires to protect your effective date.',
          scheduleAt,
          category: 'itf',
          actionRoute: '/claims/deadlines',
        });
      }
    });
  }

  // C&P exam reminders
  if (params.examDates) {
    params.examDates.forEach((exam, examIdx) => {
      const examDate = new Date(exam.date);
      const now = Date.now();

      [7, 1].forEach((daysBefore, i) => {
        const scheduleAt = new Date(examDate.getTime() - daysBefore * 86_400_000);
        scheduleAt.setHours(9, 0, 0, 0); // 9 AM
        if (scheduleAt.getTime() > now) {
          notifications.push({
            id: ID_RANGES.exam + examIdx * 10 + i,
            title: daysBefore === 1
              ? `C&P Exam TOMORROW: ${exam.conditionName}`
              : `C&P Exam in ${daysBefore} days: ${exam.conditionName}`,
            body: daysBefore === 1
              ? 'Review your condition details and worst-day examples. Describe your worst days, not your best.'
              : 'Use the C&P Exam Prep tool to review what the examiner will look for.',
            scheduleAt,
            category: 'exam',
            actionRoute: `/prep/exam?condition=${encodeURIComponent(exam.conditionName)}`,
          });
        }
      });
    });
  }

  // BDD window notifications
  if (params.separationDate) {
    const sepDate = new Date(params.separationDate);
    const now = Date.now();
    const bddOpen = new Date(sepDate.getTime() - 180 * 86_400_000);
    const bddClose = new Date(sepDate.getTime() - 90 * 86_400_000);

    if (bddOpen.getTime() > now) {
      notifications.push({
        id: ID_RANGES.bdd,
        title: 'BDD Filing Window Opens Today',
        body: 'You can now file a Benefits Delivery at Discharge claim. File 180-90 days before separation for faster processing.',
        scheduleAt: bddOpen,
        category: 'bdd',
      });
    }

    const fiveBefore = new Date(bddClose.getTime() - 5 * 86_400_000);
    if (fiveBefore.getTime() > now) {
      notifications.push({
        id: ID_RANGES.bdd + 1,
        title: 'BDD Window Closes in 5 Days',
        body: 'File your BDD claim before the window closes at 90 days before separation.',
        scheduleAt: fiveBefore,
        category: 'bdd',
      });
    }
  }

  // Custom deadlines
  if (params.deadlines) {
    params.deadlines.forEach((dl, i) => {
      const dueDate = new Date(dl.dueDate);
      const now = Date.now();
      const dayBefore = new Date(dueDate.getTime() - 86_400_000);
      dayBefore.setHours(9, 0, 0, 0);

      if (dayBefore.getTime() > now && i < 50) {
        notifications.push({
          id: ID_RANGES.deadline + i,
          title: `Deadline Tomorrow: ${dl.title}`,
          body: 'Check your Deadlines page for details.',
          scheduleAt: dayBefore,
          category: 'deadline',
        });
      }
    });
  }

  if (notifications.length === 0) return;

  try {
    const plugin = await getPlugin();
    // Cancel existing scheduled notifications before re-scheduling
    await plugin.cancel({
      notifications: notifications.map((n) => ({ id: n.id })),
    });

    await plugin.schedule({
      notifications: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        schedule: { at: n.scheduleAt },
        sound: 'default',
        smallIcon: 'ic_stat_shield',
        largeIcon: 'ic_launcher',
        extra: n.actionRoute ? { route: n.actionRoute } : undefined,
      })),
    });

    logger.info(`[notifications] Scheduled ${notifications.length} notifications`);
  } catch (err) {
    logger.error('[notifications] Failed to schedule:', err);
  }
}

/**
 * Schedule a streak-at-risk notification for 20 hours from now.
 * Call after each successful log entry.
 */
export async function scheduleStreakReminder(): Promise<void> {
  if (!isNativeApp) return;
  const hasPermission = await hasNotificationPermission();
  if (!hasPermission) return;

  try {
    const plugin = await getPlugin();
    const scheduleAt = new Date(Date.now() + 20 * 60 * 60 * 1000);

    await plugin.cancel({ notifications: [{ id: ID_RANGES.streak }] });
    await plugin.schedule({
      notifications: [{
        id: ID_RANGES.streak,
        title: 'Don\'t break your streak!',
        body: 'Log how you\'re feeling today to keep building your evidence trail.',
        schedule: { at: scheduleAt },
        sound: 'default',
      }],
    });
  } catch (err) {
    logger.error('[notifications] Failed to schedule streak reminder:', err);
  }
}

/**
 * Schedule a symptom gap notification for 3 days from now.
 * Call when the user has conditions but hasn't logged in 3 days.
 */
export async function scheduleGapReminder(lastLogDate: string): Promise<void> {
  if (!isNativeApp) return;
  const hasPermission = await hasNotificationPermission();
  if (!hasPermission) return;

  try {
    const plugin = await getPlugin();
    const gapDate = new Date(new Date(lastLogDate).getTime() + 3 * 86_400_000);
    gapDate.setHours(10, 0, 0, 0);

    if (gapDate.getTime() <= Date.now()) return;

    await plugin.cancel({ notifications: [{ id: ID_RANGES.gap }] });
    await plugin.schedule({
      notifications: [{
        id: ID_RANGES.gap,
        title: 'Symptom logging gap detected',
        body: 'The VA looks for consistent documentation. Log your symptoms to avoid gaps in your evidence.',
        schedule: { at: gapDate },
        sound: 'default',
      }],
    });
  } catch (err) {
    logger.error('[notifications] Failed to schedule gap reminder:', err);
  }
}

/**
 * Cancel all scheduled notifications.
 */
export async function cancelAllNotifications(): Promise<void> {
  if (!isNativeApp) return;
  try {
    const plugin = await getPlugin();
    const { notifications } = await plugin.getPending();
    if (notifications.length > 0) {
      await plugin.cancel({ notifications: notifications.map((n) => ({ id: n.id })) });
    }
  } catch (err) {
    logger.error('[notifications] Failed to cancel all:', err);
  }
}
