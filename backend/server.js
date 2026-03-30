const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. DATABASE CONNECTION (Neon / PostgreSQL)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// 2. MIDDLEWARE & SECURITY GLUE
app.use(express.json());

// CORS: Critical for Vercel -> Render communication
app.use(cors({
    origin: 'https://bit-stream-web.vercel.app',
    credentials: true 
}));

// Required for Render to handle secure cookies correctly
app.set("trust proxy", 1); 

// SESSION CONFIG: The "Handshake" between Vercel and Render
app.use(session({
    secret: process.env.SESSION_SECRET || 'bitstream_secret_key',
    resave: true,               // Forces session to be saved back to the store
    saveUninitialized: true,    // Forces a session to be created even if not logged in
    proxy: true,                // Tells session to trust the Render/Vercel proxy
    cookie: {
        secure: true,           // Required for HTTPS (Production)
        sameSite: 'none',       // Required for cross-domain cookies
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// 3. PASSPORT CONFIG (Google OAuth)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://bitstream-web.onrender.com/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const googleId = profile.id;

    try {
        let res = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        if (res.rows.length === 0) {
            res = await pool.query(
                'INSERT INTO Users (google_id, name, email) VALUES ($1, $2, $3) RETURNING *',
                [googleId, name, email]
            );
        }
        return done(null, res.rows[0]);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => done(null, user.user_id));
passport.deserializeUser(async (id, done) => {
    try {
        const res = await pool.query('SELECT * FROM Users WHERE user_id = $1', [id]);
        done(null, res.rows[0]);
    } catch (err) {
        done(err);
    }
});

// 4. AUTHENTICATION ROUTES
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: 'https://bit-stream-web.vercel.app' }),
    (req, res) => res.redirect('https://bit-stream-web.vercel.app')
);

app.get('/api/current_user', (req, res) => {
    // This is what the Navbar calls to see if you are logged in
    res.json(req.user || null);
});

app.get('/auth/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); 
            res.redirect('https://bit-stream-web.vercel.app');
        });
    });
});

// 5. VIDEO MANAGEMENT ROUTES
// Get all videos
app.get('/api/videos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Videos ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get a single video (for the Player page)
app.get('/api/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM Videos WHERE video_id = $1', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Upload a new video
app.post('/api/videos', async (req, res) => {
    const { title, description, url, duration, mood } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Videos (title, description, url, duration_minutes, primary_mood) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, url, duration, mood]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update View Count
app.patch('/api/videos/:id/view', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE Videos SET view_count = COALESCE(view_count, 0) + 1 WHERE video_id = $1', [id]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a video
app.delete('/api/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Videos WHERE video_id = $1', [id]);
        res.json({ message: "Video deleted successfully" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 6. START SERVER
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 BITStream Engine running on port ${PORT}`));