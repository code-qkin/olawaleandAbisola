import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeddingPlanner from './Components/Weddingchecklist';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeddingPlanner />} />
        {/* You can add more routes here later, e.g.:
        <Route path="/login" element={<Login />} />
        <Route path="/guests" element={<GuestList />} />
        */}
      </Routes>
    </Router>
  );
}
