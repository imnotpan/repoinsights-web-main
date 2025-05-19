<template>
  <div
    class="space-y-2 overflow-y-auto h-full overflow-x-hidden"
    ref="scrollContainer"
  >
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
    <div v-for="thread in messageStore.conversationThreads" :key="thread.id">
      <ConversationThread :thread="thread" />
    </div>

    <!-- Anchor para scroll automático -->
    <div ref="bottomAnchor" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick, watch } from 'vue'
import ConversationThread from '@/components/ChatModule/Conversation/Thread.vue'
import { useMessageStore } from '@/store/messageStore'
import { connectToSSE } from '@/plugins/eventSource.js'

const messageStore = useMessageStore()
const scrollContainer = ref(null)
const bottomAnchor = ref(null)
let disconnect = null

// Función manual para llevar el scroll al fondo
function scrollToBottom() {
  if (!scrollContainer.value) return
  scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
}

// Conexión SSE
function setupSSE() {
  disconnect = connectToSSE(async (newMsg) => {
    await nextTick()
    scrollToBottom()
  })
}

onMounted(async () => {
  // Traer mensajes y, una vez renderizados, scrollear al fondo
  await messageStore.fetchMessages()
  await nextTick()
  scrollToBottom()

  setupSSE()
})

onUnmounted(() => {
  if (disconnect) disconnect()
})

watch(
  () => messageStore.conversationThreads.length,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)

// Cargar más mensajes manteniendo la posición relativa del scroll
async function onLoadMore() {
  if (
    !scrollContainer.value ||
    !messageStore.hasMore ||
    messageStore.loadingMore
  )
    return
  const container = scrollContainer.value
  const previousHeight = container.scrollHeight

  await messageStore.loadMore()
  await nextTick()

  container.scrollTop = container.scrollHeight - previousHeight
}
</script>
