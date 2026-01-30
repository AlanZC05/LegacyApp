import { Response } from 'express';
import { Notification } from '../models';
import { AuthRequest } from '../middleware/auth';

/**
 * Controlador de Notificaciones
 * Maneja las notificaciones de usuario
 */

/**
 * @route   GET /api/notifications
 * @desc    Obtener notificaciones del usuario autenticado
 * @access  Private
 */
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const notifications = await Notification.find({
            userId: req.user?._id
        })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener notificaciones'
        });
    }
};

/**
 * @route   PUT /api/notifications/read
 * @desc    Marcar todas las notificaciones como leídas
 * @access  Private
 */
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await Notification.updateMany(
            { userId: req.user?._id, read: false },
            { read: true }
        );

        res.json({
            success: true,
            message: 'Notificaciones marcadas como leídas'
        });
    } catch (error) {
        console.error('Error al marcar notificaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al marcar notificaciones'
        });
    }
};
