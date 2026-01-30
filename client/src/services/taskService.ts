import api from './api';
import { Task, TaskFormDTO, TaskStats, APIResponse } from '../types';

/**
 * Servicio de Tareas
 * Maneja todas las operaciones CRUD de tareas
 */

export const taskService = {
    /**
     * Obtener todas las tareas
     */
    getTasks: async (): Promise<Task[]> => {
        const response = await api.get<APIResponse<Task[]>>('/tasks');
        return response.data.data || [];
    },

    /**
     * Obtener una tarea por ID
     */
    getTaskById: async (id: string): Promise<Task> => {
        const response = await api.get<APIResponse<Task>>(`/tasks/${id}`);
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error('Tarea no encontrada');
    },

    /**
     * Crear nueva tarea
     */
    createTask: async (taskData: TaskFormDTO): Promise<Task> => {
        const response = await api.post<APIResponse<Task>>('/tasks', taskData);
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error('Error al crear tarea');
    },

    /**
     * Actualizar tarea
     */
    updateTask: async (id: string, taskData: Partial<TaskFormDTO>): Promise<Task> => {
        const response = await api.put<APIResponse<Task>>(`/tasks/${id}`, taskData);
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error('Error al actualizar tarea');
    },

    /**
     * Eliminar tarea
     */
    deleteTask: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },

    /**
     * Obtener estadísticas de tareas
     */
    getStats: async (): Promise<TaskStats> => {
        const response = await api.get<APIResponse<TaskStats>>('/tasks/stats');
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error('Error al obtener estadísticas');
    }
};
