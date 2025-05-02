// src/stores/notificationStore.js
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: []
  }),
  actions: {
    addNotification(notification) {
      // Asignamos un id único basado en el tiempo
      notification.id = Date.now();
      this.notifications.push(notification);
      // Remover la notificación automáticamente después de 5 segundos
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, 5000);
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    }
  }
});
