import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

// Cargar variables de entorno
dotenv.config();

/**
 * Servidor Express Principal
 * Configuración y arranque del backend
 */

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Parsear JSON en el body
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api', routes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'Task Manager API - MERN Stack' });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

/**
 * Iniciar servidor
 */
const startServer = async () => {
    try {
        // Conectar a MongoDB
        await connectDB();

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📡 API disponible en http://localhost:${PORT}/api`);
            console.log(`🏠 Health check: http://localhost:${PORT}/\n`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Iniciar el servidor
startServer();

export default app;
