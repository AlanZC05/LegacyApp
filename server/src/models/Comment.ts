import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface para el documento Comment
 */
export interface IComment extends Document {
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    commentText: string;
    createdAt: Date;
}

/**
 * Schema de Comentario
 * Permite agregar comentarios a las tareas
 */
const CommentSchema = new Schema<IComment>({
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
    commentText: {
        type: String,
        required: [true, 'El texto del comentario es requerido'],
        trim: true,
        minlength: [1, 'El comentario no puede estar vacío']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Índices para búsquedas por tarea
CommentSchema.index({ taskId: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
