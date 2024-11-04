import axios from 'axios';

const api = axios.create({
  baseURL: '69.243.107.181/32',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const register = async (username: string, password: string) => {
  const response = await api.post('/auth/register', { username, password });
  return response.data;
};

export const getNotes = async () => {
  const response = await api.get('/notes');
  return response.data;
};

export const createNote = async (note: { title: string; content: string }) => {
  const response = await api.post('/notes', note);
  return response.data;
};

export const updateNote = async (id: string, note: { title: string; content: string }) => {
  const response = await api.put(`/notes/${id}`, note);
  return response.data;
};

export const deleteNote = async (id: string) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};