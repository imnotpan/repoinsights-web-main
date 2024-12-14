<template>
    <div v-if="type == 1" class="flex w-full justify-between">
        <span :class=[sizeClasses[size].text]>{{ text }}</span>
        <div class="flex gap-2">
            <span v-if="showValue" class="font-medium" :class="[sizeClasses[size].value]">{{ roundValue(value) }}<small>{{
                measure
            }}</small></span>
            <template v-if="rating">
                <Rating :rating="rating" :size=sizeClasses[size].circle :text=sizeClasses[size].circleText />
            </template>
        </div>
    </div>

    <div v-else-if="type == 2" class="leading-none text-center">
        <div class="p-1 rounded-sm border border-transparent" :class="{
            ' border-primary-400': id === store.sortActiveFilter && store.sortActiveFilter !== null,
            [id]: true
        }">
            <div class="flex gap-2 justify-center">
                <template v-if="rating">

                    <Rating :rating="rating" :size=sizeClasses[size].circle :text=sizeClasses[size].circleText
                        :measure="measure" />

                </template>


                <span v-if="showValue" class="font-medium" :class="[sizeClasses[size].value]">{{ roundValue(value) }}
                    <small>{{ measuremnts[measurement] ? measuremnts[measurement] : measure }}</small>
                </span>
            </div>
            <span :class=[sizeClasses[size].text]>
                {{ text }}
            </span>
        </div>

    </div>
</template>

<script setup>
import Rating from "@/components/Rating";
import { useExploreStore } from "@/store/exploreProject";
import { onMounted, ref } from "vue";

const sizeClasses = {
    xs: {
        circle: 'h-5 w-5',
        circleText: 'text-xs',
        value: 'text-sm',
        text: 'text-xs'
    },
    lg: {
        circle: 'h-6 w-6',
        circleText: 'text-base',
        value: 'text-base',
        text: 'text-base'
    },
    xl: {
        circle: 'h-7 w-7',
        circleText: 'text-base',
        value: 'text-xl',
        text: 'text-lg'
    }
}

const measuremnts = {
    'h': 'horas',
    'd': 'días',
    '%': '%'
}

const store = useExploreStore()

const measurement = ref('')
const props = defineProps({
    id: {
        type: String,
        required: false
    },
    type: {
        type: Number,
        required: false,
        default: 1
    },
    rating: {
        type: String,
        required: true
    },
    text: {
        type: String
    },
    value: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        default: 'xl'
    },
    showValue: {
        type: Boolean,
        default: false
    },
    measure: {
        type: String,
        default: '',
        required: false

    }
}
);

const roundValue = (value) => {
    let roundedValue = null
    if (props.measure == '%') {
        roundedValue = Math.round(value * 100)
    }
    else {
        roundedValue = Math.round(value * 10) / 10
        if (props.measure == 'h' && roundedValue > 24) {
            roundedValue = Math.round(roundedValue / 24)
            measurement.value = 'd'
        }
    }
    return roundedValue
}

onMounted(() => {
    measurement.value = props.measure
})

</script>

<style scoped>
.hovered:hover {
    border-color: #e2e8f0;
}
</style>
