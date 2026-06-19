import axios from 'axios';

const isProd = import.meta.env.PROD;

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || (isProd ? 'https://quickquote-pro.onrender.com/api/' : 'http://localhost:8000/api/'),
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
