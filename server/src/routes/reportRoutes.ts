import { Router } from 'express';
import {
    generateTaskReport,
    generateProjectReport,
    generateUserReport,
    exportCSV
} from '../controllers/reportController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Rutas de Reportes
 * /api/reports
 */

router.use(authMiddleware);

// @route   GET /api/reports/tasks
router.get('/tasks', generateTaskReport);

// @route   GET /api/reports/projects
router.get('/projects', generateProjectReport);

// @route   GET /api/reports/users
router.get('/users', generateUserReport);

// @route   GET /api/reports/export-csv
router.get('/export-csv', exportCSV);

export default router;
