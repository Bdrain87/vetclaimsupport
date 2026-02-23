import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initNativeFeatures } from './utils/capacitor';

// ============================================================
// Fatal error display — uses safe DOM APIs (no innerHTML XSS risk)
// ============================================================
const showFatalError = (label: string, err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack ?? '(no stack trace)' : '(no stack trace)';
  console.error(`[TRAP] ${label}:`, err);

  // Clear existing content safely
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }

  const container = document.createElement('div');
  container.style.cssText =
    'color:#ff5555;background:#1a0000;padding:40px;min-height:100vh;font-family:monospace;overflow:auto;';

  const heading = document.createElement('h1');
  heading.style.cssText = 'color:#ff3333;font-size:28px;margin-bottom:10px;';
  heading.textContent = `RUNTIME TRAP CAUGHT: ${label}`;

  const description = document.createElement('p');
  description.style.cssText = 'color:#ffaaaa;font-size:16px;margin-bottom:20px;';
  description.textContent = 'The app crashed during browser execution. Raw error below:';

  const pre = document.createElement('pre');
  pre.style.cssText =
    'background:rgba(255,255,255,0.05);padding:20px;border:1px solid #ff5555;color:#ff8888;white-space:pre-wrap;word-break:break-all;font-size:13px;line-height:1.6;';
  pre.textContent = `${msg}\n\n${stack}`;

  container.appendChild(heading);
  container.appendChild(description);
  container.appendChild(pre);
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
  console.error(
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
  });
  if ('caches' in window) {
    caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
  }
}

if (!isNative && 'serviceWorker' in navigator) {
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
  const VALID_CACHES = ['pages', 'google-fonts-cache', 'google-fonts-webfonts'];
  caches.keys().then((names) => {
    names.forEach((name) => {
      if (!VALID_CACHES.includes(name)) {
        caches.delete(name);
      }
    });
  });

  // Check for SW updates immediately on load, every 30s, and on tab focus
  navigator.serviceWorker.ready.then((registration) => {
    // Immediate check on boot
    registration.update();

    // Poll every 30s (was 60s — faster catches deploys sooner)
    setInterval(() => registration.update(), 30_000);

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
  });
}

// ============================================================
// BOOT
// ============================================================
const container = document.getElementById('root');

if (!container) {
  showFatalError('Boot Failure', new Error('#root element missing in HTML'));
} else {
  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    initNativeFeatures();
  } catch (error: unknown) {
    showFatalError('Synchronous Boot Crash', error);
  }
}
