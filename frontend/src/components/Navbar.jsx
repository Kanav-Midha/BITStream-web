import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const [user, setUser] = useState(null);

    // --- 1. ENSURE THESE EMAILS ARE EXACTLY AS THEY APPEAR IN GMAIL ---
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
            .then(res => {
                console.log("Logged in user data:", res.data); // DEBUG: Check this in browser console
                setUser(res.data);
            })
            .catch(err => console.log("Login check error:", err));
    }, []);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <h1>BITStream</h1>
                </Link>
                
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    
                    {/* --- 2. SHOW UPLOAD ONLY IF EMAIL MATCHES LIST --- */}
                    {user && user.email && adminEmails.includes(user.email.toLowerCase()) && (
                        <Link to="/upload" className="upload-btn">Upload</Link>
                    )}

                    {user ? (
                        <div className="user-profile">
                            <span className="user-name">{user.name}</span>
                            {/* Optional: add a logout link here later */}
                        </div>
                    ) : (
                        <a href="https://bitstream-web.onrender.com/auth/google" className="login-btn">
                            Login
                        </a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;