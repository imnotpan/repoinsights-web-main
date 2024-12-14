<!-- Button.vue -->
<template>
    <button
        class="p-2 hover:bg-primary-100 rounded-full dark:hover:bg-slate-900" 
        @click="onClick"
        :class="{'invisible': !show, 'visible': show}"
    >
        <Icon 
            :icon="icon" 
            class="w-5 h-5 rounded text-primary-600 dark:text-white bg-white dark:bg-slate-900" 
        />
    </button>

</template>

<script setup>
import Icon from "@/components/Icon";

const props = defineProps({
    icon: { type: String, required: true },
    onClick: { type: Function, required: true },
    show: { type: Boolean, required: false, default: true }
})

</script>
