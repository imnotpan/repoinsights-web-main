<!-- src/components/ChatModule/InputMessage/Tools/InfoGeneral.vue -->
<template>
  <div class="inline-block">
    <Tooltip
      placement="top"
      :arrow="true"
      theme="light"
      trigger="mouseenter"
      :interactive="true"
      :delay="0"
      maxWidth="250px"
      :offset="[0,15]"

    >
      <template #button>
        <button class="p-1 rounded-full hover:bg-gray-100 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="gray" stroke-width="1.5">
              <circle cx="12" cy="12" r="9.25"/>
              <path stroke-linecap="round" d="M12 11.813v5"/>
            </g>
            <circle cx="12" cy="8.438" r="1.25" fill="gray"/>
          </svg>
        </button>
      </template>

      <!-- contenido del tooltip -->
       <template #default>
        <div class="text-sm space-y-2 p-2">
          <p class="font-semibold text-md">Atajos de Mención</p>
          <p class="text-gray-600 text-xs">
            Dentro del editor de texto, usa los siguientes atajos para señalar entidades:
          </p>
         <ul class="list-disc list-inside space-y-1 text-xs w-full">
          <li class="flex items-start  w-full ">
            <div class="flex-none w-20 space-x-2">
                <span class="text-blue-500 font-semibold w-[25%]">@</span>
                <strong  class=" flex-shrink-0 flex-1">Usuario:</strong>
              </div>
              <div class="flex-1">
                Listado de usuarios
              </div>
          </li>
          <li class="flex items-start  w-full">
            <div class="flex-none w-20 space-x-2">
              <span class="text-green-500 font-semibold w-[25%]">#</span>
              <strong class=" flex-shrink-0"> Métrica:</strong>
            </div>
            <div class="flex-1">
              <span>Listado de métricas</span>
            </div>
          </li>
          <li class="flex items-start  w-full">
            <div class="flex-none w-20 space-x-2">
              <span class="text-purple-500 font-semibold w-[25%]">%</span>
              <strong class=" flex-shrink-0">Proyectos:</strong>
            </div>
            <div class="flex-1">
              <span>Listado de proyectos</span>
            </div>
          </li>
        </ul>
        </div>
      </template>
    </Tooltip>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Tooltip from '@/components/Tooltip/index.vue';

const lastCheck  = ref('Calculando...');
const latency    = ref(0);
const serverName = ref('api.miapp.com');

onMounted(() => {
  // Simula actualización de datos
  setTimeout(() => {
    lastCheck.value = 'Hace 5 segundos';
    latency.value   = 120;
  }, 500);
});
</script>
