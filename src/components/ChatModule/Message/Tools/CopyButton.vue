<template>
  <!-- Usamos el componente Tooltip para el botón de copia -->
  <Tooltip :content="copied ? '¡Copiado!' : 'Copiar mensaje'">
    <button
      @click="copyText"
      class="hover:bg-gray-200 rounded-md w-8 h-8 flex items-center justify-center transition-all duration-300 focus:outline-none"
      aria-label="Copiar mensaje"
    >
      <!-- Icono proporcionado para el botón -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <g fill="none" stroke="gray" stroke-linecap="round" stroke-width="1.5">
          <path d="M20.998 10c-.012-2.175-.108-3.353-.877-4.121C19.243 5 17.828 5 15 5h-3c-2.828 0-4.243 0-5.121.879C6 6.757 6 8.172 6 11v5c0 2.828 0 4.243.879 5.121C7.757 22 9.172 22 12 22h3c2.828 0 4.243 0 5.121-.879C21 20.243 21 18.828 21 16v-1"/>
          <path d="M3 10v6a3 3 0 0 0 3 3M18 5a3 3 0 0 0-3-3h-4C7.229 2 5.343 2 4.172 3.172C3.518 3.825 3.229 4.7 3.102 6"/>
        </g>
      </svg>
    </button>
  </Tooltip>
</template>

<script setup>
import { ref } from 'vue'
import Tooltip from '@/components/ChatModule/components/Tooltip.vue'

const props = defineProps({
  /** Texto a copiar; se debe pasar desde el componente padre. */
  text: { type: String, required: true }
})

const copied = ref(false)

/** Copia el texto al portapapeles con fallback seguro */
const copyText = async () => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.text)
    } else {
      // Fallback con textarea y execCommand (TS ignore para evitar deprecation warning)
      const textarea = document.createElement('textarea')
      textarea.value = props.text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      // @ts-ignore: execCommand es obsoleto pero necesario para fallback
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    copied.value = true
    setTimeout(() => { copied.value = false }, 1000)
  } catch (error) {
    console.error('Error copiando el mensaje:', error)
  }
}
</script>
