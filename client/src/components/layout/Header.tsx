import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

/**
 * Componente Header
 * Muestra el usuario actual y botón de logout
 */
export const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white border-b border-elegant-blue/30 shadow-md relative z-20">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-black italic">Task Manager</h1>
                    <p className="text-sm text-gray-600">Sistema de Gestión de Tareas</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Usuario:</p>
                        <p className="font-semibold text-gray-800">{user?.username}</p>
                    </div>
                    <Button variant="secondary" onClick={logout}>
                        Cerrar Sesión
                    </Button>
                </div>
            </div>
        </header>
    );
};
