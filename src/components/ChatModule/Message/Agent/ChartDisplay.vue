<template>
  <!-- Aquí el root ocupa siempre todo el espacio que le dé el padre -->
  <div class="w-full h-full relative">
    <!-- Mensaje de carga / error centrado -->
    <div
      v-if="loading || error"
      class="absolute inset-0 flex items-center justify-center p-4 text-sm"
    >
      <span v-if="loading">Cargando gráfico…</span>
      <span v-else class="text-red-500">Error al cargar el gráfico.</span>
    </div>
    <!-- El canvas sólo aparece cuando no hay loading ni error -->
    <canvas
      v-else
      ref="canvasRef"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useChart } from '@/composables/Message/useChart'

Chart.register(...registerables)

const props = defineProps({
  messageId: { type: Number, required: true },
  overrideChartType: { type: String, default: null }
})

const canvasRef     = ref(null)
const chartInstance = ref(null)
const { loading, error, sendChartRequest } = useChart()

async function renderChart() {
  if (loading.value || error.value) return
  await nextTick()
  if (!canvasRef.value) return

  const data = await sendChartRequest(props.messageId)
  if (!data) return

  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }

  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  const count = data.values.length
  const bg = data.values.map((_, i) =>
    `hsla(${Math.round((360 * i) / count)}, 70%, 50%, 0.6)`
  )
  const bd = data.values.map((_, i) =>
    `hsla(${Math.round((360 * i) / count)}, 70%, 50%, 1)`
  )

  chartInstance.value = new Chart(ctx, {
    type: props.overrideChartType || data.chart_type || 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: data.axis_labels.y || '',
        data: data.values,
        backgroundColor: bg,
        borderColor: bd,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: { title: { display: !!data.axis_labels.x, text: data.axis_labels.x || '' } },
        y: { beginAtZero: true, title: { display: !!data.axis_labels.y, text: data.axis_labels.y || '' } }
      }
    }
  })

  // Forzar un resize por si el contenedor ya tenía tamaño
  chartInstance.value.resize()
}

onMounted(renderChart)
watch(
  [() => props.overrideChartType, () => loading.value, () => error.value],
  renderChart
)

onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }
})
</script>

