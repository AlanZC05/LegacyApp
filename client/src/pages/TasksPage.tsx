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
 * CRUD completo de tareas con diseño centrado y estético
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
    const [showForm, setShowForm] = useState(false);

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
                alert('Tarea actualizada exitosamente');
            } else {
                // Crear
                await taskService.createTask(formData);
                alert('Tarea creada exitosamente');
            }
            await loadTasks();
            handleCloseForm();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al guardar tarea');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedTask) return;
        if (!confirm(`¿Eliminar tarea: ${selectedTask.title}?`)) return;

        setLoading(true);
        try {
            await taskService.deleteTask(selectedTask._id);
            alert('Tarea eliminada');
            await loadTasks();
            handleCloseForm();
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
        setShowForm(true);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const handleOpenNewTask = () => {
        handleClearForm(); // Limpiar primero
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        handleClearForm();
    };

    const handleClearForm = () => {
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
        <div className="min-h-screen bg-gray-50 pb-12">
            <Header />
            <Navigation />

            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mt-8 mb-8">
                    <Stats />
                </div>

                {/* Encabezado y Acciones */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Mis Tareas</h2>
                        <p className="text-gray-500">Gestiona y organiza tus actividades diarias</p>
                    </div>
                    {!showForm && (
                        <Button
                            variant="primary"
                            onClick={handleOpenNewTask}
                            className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                        >
                            ➕ Nueva Tarea
                        </Button>
                    )}
                </div>

                {/* Formulario (Condicional) */}
                {showForm && (
                    <div className="mb-8 animate-fadeIn">
                        <Card title={selectedTask ? '✏️ Editar Tarea' : '✨ Nueva Tarea'}>
                            <form onSubmit={handleSubmit} className="p-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="col-span-1 md:col-span-2">
                                        <Input
                                            label="Título *"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="¿Qué necesitas hacer?"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                                            placeholder="Detalles adicionales..."
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
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleCloseForm}
                                    >
                                        Cancelar
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
                                        type="submit"
                                        variant="primary"
                                        disabled={loading}
                                        className="min-w-[120px]"
                                    >
                                        {selectedTask ? 'Guardar Cambios' : 'Crear Tarea'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}

                {/* Lista de Tareas */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-5 font-semibold text-gray-600 text-sm tracking-wider">Tarea</th>
                                    <th className="p-5 font-semibold text-gray-600 text-sm tracking-wider">Estado</th>
                                    <th className="p-5 font-semibold text-gray-600 text-sm tracking-wider">Prioridad</th>
                                    <th className="p-5 font-semibold text-gray-600 text-sm tracking-wider">Proyecto</th>
                                    <th className="p-5 font-semibold text-gray-600 text-sm tracking-wider">Vencimiento</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {tasks.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center p-12">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                                <p className="text-lg font-medium">No hay tareas pendientes</p>
                                                <p className="text-sm mt-2">¡Comienza creando una nueva tarea!</p>
                                                <Button
                                                    variant="primary"
                                                    className="mt-6"
                                                    onClick={handleOpenNewTask}
                                                >
                                                    Crear primera tarea
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    tasks.map(task => (
                                        <tr
                                            key={task._id}
                                            onClick={() => handleSelectTask(task)}
                                            className="hover:bg-blue-50 cursor-pointer transition-colors duration-200 group"
                                        >
                                            <td className="p-5">
                                                <div className="font-semibold text-gray-800 group-hover:text-primary-700">{task.title}</div>
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
                                                {typeof task.projectId === 'object' ? (
                                                    <span className="flex items-center gap-1">
                                                        📁 {task.projectId?.name}
                                                    </span>
                                                ) : <span className="text-gray-400 italic">--</span>}
                                            </td>
                                            <td className="p-5 text-sm">
                                                {task.dueDate ? (
                                                    <span className={`${new Date(task.dueDate) < new Date() ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                ) : <span className="text-gray-400">-</span>}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
