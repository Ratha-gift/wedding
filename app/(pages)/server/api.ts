import { useAuth } from '@/app/src/lib/useAuth';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://wedding.ezegroup.store/api',
 
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("authToken");

//   console.log("INTERCEPTOR TOKEN:", token);
//   console.log("REQUEST URL:", config.url);

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export const Authorization = () => {
//   const token = localStorage.getItem("authToken");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const Authorization = () => {
  const token = useAuth.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
export default api;
 