const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3002; // Different port than auth-service (3001)

app.use(cors());
app.use(bodyParser.json());

// In-memory posts store
let posts = [
    { id: '1', content: 'Hello World!', authorId: 'admin', timestamp: Date.now() }
];

app.get('/posts', (req, res) => {
    res.json(posts.sort((a, b) => b.timestamp - a.timestamp));
});

app.post('/posts', (req, res) => {
    const { content, authorId, mediaUrl } = req.body;
    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    const newPost = {
        id: Date.now().toString(),
        content,
        authorId: authorId || 'anonymous',
        mediaUrl: mediaUrl || null,
        timestamp: Date.now()
    };

    posts.push(newPost);
    res.status(201).json(newPost);
});

app.listen(PORT, () => {
    console.log(`Post Service running on port ${PORT}`);
});
