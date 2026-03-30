import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Required to send cookies back and forth
axios.defaults.withCredentials = true;

const Navbar = () => {
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
        axios.get('https://bitstream-web.onrender.com/api/current_user')
            .then(res => setUser(res.data))
            .catch(err => console.log("Auth error:", err));
    }, []);

    // Inline styles for a guaranteed layout
    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: '#0a0f1c',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
    };

    const linkGroupStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem'
    };

    const buttonStyle = {
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: '600',
        transition: '0.2s'
    };

    return (
        <nav style={navStyle}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 style={{ margin: 0, color: '#a78bfa', fontSize: '1.5rem', fontWeight: '800' }}>BITStream</h1>
            </Link>
            
            <div style={linkGroupStyle}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                
                {/* ADMIN CHECK */}
                {user && user.email && adminEmails.includes(user.email.toLowerCase()) && (
                    <Link to="/upload" style={{ ...buttonStyle, background: '#3b82f6', color: 'white' }}>
                        Upload
                    </Link>
                )}

                {/* USER AUTH SECTION */}
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{ color: '#9ca3af' }}>{user.name}</span>
                        <a href="https://bitstream-web.onrender.com/auth/logout" 
                           style={{ ...buttonStyle, border: '1px solid #ef4444', color: '#ef4444' }}>
                            Logout
                        </a>
                    </div>
                ) : (
                    <a href="https://bitstream-web.onrender.com/auth/google" 
                       style={{ ...buttonStyle, background: 'white', color: 'black' }}>
                        Login
                    </a>
                )}
            </div>
        </nav>
    );
};

export default Navbar;