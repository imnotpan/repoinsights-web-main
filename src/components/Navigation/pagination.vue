<template>
    <div class="flex justify-around">
        <Button 
        icon="heroicons-solid:arrow-left" 
        @click="changePage(pagination.prev)" 
        :show="pagination.prev ? true : false"
        />
        <span class="text-primary-600 dark:text-white font-normal">{{ pagination.current }}</span>
        <Button 
            :show="pagination.next ? true : false"
            icon="heroicons-solid:arrow-right" @click="changePage(pagination.next)" />
    </div>
</template>


<script setup>
import Button from "@/components/Navigation/button";
const emit = defineEmits(["changePage"])
const props = defineProps({
    pagination: {
        type: Object,
        required: true
    }
})

const changePage = (page) => {
    emit("changePage", page)
}

</script>