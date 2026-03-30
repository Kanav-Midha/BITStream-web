import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const VideoCard = ({ video, isAdmin, onDelete }) => {
    
    const handleDelete = async (e) => {
        e.preventDefault(); // Prevents clicking the card when clicking delete
        if (window.confirm(`Are you sure you want to delete "${video.title}"?`)) {
            try {
                await axios.delete(`https://bitstream-web.onrender.com/api/videos/${video.video_id}`);
                onDelete(video.video_id); // Update UI after deletion
            } catch (err) {
                alert("Failed to delete video.");
                console.error(err);
            }
        }
    };

    return (
        <div className="video-card">
            <Link to={`/player/${video.video_id}`}>
                <div className="thumbnail-container">
                    <div className="play-icon">▶</div>
                    <span className="duration">{video.duration_minutes}m</span>
                </div>
                <div className="video-info">
                    <h3>{video.title}</h3>
                    <div className="video-meta">
                        <span className="mood-tag">{video.primary_mood}</span>
                        {/* --- SHOW DELETE ONLY FOR ADMINS --- */}
                        {isAdmin && (
                            <button className="delete-btn" onClick={handleDelete}>
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