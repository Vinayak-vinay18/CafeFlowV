import api from './api';

export const getMenuItems = (params) => api.get('/menu', { params });
export const getMenuItem = (id) => api.get(`/menu/${id}`);
export const createMenuItem = (data) => api.post('/menu', data);
export const updateMenuItem = (id, data) => api.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`);
export const getPopularityStats = () => api.get('/menu/stats/popularity');
