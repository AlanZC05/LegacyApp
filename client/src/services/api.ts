import axios, { AxiosInstance } from 'axios';

/**
 * Configuración centralizada de Axios
 * - Base URL de la API
 * - Interceptores para JWT
 * - Manejo de errores global
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor de request: Agregar token JWT si existe
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de response: Manejar errores de autenticación
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token inválido o expirado
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
