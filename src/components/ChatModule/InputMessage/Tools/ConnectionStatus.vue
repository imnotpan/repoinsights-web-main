<template>
    <div class="p-1 connection-status h-full my-auto relative items-center border border-gray-300 rounded-xl">
      <!-- Conectado -->
      <div v-if="status === 'conectado'" class="relative group flex">
        <!-- Tooltip modificado para aparecer al lado -->
        <span
          class="absolute left-full top-1/2 ml-2 transform -translate-y-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        >
          {{ tooltipText }}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
          <path fill="currentColor" d="M640 384v64H448a128 128 0 0 0-128 128v128a128 128 0 0 0 128 128h320a128 128 0 0 0 128-128V576a128 128 0 0 0-64-110.848V394.88c74.56 26.368 128 97.472 128 181.056v128a192 192 0 0 1-192 192H448a192 192 0 0 1-192-192V576a192 192 0 0 1 192-192z"/>
          <path fill="currentColor" d="M384 640v-64h192a128 128 0 0 0 128-128V320a128 128 0 0 0-128-128H256a128 128 0 0 0-128 128v128a128 128 0 0 0 64 110.848v70.272A192.06 192.06 0 0 1 64 448V320a192 192 0 0 1 192-192h320a192 192 0 0 1 192 192v128a192 192 0 0 1-192 192z"/>
        </svg>
        <span class="text-sm ml-2">
            Conectado 
          </span>
      </div>
  
      <!-- Desconectado: al hacer click se reconecta -->
      <div v-else-if="status === 'desconectado'" class="text-red-400 flex items-center relative group">
        <!-- Tooltip modificado para aparecer al lado -->
        <span
          class="absolute left-full top-1/2 ml-2 transform -translate-y-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        >
          {{ tooltipText }}
        </span>
        <!-- El icono se muestra dentro de un botón para permitir reconectar -->
        <button @click="reconnect" class="flex items-center focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
            <path fill="currentColor" d="M640 384v64H448a128 128 0 0 0-128 128v128a128 128 0 0 0 128 128h320a128 128 0 0 0 128-128V576a128 128 0 0 0-64-110.848V394.88c74.56 26.368 128 97.472 128 181.056v128a192 192 0 0 1-192 192H448a192 192 0 0 1-192-192V576a192 192 0 0 1 192-192z"/>
            <path fill="currentColor" d="M384 640v-64h192a128 128 0 0 0 128-128V320a128 128 0 0 0-128-128H256a128 128 0 0 0-128 128v128a128 128 0 0 0 64 110.848v70.272A192.06 192.06 0 0 1 64 448V320a192 192 0 0 1 192-192h320a192 192 0 0 1 192 192v128a192 192 0 0 1-192 192z"/>
          </svg>
          <span class="text-sm ml-2">
            Desconectado
          </span>
        </button>
      </div>
  
      <!-- Reintentando conexión -->
      <div v-else-if="status === 'reintentar'" class="text-yellow-600 relative group">
        <!-- Tooltip modificado para aparecer al lado -->
        <span
          class="absolute left-full top-1/2 ml-2 transform -translate-y-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        >
          {{ tooltipText }}
        </span>
      </div>
    </div>
</template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useConnectionStore } from '@/store/connectionStore'
  import { connectToSSE } from '@/plugins/eventSource'
  
  const connectionStore = useConnectionStore()
  // Obtenemos el estado del store
  const status = computed(() => connectionStore.status)
  
  // Computada para definir el texto del tooltip según el estado
  const tooltipText = computed(() => {
    switch (status.value) {
      case 'conectado':
        return 'Conectado'
      case 'desconectado':
        return 'Desconectado. Presiona para reconectar'
      case 'reintentar':
        return 'Reintentando conexión…'
      default:
        return ''
    }
  })
  
  // Función para reintentar la conexión SSE
  async function reconnect() {
    connectionStore.setStatus("reintentar")
    try {
      connectToSSE()
    } catch (error) {
      console.error("Error reintentando conexión SSE: ", error)
      connectionStore.setStatus("desconectado")
    }
  }
  </script>
  
  <style scoped>
  .connection-status {
    font-size: 0.875rem;
  }
  </style>
  