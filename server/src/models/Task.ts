import mongoose, { Document, Schema } from 'mongoose';

/**
 * Enums para estados y prioridades de tareas
 */
export enum TaskStatus {
    PENDIENTE = 'Pendiente',
    EN_PROGRESO = 'En Progreso',
    COMPLETADA = 'Completada',
    BLOQUEADA = 'Bloqueada',
    CANCELADA = 'Cancelada'
}

export enum TaskPriority {
    BAJA = 'Baja',
    MEDIA = 'Media',
    ALTA = 'Alta',
    CRITICA = 'Crítica'
}

/**
 * Interface para el documento Task
 */
export interface ITask extends Document {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId?: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    dueDate?: Date;
    estimatedHours: number;
    actualHours: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Schema de Tarea
 * Modelo principal del sistema de gestión de tareas
 */
const TaskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: [true, 'El título es requerido'],
        trim: true,
        minlength: [3, 'El título debe tener al menos 3 caracteres']
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: Object.values(TaskStatus),
        default: TaskStatus.PENDIENTE
    },
    priority: {
        type: String,
        enum: Object.values(TaskPriority),
        default: TaskPriority.MEDIA
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project', // Referencia al modelo Project
        default: null
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User
        default: null
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate: {
        type: Date,
        default: null
    },
    estimatedHours: {
        type: Number,
        default: 0,
        min: [0, 'Las horas no pueden ser negativas']
    },
    actualHours: {
        type: Number,
        default: 0,
        min: [0, 'Las horas no pueden ser negativas']
    }
}, {
    timestamps: true
});

// Índices para optimizar búsquedas comunes
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ createdBy: 1 });
TaskSchema.index({ title: 'text', description: 'text' }); // Índice de texto para búsqueda

export const Task = mongoose.model<ITask>('Task', TaskSchema);
