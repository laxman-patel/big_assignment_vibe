const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = 3005;

app.use(cors());
app.use(bodyParser.json());

// Initialize DB
pool.query(`
  CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    data JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('Error creating analytics_events table', err));

app.post('/track', async (req, res) => {
    const { event, data, timestamp } = req.body;
    if (!event) {
        return res.status(400).json({ message: 'Event name required' });
    }

    try {
        await pool.query(
            'INSERT INTO analytics_events (event_type, data, timestamp) VALUES ($1, $2, $3)',
            [event, data || {}, timestamp ? new Date(timestamp) : new Date()]
        );
        console.log(`[Analytics] Tracked: ${event}`, data);
        res.status(201).json({ message: 'Event tracked' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/stats', async (req, res) => {
    try {
        const result = await pool.query('SELECT event_type, COUNT(*) as count FROM analytics_events GROUP BY event_type');

        const stats = {};
        let totalEvents = 0;

        result.rows.forEach(row => {
            stats[row.event_type] = parseInt(row.count);
            totalEvents += parseInt(row.count);
        });

        res.json({
            totalEvents,
            breakdown: stats
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Analytics Service running on port ${PORT}`);
});
