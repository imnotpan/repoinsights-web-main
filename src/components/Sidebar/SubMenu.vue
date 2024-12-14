<template>
    <ul class="absolute bottom-0 w-[90%]">
        <li v-for="(item, i) in items" :key="i" class="menu-link">
            <div class="flex gap-1 text-slate-600 font-medium dark:text-slate-300 text-sm capitalize px-[10px] py-3 rounded-[4px] cursor-pointer"
                @click="() => { showModal = !showModal }">
                <span class="inline-flex items-center text-slate-600 dark:text-slate-300 text-lg" v-if="item.icon">
                    <Icon :icon="item.icon" />
                </span>
                <div class="text-box text-sm font-semibold capitalize">
                    {{ item.title }}
                </div>
            </div>
        </li>
    </ul>

    <Modal 
        :activeModal="showModal"
        @close="showModal = false"
        title="Glosario de métricas"
        class="w-[90%] h-[90%]"
        :scrollContent=false
        :disableBackdrop=false
        :showHeader=false
        sizeClass="max-w-6xl"
    >
        <Glossary />
    </Modal>
</template>

<script setup>
import Icon from "@/components/Icon";
import Modal from "../Modal/index.vue";
import Glossary from "@/components/Glossary/index.vue";
import { ref } from "vue";

const items = [
    {
        title: "Glosario",
        icon: "heroicons-outline:bookmark"
    }
]

const showModal = ref(false);

</script>

<style scoped>
.close_sidebar .text-box {
    visibility: hidden;
}

.sidebar-hovered .text-box {
    visibility: visible !important;
}
</style>