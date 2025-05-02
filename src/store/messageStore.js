// src/store/messages.js
import { defineStore } from 'pinia';
import { useMessageMapper } from '@/composables/Message/useMessageMapper';
import { useSSEProcessor } from '@/composables/Message/useSSEProcessor';
import { useFetchMessages } from '@/composables/Message/useFetchMessages';
import { useSendMessage } from '@/composables/Message/useSendMessage';
import { useFetchMessageProcess } from '@/composables/Message/useFetchMessageProcess';

export const useMessageStore = defineStore('messages', {
  state: () => ({
    conversationThreads: [],    // Hilos de conversación mapeados
    offset: 0,                  // Desplazamiento para paginación
    limit: 15,                  // Límite de mensajes por página
    hasMore: false,             // Indica si hay más mensajes para cargar
    loadingMore: false,         // Indicador de carga adicional
    userMessages: [],           // (Opcional) Mensajes enviados por el usuario
    messageGroups: [],          // (Opcional) Grupos de mensajes
    messageProcessCache: {}     // Cache de procesos por mensaje
  }),
  actions: {
    /**
     * Carga inicial de mensajes (primeros `limit` hilos)
     */
    async fetchMessages() {
      this.isLoading = true;
      try {
        this.offset = 0;
        this.hasMore = false;
        const { fetchMessages } = useFetchMessages();
        const { mapMessages } = useMessageMapper();
        const { messages, has_more } = await fetchMessages(
          this.limit,
          this.offset
        );
        this.conversationThreads = mapMessages(messages);
        this.hasMore = has_more;
        this.offset += messages.length;

        console.log(messages)
      } catch (error) {
        console.error('Error al obtener mensajes:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Carga más mensajes anteriores (paginación)
     */
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
        this.conversationThreads = [...newThreads, ...this.conversationThreads];

        this.hasMore = has_more;
        this.offset += messages.length;
      } catch (error) {
        console.error('Error al cargar más mensajes:', error);
      } finally {
        this.loadingMore = false;
      }
    },

    /**
     * Envía un nuevo mensaje y lo añade al final del hilo
     */
    async sendMessage(content, projectId, replyToId = null) {
        try {
          const { send } = useSendMessage();
          const result = await send(content,projectId, replyToId);
          if (result?.message) {
            this.conversationThreads.push(result.message);
          }
        } catch (error) {
          console.error('Error al enviar el mensaje:', error);
        }
      },

    /**
     * Obtiene el proceso asociado a un mensaje y lo cachea
     */
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

    /**
     * Procesa datos SSE de proceso y actualiza los hilos
     */
    appendProcessSSE(sseData) {
      const { processSSE } = useSSEProcessor();
      processSSE(this.conversationThreads, sseData);
    },
    setChartEnabled(messageId, enabled) {
        const thread = this.conversationThreads.find(t => t.id === messageId)
        if (thread) {
          thread.chart_enabled = enabled
        }
      },
    setConfiabilityData(messageId, metrics) {
        const thread = this.conversationThreads.find(t => t.id === messageId)
        console.log("OUTSIDE STATE")

        if (thread) {
            console.log("INSIDE STATE")
            thread.response = thread.response || { content: '', status_id: null };
            thread.response.metrics = metrics
            console.log(thread)
        }
    }
  }
});