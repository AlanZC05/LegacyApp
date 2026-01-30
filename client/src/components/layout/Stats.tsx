import React, { useEffect, useState } from 'react';
import { taskService } from '../../services/taskService';
import { TaskStats as TaskStatsType } from '../../types';

/**
 * Componente Stats
 * Muestra estadísticas de tareas
 */
export const Stats: React.FC = () => {
    const [stats, setStats] = useState<TaskStatsType | null>(null);

    const loadStats = async () => {
        try {
            const data = await taskService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    if (!stats) return null;

    return (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{stats.total}</p>
                        <p className="text-sm opacity-90">Total</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold">{stats.completed}</p>
                        <p className="text-sm opacity-90">Completadas</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold">{stats.pending}</p>
                        <p className="text-sm opacity-90">Pendientes</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold">{stats.highPriority}</p>
                        <p className="text-sm opacity-90">Alta Prioridad</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-300">{stats.overdue}</p>
                        <p className="text-sm opacity-90">Vencidas</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
