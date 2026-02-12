import { Capacitor } from '@capacitor/core';

export const isNativeApp = Capacitor.isNativePlatform();
export const isWeb = !isNativeApp;
