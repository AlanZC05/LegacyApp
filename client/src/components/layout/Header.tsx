import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { notificationService } from '../../services/notificationService';
import { Notification } from '../../types';

/**
 * Componente Header
 * Muestra el usuario actual, botón de logout y notificaciones
 */
export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    const loadNotifications = async () => {
        try {
            // setLoading(true); // Evitar loading parpadeante en polling
            const data = await notificationService.getNotifications();
            // console.log('Notificaciones cargadas:', data.length);
            setNotifications(data);
        } catch (error) {
            console.error('Error al cargar notificaciones', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleNotifications = () => {
        if (!showNotifications) {
            loadNotifications();
        }
        setShowNotifications(!showNotifications);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    // Cargar notificaciones y polling
    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 3000); // Polling cada 3s para prueba
        return () => clearInterval(interval);
    }, []);

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white border-b border-elegant-blue/30 shadow-md relative z-20">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-black italic">Task Manager</h1>
                    <p className="text-sm text-gray-600">Sistema de Gestión de Tareas</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={toggleNotifications}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-elegant-burgundy transition-colors relative focus:outline-none"
                            title="Notificaciones"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white transform translate-x-1/4 -translate-y-1/4"></span>
                            )}
                        </button>

                        {/* Dropdown de Notificaciones */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                                <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-700">Notificaciones</h3>
                                    {unreadCount > 0 && (
                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unreadCount} nuevas</span>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {loading ? (
                                        <div className="p-4 text-center text-gray-500">Cargando...</div>
                                    ) : notifications.length === 0 ? (
                                        <div className="p-6 text-center text-gray-400">
                                            <p>No tienes notificaciones</p>
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-50">
                                            {notifications.map((notif) => (
                                                <li key={notif._id} className={`p-4 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                                                    <p className="text-sm text-gray-800">{notif.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="p-2 border-t border-gray-100 text-center bg-gray-50">
                                    <button onClick={() => notificationService.markAsRead().then(loadNotifications)} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                                        Marcar todas como leídas
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-right hidden md:block">
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
