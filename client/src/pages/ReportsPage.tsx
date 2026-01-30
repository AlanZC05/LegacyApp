import React, { useEffect, useState } from 'react';
import { reportService } from '../services';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const ReportsPage: React.FC = () => {
    const [taskStats, setTaskStats] = useState<any>(null);
    const [projectStats, setProjectStats] = useState<any[]>([]);
    const [userStats, setUserStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [tStats, pStats, uStats] = await Promise.all([
                reportService.getTaskStats(),
                reportService.getProjectStats(),
                reportService.getUserStats()
            ]);
            setTaskStats(tStats);
            setProjectStats(pStats);
            setUserStats(uStats);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        reportService.exportCSV();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Generando reportes...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">📊 Reportes y Estadísticas</h2>
                    <Button onClick={handleExport} className="bg-elegant-green text-white hover:bg-[#8FB593] shadow-md hover:shadow-lg transition-all">
                        ⇩ Exportar a CSV
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Tareas por Estado */}
                    <Card title="Estado de Tareas">
                        <div className="space-y-4">
                            {taskStats && Object.entries(taskStats).map(([status, count]: [string, any]) => (
                                <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">{status}</span>
                                    <span className="px-3 py-1 bg-white border border-gray-200 rounded-full font-bold text-gray-800 shadow-sm">
                                        {count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Tareas por Proyecto */}
                    <Card title="Carga por Proyecto">
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                            {projectStats.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">No hay datos</p>
                            ) : (
                                projectStats.map((p) => (
                                    <div key={p.projectId} className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium text-gray-800 text-sm">{p.projectName}</span>
                                            <span className="text-sm font-bold text-blue-600">{p.taskCount} tareas</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="bg-blue-400 h-2 rounded-full"
                                                style={{ width: `${Math.min(100, (p.taskCount / 10) * 100)}%` }} // Escala visual simple
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Tareas por Usuario */}
                    <Card title="Desempeño del Equipo">
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                            {userStats.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">No hay datos</p>
                            ) : (
                                userStats.map((u) => (
                                    <div key={u.userId} className="flex items-center justify-between p-3 bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-elegant-burgundy text-white flex items-center justify-center font-bold text-sm">
                                                {u.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-700">{u.username}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold text-gray-900">{u.assignedTasks}</span>
                                            <span className="text-[10px] text-gray-400 uppercase">Asignadas</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
