import { Router } from 'express';
import { getCommentsByTask, createComment } from '../controllers/commentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Rutas de Comentarios
 * /api/comments
 */

router.use(authMiddleware);

// @route   GET /api/comments/task/:taskId
router.get('/task/:taskId', getCommentsByTask);

// @route   POST /api/comments
router.post('/', createComment);

export default router;
