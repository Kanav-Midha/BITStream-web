import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import MoodSelector from '../components/MoodSelector'
import VideoCard from '../components/VideoCard'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/videos')
        setVideos(response.data)
        setFilteredVideos(response.data)
      } catch (error) {
        console.error("Error fetching videos:", error)
      }
    }
    fetchVideos()
  }, [])

  const handleMoodSelect = (mood) => {
    if (mood === 'All') {
      setFilteredVideos(videos)
    } else {
      const filtered = videos.filter(v => v.primary_mood === mood)
      setFilteredVideos(filtered)
    }
  }

  // Combine Mood Filter with Search Filter
  const displayVideos = filteredVideos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <section className="text-center mt-16 mb-8">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            BITStream
          </h1>
          <p className="text-gray-400 text-lg">Your vibe, your stream.</p>
        </section>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <input 
            type="text"
            placeholder="Search for a video or vibe..."
            className="w-full bg-gray-800 border border-gray-700 rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-inner"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <MoodSelector onSelectMood={handleMoodSelect} />
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-300">
            {displayVideos.length === 0 ? "No videos found..." : "Trending Now"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayVideos.map(video => (
              <VideoCard key={video.video_id} video={video} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home