import { Response } from 'express';
import { Comment, Notification, Task, History, HistoryAction } from '../models';
import { AuthRequest } from '../middleware/auth';

/**
 * Controlador de Comentarios
 * Maneja comentarios de tareas
 */

/**
 * @route   GET /api/comments/task/:taskId
 * @desc    Obtener comentarios de una tarea
 * @access  Private
 */
export const getCommentsByTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const comments = await Comment.find({ taskId: req.params.taskId })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: comments
        });
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener comentarios'
        });
    }
};

/**
 * @route   POST /api/comments
 * @desc    Crear nuevo comentario
 * @access  Private
 */
export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const commentData = {
            ...req.body,
            userId: req.user?._id
        };

        const comment = await Comment.create(commentData);

        // Notificar al asignado de la tarea (siempre, para feedback inmediato)
        try {
            const task = await Task.findById(commentData.taskId);
            if (task && task.assignedTo) {
                console.log('Creando notificación para:', task.assignedTo, 'Tipo: comment_added');
                await Notification.create({
                    userId: task.assignedTo,
                    message: `Nuevo comentario en: ${task.title}`,
                    type: 'comment_added'
                });
            } else {
                console.log('No se creó notificación: Tarea no encontrada o sin asignado', commentData.taskId);
            }
        } catch (notifError) {
            console.error('Error al crear notificación de comentario:', notifError);
        }

        // Registrar en historial
        await History.create({
            taskId: commentData.taskId,
            userId: req.user?._id,
            action: HistoryAction.COMMENT_ADDED,
            oldValue: '',
            newValue: 'Nuevo comentario'
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate('userId', 'username');

        res.status(201).json({
            success: true,
            data: populatedComment
        });
    } catch (error) {
        console.error('Error al crear comentario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear comentario'
        });
    }
};
