const axios = require('axios');

async function test() {
    try {
        console.log('Testing Auth Service...');
        const user = `user_${Date.now()}`;
        await axios.post('http://localhost:3001/signup', { username: user, password: 'password' });
        console.log('Signup: OK');

        const loginRes = await axios.post('http://localhost:3001/login', { username: user, password: 'password' });
        console.log('Login: OK');
        const token = loginRes.data.token;

        console.log('Testing Post Service...');
        await axios.post('http://localhost:3002/posts', { content: 'Hello World', authorId: user });
        console.log('Create Post: OK');

        const postsRes = await axios.get('http://localhost:3002/posts');
        console.log(`Get Posts: OK (${postsRes.data.length} posts)`);

        console.log('Testing Feed Service...');
        const feedRes = await axios.get('http://localhost:3004/feed');
        console.log(`Get Feed: OK (${feedRes.data.length} items)`);

        console.log('Testing Analytics Service...');
        await axios.post('http://localhost:3005/track', { event: 'TestEvent', data: { foo: 'bar' } });
        console.log('Track Event: OK');

        const statsRes = await axios.get('http://localhost:3005/stats');
        console.log('Get Stats: OK', statsRes.data);

        console.log('ALL TESTS PASSED');
    } catch (error) {
        console.error('TEST FAILED:', error.message);
        if (error.response) console.error(error.response.data);
    }
}

test();
