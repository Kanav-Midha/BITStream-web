require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Database Connection using the Render Environment Variable
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// --- UPDATED CORS FOR PRODUCTION ---
app.use(cors({ 
    origin: 'https://bit-stream-web.vercel.app', // Your Vercel URL
    credentials: true 
}));

app.use(express.json());
app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        sameSite: 'none', // Required for cross-site cookies
        secure: true      // Required for HTTPS
    }
}));
app.set('trust proxy', 1); // Required for Render/Vercel cookies

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://bitstream-web.onrender.com/auth/google/callback" // Your Render URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const { id, displayName, emails } = profile;
        let res = await pool.query('SELECT * FROM Users WHERE google_id = $1', [id]);
        if (res.rows.length === 0) {
            res = await pool.query('INSERT INTO Users (google_id, name, email) VALUES ($1, $2, $3) RETURNING *', [id, displayName, emails[0].value]);
        }
        return done(null, res.rows[0]);
    } catch (err) { return done(err, null); }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// --- ROUTES ---
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'https://bit-stream-web.vercel.app' }), 
  (req, res) => {
    res.redirect('https://bit-stream-web.vercel.app'); // Send user back to Vercel
});

app.get('/api/current_user', (req, res) => { res.json(req.user || null); });

app.get('/api/videos', async (req, res) => {
    const result = await pool.query('SELECT * FROM Videos ORDER BY created_at DESC');
    res.json(result.rows);
});

app.get('/api/videos/:id', async (req, res) => {
    const result = await pool.query('SELECT * FROM Videos WHERE video_id = $1', [req.params.id]);
    res.json(result.rows[0]);
});

app.patch('/api/videos/:id/view', async (req, res) => {
    await pool.query('UPDATE Videos SET view_count = view_count + 1 WHERE video_id = $1', [req.params.id]);
    res.sendStatus(200);
});

app.post('/api/videos', async (req, res) => {
    const { title, description, url, duration, mood } = req.body;
    const result = await pool.query(
        'INSERT INTO Videos (title, description, url, duration_minutes, primary_mood) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, description, url, duration, mood]
    );
    res.json(result.rows[0]);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running`));