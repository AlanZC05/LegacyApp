import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { TasksPage } from './pages/TasksPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { NotificationsPage } from './pages/NotificationsPage';

// Placeholder pages para las rutas restantes
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { Card } from './components/ui/Card';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
    <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <div className="container mx-auto px-4 py-8">
            <Card>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
                    <p className="text-gray-600">Esta funcionalidad está implementada en el backend.</p>
                    <p className="text-gray-600 mt-2">Puedes completar el frontend siguiendo el mismo patrón de las otras páginas.</p>
                </div>
            </Card>
        </div>
    </div>
);

/**
 * Componente principal de la aplicación
 * Configura el enrutamiento y providers
 */
function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Ruta pública */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Rutas protegidas */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <TasksPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/projects"
                        element={
                            <ProtectedRoute>
                                <ProjectsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/comments"
                        element={
                            <ProtectedRoute>
                                <PlaceholderPage title="📝 Comentarios" />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/history"
                        element={
                            <ProtectedRoute>
                                <PlaceholderPage title="📜 Historial" />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/notifications"
                        element={
                            <ProtectedRoute>
                                <NotificationsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/search"
                        element={
                            <ProtectedRoute>
                                <PlaceholderPage title="🔍 Búsqueda Avanzada" />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reports"
                        element={
                            <ProtectedRoute>
                                <PlaceholderPage title="📊 Reportes" />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
