import api from './api';
import { Notification } from '../types';

export const notificationService = {
    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get('/notifications');
        return response.data.data;
    },

    markAsRead: async (): Promise<void> => {
        await api.put('/notifications/read');
    }
};
