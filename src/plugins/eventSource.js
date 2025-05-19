// src/plugins/eventSource.js
import { useMessageStore } from '@/store/messageStore';
import { useConnectionStore } from '@/store/connectionStore';
import { useNotificationStore } from '@/store/notificationStore';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useUserStore } from '@/store/user';
import { useSSEProcessor } from '@/composables/useSSEProcessor';

export function connectToSSE(callback) {
  const messageStore = useMessageStore();
  const connectionStore = useConnectionStore();
  const notificationStore = useNotificationStore();
  const userStore = useUserStore();
  const { processSSE } = useSSEProcessor()

  const token = userStore.token;
  if (!token) {
    console.error("Token no encontrado. No se puede establecer conexión SSE.");
    return () => {};
  }

  const url = import.meta.env.VITE_DEV
    ? 'http://146.83.216.157:8080/core/sse'
    : 'https://backend.repoinsights.app/core/sse';

  let eventSource = null;
  let retryTimeout = 3000; 

  const createConnection = () => {
    console.log(`🔄 Intentando conectar SSE (next retry in ${retryTimeout/1000}s if fails)…`);
    eventSource = new EventSourcePolyfill(url, {
      headers: { Authorization: `Bearer ${token}` },
      heartbeatTimeout: 45000,
    });

    eventSource.onopen = () => {
      console.log("✅ SSE conectado.");
      connectionStore.setStatus("conectado");
      retryTimeout = 3000;
    };

    eventSource.addEventListener('agent_message', (event) => {
      try {
        const sseData = JSON.parse(event.data);
        const thread = messageStore.conversationThreads.find( t => Number(t.id) === Number(sseData.message_id) );

        processSSE(thread, sseData);
        callback?.(sseData);
      } catch (err) {
        console.error("❌ Error procesando agent_message:", err);
      }
    });

    eventSource.addEventListener('on_notify', (event) => {
      try {
        const notificationData = JSON.parse(event.data);
        notificationStore.addNotification(notificationData);
      } catch (err) {
        console.error("❌ Error procesando on_notify:", err);
      }
    });

    eventSource.onerror = (err) => {
      console.error("❌ SSE error:", err);
      connectionStore.setStatus("desconectado");
      eventSource.close();

      setTimeout(() => {
        retryTimeout = Math.min(retryTimeout * 2, 60000);
        createConnection();
      }, retryTimeout);
    };
  };

  createConnection();
  return () => {
    if (eventSource) {
      eventSource.close();
      connectionStore.setStatus("desconectado");
    }
  };
}
