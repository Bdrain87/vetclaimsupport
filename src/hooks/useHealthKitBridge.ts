import { Capacitor } from '@capacitor/core';

export interface HealthSample {
  type: 'sleep' | 'heartRate' | 'steps' | 'activeEnergy';
  value: number;
  unit: string;
  startDate: string;
  endDate: string;
}

export interface HealthKitBridge {
  isAvailable: boolean;
  requestAuthorization: () => Promise<boolean>;
  querySleep: (days: number) => Promise<HealthSample[]>;
  queryHeartRate: (days: number) => Promise<HealthSample[]>;
  querySteps: (days: number) => Promise<HealthSample[]>;
}

export function useHealthKitBridge(): HealthKitBridge {
  const isAvailable =
    Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';

  const requestAuthorization = async (): Promise<boolean> => {
    if (!isAvailable) return false;
    try {
      const { CapacitorHealthkit } = await import(
        /* webpackIgnore: true */ '@nicepkg/capacitor-healthkit'
      );
      await CapacitorHealthkit.requestAuthorization({
        all: [],
        read: [
          'HKQuantityTypeIdentifierHeartRate',
          'HKQuantityTypeIdentifierStepCount',
          'HKQuantityTypeIdentifierActiveEnergyBurned',
          'HKCategoryTypeIdentifierSleepAnalysis',
        ],
        write: [],
      });
      return true;
    } catch {
      return false;
    }
  };

  const queryGeneric = async (
    _type: string,
    _days: number,
  ): Promise<HealthSample[]> => {
    if (!isAvailable) return [];
    return [];
  };

  return {
    isAvailable,
    requestAuthorization,
    querySleep: (days) => queryGeneric('sleep', days),
    queryHeartRate: (days) => queryGeneric('heartRate', days),
    querySteps: (days) => queryGeneric('steps', days),
  };
}
