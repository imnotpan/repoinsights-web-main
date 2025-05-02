<template>
    <button
      @click="$emit('send')"
      :disabled="!hasSelectedProject || !hasContent"
      :class="[
        'p-3 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none',
        (!hasSelectedProject || !hasContent)
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      ]"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 12 12">
        <path fill="currentColor" d="M6 10.5a.75.75 0 0 0 .75-.75V3.81l1.97 1.97a.75.75 0 0 0 1.06-1.06L6.53 1.47a.75.75 0 0 0-1.06 0L2.22 4.72a.75.75 0 1 0 1.06 1.06l1.97-1.97v5.94c0 .414.336.75.75.75"/>
      </svg>
    </button>
  </template>
  
  <script setup lang="ts">
  defineProps({
    hasSelectedProject: {
      type: Boolean,
      required: true
    },
    hasContent: {
      type: Boolean,
      required: true
    }
  })
  
  defineEmits(['send'])
  </script>
  