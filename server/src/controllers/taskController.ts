import { Response } from 'express';
import { Task, History, Notification, HistoryAction } from '../models';
import { AuthRequest } from '../middleware/auth';

/**
 * Controlador de Tareas
 * Maneja CRUD completo de tareas con historial y notificaciones
 */

/**
 * @route   GET /api/tasks
 * @desc    Obtener todas las tareas
 * @access  Private
 */
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const tasks = await Task.find()
            .populate('projectId', 'name')
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener tareas'
        });
    }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Obtener una tarea por ID
 * @access  Private
 */
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('projectId', 'name')
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username');

        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
            return;
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error al obtener tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener tarea'
        });
    }
};

/**
 * @route   POST /api/tasks
 * @desc    Crear nueva tarea
 * @access  Private
 */
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const taskData = {
            ...req.body,
            createdBy: req.user?._id
        };

        const task = await Task.create(taskData);

        // Registrar en historial
        await History.create({
            taskId: task._id,
            userId: req.user?._id,
            action: HistoryAction.CREATED,
            oldValue: '',
            newValue: task.title
        });

        // Crear notificaciones (aseguradas con try/catch)
        try {
            // 1. Notificar al creador (Confirmación visual)
            await Notification.create({
                userId: req.user?._id,
                message: `Has creado la tarea: ${task.title}`,
                type: 'task_created'
            });

            // 2. Notificar al asignado (si es diferente al creador)
            if (task.assignedTo && task.assignedTo.toString() !== req.user?._id.toString()) {
                await Notification.create({
                    userId: task.assignedTo,
                    message: `Nueva tarea asignada: ${task.title}`,
                    type: 'task_assigned'
                });
            }
        } catch (notifError) {
            console.error('Error al crear notificaciones de tarea:', notifError);
        }

        const populatedTask = await Task.findById(task._id)
            .populate('projectId', 'name')
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username');

        res.status(201).json({
            success: true,
            data: populatedTask
        });
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear tarea'
        });
    }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Actualizar tarea
 * @access  Private
 */
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const oldTask = await Task.findById(req.params.id);

        if (!oldTask) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
            return;
        }

        // Actualizar tarea
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('projectId', 'name')
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username');

        // Registrar cambios en historial
        if (oldTask.status !== task?.status) {
            await History.create({
                taskId: task?._id,
                userId: req.user?._id,
                action: HistoryAction.STATUS_CHANGED,
                oldValue: oldTask.status,
                newValue: task?.status
            });
        }

        if (oldTask.title !== task?.title) {
            await History.create({
                taskId: task?._id,
                userId: req.user?._id,
                action: HistoryAction.TITLE_CHANGED,
                oldValue: oldTask.title,
                newValue: task?.title
            });
        }

        // Crear notificación si está asignada
        // Crear notificaciones de actualización
        try {
            // 1. Notificar al usuario actual que realizó la acción
            await Notification.create({
                userId: req.user?._id,
                message: `Has actualizado la tarea: ${task?.title}`,
                type: 'task_updated'
            });

            // 2. Notificar al asignado si es diferente al usuario actual
            if (task?.assignedTo && task.assignedTo.toString() !== req.user?._id.toString()) {
                await Notification.create({
                    userId: task.assignedTo,
                    message: `Tarea actualizada: ${task.title}`,
                    type: 'task_updated'
                });
            }
        } catch (notifError) {
            console.error('Error al crear notificaciones de actualización:', notifError);
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar tarea'
        });
    }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Eliminar tarea
 * @access  Private
 */
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
            return;
        }

        // Registrar en historial
        await History.create({
            taskId: task._id,
            userId: req.user?._id,
            action: HistoryAction.DELETED,
            oldValue: task.title,
            newValue: ''
        });

        await Task.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Tarea eliminada correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar tarea'
        });
    }
};

/**
 * @route   GET /api/tasks/stats
 * @desc    Obtener estadísticas de tareas
 * @access  Private
 */
export const getTaskStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const tasks = await Task.find();
        const now = new Date();

        const stats = {
            total: tasks.length,
            completed: tasks.filter(t => t.status === 'Completada').length,
            pending: tasks.filter(t => t.status !== 'Completada').length,
            highPriority: tasks.filter(t => t.priority === 'Alta' || t.priority === 'Crítica').length,
            overdue: tasks.filter(t =>
                t.dueDate &&
                t.status !== 'Completada' &&
                new Date(t.dueDate) < now
            ).length
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas'
        });
    }
};
