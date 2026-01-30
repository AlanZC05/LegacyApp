
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { TasksPage } from './pages/TasksPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { CommentsPage } from './pages/CommentsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SearchPage } from './pages/SearchPage';
import { ReportsPage } from './pages/ReportsPage';

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
                                <CommentsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/history"
                        element={
                            <ProtectedRoute>
                                <HistoryPage />
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
                                <SearchPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reports"
                        element={
                            <ProtectedRoute>
                                <ReportsPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
