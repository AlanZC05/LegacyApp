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
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-md border-0 flex flex-col items-center justify-center transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                <span className="text-3xl font-bold text-black">{stats.total}</span>
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider mt-1">Total</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md border-0 flex flex-col items-center justify-center transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                <span className="text-3xl font-bold text-black">{stats.completed}</span>
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider mt-1">Completadas</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md border-0 flex flex-col items-center justify-center transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                <span className="text-3xl font-bold text-yellow-600">{stats.pending}</span>
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider mt-1">Pendientes</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md border-0 flex flex-col items-center justify-center transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                <span className="text-3xl font-bold text-red-600">{stats.highPriority}</span>
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider mt-1">Alta Prio.</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md border-0 flex flex-col items-center justify-center transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                <span className="text-3xl font-bold text-red-600">{stats.overdue}</span>
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider mt-1">Vencidas</span>
            </div>
        </div>
    );
};
