import api from './api';
import { Comment, CommentFormDTO, Notification, History, APIResponse } from '../types';

/**
 * Servicios adicionales: Comentarios, Notificaciones, Historial, Búsqueda, Reportes
 */

// Servicio de Comentarios
export const commentService = {
    getCommentsByTask: async (taskId: string): Promise<Comment[]> => {
        const response = await api.get<APIResponse<Comment[]>>(`/comments/task/${taskId}`);
        return response.data.data || [];
    },

    createComment: async (commentData: CommentFormDTO): Promise<Comment> => {
        const response = await api.post<APIResponse<Comment>>('/comments', commentData);
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error('Error al crear comentario');
    }
};

// Servicio de Notificaciones
export const notificationService = {
    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get<APIResponse<Notification[]>>('/notifications');
        return response.data.data || [];
    },

    markAsRead: async (): Promise<void> => {
        await api.put('/notifications/read');
    }
};

// Servicio de Historial
export const historyService = {
    getHistoryByTask: async (taskId: string): Promise<History[]> => {
        const response = await api.get<APIResponse<History[]>>(`/history/task/${taskId}`);
        return response.data.data || [];
    },

    getAllHistory: async (): Promise<History[]> => {
        const response = await api.get<APIResponse<History[]>>('/history/all');
        return response.data.data || [];
    }
};

// Servicio de Búsqueda
export const searchService = {
    searchTasks: async (params: {
        text?: string;
        status?: string;
        priority?: string;
        projectId?: string;
    }): Promise<any[]> => {
        const response = await api.get('/search', { params });
        return response.data.data || [];
    }
};

// Servicio de Reportes
export const reportService = {
    generateTaskReport: async (): Promise<any> => {
        const response = await api.get('/reports/tasks');
        return response.data.data;
    },

    generateProjectReport: async (): Promise<any> => {
        const response = await api.get('/reports/projects');
        return response.data.data;
    },

    generateUserReport: async (): Promise<any> => {
        const response = await api.get('/reports/users');
        return response.data.data;
    },

    exportCSV: async (): Promise<void> => {
        const response = await api.get('/reports/export-csv', {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tareas.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};
