import api from './api';
import { History } from '../types';

export const historyService = {
    getAllHistory: async (): Promise<History[]> => {
        const response = await api.get('/history/all');
        return response.data.data;
    },

    getHistoryByTask: async (taskId: string): Promise<History[]> => {
        const response = await api.get(`/history/task/${taskId}`);
        return response.data.data;
    }
};
