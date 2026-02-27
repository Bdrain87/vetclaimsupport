import { Capacitor } from '@capacitor/core';

type ImpactStyle = 'Heavy' | 'Medium' | 'Light';
type NotificationType = 'Success' | 'Warning' | 'Error';

let Haptics: {
  impact: (options: { style: ImpactStyle }) => Promise<void>;
  notification: (options: { type: NotificationType }) => Promise<void>;
  selectionStart: () => Promise<void>;
  selectionChanged: () => Promise<void>;
  selectionEnd: () => Promise<void>;
} | null = null;

if (Capacitor.isNativePlatform()) {
  import('@capacitor/haptics').then((mod) => {
    Haptics = mod.Haptics;
  }).catch(() => {
    // Haptics plugin unavailable — non-fatal
  });
}

function isNative(): boolean {
  return Capacitor.isNativePlatform() && Haptics !== null;
}

export function impactLight(): void {
  if (isNative()) Haptics!.impact({ style: 'Light' });
}

export function impactMedium(): void {
  if (isNative()) Haptics!.impact({ style: 'Medium' });
}

export function impactHeavy(): void {
  if (isNative()) Haptics!.impact({ style: 'Heavy' });
}

export function notifySuccess(): void {
  if (isNative()) Haptics!.notification({ type: 'Success' });
}

export function notifyWarning(): void {
  if (isNative()) Haptics!.notification({ type: 'Warning' });
}

export function notifyError(): void {
  if (isNative()) Haptics!.notification({ type: 'Error' });
}

export function selectionTap(): void {
  if (isNative()) {
    Haptics!.selectionStart();
    Haptics!.selectionChanged();
    Haptics!.selectionEnd();
  }
}
