<template>
    <button 
        class="flex items-center border border-gray-200 rounded-md px-4 m-2" 
        :class="selected ? 'bg-primary-100 text-primary-500' : 'bg-white text-gray-500'"
        @click="handleClick"
    >
        <Icon v-if="selected" icon="heroicons-outline:check" class="text-primary-400 mr-2 h-fit" />
        <span> {{ props.title }} </span>
    </button>
</template>

<script setup>

import { Icon } from '@iconify/vue';
import { ref } from 'vue';

const selected = ref(props.selected)
const emit = defineEmits(['chipClicked'])

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    selected: {
        type: Boolean,
        required: false,
        default: false
    }
})

const handleClick = () => {
    selected.value = !selected.value
    emit('chipClicked', selected.value)
}

</script>