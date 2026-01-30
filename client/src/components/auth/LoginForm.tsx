import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

/**
 * Formulario de Login
 * Componente para iniciar sesión en la aplicación
 */
export const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 p-4">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Task Manager
                    </h1>
                    <p className="text-gray-600">MERN Stack - Sistema Profesional</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Usuario"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ingresa tu usuario"
                        required
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        required
                    />

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-2">
                        Credenciales de prueba:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Usuario: <code className="bg-white px-2 py-1 rounded">admin</code> / Contraseña: <code className="bg-white px-2 py-1 rounded">admin123</code></li>
                        <li>• Usuario: <code className="bg-white px-2 py-1 rounded">user1</code> / Contraseña: <code className="bg-white px-2 py-1 rounded">user123</code></li>
                    </ul>
                </div>
            </Card>
        </div>
    );
};
