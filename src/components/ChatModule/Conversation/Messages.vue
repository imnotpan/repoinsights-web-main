<template>
    <div class="space-y-2 overflow-y-auto h-full overflow-x-hidden" ref="scrollContainer">
      <!-- Botón para cargar más solo si hay más mensajes -->
      <div v-if="messageStore.hasMore" class="text-center py-2">
        <button
          @click="onLoadMore"
          :disabled="messageStore.loadingMore"
          class="text-blue-600 hover:underline"
        >
          {{ messageStore.loadingMore ? 'Cargando…' : 'Mostrar más' }}
        </button>
      </div>
  
      <!-- Hilos de conversación -->
      <div
        v-for="thread in messageStore.conversationThreads"
        :key="thread.id"
      >
        <ConversationThread :thread="thread" />
      </div>
  
      <!-- Anchor para scroll automático en nuevos mensajes -->
      <div ref="bottomAnchor" />
    </div>
  </template>
  
  <script setup>
  import { onMounted, onUnmounted, ref, nextTick } from 'vue';
  import ConversationThread from '@/components/ChatModule/Conversation/Thread.vue';
  import { useMessageStore } from '@/store/messageStore';
  import { useScrollToBottom } from '@/composables/useScrollToBottom';
  import { connectToSSE } from '@/plugins/eventSource.js';
  
  const messageStore = useMessageStore();
  const userId = 1;
  const scrollContainer = ref<HTMLElement | null>(null);
  const bottomAnchor = ref<HTMLElement | null>(null);
  const { scrollToBottom, debouncedScrollToBottom } = useScrollToBottom(bottomAnchor);
  
  onMounted(async () => {
    // Carga inicial y scroll al fondo
    await messageStore.fetchMessages(userId);
    await nextTick();
    scrollToBottom();
  
    // SSE: nuevos mensajes => append + scroll al fondo
    const disconnect = connectToSSE((newMsg) => {
      debouncedScrollToBottom();
    });
    onUnmounted(() => {
      if (disconnect) disconnect();
    });
  });
  
  /* Cargar más mensajes (paginación atrás) manteniendo la posición del scroll */
  async function onLoadMore() {
    if (!scrollContainer.value || !messageStore.hasMore || messageStore.loadingMore) return;
    const container = scrollContainer.value;
    // Altura antes de cargar más
    const previousHeight = container.scrollHeight;
  
    // Cargar nuevos mensajes al inicio de la lista
    await messageStore.loadMore(userId);
    await nextTick();
  
    // Ajustar scroll para que la vista quede en el mismo lugar relativo
    container.scrollTop = container.scrollHeight - previousHeight;
  }
  </script>
  