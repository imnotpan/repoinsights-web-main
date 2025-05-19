<!-- src/components/ChatModule/InputMessage/Tools/ConnectionStatus.vue -->
<template>
  <div
    class="p-1 connection-status h-full my-auto relative items-center rounded-full flex items-center"
  >
    <!-- Conectado -->
    <Tooltip
      v-if="status === 'conectado'"
      placement="top"
      :arrow="true"
      theme="custom-light"
      trigger="mouseenter"
      :interactive="true"
      :delay="0"
      maxWidth="200px"
      :offset="[0,15]"
    >
      <template #button>
        <button class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 1024 1024"
            class="text-gray-500"
          >
            <path
              fill="currentColor"
              d="M640 384v64H448a128 128 0 0 0-128 128v128a128 128 0 0 0 128 128h320a128 128 0 0 0 128-128V576a128 128 0 0 0-64-110.848V394.88c74.56 26.368 128 97.472 128 181.056v128a192 192 0 0 1-192 192H448a192 192 0 0 1-192-192V576a192 192 0 0 1 192-192z"
            />
            <path
              fill="currentColor"
              d="M384 640v-64h192a128 128 0 0 0 128-128V320a128 128 0 0 0-128-128H256a128 128 0 0 0-128 128v128a128 128 0 0 0 64 110.848v70.272A192.06 192.06 0 0 1 64 448V320a192 192 0 0 1 192-192h320a192 192 0 0 1 192 192v128a192 192 0 0 1-192 192z"
            />
          </svg>
        </button>
      </template>
      <template #default>
        {{ tooltipText }}
      </template>
    </Tooltip>

    <!-- Desconectado: clic para reconectar -->
    <Tooltip
      v-else-if="status === 'desconectado'"
      placement="top"
      :arrow="false"
      theme="custom-light"
      trigger="mouseenter"
      :interactive="true"
      :delay="0"
      maxWidth="200px"
    >
      <template #button>
        <button
          @click="reconnect"
          class="flex items-center cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 1024 1024"
             class="text-red-600" 
          >
            <path
              fill="currentColor"
              d="M640 384v64H448a128 128 0 0 0-128 128v128a128 128 0 0 0 128 128h320a128 128 0 0 0 128-128V576a128 128 0 0 0-64-110.848V394.88c74.56 26.368 128 97.472 128 181.056v128a192 192 0 0 1-192 192H448a192 192 0 0 1-192-192V576a192 192 0 0 1 192-192z"
            />
            <path
              fill="currentColor"
              d="M384 640v-64h192a128 128 0 0 0 128-128V320a128 128 0 0 0-128-128H256a128 128 0 0 0-128 128v128a128 128 0 0 0 64 110.848v70.272A192.06 192.06 0 0 1 64 448V320a192 192 0 0 1 192-192h320a192 192 0 0 1 192 192v128a192 192 0 0 1-192 192z"
            />
          </svg>
        </button>
      </template>
      <template #default>
        {{ tooltipText }}
      </template>
    </Tooltip>

    <!-- Reintentando conexión -->
    <Tooltip
      v-else-if="status === 'reintentar'"
      placement="top"
      :arrow="false"
      theme="custom-light"
      trigger="mouseenter"
      :interactive="true"
      :delay="0"
      maxWidth="200px"
    >
      <template #button>
        <button class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24" 
            viewBox="0 0 1024 1024"
             class="text-red-600" 
          >
            <path
              fill="currentColor"
              d="M640 384v64H448a128 128 0 0 0-128 128v128a128 128 0 0 0 128 128h320a128 128 0 0 0 128-128V576a128 128 0 0 0-64-110.848V394.88c74.56 26.368 128 97.472 128 181.056v128a192 192 0 0 1-192 192H448a192 192 0 0 1-192-192V576a192 192 0 0 1 192-192z"
            />
            <path
              fill="currentColor"
              d="M384 640v-64h192a128 128 0 0 0 128-128V320a128 128 0 0 0-128-128H256a128 128 0 0 0-128 128v128a128 128 0 0 0 64 110.848v70.272A192.06 192.06 0 0 1 64 448V320a192 192 0 0 1 192-192h320a192 192 0 0 1 192 192v128a192 192 0 0 1-192 192z"
            />
          </svg>
        </button>
      </template>
      <template #default>
        {{ tooltipText }}
      </template>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Tooltip from '@/components/Tooltip/index.vue';
import { useConnectionStore } from '@/store/connectionStore';
import { connectToSSE } from '@/plugins/eventSource';

const connectionStore = useConnectionStore();
const status = computed(() => connectionStore.status);

const tooltipText = computed(() => {
  switch (status.value) {
    case 'conectado':      return 'Conectado';
    case 'desconectado':   return 'Desconectado. Presiona para reconectar';
    case 'reintentar':     return 'Reintentando conexión…';
    default:               return '';
  }
});

async function reconnect() {
  connectionStore.setStatus('reintentar');
  try {
    await connectToSSE();
  } catch {
    connectionStore.setStatus('desconectado');
  }
}
</script>

<style scoped>
.connection-status {
  font-size: 0.875rem;
}
</style>
