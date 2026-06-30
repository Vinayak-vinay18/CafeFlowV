import axios from 'axios';

const api = axios.create({
  // Hardcode your live Render URL as the fallback option
  baseURL: import.meta.env.VITE_API_URL || 'https://cafeflowv-backend.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cafeflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cafeflow_token');
      localStorage.removeItem('cafeflow_admin');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;