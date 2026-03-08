import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { logger } from './utils/logger';

// ============================================================
// Fatal error display — uses safe DOM APIs (no innerHTML XSS risk)
// MUST be registered BEFORE importing App, so module-evaluation
// errors (e.g. missing env vars) show a styled error page
// instead of a black screen.
// ============================================================
const showFatalError = (label: string, err: unknown) => {
  // Log full details for debugging (only visible in browser dev tools)
  logger.error(`[TRAP] ${label}:`, err);

  // Clear existing content safely
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }

  const container = document.createElement('div');
  container.style.cssText =
    'color:#ffffff;background:#0A0A0A;padding:40px;min-height:100vh;font-family:system-ui,-apple-system,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;';

  const heading = document.createElement('h1');
  heading.style.cssText = 'font-size:24px;margin-bottom:12px;font-weight:600;';
  heading.textContent = 'Something went wrong';

  const description = document.createElement('p');
  description.style.cssText = 'color:rgba(255,255,255,0.6);font-size:16px;margin-bottom:24px;max-width:400px;line-height:1.5;';
  description.textContent = 'The app ran into an unexpected error. Please reload the page to try again.';

  const btn = document.createElement('button');
  btn.style.cssText =
    'background:linear-gradient(90deg,#A68B3C,#C5A55A,#D9BE6C,#C5A55A,#A68B3C);color:#000;border:none;padding:12px 32px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;';
  btn.textContent = 'Reload';
  btn.onclick = () => window.location.reload();

  container.appendChild(heading);
  container.appendChild(description);
  container.appendChild(btn);
  document.body.appendChild(container);
};

// Catch uncaught synchronous errors
window.addEventListener('error', (event) => {
  showFatalError('Uncaught Error', event.error ?? event.message);
});

// Catch unhandled promise rejections — log them but don't nuke the UI.
// Async failures (failed fetches, expired tokens, etc.) should not
// replace the entire app with a red error screen. The ErrorBoundary
// and component-level error handling cover user-facing recovery.
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  logger.error(
    '[unhandledrejection]',
    reason instanceof Error ? reason.message : String(reason),
    reason instanceof Error ? reason.stack : '',
  );
});

// ============================================================
// SERVICE WORKER — web only (native app doesn't need PWA caching)
// ============================================================
import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();

// On native, unregister any existing SW and clear caches so the
// webview always fetches fresh content from the server.
if (isNative && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  }).catch(() => {});
  if ('caches' in window) {
    caches.keys().then((names) => names.forEach((n) => caches.delete(n))).catch(() => {});
  }
}

if (!isNative && 'serviceWorker' in navigator) {
  // Register SW on web only (injectRegister: null in vite.config.ts)
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' });
  });

  // When a new SW takes control, reload so the user gets fresh code.
  // This fires after skipWaiting + clientsClaim on a new deployment.
  let swRefreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (swRefreshing) return;
    swRefreshing = true;
    window.location.reload();
  });

  // Purge old runtime caches that may hold stale JS/CSS from
  // previous builds. The SW handles its own precache cleanup,
  // but runtime caches (pages, app-assets) from older SW versions
  // can linger. Delete any cache name we no longer use.
  const VALID_CACHES = ['google-fonts-cache', 'google-fonts-webfonts'];
  caches.keys().then((names) => {
    names.forEach((name) => {
      if (!VALID_CACHES.includes(name)) {
        caches.delete(name);
      }
    });
  }).catch(() => {});

  // Check for SW updates immediately on load, every 5 minutes, and on tab focus
  navigator.serviceWorker.ready.then((registration) => {
    // Immediate check on boot
    registration.update();

    // Poll every 5 minutes — balances deploy detection with battery/bandwidth
    setInterval(() => registration.update(), 5 * 60_000);

    // Check when user returns to tab
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        registration.update();
      }
    });

    // If a new SW is already waiting (installed before page loaded),
    // tell it to activate immediately
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    // Also catch the case where a new SW finishes installing while
    // the page is open
    registration.addEventListener('updatefound', () => {
      const newSW = registration.installing;
      if (!newSW) return;
      newSW.addEventListener('statechange', () => {
        if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
          // New SW installed while old one controls — force activate
          newSW.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    });
  }).catch(() => {});
}

// ============================================================
// BOOT — Dynamic import so error handlers above catch any
// module-evaluation failures in App or its dependency tree.
// ============================================================
async function boot() {
  const container = document.getElementById('root');

  if (!container) {
    showFatalError('Boot Failure', new Error('#root element missing in HTML'));
    return;
  }

  try {
    const [{ default: App }, { initNativeFeatures }] = await Promise.all([
      import('./App'),
      import('./utils/capacitor'),
    ]);

    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    initNativeFeatures();
  } catch (error: unknown) {
    showFatalError('Boot Crash', error);
  }
}

boot();
