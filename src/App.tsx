import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Navbar } from './components/layout/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#102039] text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
