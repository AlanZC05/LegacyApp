import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Componente Navigation
 * Tabs de navegación para las diferentes secciones
 */

const navItems = [
    { path: '/', label: 'Tareas' },
    { path: '/projects', label: 'Proyectos' },
    { path: '/comments', label: 'Comentarios' },
    { path: '/history', label: 'Historial' },
    { path: '/notifications', label: 'Notificaciones' },
    { path: '/search', label: 'Búsqueda' },
    { path: '/reports', label: 'Reportes' }
];

export const Navigation: React.FC = () => {
    const location = useLocation();

    return (
        <nav className="bg-elegant-cream border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex justify-center space-x-1 overflow-x-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${isActive
                                    ? 'border-elegant-blue text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-elegant-blue/50'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};
