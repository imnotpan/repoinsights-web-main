import axios from 'axios';
import router from '../router/index.js';
import { useUserStore } from '@/store/user';

const axiosClient = axios.create({
  // if VITE_DEV_SERVER_URL is not defined, it will use the default value
  baseURL: import.meta.env.VITE_DEV ?  'http://146.83.216.157:8000' : 'https://backend.repoinsights.app'
});

const axiosNLP = axios.create({
  // if VITE_DEV_SERVER_URL is not defined, it will use the default value
  baseURL: import.meta.env.VITE_DEV ?  'http://146.83.216.157:8080' : 'https://backend.repoinsights.app'
});

// Configura el interceptor para amobos clientes de Axios
function setupAuthInterceptors(client) {
  client.interceptors.request.use(config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  })

  client.interceptors.response.use(
    response => response,
    error => {
      const status = error.response?.status
      if (status === 401 || status === 403) {
        const userStore = useUserStore()
        userStore.setToken(null)
        router.push({ name: 'Login' })
      }
      return Promise.reject(error)
    }
  )
}

setupAuthInterceptors(axiosClient)
setupAuthInterceptors(axiosNLP)

export { axiosNLP }
export default axiosClient


