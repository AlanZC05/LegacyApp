import React, { useState, useEffect, useRef } from 'react';
import { taskService, commentService } from '../services';
import { Task, Comment } from '../types';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Button } from '../components/ui/Button';

export const CommentsPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
        if (selectedTask) {
            loadComments(selectedTask._id);
        }
    }, [selectedTask]);

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    const loadTasks = async () => {
        setLoadingTasks(true);
        try {
            const data = await taskService.getTasks();
            setTasks(data);
        } catch (_) { } finally {
            setLoadingTasks(false);
        }
    };

    const loadComments = async (taskId: string) => {
        setLoadingComments(true);
        try {
            const data = await commentService.getCommentsByTask(taskId);
            setComments(data);
        } catch (_) {
            console.error('Error loading comments');
        } finally {
            setLoadingComments(false);
        }
    };

    const handleSendComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask || !newComment.trim()) return;

        if (newComment.length > 200) {
            alert('El comentario no puede exceder los 200 caracteres');
            return;
        }

        try {
            await commentService.createComment({
                taskId: selectedTask._id,
                commentText: newComment
            });
            setNewComment('');
            loadComments(selectedTask._id);
        } catch (_) {
            alert('Error al enviar comentario');
        }
    };

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <Navigation />

            <div className="container mx-auto px-4 py-6 flex-1 flex overflow-hidden gap-6 h-[calc(100vh-140px)]">
                {/* Panel Izquierdo: Lista de Tareas */}
                <div className="w-1/3 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-4 bg-elegant-blue border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800">Seleccionar Tarea</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {loadingTasks ? (
                            <div className="text-center p-4 text-gray-500">Cargando tareas...</div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center p-4 text-gray-400">No hay tareas disponibles</div>
                        ) : (
                            tasks.map(task => (
                                <div
                                    key={task._id}
                                    onClick={() => setSelectedTask(task)}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedTask?._id === task._id
                                        ? 'bg-blue-50 border border-blue-200'
                                        : 'hover:bg-gray-50 border border-transparent'
                                        }`}
                                >
                                    <p className="font-medium text-gray-800 text-sm truncate">{task.title}</p>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-xs text-gray-500">{task.status}</span>
                                        {task.priority === 'Crítica' && <span className="text-xs text-red-500 font-bold">!</span>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Panel Derecho: Chat de Comentarios */}
                <div className="w-2/3 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col overflow-hidden">
                    {selectedTask ? (
                        <>
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h2 className="font-bold text-gray-800">{selectedTask.title}</h2>
                                    <p className="text-xs text-gray-500">{selectedTask.description}</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                                {loadingComments ? (
                                    <div className="text-center py-10 text-gray-400">Cargando comentarios...</div>
                                ) : comments.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                                        <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                        <p>Aún no hay comentarios en esta tarea.</p>
                                        <p className="text-sm">¡Sé el primero en comentar!</p>
                                    </div>
                                ) : (
                                    comments.map(comment => (
                                        <div key={comment._id} className="flex flex-col animate-fadeIn">
                                            <div className="bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-gray-100 self-start max-w-[85%]">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-xs text-elegant-burgundy">
                                                        {typeof comment.userId === 'object' ? comment.userId.username : 'Usuario'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{comment.commentText}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={commentsEndRef} />
                            </div>

                            <div className="p-4 bg-white border-t border-gray-100">
                                <form onSubmit={handleSendComment} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Escribe un comentario... (Max 200 caracteres)"
                                        maxLength={200}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-elegant-green/50 focus:border-elegant-green transition-all"
                                    />
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={!newComment.trim()}
                                        className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-elegant-green hover:bg-[#8FB593] text-white"
                                    >
                                        ➤
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                            <h3 className="text-lg font-medium text-gray-600">Selecciona una tarea</h3>
                            <p>Elige una tarea de la izquierda para ver sus comentarios.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
