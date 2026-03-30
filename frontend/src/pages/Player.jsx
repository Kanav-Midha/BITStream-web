import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const Player = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://bitstream-web.onrender.com/api/videos/${id}`)
        setVideo(response.data)
        setLoading(false)
        await axios.patch(`https://bitstream-web.onrender.com/api/videos/${id}/view`)
      } catch (error) {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await axios.delete(`https://bitstream-web.onrender.com/api/videos/${id}`);
        navigate('/'); // Go home after deleting
      } catch (err) {
        alert("Error deleting video");
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center font-sans text-xl">Buffering...</div>
  if (!video) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center font-sans text-xl">Video Not Found</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto p-10">
        <Link to="/" className="text-blue-400 hover:underline mb-6 block">← Back to Feed</Link>
        
        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
           <video controls autoPlay className="w-full h-full" src={video.url} />
        </div>
        
        <div className="mt-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">{video.title}</h1>
            <p className="text-gray-400 mt-2 text-lg">{video.view_count} views • {video.description}</p>
          </div>
          <button 
            onClick={handleDelete}
            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2 rounded-xl font-bold transition-all border border-red-500/20"
          >
            Delete Video
          </button>
        </div>
      </div>
    </div>
  )
}

export default Player