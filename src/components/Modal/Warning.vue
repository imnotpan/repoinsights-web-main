<template>
    <div v-if="isOpen" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
        aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <div class="absolute top-0 right-0 pt-4 pr-4">
                            <button @click="close" type="button"
                                class="text-gray-400 hover:text-gray-500 focus:outline-none">
                                <span class="sr-only">Close</span>
                                <Icon icon="heroicons-outline:x" />
                            </button>
                        </div>
                        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            {{ title }}
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                <slot/>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6">
                    <button 
                        type="button"
                        @click="emit('validate')"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                        {{ btnText }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { Icon } from '@iconify/vue';

// Prop setup for v-model
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: 'Warning',
    },
    btnText: {
        type: String,
        default: 'OK',
    },
});

const isOpen = ref(props.modelValue);
const emit = defineEmits(['update:modelValue', 'close']);

watchEffect(() => {
    isOpen.value = props.modelValue;
});

const close = () => {
    isOpen.value = false;
    emit('update:modelValue', false);
    emit('close');
};
</script>
