import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Upload = () => {
  const [formData, setFormData] = useState({ title: '', description: '', url: '', duration: '', mood: 'Chill' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/videos', formData);
      alert("Video Uploaded Successfully!");
      navigate('/'); // Go back to Home to see the new video
    } catch (err) {
      alert("Error uploading video");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto p-10 mt-10 bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-500">Upload to BITStream</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Video Title</label>
            <input required type="text" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" 
              onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea required className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Video URL (.mp4)</label>
              <input required type="text" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                onChange={(e) => setFormData({...formData, url: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Duration (mins)</label>
              <input required type="number" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                onChange={(e) => setFormData({...formData, duration: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Primary Mood</label>
            <select className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, mood: e.target.value})}>
              <option>Chill</option><option>Hype</option><option>Focus</option><option>Happy</option><option>Sad</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95">
            Publish Video
          </button>
        </form>
      </div>
    </div>
  )
}

export default Upload