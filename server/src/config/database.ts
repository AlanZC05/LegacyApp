import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node.js DNS resolution issues with MongoDB Atlas SRV records
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS
} catch (error) {
    console.warn('Failed to set custom DNS servers:', error);
}

/**
 * Configuración y conexión a MongoDB Atlas
 * Este módulo maneja la conexión a la base de datos usando Mongoose
 */
export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error('MONGODB_URI no está definida en las variables de entorno');
        }

        // Configuración de opciones de conexión
        const options = {
            // Opciones modernas de conexión
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        // Conectar a MongoDB
        const conn = await mongoose.connect(mongoURI, options);

        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);

        // Listeners para eventos de conexión
        mongoose.connection.on('error', (error) => {
            console.error('❌ Error de MongoDB:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB desconectado');
        });

    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1); // Salir si no se puede conectar a la BD
    }
};
