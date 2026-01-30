import api from './api';
import { Project, ProyectFormDTO, APIResponse } from '../types';

/**
 * Servicio de Proyectos
 */

export const projectService = {
    getProjects: async (): Promise<Project[]> => {
        const response = await api.get<APIResponse<Project[]>>('/projects');
        return response.data.data || [];
    },

    getProjectById: async (id: string): Promise<Project> => {
        const response = await api.get<APIResponse<Project>>(`/projects/${id}`);
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error('Proyecto no encontrado');
    },

    createProject: async (projectData: ProyectFormDTO): Promise<Project> => {
        const response = await api.post<APIResponse<Project>>('/projects', projectData);
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error('Error al crear proyecto');
    },

    updateProject: async (id: string, projectData: Partial<ProyectFormDTO>): Promise<Project> => {
        const response = await api.put<APIResponse<Project>>(`/projects/${id}`, projectData);
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error('Error al actualizar proyecto');
    },

    deleteProject: async (id: string): Promise<void> => {
        await api.delete(`/projects/${id}`);
    }
};
