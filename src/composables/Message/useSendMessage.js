// composables/useSendMessage.js
import { ref } from 'vue';
import { axiosNLP } from '@/plugins/axios.js';
import { useMessageRepliesStore } from '@/store/replyStore';

export function useSendMessage(editorRef, getTextFn) {
  const loading = ref(false);
  const error = ref(null);
  const replyStore = useMessageRepliesStore();

  const send = async (content, projectId, replyToId = null) => {
    console.log("CONTENT TO SEND: " + content)
    let finalContent = '';
    if (typeof content === 'string' && content !== '') {
     finalContent = content;
    } else if (getTextFn) {
      finalContent = getTextFn();
    }
    finalContent = finalContent.replace(/\u200B/g, '');
    if (!finalContent.replace(/\s/g, '')) {
      error.value = 'El mensaje no puede estar vacío';
      return null;
    }

    loading.value = true;
    error.value = null;

    try {
      const effectiveReplyId = replyToId ?? replyStore.replyToId;
      const payload = {
        content: finalContent,
        project_id: projectId,
        ...(effectiveReplyId && { reply_to_id: effectiveReplyId }),
      };
      console.log('TO BACK PAYLOAD', payload);

      const response = await axiosNLP.post(
        '/core/message/send',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Limpiar editor
      if (editorRef?.value) {
        editorRef.value.innerHTML = '';
      }
      replyStore.clearReply();

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      console.error('Error al enviar mensaje:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, send };
}
