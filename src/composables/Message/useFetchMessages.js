// src/composables/useFetchMessages.js
import { ref } from 'vue'
import { axiosNLP } from '@/plugins/axios'  // <— usamos el cliente NLP con el interceptor

export function useFetchMessages() {
  const loading = ref(false)
  const error   = ref(null)

  /**
   * @returns { messages: Array, has_more: boolean }
   */
  const fetchMessages = async (limit = 15, offset = 0) => {
    loading.value = true
    error.value   = null

    try {
      const res = await axiosNLP.get('/core/chat/messages', {
        params: { limit, offset }
      })

      const { messages, has_more } = res.data
      return {
        messages: Array.isArray(messages) ? messages : [],
        has_more: Boolean(has_more),
      }
    } catch (err) {
      error.value = err
      console.error('Error al obtener mensajes:', err)
      return { messages: [], has_more: false }
    } finally {
      loading.value = false
    }
  }

  return { loading, error, fetchMessages }
}
