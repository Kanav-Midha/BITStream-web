import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [user, setUser] = useState(null);
    
    const adminEmails = [
        'f20240200@goa.bits-pilani.ac.in', 
        'f20240207@goa.bits-pilani.ac.in', 
        'f20240222@goa.bits-pilani.ac.in',
        'f20240225@goa.bits-pilani.ac.in',
        'f20240007@goa.bits-pilani.ac.in',
        'f20240598@goa.bits-pilani.ac.in'
    ];

    useEffect(() => {
        // Fetch videos
        axios.get('https://bitstream-web.onrender.com/api/videos')
            .then(res => setVideos(res.data))
            .catch(err => console.log(err));

        // Fetch current user
        axios.get('https://bitstream-web.onrender.com/api/current_user')
            .then(res => setUser(res.data))
            .catch(err => console.log(err));
    }, []);

    const removeVideoFromUI = (id) => {
        setVideos(videos.filter(v => v.video_id !== id));
    };

    const isAdmin = user && user.email && adminEmails.includes(user.email.toLowerCase());

    return (
        <div className="home-container">
            <section className="trending">
                <h2>Trending Now</h2>
                <div className="video-grid">
                    {videos.map(video => (
                        <VideoCard 
                            key={video.video_id} 
                            video={video} 
                            isAdmin={isAdmin} 
                            onDelete={removeVideoFromUI}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;