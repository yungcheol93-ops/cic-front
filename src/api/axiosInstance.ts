import axios from 'axios';
import {getToken} from "./auth.api.ts";

const API_BASE_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API = `${API_BASE_URL}/api`;

const api = axios.create({
    baseURL: API,
    timeout: 15000,
});

api.interceptors.request.use((config) => {
    const token = getToken();
    console.log(token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;