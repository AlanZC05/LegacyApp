import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de manejo de errores global
 * Captura todos los errores y los formatea de manera consistente
 */
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Log del error en la consola
    console.error('❌ Error:', err);

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e: any) => e.message);
        res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: messages
        });
        return;
    }

    // Error de cast de Mongoose (ID inválido)
    if (err.name === 'CastError') {
        res.status(400).json({
            success: false,
            message: 'ID no válido'
        });
        return;
    }

    // Error de duplicado (clave única)
    if (err.code === 11000) {
        res.status(400).json({
            success: false,
            message: 'Ya existe un registro con esos datos'
        });
        return;
    }

    // Error genérico
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
