import { useProcessStore } from '@/store/processStore';
import { useChartStore }   from '@/store/chartStore'    // nuevo store para datos de gráfico
import { useMessageStore } from '@/store/messageStore'  // asume que aquí tienes chart_enabled

export function useSSEProcessor() {
  const processSSE = (conversationThreads, sseData) => {
    // Asegurar comparación correcta de IDs (pueden venir como string o número)
    const threadIndex = conversationThreads.findIndex(
      t => Number(t.id) === Number(sseData.message_id)
    );
    if (threadIndex === -1) {
      console.warn(`No se encontró el thread con id ${sseData.message_id} para actualizar el proceso.`);
      return;
    }
    
    const thread = conversationThreads[threadIndex];
    
    // Asegurarse de que el thread tenga un array "process"
    if (!Array.isArray(thread.process)) {
      thread.process = [];
    }
    
    // Crear el nuevo proceso con la estructura esperada, utilizando status_id en lugar de status
    const newProcess = {
      id: Date.now(), // Puedes cambiar este método para generar IDs únicos si lo prefieres
      step_order: thread.process.length + 1,
      step: { name: sseData.step }, // Se accederá como step.step.name en ProcessSteps
      status_id: sseData.status_id, // Usamos status_id recibido
      process_time: new Date().toISOString(),
      details: sseData.content,
      visible: sseData.visible
    };
    
    // Agregar el nuevo proceso y forzar la reactividad (reasignación del array)
    thread.process.push(newProcess);
    conversationThreads[threadIndex].process = [...thread.process];
    
    // Sincronizar con el store de procesos para la UI
    const processStore = useProcessStore();
    const chartStore   = useChartStore()
    const messageStore = useMessageStore()

    processStore.processMap[thread.id] = thread.process;
    
    // Actualizar el estado del thread basado en status_id:
    // - Si status_id es 3 (razonando) dejamos is_reasoning en true.
    // - En cualquier otro caso (1 o 2 o cualquier otro valor), es completado (o error si es 1 o 2),
    //   asignamos el mensaje recibido a headerResponse y marcamos is_reasoning como false.
    thread.status_id = sseData.status_id; // Guardamos el status_id en el thread para su posterior uso en la UI
    if (sseData.status_id === 3) { // 3 = razonando
      thread.is_reasoning = true;
    } else {
      thread.is_reasoning = false;
      thread.response = {
        ...thread.response,
        content: sseData.content,
        status_id: sseData.status_id
      };    }


    if (sseData.step_id === 'STEP_CHART_STRUCTURE') {
        messageStore.setChartEnabled(sseData.message_id, true)
        const parsed = JSON.parse(sseData.content)
        chartStore.setChartData(sseData.message_id, parsed)
      };
    if (sseData.step_id == 'STEP_CONFIABILITY_METRICS'){
        const parsed = JSON.parse(sseData.content)
        messageStore.setConfiabilityData(sseData.message_id, parsed.data)
    };
}
  return { processSSE };
}