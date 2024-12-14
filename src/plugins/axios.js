import axios from 'axios';
import router from '../router/index.js';
import { useUserStore } from '@/store/user';

const axiosClient = axios.create({
  // if VITE_DEV_SERVER_URL is not defined, it will use the default value
  baseURL: import.meta.env.VITE_DEV ?  'http://localhost:8000' : 'https://backend.repoinsights.app'
});

axiosClient.interceptors.request.use((config) => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    const userStore = useUserStore();
    if (error.response.status === 401) {
      userStore.setToken(null);
      router.push({ name: 'Login' });
    }
    else if (error.response.status === 403) {
      userStore.setToken(null);
      router.push({ name: 'Login' });
    }
    throw error;
  },
);

export default axiosClient;
