<template>
    <div class="relative group">
      <!-- Tooltip posicionado debajo del botón -->
      <span
        class="absolute top-full left-1/2 transform -translate-x-1/2  mt-2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
      >
        {{ copied ? "¡Copiado!" : "Copiar mensaje" }}
      </span>
      <button
        @click="copyText"
        class="hover:bg-gray-200 rounded-md w-8 h-8 flex items-center justify-center transition-all duration-300 focus:outline-none"
      >
        <!-- Icono proporcionado para el botón -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <g fill="none" stroke="gray" stroke-linecap="round" stroke-width="1.5">
            <path d="M20.998 10c-.012-2.175-.108-3.353-.877-4.121C19.243 5 17.828 5 15 5h-3c-2.828 0-4.243 0-5.121.879C6 6.757 6 8.172 6 11v5c0 2.828 0 4.243.879 5.121C7.757 22 9.172 22 12 22h3c2.828 0 4.243 0 5.121-.879C21 20.243 21 18.828 21 16v-1"/>
            <path d="M3 10v6a3 3 0 0 0 3 3M18 5a3 3 0 0 0-3-3h-4C7.229 2 5.343 2 4.172 3.172C3.518 3.825 3.229 4.7 3.102 6"/>
          </g>
        </svg>
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
    // Texto a copiar; se debe pasar desde el componente padre.
    text: {
      type: String,
      required: true
    }
  })
  
  // Estado reactivo que controla si ya se copió el texto
  const copied = ref(false)
  
  const copyText = async () => {
    try {
      // Utiliza la Clipboard API para copiar el texto proporcionado
      await navigator.clipboard.writeText(props.text)
      copied.value = true
      // Reinicia el estado después de 2 segundos
      setTimeout(() => {
        copied.value = false
      }, 1000)
    } catch (error) {
      console.error("Error copiando el mensaje:", error)
    }
  }
  </script>
  