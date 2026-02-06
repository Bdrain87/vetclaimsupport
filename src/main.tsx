import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

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

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  showFatalError('Unhandled Promise Rejection', event.reason);
});

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
  } catch (error: unknown) {
    showFatalError('Synchronous Boot Crash', error);
  }
}
