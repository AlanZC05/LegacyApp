import React, { useEffect, useState } from 'react';
import { notificationService } from '../services';
import { Notification } from '../types';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

/**
 * Página de Notificaciones
 */
export const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (_) {
            alert('Error al cargar notificaciones');
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleMarkAsRead = async () => {
        try {
            await notificationService.markAsRead();
            alert('Notificaciones marcadas como leídas');
            await loadNotifications();
        } catch (_) {
            alert('Error al marcar notificaciones');
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <div className="container mx-auto px-4 py-8">
                <Card title="🔔 Notificaciones">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">
                            {unreadCount > 0 ? `${unreadCount} notificación(es) sin leer` : 'No hay notificaciones nuevas'}
                        </p>
                        {unreadCount > 0 && (
                            <Button variant="primary" onClick={handleMarkAsRead}>
                                Marcar todas como leídas
                            </Button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {notifications.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No hay notificaciones</p>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border rounded-lg ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{notification.message}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                                Nueva
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};
