import axios, {type AxiosInstance} from 'axios';

const API_BASE_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API = `${API_BASE_URL}/api`;

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API,
    timeout: 15000,
});

export default axiosInstance;