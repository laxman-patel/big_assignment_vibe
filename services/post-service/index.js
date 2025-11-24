const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = 3002; // Different port than auth-service (3001)

app.use(cors());
app.use(bodyParser.json());

// Initialize DB
pool.query(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    media_url TEXT,
    timestamp TEXT NOT NULL,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0
  )
`).catch(err => console.error('Error creating posts table', err));

app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY timestamp DESC');
        // Map snake_case to camelCase if needed, or just return as is. 
        // Frontend expects: id, content, author, timestamp, likes, comments.
        // Postgres returns lowercase column names by default.
        // media_url needs mapping if frontend expects mediaUrl.
        const posts = result.rows.map(row => ({
            ...row,
            mediaUrl: row.media_url
        }));
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/posts', async (req, res) => {
    const { content, author, mediaUrl } = req.body;
    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    const id = Date.now().toString();
    const timestamp = new Date().toISOString();
    const authorName = author || 'anonymous';
    const media = mediaUrl || null;

    try {
        await pool.query(
            'INSERT INTO posts (id, content, author, media_url, timestamp, likes, comments) VALUES ($1, $2, $3, $4, $5, 0, 0)',
            [id, content, authorName, media, timestamp]
        );

        const newPost = {
            id,
            content,
            author: authorName,
            mediaUrl: media,
            timestamp,
            likes: 0,
            comments: 0
        };
        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Post Service running on port ${PORT}`);
});
