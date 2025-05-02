<template>
    <div class="bg-white mb-2 p-2 border text-gray-400 border-gray-200 rounded-xl flex justify-between items-center">
            <span>
                {{ reply.response.content }}
            </span>
      <button @click="$emit('clear')" class="text-red-500">
        x
      </button>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    reply: {
      type: Object,
      required: true,
    }
  });
  

  </script>
  