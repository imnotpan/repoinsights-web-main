<template>
  <div ref="wrapper" class="inline-block relative">
    <!-- Tooltip: siempre presente, sólo que el botón dentro se deshabilita -->
    <Tooltip
      placement="top"
      :arrow="true"
      theme="light"
      trigger="mouseenter focus"
      :interactive="true"
      :offset="[0,12]"
    >
      <template #button>
        <button
          @click.stop="enterConfirmMode"
          :disabled="confirmMode"
          class="p-1 rounded-full focus:outline-none transition"
          :class="confirmMode
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-red-600 hover:bg-gray-100'"
        >
          <!-- icono papelera -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
               viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
            <path d="M3 6h18M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6m-6 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </template>
      <template #default>
        <div class="min-w-[150px] text-sm space-y-1 text-center">
            <p class="font-semibold">Borrar historial de chat</p>
        </div>
      </template>
    </Tooltip>

    <div
      v-if="confirmMode"
      class="absolute left-1/2 transform  bottom-full
            -translate-x-1/2 mb-[1rem]
            w-60 bg-white border rounded shadow-lg p-3 text-sm z-50"
        >
      <p class="font-semibold">¿Seguro que deseas eliminar?</p>
      <div class="mt-2 flex justify-end space-x-2">
        <button
          @click="cancelConfirm"
          class="py-1 px-3 rounded border border-gray-300 hover:bg-gray-100 text-xs"
        >Cancelar</button>
        <button
          @click="onConfirmDelete"
          :disabled="loading"
          class="py-1 px-3 rounded bg-red-600 text-white hover:bg-red-700 text-xs"
        >
          <span v-if="loading">…</span><span v-else>Confirmar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Tooltip from '@/components/Tooltip/index.vue'
import { useDeleteChat } from '@/composables/useDeleteChat.js'
import { useMessageStore } from '@/store/messageStore'

const wrapper = ref(null)
const confirmMode = ref(false)
const { loading, deleteChat } = useDeleteChat()
const messageStore = useMessageStore()

function enterConfirmMode() {
  confirmMode.value = true
}

// Si haces click fuera del popover, se cancela
function onDocumentClick(e) {
  if (confirmMode.value && wrapper.value && !wrapper.value.contains(e.target)) {
    confirmMode.value = false
  }
}

function cancelConfirm() {
  confirmMode.value = false
}

async function onConfirmDelete() {
  const ok = await deleteChat()
  if (ok) {
    messageStore.conversationThreads = []
    messageStore.hasMore = false
    messageStore.offset = 0
  }
  confirmMode.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
</script>
