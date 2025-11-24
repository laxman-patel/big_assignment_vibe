const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'super-secret-key'; // In prod, use env var

app.use(cors());
app.use(bodyParser.json());

// In-memory user store
const users = [];

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = { id: Date.now().toString(), username, password }; // Plaintext password for simplicity as requested
    users.push(newUser);

    res.status(201).json({ message: 'User created', userId: newUser.id });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, username: user.username, userId: user.id });
});

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});
