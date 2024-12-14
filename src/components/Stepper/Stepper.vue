<template>
    <div class="stepper-container">
        <ol class="flex items-center space-x-4">
            <li
                v-for="(step, index) in steps"
                :key="index"
                :class="[
                    'flex items-center',
                    index <= currentStep ? 'text-blue-500' : 'text-gray-400',
                ]"
            >
                <div class="flex items-center">
                    <span
                        class="flex items-center justify-center w-8 h-8 border-2 rounded-full"
                        :class="
                            index <= currentStep
                                ? 'border-blue-500 bg-blue-100'
                                : 'border-gray-300'
                        "
                    >
                        {{ index + 1 }}
                    </span>
                    <span class="ml-2">{{ step }}</span>
                </div>
                <span
                    v-if="index < steps.length - 1"
                    class="flex-1 border-t border-gray-300 mx-4"
                ></span>
            </li>
        </ol>
    </div>
</template>

<script>
export default {
    name: "Stepper",
    props: {
        steps: {
            type: Array,
            required: true,
        },
        currentStep: {
            type: Number,
            required: true,
        },
    },
};
</script>

<style scoped>
.stepper-container {
    margin: 1rem 0;
}
</style>
