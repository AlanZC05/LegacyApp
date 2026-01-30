import { Response } from 'express';
import { Task } from '../models';
import { AuthRequest } from '../middleware/auth';

/**
 * Controlador de Búsqueda
 * Maneja búsqueda avanzada de tareas
 */

/**
 * @route   GET /api/search
 * @desc    Buscar tareas con filtros
 * @access  Private
 * @query   text, status, priority, projectId
 */
export const searchTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { text, status, priority, projectId } = req.query;

        // Construir query de búsqueda
        const query: any = {};

        // Búsqueda por texto en título y descripción
        if (text) {
            query.$or = [
                { title: { $regex: text, $options: 'i' } },
                { description: { $regex: text, $options: 'i' } }
            ];
        }

        // Filtrar por estado
        if (status) {
            query.status = status;
        }

        // Filtrar por prioridad
        if (priority) {
            query.priority = priority;
        }

        // Filtrar por proyecto
        if (projectId && projectId !== '0') {
            query.projectId = projectId;
        }

        const tasks = await Task.find(query)
            .populate('projectId', 'name')
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error('Error en búsqueda:', error);
        res.status(500).json({
            success: false,
            message: 'Error en búsqueda'
        });
    }
};
