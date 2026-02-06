import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import Dashboard from './pages/Dashboard';
import { Navbar } from './components/layout/Navbar';
import { ClaimsProvider } from './context/ClaimsContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ClaimsProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#102039] text-white">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Failsafe: redirect unknown paths to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ClaimsProvider>
    </ErrorBoundary>
  );
}

export default App;
