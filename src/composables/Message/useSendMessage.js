import { ref } from 'vue';
import {axiosNLP} from '@/plugins/axios.js';
import { useMessageRepliesStore } from '@/store/replyStore'; // Ajusta la ruta según tu estructura

export function useSendMessage(editorRef) {
    const loading = ref(false);
    const error = ref(null);
    const replyStore = useMessageRepliesStore(); // Usamos el store de respuestas

    const send = async (content, projectId, replyToId = null) => {
        // Extraer contenido del editor si está vacío
        let editorContent = '';
        if (editorRef?.value) {
        editorContent = editorRef.value.textContent?.trim() || '';
        }
        const finalContent = (content?.trim() || editorContent).trim();

        // Validaciones básicas
        if (!finalContent || finalContent === 'Escribe tu pregunta aquí') {
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
            // sólo lo añadimos si efectivamente hay ID
            ...(effectiveReplyId && { reply_to_id: effectiveReplyId }),
        };
        console.log('TO BACK PAYLOAD', payload);

        const response = await axiosNLP.post(
            '/core/chat/message/send',
            payload,
            { headers: { 'Content-Type': 'application/json' } }
        );

        console.log(response)

        // Limpiar editor
        if (editorRef?.value) {
            editorRef.value.textContent = '';
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
