import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface para el documento Project
 */
export interface IProject extends Document {
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Schema de Proyecto
 * Representa un proyecto al cual se pueden asignar tareas
 */
const ProjectSchema = new Schema<IProject>({
    name: {
        type: String,
        required: [true, 'El nombre del proyecto es requerido'],
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres']
    },
    description: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índice para búsquedas por nombre
ProjectSchema.index({ name: 1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
