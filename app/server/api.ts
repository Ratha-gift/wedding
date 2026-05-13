import axios from 'axios';
import { useAuth } from '@/app/src/lib/useAuth';   // ← adjust path if needed

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuth.getState().onLogout?.();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getAuthHeader = () => {
  const token = useAuth.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};
export const Authorization = () => {
  const token = useAuth.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default api;