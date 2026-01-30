import { Response } from 'express';
import { Comment } from '../models';
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
