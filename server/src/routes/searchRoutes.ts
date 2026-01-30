import { Router } from 'express';
import { searchTasks } from '../controllers/searchController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Rutas de Búsqueda
 * /api/search
 */

router.use(authMiddleware);

// @route   GET /api/search
router.get('/', searchTasks);

export default router;
