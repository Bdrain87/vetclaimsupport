/**
 * clearLocalData() orchestration tests
 *
 * Verifies that clearLocalData resets all Zustand stores, clears localStorage
 * keys, sessionStorage, and IndexedDB.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clearLocalData } from '@/services/accountManagement';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useAICacheStore } from '@/store/useAICacheStore';
import { useFeatureFlagStore } from '@/store/useFeatureFlagStore';

// Mock IndexedDB clearDatabase so we don't need a real IDB implementation
vi.mock('@/lib/indexedDB', () => ({
  clearDatabase: vi.fn().mockResolvedValue(undefined),
  openDB: vi.fn(),
  getFileData: vi.fn(),
  saveFileData: vi.fn(),
  deleteFileData: vi.fn(),
  getAllFileIds: vi.fn().mockResolvedValue([]),
  restoreFiles: vi.fn(),
}));

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('clearLocalData', () => {
  it('resets useAppStore in-memory state', async () => {
    const resetSpy = vi.spyOn(useAppStore.getState(), 'resetAllData');
    await clearLocalData();
    expect(resetSpy).toHaveBeenCalled();
    resetSpy.mockRestore();
  });

  it('resets useProfileStore in-memory state', async () => {
    const resetSpy = vi.spyOn(useProfileStore.getState(), 'resetProfile');
    await clearLocalData();
    expect(resetSpy).toHaveBeenCalled();
    resetSpy.mockRestore();
  });

  it('resets useAICacheStore in-memory state', async () => {
    const resetSpy = vi.spyOn(useAICacheStore.getState(), 'clearCache');
    await clearLocalData();
    expect(resetSpy).toHaveBeenCalled();
    resetSpy.mockRestore();
  });

  it('resets useFeatureFlagStore in-memory state', async () => {
    const resetSpy = vi.spyOn(useFeatureFlagStore.getState(), 'resetFlags');
    await clearLocalData();
    expect(resetSpy).toHaveBeenCalled();
    resetSpy.mockRestore();
  });

  it('clears all known localStorage keys', async () => {
    // Plant some data under known keys
    localStorage.setItem('vcs-app-data', 'test');
    localStorage.setItem('vet-user-profile', 'test');
    localStorage.setItem('vcs-ai-cache', 'test');
    localStorage.setItem('vcs_onboarding_progress', 'test');

    await clearLocalData();

    expect(localStorage.getItem('vcs-app-data')).toBeNull();
    expect(localStorage.getItem('vet-user-profile')).toBeNull();
    expect(localStorage.getItem('vcs-ai-cache')).toBeNull();
    expect(localStorage.getItem('vcs_onboarding_progress')).toBeNull();
  });

  it('clears sessionStorage', async () => {
    sessionStorage.setItem('test-key', 'test-value');
    await clearLocalData();
    expect(sessionStorage.getItem('test-key')).toBeNull();
  });

  it('calls clearDatabase for IndexedDB', async () => {
    const { clearDatabase } = await import('@/lib/indexedDB');
    await clearLocalData();
    expect(clearDatabase).toHaveBeenCalled();
  });
});
