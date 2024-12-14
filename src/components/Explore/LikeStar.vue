<template>
    <div>
        <div v-if="disabled" class="text-lg text-primary-500 cursor-pointer" >

        </div>
        <Icon
            v-else
            :icon="selectedProject(project)" 
            class="text-lg text-primary-500 cursor-pointer" 
            @click="starClick(project)" 
            :className="className"
        />
    </div>

</template>

<script setup>
import Icon from "@/components/Icon";
import { defineEmits } from 'vue'

const emit = defineEmits(['starClicked'])

const props = defineProps({
    project: {
        type: Object,
        required: true
    },
    className: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const selectedProject = (project) => {
    if (project.selected) {
        return 'heroicons-solid:star'
    }
    return 'heroicons-outline:star'
}

const starClick = (project) => {
    project.selected = !project.selected
    emit('starClicked', project)
}

</script>