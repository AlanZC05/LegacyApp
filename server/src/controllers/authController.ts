import { Request, Response } from 'express';
import { User } from '../models';
import { AuthRequest } from '../middleware/auth';

/**
 * Controlador de Autenticación
 * Maneja login, registro y obtención del usuario actual
 */

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión y obtener token JWT
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Validar que se enviaron los datos
        if (!username || !password) {
            res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos'
            });
            return;
        }

        // Buscar el usuario
        const user = await User.findOne({ username });

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
            return;
        }

        // Verificar la contraseña
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
            return;
        }

        // Generar token
        const token = user.generateToken();

        // Responder con el token y datos del usuario
        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión'
        });
    }
};

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario (opcional)
 * @access  Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, role } = req.body;

        // Validar datos
        if (!username || !password) {
            res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos'
            });
            return;
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'El usuario ya existe'
            });
            return;
        }

        // Crear nuevo usuario
        const user = await User.create({
            username,
            password,
            role: role || 'user'
        });

        // Generar token
        const token = user.generateToken();

        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario'
        });
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Obtener usuario autenticado actual
 * @access  Private
 */
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        res.json({
            success: true,
            data: {
                user: {
                    id: req.user?._id,
                    username: req.user?.username,
                    role: req.user?.role
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario'
        });
    }
};
