import api from './api';

export const login = (email, password) => api.post('/auth/login', { email, password });
export const getMe = () => api.get('/auth/me');
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
