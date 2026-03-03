import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();
export const isIOS = Capacitor.getPlatform() === 'ios';

/**
 * Router navigate function — set by App.tsx after router mounts.
 * Used by deep link handler to navigate within the app.
 */
let _navigate: ((path: string) => void) | null = null;

export function setDeepLinkNavigator(fn: (path: string) => void) {
  _navigate = fn;
}

/**
 * Parse a vetclaim:// or https://app.vetclaimsupport.com deep link URL
 * and return the internal route path, or null if not recognized.
 */
function parseDeepLink(url: string): string | null {
  try {
    // Handle vetclaim:// scheme
    if (url.startsWith('vetclaim://')) {
      const path = url.replace('vetclaim:/', '');
      return path.startsWith('/') ? path : `/${path}`;
    }

    // Handle https://app.vetclaimsupport.com/...
    const parsed = new URL(url);
    if (parsed.hostname === 'app.vetclaimsupport.com') {
      return parsed.pathname + parsed.search;
    }

    return null;
  } catch {
    return null;
  }
}

export async function initNativeFeatures() {
  if (!isNative) return;

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    // Status bar - light text on dark background
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#000000' });
  } catch {
    // StatusBar not available on this platform
  }

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch {
    // SplashScreen plugin not available
  }

  try {
    const { Keyboard } = await import('@capacitor/keyboard');
    // Keyboard listeners for safe layout adjustments
    await Keyboard.addListener('keyboardWillShow', (info) => {
      document.body.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
      document.body.classList.add('keyboard-open');
    });
    await Keyboard.addListener('keyboardWillHide', () => {
      document.body.style.setProperty('--keyboard-height', '0px');
      document.body.classList.remove('keyboard-open');
    });
  } catch {
    // Keyboard plugin not available on this platform
  }

  // Deep link handling (vetclaim:// and universal links)
  try {
    const { App } = await import('@capacitor/app');
    await App.addListener('appUrlOpen', ({ url }) => {
      const route = parseDeepLink(url);
      if (route && _navigate) {
        _navigate(route);
      }
    });
  } catch {
    // App plugin not available
  }

  // Notification tap handling — navigate to the route stored in extra data
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
      const route = action.notification?.extra?.route;
      if (route && _navigate) {
        _navigate(route);
      }
    });
  } catch {
    // LocalNotifications not available
  }
}
