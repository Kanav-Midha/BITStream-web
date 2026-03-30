import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const [user, setUser] = useState(null);

    // --- ADD YOUR TEAM EMAILS HERE ---
    const adminEmails = [
        'f20240200@goa.bits-pilani.ac.in', 
        'f20240207@goa.bits-pilani.ac.in', 
        'f20240222@goa.bits-pilani.ac.in',
        'f20240225@goa.bits-pilani.ac.in',
        'f20240007@goa.bits-pilani.ac.in',
        'f20240598@goa.bits-pilani.ac.in'
    ];

    useEffect(() => {
        // Fetches the user from your Render backend
        axios.get('https://bitstream-web.onrender.com/api/current_user')
            .then(res => setUser(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <nav className="navbar">
            <Link to="/"><h1>BITStream</h1></Link>
            <div className="nav-links">
                <Link to="/">Home</Link>
                
                {/* --- SHOW UPLOAD ONLY FOR ADMINS --- */}
                {user && adminEmails.includes(user.email) && (
                    <Link to="/upload" className="upload-btn">Upload</Link>
                )}

                {user ? (
                    <span className="user-name">{user.name}</span>
                ) : (
                    <a href="https://bitstream-web.onrender.com/auth/google" className="login-btn">Login</a>
                )}
            </div>
        </nav>
    );
};

export default Navbar;