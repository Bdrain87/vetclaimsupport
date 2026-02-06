import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// ============================================================
// TRAP LOGIC: Catch ALL runtime errors, including async React
// rendering failures that a try/catch around root.render() misses.
// ============================================================
const showFatalError = (label: string, err: any) => {
  const msg = err?.message || String(err);
  const stack = err?.stack || '(no stack trace)';
  console.error(`[TRAP] ${label}:`, err);
  document.body.innerHTML = `
    <div style="
      color: #ff5555;
      background: #1a0000;
      padding: 40px;
      min-height: 100vh;
      font-family: monospace;
      overflow: auto;
    ">
      <h1 style="color: #ff3333; font-size: 28px; margin-bottom: 10px;">
        RUNTIME TRAP CAUGHT: ${label}
      </h1>
      <p style="color: #ffaaaa; font-size: 16px; margin-bottom: 20px;">
        The app crashed during browser execution. Raw error below:
      </p>
      <pre style="
        background: rgba(255,255,255,0.05);
        padding: 20px;
        border: 1px solid #ff5555;
        color: #ff8888;
        white-space: pre-wrap;
        word-break: break-all;
        font-size: 13px;
        line-height: 1.6;
      ">${msg}\n\n${stack}</pre>
    </div>
  `;
};

// Catch uncaught synchronous errors (e.g., bad module-level code)
window.addEventListener('error', (event) => {
  showFatalError('Uncaught Error', event.error || event.message);
});

// Catch unhandled promise rejections (e.g., lazy imports, async init)
window.addEventListener('unhandledrejection', (event) => {
  showFatalError('Unhandled Promise Rejection', event.reason);
});

// ============================================================
// BOOT
// ============================================================
const container = document.getElementById('root');

if (!container) {
  document.body.innerHTML = '<div style="color:white; background:red; padding:20px;">CRITICAL: #root element missing in HTML</div>';
} else {
  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error: any) {
    showFatalError('Synchronous Boot Crash', error);
  }
}
