import axios from 'axios';

const api = axios.create({
    // En dev : le proxy Vite redirige /api → Django (voir vite.config.ts)
    // En prod : VITE_API_URL doit pointer vers votre backend Django
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/` : '/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        config.headers = config.headers || {};
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
