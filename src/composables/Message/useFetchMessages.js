// src/composables/useFetchMessages.js
import { axiosNLP } from '@/plugins/axios'  // usamos el cliente NLP con interceptor

export function useFetchMessages() {

  const getMessages = async (limit = 15, offset = 0) => {
    try {
      const res = await axiosNLP.get('/core/chat/messages', {
        params: { limit, offset }
      })
      const { messages = [], has_more = false } = res.data
      console.log(messages)
      return { messages, hasMore: has_more }
    } catch (err) {
      console.error('Error al obtener mensajes:', err)
      return { messages: [], hasMore: false }
    } 
  }
  return { getMessages }
}
