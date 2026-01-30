import React, { useEffect, useState } from 'react';
import { projectService } from '../services/projectService';
import { Project } from '../types';
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
        if (!name) {
            alert('El nombre es requerido');
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

    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
        setName(project.name);
        setDescription(project.description || '');
    };

    const handleClear = () => {
        setSelectedProject(null);
        setName('');
        setDescription('');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Formulario */}
                    <Card title={selectedProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}>
                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Nombre *"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nombre del proyecto"
                                required
                            />

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Descripción del proyecto"
                                />
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
                                    Limpiar
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Lista de Proyectos */}
                    <Card title="Lista de Proyectos">
                        <div className="space-y-3">
                            {projects.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No hay proyectos</p>
                            ) : (
                                projects.map(project => (
                                    <div
                                        key={project._id}
                                        onClick={() => handleSelectProject(project)}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors"
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
        </div>
    );
};
