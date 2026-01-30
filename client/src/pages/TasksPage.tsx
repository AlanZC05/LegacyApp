import React, { useEffect, useState } from 'react';
import { Task, Project, TaskStatus, TaskPriority, TaskFormDTO } from '../types';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Stats } from '../components/layout/Stats';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

/**
 * Página de Gestión de Tareas
 * CRUD completo de tareas con formulario y tabla
 */
export const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [users] = useState<{ _id: string; username: string }[]>([
        { _id: '1', username: 'Sin asignar' },
        { _id: 'admin', username: 'Admin' },
        { _id: 'user1', username: 'User1' },
        { _id: 'user2', username: 'User2' }
    ]);

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [formData, setFormData] = useState<TaskFormDTO>({
        title: '',
        description: '',
        status: TaskStatus.PENDIENTE,
        priority: TaskPriority.MEDIA,
        projectId: '',
        assignedTo: '',
        dueDate: '',
        estimatedHours: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTasks();
        loadProjects();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await taskService.getTasks();
            setTasks(data);
        } catch (error) {
            console.error('Error al cargar tareas:', error);
            alert('Error al cargar tareas');
        }
    };

    const loadProjects = async () => {
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Error al cargar proyectos:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) {
            alert('El título es requerido');
            return;
        }

        setLoading(true);
        try {
            if (selectedTask) {
                // Actualizar
                await taskService.updateTask(selectedTask._id, formData);
                alert('Tarea actualizada');
            } else {
                // Crear
                await taskService.createTask(formData);
                alert('Tarea creada');
            }
            await loadTasks();
            handleClear();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al guardar tarea');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedTask) {
            alert('Selecciona una tarea');
            return;
        }

        if (!confirm(`¿Eliminar tarea: ${selectedTask.title}?`)) return;

        setLoading(true);
        try {
            await taskService.deleteTask(selectedTask._id);
            alert('Tarea eliminada');
            await loadTasks();
            handleClear();
        } catch (_) {
            alert('Error al eliminar tarea');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTask = (task: Task) => {
        setSelectedTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            projectId: typeof task.projectId === 'object' ? task.projectId?._id : task.projectId || '',
            assignedTo: typeof task.assignedTo === 'object' ? task.assignedTo?._id : task.assignedTo || '',
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
            estimatedHours: task.estimatedHours || 0
        });
    };

    const handleClear = () => {
        setSelectedTask(null);
        setFormData({
            title: '',
            description: '',
            status: TaskStatus.PENDIENTE,
            priority: TaskPriority.MEDIA,
            projectId: '',
            assignedTo: '',
            dueDate: '',
            estimatedHours: 0
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />
            <Stats />

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulario */}
                    <div className="lg:col-span-1">
                        <Card title={selectedTask ? '✏️ Editar Tarea' : '➕ Nueva Tarea'}>
                            <form onSubmit={handleSubmit}>
                                <Input
                                    label="Título *"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Título de la tarea"
                                    required
                                />

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Descripción de la tarea"
                                    />
                                </div>

                                <Select
                                    label="Estado"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    options={Object.values(TaskStatus).map(s => ({ value: s, label: s }))}
                                />

                                <Select
                                    label="Prioridad"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    options={Object.values(TaskPriority).map(p => ({ value: p, label: p }))}
                                />

                                <Select
                                    label="Proyecto"
                                    name="projectId"
                                    value={formData.projectId}
                                    onChange={handleInputChange}
                                    options={[
                                        { value: '', label: 'Sin proyecto' },
                                        ...projects.map(p => ({ value: p._id, label: p.name }))
                                    ]}
                                />

                                <Select
                                    label="Asignado a"
                                    name="assignedTo"
                                    value={formData.assignedTo}
                                    onChange={handleInputChange}
                                    options={users.map(u => ({ value: u._id, label: u.username }))}
                                />

                                <Input
                                    label="Fecha Vencimiento"
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                />

                                <Input
                                    label="Horas Estimadas"
                                    type="number"
                                    name="estimatedHours"
                                    value={formData.estimatedHours}
                                    onChange={handleInputChange}
                                    step="0.5"
                                    min="0"
                                />

                                <div className="flex gap-2 mt-6">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={loading}
                                        className="flex-1"
                                    >
                                        {selectedTask ? 'Actualizar' : 'Agregar'}
                                    </Button>
                                    {selectedTask && (
                                        <Button
                                            type="button"
                                            variant="danger"
                                            onClick={handleDelete}
                                            disabled={loading}
                                        >
                                            Eliminar
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleClear}
                                    >
                                        Limpiar
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* Tabla de Tareas */}
                    <div className="lg:col-span-2">
                        <Card title="📋 Lista de Tareas">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 border-b">
                                            <th className="text-left p-3 font-semibold text-sm">Título</th>
                                            <th className="text-left p-3 font-semibold text-sm">Estado</th>
                                            <th className="text-left p-3 font-semibold text-sm">Prioridad</th>
                                            <th className="text-left p-3 font-semibold text-sm">Proyecto</th>
                                            <th className="text-left p-3 font-semibold text-sm">Asignado</th>
                                            <th className="text-left p-3 font-semibold text-sm">Vencimiento</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center p-8 text-gray-500">
                                                    No hay tareas. ¡Crea la primera!
                                                </td>
                                            </tr>
                                        ) : (
                                            tasks.map(task => (
                                                <tr
                                                    key={task._id}
                                                    onClick={() => handleSelectTask(task)}
                                                    className="border-b hover:bg-primary-50 cursor-pointer transition-colors"
                                                >
                                                    <td className="p-3 font-medium">{task.title}</td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === 'Completada' ? 'bg-green-100 text-green-800' :
                                                            task.status === 'En Progreso' ? 'bg-blue-100 text-blue-800' :
                                                                task.status === 'Bloqueada' ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.priority === 'Crítica' ? 'bg-red-100 text-red-800' :
                                                            task.priority === 'Alta' ? 'bg-orange-100 text-orange-800' :
                                                                task.priority === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {task.priority}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-sm">
                                                        {typeof task.projectId === 'object' ? task.projectId?.name : 'Sin proyecto'}
                                                    </td>
                                                    <td className="p-3 text-sm">
                                                        {typeof task.assignedTo === 'object' ? task.assignedTo?.username : 'Sin asignar'}
                                                    </td>
                                                    <td className="p-3 text-sm">
                                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}
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
            </div>
        </div>
    );
};
