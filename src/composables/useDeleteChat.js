import { ref } from 'vue';
import { axiosNLP } from '@/plugins/axios.js';


export function useDeleteChat() {
  const loading = ref(false);
  const error = ref(null);

  const deleteChat = async () => {
    loading.value = true;
    error.value = null;

    try {
      await axiosNLP.delete('/core/chat/delete');
      return true;
    } catch (err) {
      error.value = err.response?.data?.detail || err.response?.data?.message || err.message;
      console.error('Error al borrar chat:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, deleteChat };
}
