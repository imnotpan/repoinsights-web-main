<!-- src/components/ChatModule/ChatView.vue -->
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
      <!-- Spinner interno: solo oculta con CSS, no desmonta -->
      <div
        v-show="messageStore.isLoading"
        class="flex-1 flex items-center justify-center"
      >
        <span class="text-gray-500">Cargando mensajes...</span>
      </div>

      <!-- Conversación existente -->
      <div
        v-show="!messageStore.isLoading && messageStore.conversationThreads.length"
        class="flex-1 min-h-0 overflow-y-auto mb-2"
      >
        <Messages />
      </div>

      <!-- Sin conversación previa -->
      <div
        v-show="!messageStore.isLoading && !messageStore.conversationThreads.length"
        class="flex-1 flex flex-col justify-center items-center mb-[10%]"
      >
        <div class="text-center">
          <h2 class="text-xl font-semibold mb-2">¡Me alegro de verte!</h2>
          <h3 class="text-base text-gray-600 mb-4">
            Pregúntame qué deseas saber
          </h3>
        </div>
      </div>

      <!-- Formulario: siempre montado, solo oculto durante la carga -->
      <MessageForm
        v-show="!messageStore.isLoading"
        class="flex-shrink-0 w-full"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useMessageStore } from '@/store/messageStore'
import Messages from '@/components/ChatModule/Conversation/Messages.vue'
import MessageForm from '@/components/ChatModule/InputMessage/MessageForm.vue'

const messageStore = useMessageStore()

onMounted(async () => {
  document.body.style.overflow = 'hidden'
  await messageStore.fetchMessages()
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
