import { useState, useEffect, useCallback } from 'react';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'tracking' | 'evidence' | 'preparation' | 'engagement' | 'mastery';
  requirement: number;
  current?: number;
  unlockedAt?: number;
  isUnlocked: boolean;
}

interface MilestoneState {
  milestones: Record<string, Milestone>;
  recentlyUnlocked: Milestone | null;
}

const STORAGE_KEY = 'vet-claim-milestones';

// Define all available milestones
const defaultMilestones: Omit<Milestone, 'current' | 'unlockedAt' | 'isUnlocked'>[] = [
  // Tracking milestones
  {
    id: 'first-symptom',
    title: 'First Steps',
    description: 'Log your first symptom entry',
    icon: 'Star',
    category: 'tracking',
    requirement: 1,
  },
  {
    id: 'symptom-streak-7',
    title: 'Week Warrior',
    description: 'Log symptoms for 7 days',
    icon: 'Calendar',
    category: 'tracking',
    requirement: 7,
  },
  {
    id: 'symptom-streak-30',
    title: 'Monthly Milestone',
    description: 'Log symptoms for 30 days',
    icon: 'Trophy',
    category: 'tracking',
    requirement: 30,
  },
  {
    id: 'symptoms-10',
    title: 'Symptom Logger',
    description: 'Track 10 symptom entries',
    icon: 'FileText',
    category: 'tracking',
    requirement: 10,
  },
  {
    id: 'symptoms-50',
    title: 'Dedicated Tracker',
    description: 'Track 50 symptom entries',
    icon: 'Zap',
    category: 'tracking',
    requirement: 50,
  },
  // Evidence milestones
  {
    id: 'first-document',
    title: 'Paper Trail',
    description: 'Upload your first document',
    icon: 'File',
    category: 'evidence',
    requirement: 1,
  },
  {
    id: 'documents-5',
    title: 'Evidence Builder',
    description: 'Upload 5 documents',
    icon: 'Folder',
    category: 'evidence',
    requirement: 5,
  },
  {
    id: 'documents-20',
    title: 'Evidence Expert',
    description: 'Upload 20 documents',
    icon: 'FolderOpen',
    category: 'evidence',
    requirement: 20,
  },
  {
    id: 'first-buddy',
    title: 'Buddy System',
    description: 'Add your first buddy contact',
    icon: 'Users',
    category: 'evidence',
    requirement: 1,
  },
  {
    id: 'buddies-3',
    title: 'Support Network',
    description: 'Add 3 buddy contacts',
    icon: 'Users2',
    category: 'evidence',
    requirement: 3,
  },
  // Preparation milestones
  {
    id: 'checklist-complete',
    title: 'Prepared & Ready',
    description: 'Complete your claim checklist',
    icon: 'CheckCircle',
    category: 'preparation',
    requirement: 1,
  },
  {
    id: 'exam-prep',
    title: 'C&P Ready',
    description: 'Complete C&P exam preparation',
    icon: 'Target',
    category: 'preparation',
    requirement: 1,
  },
  {
    id: 'service-history',
    title: 'Service Documented',
    description: 'Complete your service history',
    icon: 'Award',
    category: 'preparation',
    requirement: 1,
  },
  // Engagement milestones
  {
    id: 'used-calculator',
    title: 'Number Cruncher',
    description: 'Use the rating calculator',
    icon: 'Calculator',
    category: 'engagement',
    requirement: 1,
  },
  {
    id: 'used-analyzer',
    title: 'AI Explorer',
    description: 'Use the AI disability analyzer',
    icon: 'Bot',
    category: 'engagement',
    requirement: 1,
  },
  {
    id: 'exported-data',
    title: 'Data Guardian',
    description: 'Export your data backup',
    icon: 'Save',
    category: 'engagement',
    requirement: 1,
  },
  {
    id: 'viewed-reference',
    title: 'Knowledge Seeker',
    description: 'View 10 conditions in the reference database',
    icon: 'BookOpen',
    category: 'engagement',
    requirement: 10,
  },
  // Mastery milestones
  {
    id: 'evidence-strong',
    title: 'Evidence Champion',
    description: 'Achieve "Strong" evidence rating',
    icon: 'Medal',
    category: 'mastery',
    requirement: 1,
  },
  {
    id: 'all-sections',
    title: 'Completionist',
    description: 'Add entries to all tracking sections',
    icon: 'PartyPopper',
    category: 'mastery',
    requirement: 1,
  },
  {
    id: 'app-veteran',
    title: 'App Veteran',
    description: 'Use the app for 90 days',
    icon: 'Star',
    category: 'mastery',
    requirement: 90,
  },
];

