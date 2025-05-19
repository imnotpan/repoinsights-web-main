<template>
  <div class="w-[77%] mb-2 relative overflow-visible">
      <ShowProcessButton
          v-if="hasVisibleStep || isOk"
          :open="showProcess"
          @toggle="handleToggleProcess"
        />

    <!-- Contenido de mensaje -->
    <div class="flex w-full">
      <div class="p-4" :class="isReasoning ? 'bg-gray-50' : 'bg-white'">
        <div v-if="isError" class=" w-full ">
          <p class="text-sm text-red-500 font-semibold">⚠️ Error al generar mensaje ⚠️</p>
        </div>
          <div
        v-else-if="isReasoning"
        class="flex items-center space-x-2 w-full justify-center"
      >
        <!-- SVG spinner -->
        <svg
          class="animate-spin h-6 w-6 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span class="text-sm text-gray-600 font-medium">Cargando respuesta…</span>
      </div>

        <div v-else class="prose text-sm w-full" v-html="formattedHtml" />
      </div>
      <Confiability
        v-if="thread.response?.metrics"
        :metrics="thread.response.metrics"
      />
    </div>
    <div class="p-2 w-[70%] flex space-x-2 overflow-visible">
      <ResendButton v-if="isError " :thread="thread" />
      <template v-else>
        <LikeButton
          v-if="isOk"
          :messageId="thread.id"
          :in_rag="thread.in_rag"
        />

        <DislikeButton
          v-if="isOk && thread.response?.id"
          :response_id="thread.response.id"
          :in_summary="thread.response.in_summary"
        />

        <ReplyButton
          v-if="isOk"
          :responseId="thread.response?.id"
          :messageId="thread.id"
        />

        <CopyButton
          v-if="isOk"
          :text="thread.response?.content || ''"
        />
        <ResendButton v-if="isOk" :thread="thread" />
        <ChartButton
          v-if="isOk"
          :thread="thread"
          :open="showChart"
          @chart-toggled="handleChartToggled"
          @chart-type-changed="handleChartTypeChanged"
        />
      </template>
    </div>
    <div v-if="showChart" class="mt-4 flex justify-start">
      <ChartDisplay
        :messageId="thread.id"
        :overrideChartType="overrideType"
        class="w-full …"
      />
    </div>
    <ProcessSteps
      v-if="showProcess"
      class="mt-4 ml-4 border-l-2 border-gray-300 pl-4"
      :steps="processSteps"
    />
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
  import DislikeButton from '../Tools/DislikeButton.vue';
  import MarkdownIt       from 'markdown-it';

  const props = defineProps({ thread: Object });
  const md = new MarkdownIt();
  const processStore = useProcessStore();

  const STATUS = { OK: 1, ERROR: 2, REASONING: 3 };

  // Estado del thread
  const threadStatus = computed(() => props.thread.status_id);
  const isError = computed(() => threadStatus.value === STATUS.ERROR);
  const isReasoning = computed(() => threadStatus.value === STATUS.REASONING);
  const isOk = computed(() => threadStatus.value === STATUS.OK);

  // Markdown: solo procesa contenido normal (no error)
  const formattedHtml = computed(() => {
    const content = props.thread.response?.content?.trim() || '';
    return md.render(content);
  });

  // Proceso de pasos
  const showProcess = ref(false);
  const handleToggleProcess = async () => {
    showProcess.value = !showProcess.value;
    if (showProcess.value) {
      await processStore.fetchProcessSteps(props.thread.id);
    }
  };
  const processSteps = computed(() =>
    processStore.processMap[String(props.thread.id)] || props.thread.process || []
  );

  const hasVisibleStep = computed(() =>
      processSteps.value.some(step => step.visible)
  );

  watch([hasVisibleStep, isOk], ([hasVisible, ok], [oldVis, oldOk]) => {
    if ((hasVisible && !oldVis) || (ok && !oldOk)) {
      showProcess.value = true;
    }
  });


  // Configuración de gráfico
  const showChart = ref(false);
  const overrideType = ref(null);
  const handleChartToggled = val => (showChart.value = val);
  const handleChartTypeChanged = type => (overrideType.value = type);

</script>
