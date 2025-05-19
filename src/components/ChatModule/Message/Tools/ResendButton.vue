<template>
  <!-- Botón de reenviar envuelto en Tooltip -->
  <Tooltip :content="tooltipText">
    <button
      @click="resend"
      class="p-2 hover:bg-gray-200 rounded focus:outline-none"
      :disabled="!hasProject"
      aria-label="Reenviar mensaje"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32">
        <path fill="gray" d="M26.41 25L30 21.41L28.59 20L25 23.59L21.41 20L20 21.41L23.59 25L20 28.59L21.41 30L25 26.41L28.59 30L30 28.59zM18 2A12.035 12.035 0 0 0 6 14v6.2l-3.6-3.6L1 18l6 6l6-6l-1.4-1.4L8 20.2V14a10 10 0 0 1 20 0v3h2v-3A12.035 12.035 0 0 0 18 2"/>
      </svg>
    </button>
  </Tooltip>
</template>

<script setup>
import { computed } from 'vue'
import Tooltip from '@/components/ChatModule/components/Tooltip.vue'
import { useMessageStore } from '@/store/messageStore'
import { useProjectStore } from '@/store/projectStore'

const props = defineProps({
  thread: { type: Object, required: true }
})

const messageStore = useMessageStore()
const projectStore = useProjectStore()

// Computed para saber si hay proyecto seleccionado
const hasProject = computed(() => !!projectStore.selectedProject)

// Texto del tooltip basado en el contenido del hilo
const tooltipText = computed(
  () => `Reintentar`
)

// Función para reenviar el mensaje
async function resend() {
  if (!hasProject.value) {
    console.warn('No hay proyecto seleccionado.')
    return
  }

  const projectId = projectStore.selectedProject.id
  const content   = props.thread.content

  try {
    if (props.thread.reply_to_id) {
      await messageStore.sendMessage(
        content,
        projectId,
        props.thread.reply_to_id
      )
    } else {
      await messageStore.sendMessage(
        content,
        projectId
      )
    }
  } catch (err) {
    console.error('Error reenviando mensaje:', err)
  }
}
</script>
