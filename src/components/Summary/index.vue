<template>
    <div>
        <span v-if="!isOpenSettings" @click="toggleSettings"
            class="fixed right-[-48px] top-1/2 z-[888] translate-y-1/2 bg-slate-800 text-slate-50 dark:bg-slate-700 dark:text-slate-300 cursor-pointer transform rotate-90 flex items-center text-sm font-medium px-2 py-2 shadow-deep rounded-t">
            <Icon icon="heroicons:cog-6-tooth" class="text-slate-50 text-lg animate-spin" />
            <span class="hidden md:inline-block ml-2">Tablas resumen</span>
        </span>

        <transition name="overlay-fade">
            <div v-show="isOpenSettings"
                class="fixed right-0 top-[10%] md:w-[400px] w-[300px] bg-white dark:bg-slate-800 h-5/6  z-[9999] px-6 md:pb-6 pb-[100px] shadow-base2 dark:shadow-base3 border border-gray-5002 dark:border-slate-700">
                <div class="flex justify-end items-center py-4 left">
                    <div class="cursor-pointer text-2xl text-slate-800 dark:text-slate-200" @click="toggleSettings">
                        <Icon icon="heroicons-outline:x" />
                    </div>
                </div>
                <div>
                    <h6>Resumen de métricas</h6>
                    <p class="pt-2 leading-1">Valores promedios calculados a partir de todos los repositorios extraidos </p>
                    <div>
                        <Tabs :headers="data.headers" :data="data.data" />
                    </div>
                </div>

            </div>
        </transition>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';
import Icon from '@/components/Icon/index.vue';
import Tabs from '@/components/Summary/tabs.vue'


const props = defineProps({   
    data: {
        type: Object,
        required: true
    },
})

const isOpenSettings = ref(false);

const toggleSettings = () => {
    isOpenSettings.value = !isOpenSettings.value;
};

</script>
  