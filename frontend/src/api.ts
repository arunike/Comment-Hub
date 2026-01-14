import axios from 'axios';
import type { Comment } from './types';

const API_URL = 'http://localhost:8000/api/comments/';

export const getComments = async () => {
    const response = await axios.get<Comment[]>(API_URL);
    return response.data;
};

export const createComment = async (text: string) => {
    const response = await axios.post<Comment>(API_URL, { text });
    return response.data;
};

export const updateComment = async (id: number, text: string) => {
    const response = await axios.patch<Comment>(`${API_URL}${id}/`, { text });
    return response.data;
};

export const deleteComment = async (id: number) => {
    await axios.delete(`${API_URL}${id}/`);
};
