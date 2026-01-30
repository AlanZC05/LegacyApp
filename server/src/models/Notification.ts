import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface para el documento Notification
 */
export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    message: string;
    type: string;
    read: boolean;
    createdAt: Date;
}

/**
 * Schema de Notificación
 * Sistema de notificaciones para usuarios
 */
const NotificationSchema = new Schema<INotification>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El ID del usuario es requerido']
    },
    message: {
        type: String,
        required: [true, 'El mensaje es requerido'],
        trim: true
    },
    type: {
        type: String,
        enum: ['task_assigned', 'task_created', 'task_updated', 'task_completed', 'comment_added', 'export_completed', 'other'],
        default: 'other'
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Índices para búsquedas de notificaciones no leídas por usuario
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
