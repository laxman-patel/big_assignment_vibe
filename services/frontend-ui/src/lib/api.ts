import axios from 'axios';

// In a real environment, these would be environment variables.
// For local dev with separate ports:
const AUTH_API_URL = '/api/auth';
const POST_API_URL = '/api/posts';

export const authApi = axios.create({
    baseURL: AUTH_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const postApi = axios.create({
    baseURL: POST_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to add token to requests
postApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
