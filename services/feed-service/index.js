const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3004;
const POST_SERVICE_URL = 'http://localhost:3002/posts';

app.use(cors());

app.get('/feed', async (req, res) => {
    try {
        // In a real app, we'd pass user ID to get personalized feed
        // Here we just fetch all posts and maybe shuffle or sort them
        const response = await axios.get(POST_SERVICE_URL);
        let posts = response.data;

        // Simple recommendation logic: Sort by timestamp descending (newest first)
        // This is already done by post-service, so let's add a "recommended" flag
        posts = posts.map(post => ({
            ...post,
            isRecommended: Math.random() > 0.5 // Randomly mark some as recommended
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
