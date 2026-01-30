/**
 * Definición de tipos TypeScript para la aplicación
 */

// Enums
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

export enum HistoryAction {
    CREATED = 'CREATED',
    STATUS_CHANGED = 'STATUS_CHANGED',
    TITLE_CHANGED = 'TITLE_CHANGED',
    UPDATED = 'UPDATED',
    DELETED = 'DELETED'
}

// Interfaces
export interface User {
    _id: string;
    username: string;
    role: string;
    createdAt: string;
}

export interface Project {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId?: Project | string;
    assignedTo?: User | string;
    createdBy: User | string;
    dueDate?: string;
    estimatedHours: number;
    actualHours: number;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    _id: string;
    taskId: string;
    userId: User | string;
    commentText: string;
    createdAt: string;
}

export interface History {
    _id: string;
    taskId: Task | string;
    userId: User | string;
    action: HistoryAction;
    oldValue: string;
    newValue: string;
    timestamp: string;
}

export interface Notification {
    _id: string;
    userId: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
    overdue: number;
}

// DTOs para formularios
export interface LoginDTO {
    username: string;
    password: string;
}

export interface TaskFormDTO {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId?: string;
    assignedTo?: string;
    dueDate?: string;
    estimatedHours?: number;
}

export interface ProyectFormDTO {
    name: string;
    description?: string;
}

export interface CommentFormDTO {
    taskId: string;
    commentText: string;
}

// Responses de API
export interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
}

export interface AuthResponse {
    token: string;
    user: User;
}
