import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Player from './pages/Player'
import Upload from './pages/Upload' // Import the new page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/video/:id" element={<Player />} />
      <Route path="/upload" element={<Upload />} />
    </Routes>
  )
}

export default App