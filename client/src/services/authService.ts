import api from './api';
import { LoginDTO, APIResponse, AuthResponse, User } from '../types';

/**
 * Servicio de Autenticación
 * Maneja login, registro y obtención del usuario actual
 */

export const authService = {
    /**
     * Iniciar sesión
     */
    login: async (credentials: LoginDTO): Promise<AuthResponse> => {
        const response = await api.post<APIResponse<AuthResponse>>('/auth/login', credentials);
        if (response.data.data) {
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            return response.data.data;
        }
        throw new Error('Error en login');
    },

    /**
     * Registrar nuevo usuario
     */
    register: async (userData: LoginDTO & { role?: string }): Promise<AuthResponse> => {
        const response = await api.post<APIResponse<AuthResponse>>('/auth/register', userData);
        if (response.data.data) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            return response.data.data;
        }
        throw new Error('Error en registro');
    },

    /**
     * Obtener usuario actual autenticado
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<APIResponse<{ user: User }>>('/auth/me');
        if (response.data.data) {
            return response.data.data.user;
        }
        throw new Error('Error al obtener usuario');
    },

    /**
     * Cerrar sesión
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Verificar si hay un usuario autenticado
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    /**
     * Obtener usuario del localStorage
     */
    getStoredUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};
