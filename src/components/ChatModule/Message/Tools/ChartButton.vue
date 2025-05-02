<template>
    <div class="flex items-center space-x-2">
      <!-- Botón para mostrar/ocultar gráfico -->
      <div class="relative group">
        <span
          class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2
                 bg-gray-700 text-white text-xs rounded px-2 py-1
                 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                 whitespace-nowrap"
        >
          Mostrar gráfico
        </span>
        <button
          @click="toggle"
          :disabled="!chartEnabled && !hasStepChartStructure"
          class="hover:bg-gray-200 rounded-md w-8 h-8 flex items-center
                 justify-center transition-all duration-300 focus:outline-none"
          :class="{
            'text-gray-300 cursor-not-allowed': !chartEnabled && !hasStepChartStructure,
            'text-blue-600': chartEnabled || hasStepChartStructure
          }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor"
                  d="M4 18h2V8H4v10zm6 0h2V4h-2v14zm6 0h2V12h-2v6z"/>
          </svg>
        </button>
      </div>
  
      <!-- Selector de tipo de gráfico -->
      <select
        v-if="open"
        v-model="selectedType"
        @change="emitType"
        class="border rounded px-2 py-1 text-sm"
      >
        <option v-for="t in chartTypes" :key="t" :value="t">
          {{ t }}
        </option>
      </select>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { useChart } from '@/composables/Message/useChart'
  
  const props = defineProps({
    thread: { type: Object, required: true },
    open:   { type: Boolean, required: true }
  })
  const emit = defineEmits(['chart-toggled', 'chart-type-changed'])
  
  const { sendChartRequest } = useChart()
  
  // Control de habilitación
  const chartEnabled = computed(() => props.thread.chart_enabled)
  const hasStepChartStructure = computed(() => {
    const steps = props.thread.response?.steps || []
    return steps.some(s => s.step.name === 'STEP_CHART_STRUCTURE')
  })
  
  // Tipos posibles y estado local
  const chartTypes = ['bar', 'line', 'pie', 'doughnut']
  const selectedType = ref('bar')
  
  // Cuando `open` pase a true, pedimos datos y sincronizamos el selector
  watch(
    () => props.open,
    async (isOpen) => {
      if (!isOpen) return
  
      try {
        const data = await sendChartRequest(props.thread.id)
        selectedType.value = data?.chart_type || 'bar'
        emit('chart-type-changed', selectedType.value)
        emit('chart-toggled', true)
      } catch {
        emit('chart-toggled', false)
      }
    }
  )
  
  // Alternar estado
  function toggle() {
    emit('chart-toggled', !props.open)
  }
  
  // Emitir cambio de tipo
  function emitType() {
    emit('chart-type-changed', selectedType.value)
  }
  </script>
  
  <style scoped>
  /* Estilos adicionales si los necesitas */
  </style>
  