import { ref } from 'vue'
import {axiosNLP} from '@/plugins/axios.js'
import { useChartStore } from '@/store/chartStore.js'

/**
 * Composable para cargar datos de gráfico, ya sea desde SSE (almacenados en chartStore)
 * o mediante petición al backend.
 */
export function useChart() {
  const loading = ref(false)
  const error = ref(null)
  const chartStore = useChartStore()

  const sendChartRequest = async (messageId) => {
    loading.value = true
    error.value = null

    // 1) Intentar obtener datos desde SSE/chartStore
    const cached = chartStore.dataMap[messageId]
    if (cached) {
      loading.value = false
      return cached
    }

    // 2) Si no hay cache, solicitar al backend
    try {
      const response = await axiosNLP.post(
        `/core/metrics/${messageId}/query`
      )

      if (response.data && Array.isArray(response.data.labels)) {
        // Guardar en store para futuras consultas
        chartStore.setChartData(messageId, response.data)
        return response.data
      } else {
        console.error(
          'useChart: respuesta inesperada del backend',
          response.data
        )
        return null
      }
    } catch (err) {
      error.value = err
      console.error('Error al solicitar gráfico:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return { loading, error, sendChartRequest }
}
