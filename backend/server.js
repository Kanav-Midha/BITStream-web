const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'bitstream_jwt_secret';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(express.json());
app.use(cors({
    origin: 'https://bit-stream-web.vercel.app',
    credentials: true
}));
app.set("trust proxy", 1);

app.use(session({
    secret: process.env.SESSION_SECRET || 'bitstream_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none',
        maxAge: 10 * 60 * 1000 
    }
}));

app.use(passport.initialize());
app.use(passport.session());

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

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'https://bit-stream-web.vercel.app' }),
    (req, res) => {
        const token = jwt.sign(
            { user_id: req.user.user_id, email: req.user.email, name: req.user.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.redirect(`https://bit-stream-web.vercel.app?token=${token}`);
    }
);

app.get('/api/current_user', (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) return res.json(null);
    try {
        const user = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
        res.json(user);
    } catch {
        res.json(null);
    }
});

app.get('/auth/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});

app.get('/api/videos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Videos ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/api/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM Videos WHERE video_id = $1', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

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

app.patch('/api/videos/:id/view', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE Videos SET view_count = COALESCE(view_count, 0) + 1 WHERE video_id = $1', [id]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/api/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Videos WHERE video_id = $1', [id]);
        res.json({ message: "Video deleted successfully" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));