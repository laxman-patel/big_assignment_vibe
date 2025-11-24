const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3004;
const pool = require('./db');

app.use(cors());

app.get('/feed', async (req, res) => {
    try {
        // In a real app, we'd pass user ID to get personalized feed
        // Here we just fetch all posts from the DB
        const result = await pool.query('SELECT * FROM posts ORDER BY timestamp DESC');
        let posts = result.rows.map(row => ({
            ...row,
            mediaUrl: row.media_url
        }));

        // Simple recommendation logic: Randomly mark some as recommended
        posts = posts.map(post => ({
            ...post,
            isRecommended: Math.random() > 0.5
        }));

        res.json(posts);
    } catch (error) {
        console.error('Error fetching feed:', error.message);
        res.status(500).json({ message: 'Error fetching feed' });
    }
});

app.listen(PORT, () => {
    console.log(`Feed Service running on port ${PORT}`);
});
