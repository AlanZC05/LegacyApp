import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import { User, Project, Task } from '../models';

dotenv.config();

/**
 * Script de Seed - Poblar Base de Datos
 * Crea datos iniciales para desarrollo y pruebas
 */

const seedData = async () => {
    try {
        console.log('🌱 Iniciando seed de base de datos...\n');

        // Conectar a MongoDB
        await connectDB();

        // Limpiar datos existentes (¡CUIDADO EN PRODUCCIÓN!)
        console.log('🗑️  Limpiando datos existentes...');
        await User.deleteMany({});
        await Project.deleteMany({});
        await Task.deleteMany({});

        // Crear usuarios
        console.log('👥 Creando usuarios...');
        const users = await User.create([
            {
                username: 'admin',
                password: 'admin123',
                role: 'admin'
            },
            {
                username: 'user1',
                password: 'user123',
                role: 'user'
            },
            {
                username: 'user2',
                password: 'user123',
                role: 'user'
            }
        ]);
        console.log(`✅ ${users.length} usuarios creados`);

        // Crear proyectos
        console.log('📁 Creando proyectos...');
        const projects = await Project.create([
            {
                name: 'Proyecto Demo',
                description: 'Proyecto de demostración inicial'
            },
            {
                name: 'Proyecto Alpha',
                description: 'Proyecto importante de alta prioridad'
            },
            {
                name: 'Proyecto Beta',
                description: 'Proyecto secundario en desarrollo'
            }
        ]);
        console.log(`✅ ${projects.length} proyectos creados`);

        // Crear tareas de ejemplo
        console.log('📝 Creando tareas...');
        const tasks = await Task.create([
            {
                title: 'Configurar entorno de desarrollo',
                description: 'Instalar y configurar todas las herramientas necesarias',
                status: 'Completada',
                priority: 'Alta',
                projectId: projects[0]._id,
                assignedTo: users[1]._id,
                createdBy: users[0]._id,
                estimatedHours: 4,
                actualHours: 3.5
            },
            {
                title: 'Diseñar base de datos',
                description: 'Crear el esquema de la base de datos MongoDB',
                status: 'Completada',
                priority: 'Alta',
                projectId: projects[0]._id,
                assignedTo: users[1]._id,
                createdBy: users[0]._id,
                estimatedHours: 6,
                actualHours: 5
            },
            {
                title: 'Implementar autenticación',
                description: 'Sistema de login con JWT',
                status: 'En Progreso',
                priority: 'Crítica',
                projectId: projects[1]._id,
                assignedTo: users[2]._id,
                createdBy: users[0]._id,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
                estimatedHours: 8
            },
            {
                title: 'Crear componentes React',
                description: 'Desarrollar componentes reutilizables',
                status: 'Pendiente',
                priority: 'Media',
                projectId: projects[1]._id,
                assignedTo: users[1]._id,
                createdBy: users[0]._id,
                estimatedHours: 12
            },
            {
                title: 'Documentar API',
                description: 'Crear documentación completa de endpoints',
                status: 'Pendiente',
                priority: 'Baja',
                projectId: projects[2]._id,
                createdBy: users[0]._id,
                estimatedHours: 4
            }
        ]);
        console.log(`✅ ${tasks.length} tareas creadas\n`);

        console.log('🎉 Seed completado exitosamente!\n');
        console.log('📊 Resumen:');
        console.log(`   - Usuarios: ${users.length}`);
        console.log(`   - Proyectos: ${projects.length}`);
        console.log(`   - Tareas: ${tasks.length}\n`);
        console.log('🔑 Credenciales de prueba:');
        console.log('   - admin / admin123');
        console.log('   - user1 / user123');
        console.log('   - user2 / user123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error en seed:', error);
        process.exit(1);
    }
};

// Ejecutar seed
seedData();
