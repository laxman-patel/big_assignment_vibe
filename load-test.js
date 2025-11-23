import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp up to 20 users
        { duration: '1m', target: 20 },  // Stay at 20 users
        { duration: '30s', target: 0 },  // Ramp down
    ],
};

export default function () {
    const url = 'http://localhost:80/click'; // Replace with actual Ingest Service URL
    const payload = JSON.stringify({
        productId: 'prod-' + Math.floor(Math.random() * 100),
        userId: 'user-' + Math.floor(Math.random() * 1000),
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    http.post(url, payload, params);
    sleep(1);
}
