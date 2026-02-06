import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

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
    // If the app crashes, this will show the error ON THE SCREEN instead of a white void.
    container.innerHTML = `
      <div style="color: #C8A628; background: #102039; padding: 40px; height: 100vh; font-family: sans-serif;">
        <h1 style="text-transform: uppercase;">Platinum Runtime Failure</h1>
        <p style="color: white;">The app crashed during boot. Exact error:</p>
        <pre style="background: rgba(255,255,255,0.1); padding: 20px; color: #ff5555; overflow: auto;">
          ${error.message}
          ${error.stack}
        </pre>
      </div>
    `;
  }
}
