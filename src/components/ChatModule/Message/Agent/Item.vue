<template>
    <div class="w-[77%] mb-2 relative overflow-visible">
      <!-- Botón para mostrar/ocultar razonamiento -->
      <div 
        v-if="!isReasoning"
        class="w-full">
        <ShowProcessButton @toggle="handleToggleProcess" />
      </div>
  
    <!-- Cuerpo del mensaje -->
    <div class="flex">
        <div
            class="p-4"
            :class="{ 'bg-white': !isReasoning, 'bg-transparent': isReasoning }"
        >
            <div v-if="isError" class="mb-2">
                <p class="text-sm text-red-500 font-semibold">
                    ⚠️ Error al generar mensaje ⚠️
                </p>
            </div>
                <p v-else-if="isReasoning" class="text-sm">Razonando</p>
                <div v-else class="prose text-sm" v-html="formattedHtml"></div>
        </div>
        <Confiability
            v-if="thread.response && thread.response.metrics"
            :metrics="thread.response.metrics"
        />   
     </div>

    <div
        v-if="!isReasoning && !isError" 
        class="p-2 w-[70%] relative overflow-visible flex space-x-2">
        <LikeButton :messageId="thread.id" :in_rag="thread.in_rag" />
        <ReplyButton :responseId="thread.response?.id" :messageId="thread.id" />
        <CopyButton :text="thread.response?.content || ''" />
        <ResendButton :thread="thread"/>
        <ChartButton
        :thread="thread"
        :open="showChart"
        @chart-toggled="handleChartToggled"
        @chart-type-changed="handleChartTypeChanged"
        />
    </div>
  
    <div v-if="showChart" class="mt-4 flex justify-start">
      <div
        class="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-[70%] aspect-video mb-2"
      >
        <ChartDisplay
          :messageId="thread.id"
          :overrideChartType="overrideType"
          class="w-full h-full"
        />
      </div>
    </div>
  
      <!-- Pasos de proceso -->
      <div v-if="showProcess" class="mt-4 ml-4 border-l-2 border-gray-300 pl-4">
        <ProcessSteps :steps="processSteps" />
      </div>
    </div>
    </template>
  <!-- Componente de mensaje (solo la sección <script setup>) -->
<script setup>
import { ref, computed, watch } from 'vue';
import { useProcessStore } from '@/store/processStore';
import ShowProcessButton from '@/components/ChatModule/Message/Agent/ShowProcessButton.vue';
import ProcessSteps from '@/components/ChatModule/Message/Agent/ProcessSteps.vue';
import LikeButton from '@/components/ChatModule/Message/Tools/LikeButton.vue';
import ReplyButton from '@/components/ChatModule/Message/Tools/ReplyButton.vue';
import CopyButton from '@/components/ChatModule/Message/Tools/CopyButton.vue';
import ChartButton from '@/components/ChatModule/Message/Tools/ChartButton.vue';
import ChartDisplay from '@/components/ChatModule/Message/Agent/ChartDisplay.vue';
import Confiability from '@/components/ChatModule/Message/Tools/Confiability.vue';
import ResendButton from '@/components/ChatModule/Message/Tools/ResendButton.vue';
import MarkdownIt       from 'markdown-it';

const md = new MarkdownIt();


const props = defineProps({
  thread: { type: Object, required: true }
});
const processStore = useProcessStore();

// Panel de razonamiento
const showProcess = ref(false);
const handleToggleProcess = async () => {
    const key = String(props.thread.id);
    const existing = processStore.processMap[key] || props.thread.process;
    
    showProcess.value = !showProcess.value;
    console.log("TOGGLE PROCESS")
    if (showProcess.value && (!existing || existing.length === 0)) {
        await processStore.fetchProcessSteps(props.thread.id);
    }
};

// Estado y tipo de gráfico
const showChart = ref(false);
const overrideType = ref(null);
const handleChartToggled = val => {
  showChart.value = val;
};
const handleChartTypeChanged = type => {
  overrideType.value = type;
};

// Estado del mensaje
const threadStatus = computed(() => {
  return props.thread.response?.status_id ?? props.thread.status_id ?? null;
});
const isError = computed(() => threadStatus.value === 2);
const isReasoning = computed(() => threadStatus.value === 3);

// Vista del texto en mensaje
const displayedText = computed(() => {
  const c = props.thread.response?.content || props.thread.headerResponse || '';
  return c.trim() || '⚠️ Error al generar mensaje ⚠️';
});
const formattedHtml = computed(() => md.render(displayedText.value));

// Pasos de proceso
const processSteps = computed(() => {
  const key = String(props.thread.id);
  return processStore.processMap[key] || props.thread.process || [];
});
watch(processSteps, ns => {
  if (ns.length && !showProcess.value) showProcess.value = true;
});



</script>
