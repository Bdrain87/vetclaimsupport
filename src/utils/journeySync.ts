/**
 * Journey sync — mark ClaimJourney checklist items as complete
 * when tool pages export or save relevant artifacts.
 *
 * Safe to call from non-React contexts (uses getState).
 */
import useAppStore from '@/store/useAppStore';

export function markJourneyItem(itemId: string): void {
  const state = useAppStore.getState();
  const progress = state.journeyProgress || {
    currentPhase: 0,
    completedChecklist: {},
  };

  // Don't overwrite if already checked
  if (progress.completedChecklist[itemId]) return;

  state.setJourneyProgress({
    completedChecklist: {
      ...progress.completedChecklist,
      [itemId]: true,
    },
  });
}
