require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// --- DATABASE CONNECTION ---
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// --- MIDDLEWARE ---
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'secret', 
    resave: false, 
    saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

// --- PASSPORT GOOGLE STRATEGY ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5001/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const { id, displayName, emails } = profile;
        let res = await pool.query('SELECT * FROM Users WHERE google_id = $1', [id]);
        
        if (res.rows.length === 0) {
            res = await pool.query(
                'INSERT INTO Users (google_id, name, email) VALUES ($1, $2, $3) RETURNING *', 
                [id, displayName, emails[0].value]
            );
        }
        return done(null, res.rows[0]);
    } catch (err) { 
        return done(err, null); 
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// --- AUTH ROUTES ---
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173' }), 
    (req, res) => {
        res.redirect('http://localhost:5173');
    }
);

app.get('/api/current_user', (req, res) => { 
    res.json(req.user || null); 
});

// --- VIDEO API ROUTES ---

// 1. Get all videos
app.get('/api/videos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Videos ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Database Error");
    }
});

// 2. Get a single video by ID
app.get('/api/videos/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Videos WHERE video_id = $1', [req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send("Database Error");
    }
});

// 3. Upload a new video
app.post('/api/videos', async (req, res) => {
    try {
        const { title, description, url, duration, mood } = req.body;
        const result = await pool.query(
            'INSERT INTO Videos (title, description, url, duration_minutes, primary_mood) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, url, duration, mood]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send("Database Error");
    }
});

// 4. Update view count
app.patch('/api/videos/:id/view', async (req, res) => {
    try {
        await pool.query('UPDATE Videos SET view_count = view_count + 1 WHERE video_id = $1', [req.params.id]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send("Database Error");
    }
});

// 5. Delete a video
app.delete('/api/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Videos WHERE video_id = $1', [id]);
        res.status(200).send("Video deleted");
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// --- START SERVER ---
const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Backend live on http://localhost:${PORT}`));