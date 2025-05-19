import { ref } from 'vue';
import { axiosNLP } from '@/plugins/axios.js';

export function useFetchMessageProcess() {
  const loading = ref(false);
  const error = ref(null);
  const messageProcessCache = ref({});

  const fetchMessageProcess = async (messageId) => {
    // Si ya lo tenemos en caché, lo devolvemos inmediatamente
    if (messageProcessCache.value[messageId]) {
      return messageProcessCache.value[messageId];
    }

    loading.value = true;
    error.value = null;

    try {
      // Petición con axios al endpoint correspondiente
      const { data } = await axiosNLP.get(`/core/message/${messageId}/process`);

      // Esperamos que la respuesta tenga el campo `process`
      if (data && data.process !== undefined) {
        messageProcessCache.value[messageId] = data.process;
        return data.process;
      } else {
        throw new Error('La respuesta no contiene el campo "process".');
      }
    } catch (err) {
      error.value = err;
      console.error('Error al obtener el proceso del mensaje:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    fetchMessageProcess,
    messageProcessCache,
  };
}
