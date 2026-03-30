import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;

const Player = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [video, setVideo] = useState(null);
    const [user, setUser] = useState(null);

    const adminEmails = [
        'f20240200@goa.bits-pilani.ac.in', 'f20240207@goa.bits-pilani.ac.in', 
        'f20240222@goa.bits-pilani.ac.in', 'f20240225@goa.bits-pilani.ac.in',
        'f20240007@goa.bits-pilani.ac.in', 'f20240598@goa.bits-pilani.ac.in'
    ];

    useEffect(() => {
        // 1. Fetch Video Data
        axios.get(`https://bitstream-web.onrender.com/api/videos/${id}`)
            .then(res => setVideo(res.data))
            .catch(err => console.log(err));

        // 2. Fetch User Data for Admin Check
        axios.get('https://bitstream-web.onrender.com/api/current_user')
            .then(res => setUser(res.data))
            .catch(err => console.log(err));

        // 3. Increment View Count
        axios.patch(`https://bitstream-web.onrender.com/api/videos/${id}/view`)
            .catch(err => console.log("View count error:", err));
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this video?")) {
            try {
                await axios.delete(`https://bitstream-web.onrender.com/api/videos/${id}`);
                navigate('/'); // Go back to home after deleting
            } catch (err) {
                alert("Error deleting video.");
            }
        }
    };

    if (!video) return <div style={{padding: '50px', color: 'white'}}>Loading video...</div>;

    const isAdmin = user && user.email && adminEmails.includes(user.email.toLowerCase());

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem', color: 'white' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', background: '#000', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                <iframe
                    src={video.url.replace('watch?v=', 'embed/')}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{video.title}</h1>
                    <p style={{ color: '#9ca3af' }}>{video.view_count || 0} views • Live from the cloud!</p>
                </div>

                {isAdmin && (
                    <button onClick={handleDelete} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                        Delete Video
                    </button>
                )}
            </div>
            
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                <p>{video.description}</p>
                <span style={{ background: '#8b5cf6', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>
                    {video.primary_mood}
                </span>
            </div>
        </div>
    );
};

export default Player;