export function useMilestones() {
  const [state, setState] = useState<MilestoneState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          milestones: parsed.milestones ?? {},
          recentlyUnlocked: null,
        };
      } catch {
        // Invalid JSON, start fresh
      }
    }

    // Initialize milestones
    const milestones: Record<string, Milestone> = {};
    defaultMilestones.forEach((m) => {
      milestones[m.id] = {
        ...m,
        current: 0,
        isUnlocked: false,
      };
    });

    return { milestones, recentlyUnlocked: null };
  });

  // Save to localStorage whenever milestones change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ milestones: state.milestones })
      );
    } catch {
      // Storage full or unavailable
    }
  }, [state.milestones]);

  // Update progress for a milestone
  const updateProgress = useCallback((milestoneId: string, current: number) => {
    setState((prev) => {
      const milestone = prev.milestones[milestoneId];
      if (!milestone || milestone.isUnlocked) return prev;

      const newCurrent = Math.max(milestone.current ?? 0, current);
      const isUnlocked = newCurrent >= milestone.requirement;

      const updatedMilestone: Milestone = {
        ...milestone,
        current: newCurrent,
        isUnlocked,
        unlockedAt: isUnlocked ? Date.now() : undefined,
      };

      return {
        milestones: {
          ...prev.milestones,
          [milestoneId]: updatedMilestone,
        },
        recentlyUnlocked: isUnlocked ? updatedMilestone : prev.recentlyUnlocked,
      };
    });
  }, []);

  // Increment progress by 1
  const incrementProgress = useCallback((milestoneId: string) => {
    setState((prev) => {
      const milestone = prev.milestones[milestoneId];
      if (!milestone || milestone.isUnlocked) return prev;

      const newCurrent = (milestone.current ?? 0) + 1;
      const isUnlocked = newCurrent >= milestone.requirement;

      const updatedMilestone: Milestone = {
        ...milestone,
        current: newCurrent,
        isUnlocked,
        unlockedAt: isUnlocked ? Date.now() : undefined,
      };

      return {
        milestones: {
          ...prev.milestones,
          [milestoneId]: updatedMilestone,
        },
        recentlyUnlocked: isUnlocked ? updatedMilestone : prev.recentlyUnlocked,
      };
    });
  }, []);

  // Unlock a milestone immediately (for binary milestones)
  const unlock = useCallback((milestoneId: string) => {
    updateProgress(milestoneId, 1);
  }, [updateProgress]);

  // Clear the recently unlocked milestone
  const clearRecentlyUnlocked = useCallback(() => {
    setState((prev) => ({ ...prev, recentlyUnlocked: null }));
  }, []);

  // Get all milestones as array
  const getMilestones = useCallback(() => {
    return Object.values(state.milestones);
  }, [state.milestones]);

  // Get milestones by category
  const getMilestonesByCategory = useCallback(
    (category: Milestone['category']) => {
      return Object.values(state.milestones).filter((m) => m.category === category);
    },
    [state.milestones]
  );

  // Get unlocked milestones
  const getUnlockedMilestones = useCallback(() => {
    return Object.values(state.milestones).filter((m) => m.isUnlocked);
  }, [state.milestones]);

  // Get progress percentage
  const getOverallProgress = useCallback(() => {
    const all = Object.values(state.milestones);
    const unlocked = all.filter((m) => m.isUnlocked).length;
    return Math.round((unlocked / all.length) * 100);
  }, [state.milestones]);

  return {
    milestones: state.milestones,
    recentlyUnlocked: state.recentlyUnlocked,
    updateProgress,
    incrementProgress,
    unlock,
    clearRecentlyUnlocked,
    getMilestones,
    getMilestonesByCategory,
    getUnlockedMilestones,
    getOverallProgress,
  };
}

export type UseMilestonesReturn = ReturnType<typeof useMilestones>;
