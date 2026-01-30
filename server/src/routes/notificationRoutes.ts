import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Rutas de Notificaciones
 * /api/notifications
 */

router.use(authMiddleware);

// @route   GET /api/notifications
router.get('/', getNotifications);

// @route   PUT /api/notifications/read
router.put('/read', markAsRead);

export default router;
