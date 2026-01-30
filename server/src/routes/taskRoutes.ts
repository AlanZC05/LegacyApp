import { Router } from 'express';
import {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats
} from '../controllers/taskController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Rutas de Tareas
 * /api/tasks
 * Todas las rutas requieren autenticación
 */

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// @route   GET /api/tasks/stats
router.get('/stats', getTaskStats);

// @route   GET /api/tasks
router.get('/', getTasks);

// @route   GET /api/tasks/:id
router.get('/:id', getTaskById);

// @route   POST /api/tasks
router.post('/', createTask);

// @route   PUT /api/tasks/:id
router.put('/:id', updateTask);

// @route   DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

export default router;
