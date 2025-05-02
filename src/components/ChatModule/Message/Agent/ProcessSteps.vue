<template>
  <div>
    <h3 class="text-xs font-semibold text-gray-600 mb-1">Proceso:</h3>
    <div
      v-for="step in visibleSteps"
      :key="step.id"
      class="mb-2"
    >
      <!-- Título del desplegable -->
      <div
        class="cursor-pointer bg-gray-100 text-sm p-2 rounded-t flex justify-between items-center"
        @click="toggleStep(step.id)"
      >
        <div>
          <span class="font-bold">{{ step.step_order }}. </span>
          {{ step.step.name }}
        </div>
      </div>
      <!-- Contenido desplegable con transición -->
      <transition name="fade">
        <div
          v-if="openSteps[step.id]"
          class="p-2 pl-4 text-xs text-gray-700 bg-gray-50 rounded-b"
        >
          <em>{{ step.details }}</em>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    default: () => []
  }
})

const openSteps = reactive({})

// Computed que filtra sólo los visibles
const visibleSteps = computed(() => 
  props.steps.filter(step => step.visible !== false)
)

const toggleStep = (id) => {
  openSteps[id] = !openSteps[id]
}

watch(
  () => visibleSteps.value.map(step => step.id),
  (newIds) => {
    newIds.forEach(id => {
      if (openSteps[id] === undefined) {
        openSteps[id] = false
      }
    })
  },
  { immediate: true }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
