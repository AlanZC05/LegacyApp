import { Response } from 'express';
import { Project } from '../models';
import { AuthRequest } from '../middleware/auth';

/**
 * Controlador de Proyectos
 * Maneja CRUD de proyectos
 */

/**
 * @route   GET /api/projects
 * @desc    Obtener todos los proyectos
 * @access  Private
 */
export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const projects = await Project.find().sort({ name: 1 });

        res.json({
            success: true,
            data: projects
        });
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener proyectos'
        });
    }
};

/**
 * @route   GET /api/projects/:id
 * @desc    Obtener un proyecto por ID
 * @access  Private
 */
export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
            return;
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Error al obtener proyecto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener proyecto'
        });
    }
};

/**
 * @route   POST /api/projects
 * @desc    Crear nuevo proyecto
 * @access  Private
 */
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const project = await Project.create(req.body);

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Error al crear proyecto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear proyecto'
        });
    }
};

/**
 * @route   PUT /api/projects/:id
 * @desc    Actualizar proyecto
 * @access  Private
 */
export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
            return;
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar proyecto'
        });
    }
};

/**
 * @route   DELETE /api/projects/:id
 * @desc    Eliminar proyecto
 * @access  Private
 */
export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Proyecto eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar proyecto'
        });
    }
};
