<template>
    <div 
        class="flex justify-between p-2 border-b hover:bg-slate-100 cursor-pointer"
        @click="redirectToProject(project.id)"
        >
        <div class="flex gap-4 items-start">
            <span class="p-1 bg-slate-900 text-white leading-none rounded text-xs w-[26px] text-center">{{ indexPlusOne }}</span>
            <div>
                <p class="text-base font-semibold leading-none capitalize">{{ project.name }}</p>
                <p class="text-xs leading-none">{{ project.owner_name }}</p>
            </div>
        </div>
        <button class="text-xs font-semibold">Ver</button>
    </div>
</template>

<script setup>

import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
    project: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        required: true
    }
})
const indexPlusOne = props.index + 1;

const redirectToProject = (id) => {
    router.push({
        name: "Proyecto",
        params: {
            id
        }
    })
}


</script>