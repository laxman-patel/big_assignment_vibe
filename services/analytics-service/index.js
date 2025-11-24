const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3005;

app.use(cors());
app.use(bodyParser.json());

// In-memory analytics store
const events = [];

app.post('/track', (req, res) => {
    const { event, data, timestamp } = req.body;
    if (!event) {
        return res.status(400).json({ message: 'Event name required' });
    }

    const newEvent = {
        event,
        data,
        timestamp: timestamp || Date.now()
    };
    events.push(newEvent);
    console.log(`[Analytics] Tracked: ${event}`, data);
    res.status(201).json({ message: 'Event tracked' });
});

app.get('/stats', (req, res) => {
    // Simple aggregation: count by event type
    const stats = events.reduce((acc, curr) => {
        acc[curr.event] = (acc[curr.event] || 0) + 1;
        return acc;
    }, {});

    res.json({
        totalEvents: events.length,
        breakdown: stats
    });
});

app.listen(PORT, () => {
    console.log(`Analytics Service running on port ${PORT}`);
});
