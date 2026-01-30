import { Router } from 'express';
import { login, register, getCurrentUser } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Rutas de Autenticación
 * /api/auth
 */

// @route   POST /api/auth/login
router.post('/login', login);

// @route   POST /api/auth/register
router.post('/register', register);

// @route   GET /api/auth/me (protegida)
router.get('/me', authMiddleware, getCurrentUser);

export default router;
