import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api"),
    withCredentials: true 
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
