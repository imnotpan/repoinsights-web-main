<template>
  <!-- Solo mostrar el botón si el mensaje está en summary y aún no se ha marcado dislike -->
  <div v-if="inSummary" class="inline-block">
    <Tooltip content="eliminar del summary">
      <button
        @click="toggleDislike"
        :disabled="disliked"
        class="hover:bg-gray-200 rounded-md w-8 h-8 flex items-center justify-center transition-all duration-300 focus:outline-none"
        :class="{ 'cursor-not-allowed opacity-50': disliked }"
        aria-label="Eliminar del summary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path fill="gray" d="M19 15V3h4v12zM15 3a2 2 0 0 1 2 2v10c0 .55-.22 1.05-.59 1.41L9.83 23l-1.06-1.06c-.27-.27-.44-.64-.44-1.06l.03-.31l.95-4.57H3a2 2 0 0 1-2-2v-2c0-.26.05-.5.14-.73l3.02-7.05C4.46 3.5 5.17 3 6 3zm0 2H5.97L3 12v2h8.78l-1.13 5.32L15 14.97z"/>
        </svg>
      </button>
    </Tooltip>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Tooltip from '@/components/ChatModule/components/Tooltip.vue'
import { useMessageDislikes } from '@/composables/useDislike'

const props = defineProps({
  response_id: { type: Number, required: true },
  in_summary: { type: Boolean, default: false }
})

// Computed para manejar v-if y binding de disabled
const inSummary = computed(() => props.in_summary)
const disliked = ref(false)
const { sendDislike } = useMessageDislikes()

const toggleDislike = async () => {
  if (!inSummary.value || disliked.value) return
  try {
    const response = await sendDislike(props.response_id)
    if (response.status === 200 && response.data.success) {
      disliked.value = true
    } else {
      console.warn('Respuesta inesperada:', response.data)
    }
  } catch (err) {
    console.error('Error al eliminar del summary:', err)
  }
}
</script>
