import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Interface para el documento User en TypeScript
 * Define la estructura de un usuario con sus métodos
 */
export interface IUser extends Document {
    username: string;
    password: string;
    role: string;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateToken(): string;
}

/**
 * Schema de Usuario para MongoDB
 * Incluye validación, hashing de contraseñas y métodos de autenticación
 */
const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'El nombre de usuario es requerido'],
        unique: true,
        trim: true,
        minlength: [3, 'El usuario debe tener al menos 3 caracteres']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Hook pre-save: Hashea la contraseña antes de guardar
 * Solo se ejecuta si la contraseña fue modificada
 */
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

/**
 * Método para comparar contraseñas
 * Compara la contraseña en texto plano con el hash almacenado
 */
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Método para generar JWT
 * Genera un token de autenticación válido por 7 días
 */
UserSchema.methods.generateToken = function (): string {
    const payload = {
        id: this._id,
        username: this.username,
        role: this.role
    };

    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const User = mongoose.model<IUser>('User', UserSchema);
