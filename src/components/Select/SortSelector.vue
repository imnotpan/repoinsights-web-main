<template>
    <div class="flex gap-2 items-center">
        <select
            class="w-full h-full cursor-pointer py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            name="filter" :value="selectedOption" @change="handleChange">
            <option value="">Última actualización</option>
            <option v-for="(option, index) in options" :value="option.id" :key="option.id">
                {{ option.name }}
            </option>
        </select>
        <button class="bg-white rounded-md focus:ring-1 border border-gray-300 h-full px-2">
            <div @click="toggleOrder" class="flex items-center gap-1">
                <div>
                    <Icon 
                        :icon="store.sortDirectionInverted ? 'fa:sort-numeric-asc' : 'fa:sort-numeric-desc'"
                        class="text-xl" 
                    />
                </div>
                <span class="text-lg">{{ orderText }}</span>
            </div>
        </button>
    </div>
</template>


<script setup>

import { useExploreStore } from "@/store/exploreProject";
import { Icon } from '@iconify/vue';
import { computed } from "vue";

const store = useExploreStore();
const emit = defineEmits(['change', 'changeOrder']);
const props = defineProps({
    options: {
        type: Array,
        default: () => []
    },
    selectedOption: {
        type: String,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const orderText = computed(() => {
    return store.sortDirectionInverted ? 'Ascendente' : 'Descendente'
})


const handleChange = (event) => {
    const selectedOptionId = event.target.value
    const selectedOption = props.options.find(option => option.id === selectedOptionId)
    emit('change', selectedOption);
}

const toggleOrder = () => {
    store.sortDirectionInverted = !store.sortDirectionInverted;
    emit('changeOrder', store.sortDirectionInverted);
}

</script>

<style scoped>
.rotate-icon-180 {
    transition: transform 0.3s;
    transform: rotate(180deg);
}

.rotate-icon-0 {
    transition: transform 0.3s;
    transform: rotate(0deg);
}

</style>
