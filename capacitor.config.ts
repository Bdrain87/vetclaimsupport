import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vetclaimsupport',
  appName: 'Vet Claim Support',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0a0f1c',
    preferredContentMode: 'mobile',
    scrollEnabled: true,
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#0a0f1c',
      overlaysWebView: true,
    },
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#0a0f1c',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
