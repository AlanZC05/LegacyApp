import React, { useEffect, useState } from 'react';
import { projectService } from '../services/projectService';
import { searchService } from '../services/searchService';
import { Project, Task } from '../types';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

/**
 * Página de Gestión de Proyectos
 */
export const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projectTasks, setProjectTasks] = useState<Task[]>([]);

    const loadProjects = async () => {
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (_) {
            alert('Error al cargar proyectos');
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || name.trim().length < 3) {
            alert('El nombre debe tener al menos 3 caracteres');
            return;
        }
        if (name.length > 50) {
            alert('El nombre no puede exceder los 50 caracteres');
            return;
        }

        try {
            if (selectedProject) {
                await projectService.updateProject(selectedProject._id, { name, description });
                alert('Proyecto actualizado');
            } else {
                await projectService.createProject({ name, description });
                alert('Proyecto creado');
            }
            await loadProjects();
            handleClear();
        } catch (_) {
            alert('Error al guardar proyecto');
        }
    };

    const handleDelete = async () => {
        if (!selectedProject) return;

        if (!confirm(`¿Eliminar proyecto: ${selectedProject.name}?`)) return;

        try {
            await projectService.deleteProject(selectedProject._id);
            alert('Proyecto eliminado');
            await loadProjects();
            handleClear();
        } catch (_) {
            alert('Error al eliminar proyecto');
        }
    };

    const handleSelectProject = async (project: Project) => {
        setSelectedProject(project);
        setName(project.name);
        setDescription(project.description || '');

        // Cargar tareas del proyecto
        try {
            const tasks = await searchService.searchTasks({ projectId: project._id });
            setProjectTasks(tasks);
        } catch (error) {
            console.error('Error al cargar tareas del proyecto:', error);
            setProjectTasks([]);
        }
    };

    const handleClear = () => {
        setSelectedProject(null);
        setName('');
        setDescription('');
        setProjectTasks([]);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Header />
            <Navigation />

            <div className="container mx-auto px-4 py-8">
                {/* Grid Superior: Formulario y Lista de Proyectos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Columna Izquierda: Formulario */}
                    <div className="space-y-6">
                        <Card title={selectedProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}>
                            <form onSubmit={handleSubmit}>
                                <Input
                                    label="Nombre *"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nombre del proyecto (3-50 caracteres)"
                                    required
                                    minLength={3}
                                    maxLength={50}
                                />

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        maxLength={200}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Descripción del proyecto (Max 200 caracteres)"
                                    />
                                    <p className="text-xs text-gray-400 text-right mt-1">
                                        {description.length}/200
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" variant="primary" className="flex-1">
                                        {selectedProject ? 'Actualizar' : 'Crear'}
                                    </Button>
                                    {selectedProject && (
                                        <Button type="button" variant="danger" onClick={handleDelete}>
                                            Eliminar
                                        </Button>
                                    )}
                                    <Button type="button" variant="secondary" onClick={handleClear}>
                                        {selectedProject ? 'Cancelar' : 'Limpiar'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* Columna Derecha: Lista de Proyectos */}
                    <div>
                        <Card title="Lista de Proyectos">
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                {projects.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No hay proyectos</p>
                                ) : (
                                    projects.map(project => (
                                        <div
                                            key={project._id}
                                            onClick={() => handleSelectProject(project)}
                                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedProject?._id === project._id ?
                                                'bg-blue-50 border-blue-200 ring-1 ring-blue-200' :
                                                'border-gray-200 hover:bg-blue-50/50'
                                                }`}
                                        >
                                            <h3 className="font-semibold text-gray-800">{project.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{project.description || 'Sin descripción'}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Sección Inferior: Lista de Tareas del Proyecto (Ancho Completo) */}
                {selectedProject && (
                    <div className="w-full">
                        <Card title={`Tareas de ${selectedProject.name}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 p-2">
                                {projectTasks.length === 0 ? (
                                    <p className="col-span-full text-center text-gray-500 py-8 text-lg">No hay tareas asociadas a este proyecto</p>
                                ) : (
                                    projectTasks.map(task => (
                                        <div key={task._id} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-gray-800 line-clamp-1">{task.title}</h4>
                                                <span className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${task.priority === 'Crítica' ? 'bg-red-500' :
                                                    task.priority === 'Alta' ? 'bg-orange-500' :
                                                        task.priority === 'Media' ? 'bg-yellow-400' :
                                                            'bg-gray-300'
                                                    }`} title={`Prioridad: ${task.priority}`}></span>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[40px]">{task.description || 'Sin descripción'}</p>

                                            <div className="flex flex-col gap-2 mt-auto">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${task.status === 'Completada' ? 'bg-green-100 text-green-700' :
                                                        task.status === 'En Progreso' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {task.status}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {task.assignedTo && typeof task.assignedTo === 'object' && (
                                                    <div className="text-xs text-gray-500 border-t border-gray-100 pt-2 flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                        {task.assignedTo.username}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};
