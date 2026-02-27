import { Capacitor } from '@capacitor/core';

export const isNativeApp = Capacitor.isNativePlatform();
export const isWeb = !isNativeApp;

/** Open an external URL using Capacitor Browser on native, window.open on web. */
export async function openExternalUrl(url: string): Promise<void> {
  if (isNativeApp) {
    const { Browser } = await import('@capacitor/browser');
    await Browser.open({ url });
  } else {
    window.open(url, '_blank');
  }
}
