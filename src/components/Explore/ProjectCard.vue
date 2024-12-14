<template>
    <Card className="my-5 lg:!h-fit">
        <div class="flex mb-1 justify-between">
            <div class="flex gap-4 items-center">
                <LikeStar 
                    :project="project" 
                    @starClicked="handleSelect"
                    :disabled="project.empty"
                />

                <router-link
                    :class="{ 'disabled': project.empty }"
                    :to="{
                    name: 'Proyecto',
                    params: {
                        id: project.id
                    }
                }">
                    <h4 class="text-primary-500 font-medium text-base flex gap-1 underline">
                        <div class="font-normal">{{ project.owner_name }}</div>/<div class="">{{
                            project.name }}</div>
                            <div>{{ project.private ? "🔒" : "" }}</div>
                    </h4>
                </router-link>
            </div>
            <div>
                <a :href="githubUrl(project)" target="_blank" class="btn btn-secondary btn-sm cursor-pointer">GitHub</a>
            </div>
        </div>
        <div class="text-xs text-secondary-600">
            <p class="flex gap-2">
            <div>
                <span><span class="font-medium">Última actualización:</span> {{ toLocalDate(project.last_extraction_date)
                }}</span>
            </div>
            |
            <div>
                <span><span class="font-medium">Lenguaje:</span> {{ project.language }}</span>
            </div>
            |
            <div>
                <span><span class="font-medium">Fecha creación:</span> {{ toLocalDate(project.created_at) }}</span>
            </div>
            </p>
        </div>
        <hr class="my-4" />
        <div v-if="project.empty" class="text-left">
            <p class="text-sm text-secondary-600 font-semibold">No se encontraron datos para este repositorio</p>
        </div>
        <div v-else class="flex gap-8">
            <template v-for="rating in project.rating" :key="rating.id">
                <RatingData 
                    :rating="rating.rating" 
                    :text="rating.name" 
                    :value="rating.value" 
                    :type=2 
                    size="xs"
                    :id=rating.id
                    :measure="rating.measurement" 
                    :showValue=rating.show_value />
            </template>
        </div>
    </Card>
</template>

<script setup>

import Card from "@/components/Card";
import RatingData from "@/components/Explore/RatingData";
import LikeStar from "./LikeStar.vue";

const emit = defineEmits(["selectedProject"])
const props = defineProps({
    project: {
        type: Object,
        required: true
    }
})


const githubUrl = (project) => {
    return `https://www.github.com/${project.owner_name}/${project.name}`
}

const toLocalDate = (date) => {
    if (date == null) return "Error";
    
    const d = new Date(date);
    return d.toLocaleDateString();
}

const handleSelect = (project) => {
    console.log(project)
    emit("selectedProject", project)
}

</script>

<style scoped>
.disabled {
    pointer-events: none;
    cursor: default;
    opacity: 0.5;
}
</style>