<template>
    <div class="flex flex-wrap">
        <Chip v-for="project in projects" 
            :key="project.id" 
            :title="project.name"
            :description="project.description" 
            :selected="project.selected"
            @chipClicked="handleClick(project, $event)"
        />
    </div>
</template>

<script setup>

import Chip from '@/components/Chip/index.vue'


const emit = defineEmits(['chipClicked'])
const props = defineProps({
    projects: {
        type: Array,
        required: true
    }
})


const handleClick = (project, value) => {
    emit('chipClicked', {
        project,
        "selected": value
    })
}

</script>