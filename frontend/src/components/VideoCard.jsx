import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const VideoCard = ({ video, isAdmin, onDelete }) => {

    const handleDelete = async (e) => {
        // Stop the click from opening the video player
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm(`Admin Action: Permanently delete "${video.title}"?`)) {
            try {
                // The token is automatically sent via the axios interceptor in main.jsx
                await axios.delete(`https://bitstream-web.onrender.com/api/videos/${video.video_id}`);
                
                // This updates the Home page list instantly so the video disappears
                onDelete(video.video_id); 
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Unauthorized: Only verified admins can delete content.");
            }
        }
    };

    return (
        <div className="video-card">
            <Link to={`/player/${video.video_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {/* Thumbnail Area with Play Button Overlay */}
                <div className="thumbnail-container">
                    <span className="play-icon">▶</span>
                    <span className="duration">{video.duration_minutes}m</span>
                </div>

                <div className="video-info">
                    <h3>{video.title}</h3>
                    
                    <div className="video-meta">
                        <span className="mood-tag">{video.primary_mood}</span>
                        
                        {/* Only renders the button if you are logged in as an Admin */}
                        {isAdmin && (
                            <button 
                                onClick={handleDelete} 
                                className="delete-btn"
                                title="Admin: Delete Video"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default VideoCard;