/**
 * React hook wrapper for veteran context.
 *
 * Most AI features should call buildVeteranContext() directly at generation time
 * inside their callbacks — no hook needed. This hook is for components that
 * need reactive updates (e.g., displaying readiness or context summary in UI).
 */

import { useMemo } from 'react';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { buildVeteranContext, type VeteranContext, type BuildContextOptions } from '@/utils/veteranContext';

export function useVeteranContext(options: BuildContextOptions = {}): VeteranContext {
  // Subscribe to the store slices that affect context
  const conditionCount = useAppStore(s => (s.userConditions || []).length);
  const symptomCount = useAppStore(s => (s.symptoms || []).length);
  const medCount = useAppStore(s => (s.medications || []).length);
  const firstName = useProfileStore(s => s.firstName);
  const branch = useProfileStore(s => s.branch);

  // Rebuild when relevant data changes
  return useMemo(
    () => buildVeteranContext(options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conditionCount, symptomCount, medCount, firstName, branch, options.conditionId, options.maskPII]
  );
}
