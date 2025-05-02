<template>
  <div
    class="relative inline-block"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <!-- Indicador de confianza con color dinámico -->
    <div :class="[bgClass, 'w-[7px] h-full']"></div>

    <!-- Tooltip en la posición fija del ratón -->
    <div
      v-if="show"
      class="fixed z-[9999] pointer-events-none"
      :style="tooltipStyle"
    >
      <div class="bg-white text-black text-sm p-4 rounded-lg shadow-lg max-w-xs">
        <!-- Listado dinámico de todas las métricas -->
        <template v-for="metric in displayMetrics" :key="metric.code">
          <div :class="['flex justify-between mb-2', { 'text-gray-400': !metric.active }]">
            <div class="flex-1 min-w-0">
              <div class="font-bold">{{ metric.name }}</div>
              <div class="text-xs truncate overflow-hidden whitespace-nowrap">
                {{ metric.description }}
              </div>
            </div>
            <div class="font-mono ml-4 flex-shrink-0">
              {{ metric.value }}<span v-if="metric.measure">{{ metric.measure }}</span>
            </div>
          </div>
        </template>

        <!-- Confianza al final -->
        <div class="mt-2 pt-2 border-t border-gray-200 text-sm font-bold">
          Confianza: {{ confidenceMetric.value }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  metrics: {
    type: Array,
    default: () => []
  }
});

const show = ref(false);
const pos = ref({ x: 0, y: 0 });

function onMouseEnter(event) {
  if (!show.value) {
    pos.value = { x: event.clientX, y: event.clientY };
    show.value = true;
  }
}

function onMouseLeave() {
  show.value = false;
}

const tooltipStyle = computed(() => ({
  top:  `${pos.value.y}px`,
  left: `${pos.value.x}px`,
  transform: 'translate(-50%, -100%)'
}));

// 1) Métrica de confianza (objeto completo)
const confidenceMetric = computed(() =>
  props.metrics.find(m => m.code === 'METRIC_CONFIDENCE_FINAL') || { value: 0 }
);

// 2) Extraer el valor numérico y calcular clase
const bgClass = computed(() => {
  // <-- aquí usamos .value
  const rawValue = Number(confidenceMetric.value.value ?? 0);
  if (rawValue >= 90)      return 'bg-blue-500';
  else if (rawValue >= 70) return 'bg-green-500';
  else if (rawValue > 30)  return 'bg-yellow-400';
  else                      return 'bg-red-500';
});

// 3) Otras métricas a mostrar
const displayMetrics = computed(() =>
  props.metrics
    .filter(m => m.code !== 'METRIC_CONFIDENCE_FINAL')
    .sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1))
);
</script>
