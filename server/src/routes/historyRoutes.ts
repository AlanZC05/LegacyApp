import { Router } from 'express';
import { getHistoryByTask, getAllHistory } from '../controllers/historyController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Rutas de Historial
 * /api/history
 */

router.use(authMiddleware);

// @route   GET /api/history/task/:taskId
router.get('/task/:taskId', getHistoryByTask);

// @route   GET /api/history/all
router.get('/all', getAllHistory);

export default router;
