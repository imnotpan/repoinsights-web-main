<!-- src/components/Notifications.vue -->
<template>
    <div class="fixed bottom-4 right-4 space-y-2 z-50 w-full max-w-sm">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        :class="[
          'p-4 rounded shadow-lg transition-all border-l-4',
          statusClass(notif.status_id)
        ]"
      >
        <div class="flex justify-between items-center mb-2">
          <strong class="font-semibold">{{ notif.message }}</strong>
          <button
            @click="remove(notif.id)"
            class="text-xs font-bold focus:outline-none hover:opacity-75"
          >
            x
          </button>
        </div>
        <p class="text-sm">
          {{ notif.details }}
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useNotificationStore } from '@/store/notificationStore';
  
  const store = useNotificationStore();
  const notifications = computed(() => store.notifications);
  
  const remove = (id) => {
    store.removeNotification(id);
  };
  
  // Retorna clases CSS según el status
  // Ajusta a la paleta de colores que prefieras.
  const statusClass = (status) => {
    switch (status) {
      case 1: // success
        return 'bg-green-50 text-green-800 border-green-600';
      case 2: // error
        return 'bg-red-50 text-red-800 border-red-600';
      case 3: // warning
        return 'bg-yellow-50 text-yellow-800 border-yellow-600';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-400';
    }
  };
  </script>
  