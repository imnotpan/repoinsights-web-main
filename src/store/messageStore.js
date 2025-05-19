// src/store/messages.js
import { defineStore } from 'pinia';
import { useMessageMapper } from '@/composables/Message/useMessageMapper';
import { useSSEProcessor } from '@/composables/useSSEProcessor';
import { useFetchMessages } from '@/composables/Message/useFetchMessages';
import { useSendMessage } from '@/composables/Message/useSendMessage';
import { useFetchMessageProcess } from '@/composables/Message/useFetchMessageProcess';

export const useMessageStore = defineStore('messages', {
  state: () => ({
    isLoading: false,          // Indicador de carga inicial
    conversationThreads: [],   // Hilos de conversación mapeados
    offset: 0,                 // Desplazamiento para paginación
    limit: 15,                 // Límite de mensajes por página
    hasMore: false,            // Indica si hay más mensajes para cargar
    loadingMore: false,        // Indicador de carga adicional
    userMessages: [],          // (Opcional) Mensajes enviados por el usuario
    messageGroups: [],         // (Opcional) Grupos de mensajes
    messageProcessCache: {}    // Cache de procesos por mensaje
  }),
  actions: {
    /** Carga inicial de mensajes (primeros `limit` hilos) */
    async fetchMessages() {
      this.isLoading = true;
      this.offset = 0;

      const { getMessages } = useFetchMessages();
      const { mapMessages } = useMessageMapper();
      try {
        const { messages, hasMore } = await getMessages(
          this.limit,
          this.offset
        );
        this.conversationThreads = mapMessages(messages)
        this.hasMore = hasMore
        this.offset = messages.length

      } catch (error) {
        console.error('Error al obtener mensajes:', error);
      } finally {
        this.isLoading = false
      }
    },
    
    /** Carga más mensajes anteriores (paginación) */
    async loadMore() {
      if (!this.hasMore || this.loadingMore) return;
      this.loadingMore = true;
      try {
        const { fetchMessages } = useFetchMessages();
        const { mapMessages } = useMessageMapper();
        const { messages, has_more } = await fetchMessages(
          this.limit,
          this.offset
        );

        // Mapear nuevos y prependear al array existente
        const newThreads = mapMessages(messages);
        this.conversationThreads = [
          ...newThreads,
          ...this.conversationThreads
        ];

        this.hasMore = has_more;
        this.offset += messages.length;
      } catch (error) {
        console.error('Error al cargar más mensajes:', error);
      } finally {
        this.loadingMore = false;
      }
    },

    /** Envía un nuevo mensaje y lo añade al final del hilo */
    async sendMessage(content, projectId, replyToId = null) {
      try {
        const { send } = useSendMessage();
        const result = await send(content, projectId, replyToId);
        if (result?.message) {
          this.conversationThreads.push(result.message);
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
      }
    },

    /** Obtiene el proceso asociado a un mensaje y lo cachea */
    async fetchMessageProcess(messageId) {
      try {
        const { fetchMessageProcess } = useFetchMessageProcess();
        const process = await fetchMessageProcess(messageId);
        if (process) {
          this.messageProcessCache[messageId] = process;
        }
        return process;
      } catch (error) {
        console.error('Error al obtener el proceso del mensaje:', error);
        throw error;
      }
    },


    setChartEnabled(thread, enabled) {
      if (thread) {
        thread.chart_enabled = enabled;
      }
    },

    setInSummary(thread, inSummary) {
      if (thread) {
        thread.in_summary = inSummary;
      }
    },

    setStatusId(thread, statusId) {
      if (!thread) return;
      thread.status_id = statusId;
    },

    setMessageAgentID(thread, agentMessageId) {
      if (!thread) return;
      thread.response.id = agentMessageId;
    },

    setConfiabilityData(thread, metrics) {
        if (!thread) return
        // Asegúrate de que exista response

        // Ahora sí asigna metrics
        thread.response.metrics = metrics
    },
    setResponseContent(thread, content) {
        if (!thread.response) {
          thread.response = {}
        }
      thread.response.content = content;
    },
  }
});
