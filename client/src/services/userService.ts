import api from './api';
import { User } from '../types';

export const userService = {
    /**
     * Obtener todos los usuarios
     */
    getUsers: async (): Promise<User[]> => {
        const response = await api.get('/auth/users');
        return response.data.data;
    }
};
