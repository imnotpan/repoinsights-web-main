<template>
  <!-- Elemento disparador del tooltip -->
  <div ref="triggerRef" class="inline-block">
    <slot />
  </div>

  <!-- Teleport del tooltip al body para evitar recortes por overflow -->
  <teleport to="body">
    <transition name="tooltip" appear>
      <div
        v-if="show"
        :style="{ top: `${y}px`, left: `${x}px` }"
        class="
          fixed bg-gray-700 text-white text-xs rounded px-2 py-1
          whitespace-nowrap z-[9999] pointer-events-none
        "
        role="tooltip"
        aria-hidden="true"
      >
        {{ content }}
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  content: { type: String, required: true }
})

// Estados reactivas para mostrar y posición
const show = ref(false)
const x = ref(0)
const y = ref(0)
const triggerRef = ref(null)

let enterHandler, leaveHandler

function updatePosition() {
  const rect = triggerRef.value.getBoundingClientRect()
  x.value = rect.left + rect.width / 2
  y.value = rect.bottom + 8
}

onMounted(() => {
  const triggerEl = triggerRef.value
  enterHandler = async () => {
    // recalcula y muestra con animación
    await nextTick()
    updatePosition()
    show.value = true
  }
  leaveHandler = () => { show.value = false }

  triggerEl.addEventListener('mouseenter', enterHandler)
  triggerEl.addEventListener('mouseleave', leaveHandler)
})

onBeforeUnmount(() => {
  const triggerEl = triggerRef.value
  triggerEl.removeEventListener('mouseenter', enterHandler)
  triggerEl.removeEventListener('mouseleave', leaveHandler)
})
</script>

<style scoped>
/* Transiciones de fade + scale */
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translate(-50%, 0) scale(0.95);
}
.tooltip-enter-to,
.tooltip-leave-from {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
}
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

/* Ajuste para centrar horizontalmente */
.fixed {
  transform: translateX(-50%);
}
</style>