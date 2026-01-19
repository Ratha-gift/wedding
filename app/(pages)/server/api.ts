// src/lib/api.ts  (or wherever you keep it)
import axios from 'axios';
import { useAuth } from '@/app/src/lib/useAuth';   // ← adjust path if needed

const api = axios.create({
  baseURL: 'https://wedding.ezegroup.store/api',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Optional: Add token automatically on every request
api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;   // or localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAuthHeader = () => {
  const token = useAuth.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};
export const Authorization = () => {
  const token = useAuth.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};  // ✅ ត្រឡប់ object
};

export default api;