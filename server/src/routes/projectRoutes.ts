import { Router } from 'express';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} from '../controllers/projectController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Rutas de Proyectos
 * /api/projects
 * Todas las rutas requieren autenticación
 */

router.use(authMiddleware);

// @route   GET /api/projects
router.get('/', getProjects);

// @route   GET /api/projects/:id
router.get('/:id', getProjectById);

// @route   POST /api/projects
router.post('/', createProject);

// @route   PUT /api/projects/:id
router.put('/:id', updateProject);

// @route   DELETE /api/projects/:id
router.delete('/:id', deleteProject);

export default router;
