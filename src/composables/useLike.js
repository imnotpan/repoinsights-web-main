// src/composables/useMessageLikes.js
import { axiosNLP } from '@/plugins/axios.js'

export function useMessageLikes() {
  async function sendLike(messageId) {
    try {
      await axiosNLP.post(`/core/message/${messageId}/like`)
      console.log(`Like enviado para el mensaje ${messageId}`)
    } catch (error) {
      console.error('Error al enviar like:', error)
      throw error
    }
  }
  
  return {
    sendLike,
  }
}
