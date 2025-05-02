<template>
    <div class="relative group">
      <!-- Tooltip posicionado debajo del botón -->
      <span
        class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
      >
        respuesta adecuada
      </span>
      <button
        @click="toggleLike"
        :disabled="liked || in_rag"
        class="hover:bg-gray-200 rounded-md w-8 h-8 flex items-center justify-center transition-all duration-300 focus:outline-none"
        :class="{
          'text-white cursor-not-allowed': liked || in_rag,
          '': !(liked || in_rag)
        }"
      >
        <template v-if="liked || in_rag">
          <!-- Ícono relleno -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="gray" d="M23 10a2 2 0 0 0-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73zM1 21h4V9H1z"/>
          </svg>
        </template>
        <template v-else>
          <!-- Ícono sin relleno -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="gray" d="M5 9v12H1V9zm4 12a2 2 0 0 1-2-2V9c0-.55.22-1.05.59-1.41L14.17 1l1.06 1.06c.27.27.44.64.44 1.05l-.03.32L14.69 8H21a2 2 0 0 1 2 2v2c0 .26-.05.5-.14.73l-3.02 7.05C19.54 20.5 18.83 21 18 21zm0-2h9.03L21 12v-2h-8.79l1.13-5.32L9 9.03z"/>
          </svg>
        </template>
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useMessageLikes } from '@/composables/useLike'
  
  const props = defineProps({
    messageId: {
      type: Number,
      required: true
    },
    in_rag: {
      type: Boolean,
      default: false
    }
  })
  
  const liked = ref(false)
  const { sendLike } = useMessageLikes()
  
  const toggleLike = async () => {
    // Si ya se dio like o "in_rag" es true, no se procesa el click.
    if (liked.value || props.in_rag) return
    try {
      await sendLike(props.messageId)
      liked.value = true
    } catch (error) {
      console.error('Error en toggleLike:', error)
    }
  }
  </script>
  