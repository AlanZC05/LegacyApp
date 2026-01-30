import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models';

/**
 * Extensión de la interfaz Request para agregar el usuario autenticado
 */
export interface AuthRequest extends Request {
    user?: IUser;
}

/**
 * Middleware de autenticación
 * Verifica el token JWT y adjunta el usuario a la petición
 */
export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'No se proporcionó token de autenticación'
            });
            return;
        }

        // Extraer el token (formato: "Bearer TOKEN")
        const token = authHeader.substring(7);

        // Verificar el token
        const secret = process.env.JWT_SECRET || 'secret';
        const decoded = jwt.verify(token, secret) as { id: string };

        // Buscar el usuario en la base de datos
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        // Adjuntar el usuario a la petición
        req.user = user;
        next();

    } catch (error) {
        console.error('Error en autenticación:', error);
        res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};
