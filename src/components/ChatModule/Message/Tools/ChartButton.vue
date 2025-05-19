<template>
  <div class="flex items-center space-x-2">
    <!-- Usamos Tooltip alrededor del botón -->
    <Tooltip content="Mostrar gráfico">
      <button
        @click="toggle"
        :disabled="!chartEnabled && !hasStepChartStructure"
        class="hover:bg-gray-200 rounded-md w-8 h-8 flex items-center
               justify-center transition-all duration-300 focus:outline-none"
        :class="{
          'text-gray-300 cursor-not-allowed': !chartEnabled && !hasStepChartStructure,
          'text-blue-600': chartEnabled || hasStepChartStructure
        }"
        aria-label="Mostrar gráfico"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path fill="currentColor"
                d="M4 18h2V8H4v10zm6 0h2V4h-2v14zm6 0h2V12h-2v6z"/>
        </svg>
      </button>
    </Tooltip>

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
import { useChart } from '@/composables/useChart'
import Tooltip from '@/components/ChatModule/components/Tooltip.vue'

const props = defineProps({
  thread: { type: Object, required: true },
  open:   { type: Boolean, required: true }
})
const emit = defineEmits(['chart-toggled', 'chart-type-changed'])

const { sendChartRequest } = useChart()

const chartEnabled = computed(() => props.thread.chart_enabled)
const hasStepChartStructure = computed(() => {
  const steps = props.thread.response?.steps || []
  return steps.some(s => s.step.name === 'STEP_CHART_STRUCTURE')
})

const chartTypes = ['bar', 'line', 'pie', 'doughnut']
const selectedType = ref('bar')

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

function toggle() {
  emit('chart-toggled', !props.open)
}

function emitType() {
  emit('chart-type-changed', selectedType.value)
}
</script>
