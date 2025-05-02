<template>
  <div
    class="flex flex-col flex-1 min-h-0 overflow-hidden mx-auto
           w-full md:w-[90%] lg:w-[80%] xl:w-[75%]
           h-[87vh] md:h-[85vh]"
  >
    <div
      class="flex flex-col flex-1 min-h-0 mx-auto w-full
             max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-screen-2xl"
    >
      <!-- Loading -->
      <template v-if="messageStore.isLoading">
        <div class="flex-1 flex items-center justify-center">
          <span class="text-gray-500">Cargando mensajes...</span>
        </div>
      </template>

      <!-- Conversación -->
      <template v-else-if="messageStore.conversationThreads.length">
        <div class="flex-1 min-h-0 overflow-y-auto mb-2">
          <Messages />
        </div>
        <MessageForm class="flex-shrink-0" />
      </template>

      <template v-else>
        <div class="flex-1 flex flex-col justify-center items-center mb-[10%]">
          <div class="text-center">
            <h2 class="text-xl font-semibold mb-2">¡Me alegro de verte!</h2>
            <h3 class="text-base text-gray-600 mb-4">Pregúntame qué deseas saber</h3>
          </div>
          <MessageForm class="flex-shrink-0 w-full" />
        </div>
      </template>
    </div>

    <Notifications class="flex-shrink-0 py-2" />
  </div>
</template>

<script setup>
import { useMessageStore } from '@/store/messageStore';
import Messages from '@/components/ChatModule/Conversation/Messages.vue';
import MessageForm from '@/components/ChatModule/InputMessage/MessageForm.vue';
import Notifications from '@/components/ChatModule/Utils/Notifications.vue';
import { onMounted, onUnmounted } from 'vue';

const messageStore = useMessageStore();

onMounted(async () => {
  // bloquear scroll de body mientras estamos en el chat
  document.body.style.overflow = 'hidden';
  await messageStore.fetchMessages();
});
onUnmounted(() => {
  // restaurar scroll al salir del componente
  document.body.style.overflow = '';
});
</script>
