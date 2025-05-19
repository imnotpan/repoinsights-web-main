<template>
  <div>
    <h3 class="text-xs font-semibold text-gray-600 mb-1">Proceso:</h3>
    <div
      v-for="(step, idx) in sortedSteps"
      :key="step.id"
      class="mb-2"
    >
      <!-- Título del desplegable -->
      <div
      class="cursor-pointer bg-gray-100 text-sm p-2 rounded-t flex justify-between items-center hover:bg-gray-200"
      @click="toggleStep(step.id)"
      >
        <div>
          <!-- Numeración sucesiva basada en idx -->
          <span class="font-bold">{{ idx + 1 }}.</span>
          <span class="ml-1">{{ step.step.name }}</span>
        </div>
      </div>

      <!-- Contenido desplegable con transición -->
      <transition name="fade">
        <div
          v-if="openSteps[step.id]"
          class="p-2 pl-4 text-xs text-gray-700 bg-gray-50 rounded-b prose prose-sm"
          v-html="renderMarkdown(step.details)"
        />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

const props = defineProps({
  steps: {
    type: Array,
    default: () => []
  }
})

// Estado de los desplegables
const openSteps = reactive({})

// Filtra pasos visibles
const visibleSteps = computed(() =>
  props.steps.filter(step => step.visible !== false)
)

// Ordena los pasos por step_order
const sortedSteps = computed(() =>
  visibleSteps.value
    .slice()
    .sort((a, b) => a.step_order - b.step_order)
)

const toggleStep = (id) => {
  openSteps[id] = !openSteps[id]
}

// Mantener estado de desplegables inicial
watch(
  () => sortedSteps.value.map(step => step.id),
  (newIds) => {
    newIds.forEach(id => {
      if (openSteps[id] === undefined) {
        openSteps[id] = false
      }
    })
  },
  { immediate: true }
)

// Función reutilizable para renderizar Markdown
const renderMarkdown = (text) => md.render(text || '')
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
