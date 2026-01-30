import api from './api';

export const reportService = {
    getTaskStats: async (): Promise<any> => {
        const response = await api.get('/reports/tasks');
        return response.data.data;
    },

    getProjectStats: async (): Promise<any> => {
        const response = await api.get('/reports/projects');
        return response.data.data;
    },

    getUserStats: async (): Promise<any> => {
        const response = await api.get('/reports/users');
        return response.data.data;
    },

    exportCSV: async (): Promise<void> => {
        const response = await api.get('/reports/export-csv', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tareas.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};
