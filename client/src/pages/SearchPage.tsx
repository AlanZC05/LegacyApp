import React, { useState, useEffect } from 'react';
import { searchService, projectService } from '../services';
import { Task, Project, TaskStatus, TaskPriority } from '../types';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export const SearchPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const [filters, setFilters] = useState({
        text: '',
        status: '',
        priority: '',
        projectId: ''
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (_) { }
    };

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        setSearched(true);
        try {
            const data = await searchService.searchTasks(filters);
            setTasks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleClear = () => {
        setFilters({ text: '', status: '', priority: '', projectId: '' });
        setTasks([]);
        setSearched(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Card title="🔍 Búsqueda Avanzada">
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="col-span-1 md:col-span-2 lg:col-span-4">
                                <Input
                                    label="Buscar texto"
                                    name="text"
                                    value={filters.text}
                                    onChange={handleInputChange}
                                    placeholder="Título o descripción..."
                                />
                            </div>

                            <Select
                                label="Estado"
                                name="status"
                                value={filters.status}
                                onChange={handleInputChange}
                                options={[
                                    { value: '', label: 'Todos' },
                                    ...Object.values(TaskStatus).map(s => ({ value: s, label: s }))
                                ]}
                            />

                            <Select
                                label="Prioridad"
                                name="priority"
                                value={filters.priority}
                                onChange={handleInputChange}
                                options={[
                                    { value: '', label: 'Todas' },
                                    ...Object.values(TaskPriority).map(p => ({ value: p, label: p }))
                                ]}
                            />

                            <Select
                                label="Proyecto"
                                name="projectId"
                                value={filters.projectId}
                                onChange={handleInputChange}
                                options={[
                                    { value: '', label: 'Todos' },
                                    ...projects.map(p => ({ value: p._id, label: p.name }))
                                ]}
                            />

                            <div className="flex items-end gap-2">
                                <Button type="submit" variant="primary" className="flex-1 bg-elegant-green text-white hover:bg-[#8FB593]">
                                    Buscar
                                </Button>
                                <Button type="button" variant="secondary" onClick={handleClear}>
                                    Limpiar
                                </Button>
                            </div>
                        </div>
                    </form>
                </Card>

                {searched && (
                    <div className="mt-6 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-elegant-blue border-b border-gray-100">
                                        <th className="p-5 font-semibold text-gray-600 text-sm">Tarea</th>
                                        <th className="p-5 font-semibold text-gray-600 text-sm">Estado</th>
                                        <th className="p-5 font-semibold text-gray-600 text-sm">Prioridad</th>
                                        <th className="p-5 font-semibold text-gray-600 text-sm">Proyecto</th>
                                        <th className="p-5 font-semibold text-gray-600 text-sm">Asignado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">Buscando...</td></tr>
                                    ) : tasks.length === 0 ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">No se encontraron tareas con estos filtros.</td></tr>
                                    ) : (
                                        tasks.map(task => (
                                            <tr key={task._id} className="hover:bg-blue-50/50 transition-colors">
                                                <td className="p-5">
                                                    <div className="font-semibold text-gray-800">{task.title}</div>
                                                    <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{task.description}</div>
                                                </td>
                                                <td className="p-5">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${task.status === 'Completada' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        task.status === 'En Progreso' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            task.status === 'Bloqueada' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                'bg-gray-100 text-gray-700 border-gray-200'
                                                        }`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${task.priority === 'Crítica' ? 'bg-red-500' :
                                                            task.priority === 'Alta' ? 'bg-orange-500' :
                                                                task.priority === 'Media' ? 'bg-yellow-400' :
                                                                    'bg-gray-400'
                                                            }`}></span>
                                                        <span className="text-sm text-gray-700">{task.priority}</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-sm text-gray-600">
                                                    {typeof task.projectId === 'object' ? task.projectId?.name : '--'}
                                                </td>
                                                <td className="p-5 text-sm text-gray-600">
                                                    {typeof task.assignedTo === 'object' ? task.assignedTo?.username : '--'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
