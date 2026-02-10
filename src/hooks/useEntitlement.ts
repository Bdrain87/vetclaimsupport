import { useProfileStore } from '@/store/useProfileStore';
import { PREVIEW_LIMITS } from '@/services/entitlements';

export function useEntitlement() {
  const entitlement = useProfileStore((s) => s.entitlement);

  const status = entitlement || 'preview';
  const isLifetime = status === 'lifetime';
  const isPreview = status === 'preview';

  return {
    status,
    isLifetime,
    isPreview,
    canAddCondition: (currentCount: number) =>
      isLifetime || currentCount < PREVIEW_LIMITS.maxConditions,
    canAddHealthLog: (currentCount: number) =>
      isLifetime || currentCount < PREVIEW_LIMITS.maxHealthLogs,
    canExport: isLifetime || PREVIEW_LIMITS.exportEnabled,
    canSync: isLifetime || PREVIEW_LIMITS.cloudSyncEnabled,
  };
}
