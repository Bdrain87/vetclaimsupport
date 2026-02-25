/**
 * Test Utilities
 *
 * Reusable helpers for all VCS tests.
 */
import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ServicePeriod, Branch } from '@/store/useProfileStore';

// ---------------------------------------------------------------------------
// Provider wrapper for component tests
// ---------------------------------------------------------------------------

function AllProviders({ children }: { children: React.ReactNode }) {
  return React.createElement(MemoryRouter, null, children);
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// ---------------------------------------------------------------------------
// Mock data factories
// ---------------------------------------------------------------------------

let _idCounter = 0;
function nextId(): string {
  _idCounter += 1;
  return `test-id-${_idCounter}`;
}

export function createMockServicePeriod(
  overrides: Partial<ServicePeriod> = {},
): ServicePeriod {
  return {
    id: nextId(),
    branch: 'army' as Branch,
    mos: '11B',
    jobTitle: 'Infantryman',
    startDate: '2010-06-01',
    endDate: '2014-06-01',
    dutyStation: 'Fort Bragg',
    currentlyServing: false,
    ...overrides,
  };
}

export interface MockBodyMapPin {
  id: string;
  region: string;
  side: 'front' | 'back';
  symptomType: string;
  severity: number;
  frequency: string;
  onsetDate: string;
  flareTriggers: string;
  functionalImpact: string;
  notes: string;
}

export function createMockBodyMapPin(
  overrides: Partial<MockBodyMapPin> = {},
): MockBodyMapPin {
  return {
    id: nextId(),
    region: 'left_shoulder',
    side: 'front',
    symptomType: 'Pain',
    severity: 6,
    frequency: 'daily',
    onsetDate: '2012-03-15',
    flareTriggers: 'Cold weather, heavy lifting',
    functionalImpact: 'Cannot lift above shoulder height',
    notes: 'Worsens with activity',
    ...overrides,
  };
}

export interface MockBackupFile {
  version: string;
  exportDate: string;
  profile: Record<string, unknown>;
  appData: Record<string, unknown>;
  settings: Record<string, unknown>;
}

export function createMockBackupFile(
  overrides: Partial<MockBackupFile> = {},
): MockBackupFile {
  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    profile: { firstName: 'Test', lastName: 'Veteran' },
    appData: { symptoms: [], medications: [], migraines: [] },
    settings: { aiSafeLevel: 0, theme: 'dark' },
    ...overrides,
  };
}

export interface MockEntitlementRecord {
  status: 'preview' | 'premium' | 'lifetime';
  source?: 'apple' | 'stripe' | 'lifetime';
  purchaseDate?: string;
}

export function createMockEntitlementRecord(
  overrides: Partial<MockEntitlementRecord> = {},
): MockEntitlementRecord {
  return {
    status: 'preview',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// User state helpers
// ---------------------------------------------------------------------------

export async function simulatePremiumUser() {
  const mod = await import('@/store/useProfileStore');
  mod.useProfileStore.setState({ entitlement: 'premium' });
}

export async function simulateFreeUser() {
  const mod = await import('@/store/useProfileStore');
  mod.useProfileStore.setState({ entitlement: 'preview' });
}

// ---------------------------------------------------------------------------
// Platform helpers
// ---------------------------------------------------------------------------

export function mockIOSPlatform() {
  vi.mock('@capacitor/core', () => ({
    Capacitor: {
      isNativePlatform: () => true,
      getPlatform: () => 'ios',
    },
  }));
}

export function mockWebPlatform() {
  vi.mock('@capacitor/core', () => ({
    Capacitor: {
      isNativePlatform: () => false,
      getPlatform: () => 'web',
    },
  }));
}

// ---------------------------------------------------------------------------
// Notification permission helpers
// ---------------------------------------------------------------------------

export function mockNotificationPermission(state: NotificationPermission) {
  Object.defineProperty(window, 'Notification', {
    writable: true,
    value: Object.assign(vi.fn(), {
      permission: state,
      requestPermission: vi.fn().mockResolvedValue(state),
    }),
  });
}
