import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed Router from here
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Player from './pages/Player';
import './App.css'; 

function App() {
  return (
    <div className="app-container">
      <Navbar /> 
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/player/:id" element={<Player />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;