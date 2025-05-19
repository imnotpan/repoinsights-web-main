// src/composables/useSSEProcessor.js

import { useChartStore }   from '@/store/chartStore'
import { useMessageStore } from '@/store/messageStore'

export function useSSEProcessor() {
  const chartStore   = useChartStore()
  const messageStore = useMessageStore()

  function processSSE(thread, sseData) {
    const statusId = sseData.status_id

    if (!thread) {
      return
    }
    if (statusId !== 4){
      messageStore.setStatusId(thread, statusId)
    }
    thread.process = Array.isArray(thread.process) ? thread.process : []
    const newProcess = {
      id:           `${sseData.step_id}-${Date.now()}`,
      step_order:   thread.process.length + 1,
      step:         { name: sseData.step },
      process_time: sseData.process_time || new Date().toISOString(),
      details:      sseData.content,
      visible:      sseData.visible,
    }
    thread.process.push(newProcess)

    switch (sseData.step_id) {
      case 'STEP_CHART_STRUCTURE':
        messageStore.setChartEnabled(thread, true)
        try {
          const chartData = JSON.parse(sseData.content)
          chartStore.setChartData(thread, chartData)
        } catch (e) {
          console.error('Error parseando datos de gráfico:', e)
        }
        break

      case 'STEP_CONFIABILITY_METRICS':
        try {
          const parsed = JSON.parse(sseData.content)
          // el array real de métricas está en parsed.data
          const metrics = Array.isArray(parsed.data) ? parsed.data : parsed
          messageStore.setConfiabilityData(thread, metrics)
        } catch (e) {
          console.error('Error parseando datos de confiabilidad:', e)
        }
        break

      case 'STEP_ACTIVE_DISLIKE':
        messageStore.setInSummary(thread, true)
        break
      case 'STEP_NATURAL_RESPONSE_GENERATION':
        try {
          messageStore.setResponseContent(thread, sseData.content)
          messageStore.setStatusId(thread, statusId)

        } catch (e) {
          console.error('Error parseando respuesta natural:', e)
        }
        break
      case 'STEP_ASIGN_ID':
        const agentAnswerId = Number(sseData.content)
        messageStore.setMessageAgentID(thread, agentAnswerId)
        break
    }
  }

  return { processSSE }
}
