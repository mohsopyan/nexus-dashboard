import axios from 'axios';

// Ambil Base URL dari .env
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor: Setiap Dashboard kirim request, otomatis cek apakah ada Token JWT di Cookies/LocalStorage

apiClient.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;