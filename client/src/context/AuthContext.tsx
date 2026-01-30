import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

/**
 * Context de Autenticación
 * Maneja el estado global de autenticación de la aplicación
 */

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider del contexto de autenticación
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Verificar autenticación al cargar la app
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            if (authService.isAuthenticated()) {
                const storedUser = authService.getStoredUser();
                if (storedUser) {
                    setUser(storedUser);
                } else {
                    // Obtener usuario del servidor
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                }
            }
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            authService.logout();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        setLoading(true);
        try {
            const response = await authService.login({ username, password });
            setUser(response.user);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        checkAuth
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};
