import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeddingPlanner from './Components/Weddingchecklist';
import InviteGenerator from './Components/InviteGenerator';
import InviteViewer from './Components/InviteViewer';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeddingPlanner />} />
        <Route path="/generate-invite" element={<InviteGenerator />} />
        <Route path="/invite/:name" element={<InviteViewer />} />
      </Routes>
    </Router>
  );
}
