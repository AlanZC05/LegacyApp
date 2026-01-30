import { Router } from 'express';
import authRoutes from './authRoutes';
import taskRoutes from './taskRoutes';
import projectRoutes from './projectRoutes';
import commentRoutes from './commentRoutes';
import historyRoutes from './historyRoutes';
import notificationRoutes from './notificationRoutes';
import searchRoutes from './searchRoutes';
import reportRoutes from './reportRoutes';

const router = Router();

/**
 * Enrutador principal
 * Monta todas las rutas de la API
 */

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/projects', projectRoutes);
router.use('/comments', commentRoutes);
router.use('/history', historyRoutes);
router.use('/notifications', notificationRoutes);
router.use('/search', searchRoutes);
router.use('/reports', reportRoutes);

export default router;
