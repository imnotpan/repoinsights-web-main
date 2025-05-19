// useDislike.js
import { axiosNLP } from '@/plugins/axios.js'

export function useMessageDislikes() {
  async function sendDislike(messageId) {
    return axiosNLP.post(`/similarity/messages/${messageId}/dislike`)
  }

  return { sendDislike }
}
