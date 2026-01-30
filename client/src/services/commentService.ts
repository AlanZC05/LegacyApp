import api from './api';
import { Comment, CommentFormDTO } from '../types';

export const commentService = {
    getCommentsByTask: async (taskId: string): Promise<Comment[]> => {
        const response = await api.get(`/comments/task/${taskId}`);
        return response.data.data;
    },

    createComment: async (data: CommentFormDTO): Promise<Comment> => {
        const response = await api.post('/comments', data);
        return response.data.data;
    }
};
