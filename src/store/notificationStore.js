import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

// Store para disparar toasts basados en status_id de la notificación
export const useNotificationStore = defineStore('notification', {
  actions: {
    addNotification({ message, status_id = 0 }) {
      const toast = useToast()

      let type
      switch (status_id) {
        case 1:
          type = 'success'
          break
        case 2:
          type = 'error'
          break
        case 3:
          type = 'warning'
          break
        default:
          type = 'default'
      }

      // Dispara el toast
      toast(message, { type })
    }
  }
})
