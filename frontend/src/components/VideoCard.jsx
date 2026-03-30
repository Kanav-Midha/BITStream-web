import React from 'react'
import { Link } from 'react-router-dom'

const VideoCard = ({ video }) => {
  // Generate a consistent gradient based on the video ID
  const fallbackGradient = `bg-gradient-to-br from-blue-600 to-purple-900`;

  return (
    <Link to={`/video/${video.video_id}`}>
      <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer group">
        <div className={`aspect-video flex items-center justify-center text-white/50 relative ${fallbackGradient}`}>
          <span className="text-4xl group-hover:scale-125 transition-transform">▶️</span>
          <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold">
            {video.duration_minutes}m
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg truncate pr-2">{video.title}</h3>
            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md uppercase">
              {video.primary_mood}
            </span>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{video.description}</p>
          <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-[11px] text-gray-500 font-medium">
            <span>{video.view_count} VIEWS</span>
            <span>ADDED {new Date(video.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard