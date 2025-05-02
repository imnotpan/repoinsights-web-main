// src/plugins/eventSource.js
import { useMessageStore } from '@/store/messageStore';
import { useConnectionStore } from '@/store/connectionStore';
import { useNotificationStore } from '@/store/notificationStore';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useUserStore } from '@/store/user';

export function connectToSSE(callback) {
  const messageStore = useMessageStore();
  const connectionStore = useConnectionStore();
  const notificationStore = useNotificationStore();
  const userStore = useUserStore();

  const token = userStore.token;

  if (!token) {
    console.error("Token no encontrado. No se puede establecer conexión SSE.");
    return null;
  }
  console.log(token)

  const url = import.meta.env.VITE_DEV
    ? 'http://146.83.216.157:8080/core/sse'
    : 'https://backend.repoinsights.app/core/sse';

  const eventSource = new EventSourcePolyfill(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    heartbeatTimeout: 45000,
  });

  eventSource.onopen = () => {
    console.log("✅ SSE conexión establecida.");
    connectionStore.setStatus("conectado");
  };

  eventSource.addEventListener('agent_message', (event) => {
    console.log("📩 Mensaje SSE recibido:", event.data);
    try {
      const sseData = JSON.parse(event.data);
      messageStore.appendProcessSSE(sseData);
      if (callback) {
        callback(sseData);
      }
    } catch (error) {
      console.error("❌ Error procesando el mensaje SSE:", error);
    }
  });

  eventSource.addEventListener('on_notify', (event) => {
    console.log("🔔 Notificación SSE recibida:", event.data);
    try {
      const notificationData = JSON.parse(event.data);
      notificationStore.addNotification(notificationData);
    } catch (error) {
      console.error("❌ Error procesando la notificación SSE:", error);
    }
  });

  eventSource.onerror = (error) => {
    console.error("❌ Error en la conexión SSE:", error);
    connectionStore.setStatus("desconectado");

    if (eventSource.readyState === EventSourcePolyfill.CLOSED) {
      console.warn("🚫 SSE connection closed. Attempting to reconnect...");
    }

    eventSource.close();
  };

  return eventSource;
}
