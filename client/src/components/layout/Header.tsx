import React from 'react';
import { Link } from 'react-router-dom';
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
                    <Link
                        to="/notifications"
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-elegant-burgundy transition-colors relative"
                        title="Notificaciones"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                    </Link>

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
