import api from './api';

export const getDashboardStats = () => api.get('/dashboard');
export const getSalesAnalytics = () => api.get('/sales');
