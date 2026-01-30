import { Response } from 'express';
import { History } from '../models';
import { AuthRequest } from '../middleware/auth';

/**
 * Controlador de Historial
 * Maneja consultas del historial de cambios
 */

/**
 * @route   GET /api/history/task/:taskId
 * @desc    Obtener historial de una tarea específica
 * @access  Private
 */
export const getHistoryByTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const history = await History.find({ taskId: req.params.taskId })
            .populate('userId', 'username')
            .sort({ timestamp: -1 });

        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial'
        });
    }
};

/**
 * @route   GET /api/history/all
 * @desc    Obtener todo el historial (últimos 100 registros)
 * @access  Private
 */
export const getAllHistory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const history = await History.find()
            .populate('userId', 'username')
            .populate('taskId', 'title')
            .sort({ timestamp: -1 })
            .limit(100);

        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial'
        });
    }
};
