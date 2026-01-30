import api from './api';
import { Task } from '../types';

interface SearchParams {
    text?: string;
    status?: string;
    priority?: string;
    projectId?: string;
}

export const searchService = {
    searchTasks: async (params: SearchParams): Promise<Task[]> => {
        const response = await api.get('/search', { params });
        return response.data.data;
    }
};
