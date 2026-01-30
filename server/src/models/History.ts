import mongoose, { Document, Schema } from 'mongoose';

/**
 * Enum para tipos de acciones en el historial
 */
export enum HistoryAction {
    CREATED = 'CREATED',
    STATUS_CHANGED = 'STATUS_CHANGED',
    TITLE_CHANGED = 'TITLE_CHANGED',
    UPDATED = 'UPDATED',
    DELETED = 'DELETED',
    COMMENT_ADDED = 'COMMENT_ADDED'
}

/**
 * Interface para el documento History
 */
export interface IHistory extends Document {
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    action: HistoryAction;
    oldValue: string;
    newValue: string;
    timestamp: Date;
}

/**
 * Schema de Historial
 * Mantiene un registro de auditoría de todos los cambios en las tareas
 */
const HistorySchema = new Schema<IHistory>({
    taskId: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: [true, 'El ID de la tarea es requerido']
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El ID del usuario es requerido']
    },
    action: {
        type: String,
        enum: Object.values(HistoryAction),
        required: [true, 'La acción es requerida']
    },
    oldValue: {
        type: String,
        default: ''
    },
    newValue: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Índices para búsquedas por tarea y timestamp
HistorySchema.index({ taskId: 1, timestamp: -1 });
HistorySchema.index({ timestamp: -1 });

export const History = mongoose.model<IHistory>('History', HistorySchema);
