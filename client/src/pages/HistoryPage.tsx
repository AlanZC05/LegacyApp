import React, { useEffect, useState } from 'react';
import { historyService } from '../services';
import { History } from '../types';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Card } from '../components/ui/Card';

export const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<History[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await historyService.getAllHistory();
            setHistory(data);
        } catch (error) {
            console.error('Error al cargar historial', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <Card title="📜 Historial de Actividades">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-elegant-blue border-b border-gray-100">
                                    <th className="p-4 font-semibold text-gray-700 text-sm">Fecha</th>
                                    <th className="p-4 font-semibold text-gray-700 text-sm">Usuario</th>
                                    <th className="p-4 font-semibold text-gray-700 text-sm">Acción</th>
                                    <th className="p-4 font-semibold text-gray-700 text-sm">Detalles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-6 text-center text-gray-500">Cargando historial...</td>
                                    </tr>
                                ) : history.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-6 text-center text-gray-500">No hay actividad registrada</td>
                                    </tr>
                                ) : (
                                    history.map((record) => (
                                        <tr key={record._id} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="p-4 text-sm text-gray-600">
                                                {new Date(record.timestamp).toLocaleString()}
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                {typeof record.userId === 'object' ? record.userId.username : 'Usuario'}
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                                    {record.action}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                <div className="max-w-md truncate">
                                                    <span className="font-medium">
                                                        {typeof record.taskId === 'object' ? record.taskId.title : 'Tarea'}
                                                    </span>
                                                    : {record.action === 'STATUS_CHANGED' ? (
                                                        <span>Cambió de <span className="text-red-500">{record.oldValue}</span> a <span className="text-green-600">{record.newValue}</span></span>
                                                    ) : (
                                                        <span>Modificad@</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};
