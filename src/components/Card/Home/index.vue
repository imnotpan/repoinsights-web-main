<template>
    <Card
        className="col-span-12 md:col-span-4"
        bodyClass="shadow-sm hover:shadow-md transition-shadow"
    >
        <div class="p-6">
            <div class="flex items-center justify-between mb-4">
                <span class="text-sm text-gray-500">{{ subtitle }}</span>
                <component
                    v-if="icon"
                    :is="icon"
                    class="h-5 w-5 text-gray-400"
                />
            </div>
            <h4 class="text-lg font-semibold text-gray-900 mb-4">
                {{ title }}
            </h4>
            <button
                class="inline-flex items-center gap-2 px-4 py-2 bg-black text-sm text-white rounded-lg bg-gray-800 transition-colors"
                @click="goToRoute"
            >
                <component v-if="buttonIcon" :is="buttonIcon" class="h-5 w-5" />
                {{ buttonText }}
            </button>
        </div>
    </Card>
</template>

<script setup>
import { useRouter } from "vue-router";
import Card from "@/components/Card";

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    buttonText: {
        type: String,
        required: true,
    },
    routeName: {
        type: String,
        required: true,
    },
    icon: {
        type: Object,
        default: null,
    },
    buttonIcon: {
        type: Object,
        default: null,
    },
});

const router = useRouter();

const goToRoute = () => {
    router.push({ name: props.routeName });
};
</script>
