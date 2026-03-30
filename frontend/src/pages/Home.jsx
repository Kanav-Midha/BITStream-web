import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import MoodSelector from '../components/MoodSelector'; 

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [user, setUser] = useState(null);
    const [visitorName, setVisitorName] = useState('Guest');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMood, setSelectedMood] = useState('All');

    // Admin List
    const adminEmails = [
        'f20240200@goa.bits-pilani.ac.in', 
        'f20240207@goa.bits-pilani.ac.in', 
        'f20240222@goa.bits-pilani.ac.in',
        'f20240225@goa.bits-pilani.ac.in',
        'f20240007@goa.bits-pilani.ac.in',
        'f20240598@goa.bits-pilani.ac.in'
    ];

    useEffect(() => {
        // Personalized Name Logic
        const savedName = localStorage.getItem('bitstream_user_name');
        if (savedName) {
            setVisitorName(savedName);
        } else {
            const nameInput = window.prompt("Welcome to BITStream! What should we call you?");
            if (nameInput && nameInput.trim() !== '') {
                localStorage.setItem('bitstream_user_name', nameInput.trim());
                setVisitorName(nameInput.trim());
            }
        }

        // Fetch Data
        axios.get('https://bitstream-web.onrender.com/api/videos')
            .then(res => setVideos(res.data))
            .catch(err => console.log(err));

        axios.get('https://bitstream-web.onrender.com/api/current_user')
            .then(res => setUser(res.data))
            .catch(err => console.log(err));
    }, []);

    const removeVideoFromUI = (id) => {
        setVideos(videos.filter(v => v.video_id !== id));
    };

    const isAdmin = user && user.email && adminEmails.includes(user.email.toLowerCase());

    // Filter Logic
    const filteredVideos = videos.filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              video.primary_mood.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMood = selectedMood === 'All' || video.primary_mood === selectedMood;
        return matchesSearch && matchesMood;
    });

    return (
        <div className="home-container">
            {/* HERO SECTION WITH SEARCH & MOODS */}
            <div className="hero-section" style={{textAlign: 'center', padding: '4rem 1rem'}}>
                <h1 style={{fontSize: '3.5rem', fontWeight: '800', marginBottom: '0.5rem'}}>
                    BIT<span style={{color: '#8b5cf6'}}>Stream</span>
                </h1>
                <p style={{color: '#9ca3af', fontSize: '1.2rem', marginBottom: '2rem'}}>
                    How are you feeling, {visitorName}?
                </p>

                <input 
                    type="text" 
                    placeholder="Search for a video or vibe..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '1rem 2rem', width: '100%', maxWidth: '600px', 
                        borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', 
                        background: 'rgba(0,0,0,0.3)', color: 'white', marginBottom: '2rem',
                        outline: 'none', fontSize: '1rem'
                    }}
                />

                <MoodSelector selectedMood={selectedMood} setSelectedMood={setSelectedMood} />
            </div>

            {/* VIDEO GRID */}
            <section className="trending">
                <h2 style={{paddingLeft: '2rem', marginBottom: '1.5rem'}}>Trending Now</h2>
                <div className="video-grid">
                    {filteredVideos.length > 0 ? (
                        filteredVideos.map(video => (
                            <VideoCard 
                                key={video.video_id} 
                                video={video} 
                                isAdmin={isAdmin} 
                                onDelete={removeVideoFromUI}
                            />
                        ))
                    ) : (
                        <p style={{paddingLeft: '2rem', color: '#9ca3af'}}>No videos found for this vibe...</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;