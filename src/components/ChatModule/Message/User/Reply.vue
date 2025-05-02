<template>
    <div class="mb-2 p-2 border text-gray-400 border-white rounded-xl flex justify-between items-center max-w-md">
      <span class="whitespace-normal break-words">
        {{ content }}
      </span>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    content: {
      type: String,
      required: true,
      default: ""
    }
  });
  </script>
  