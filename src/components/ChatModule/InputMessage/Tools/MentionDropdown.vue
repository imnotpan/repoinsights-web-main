<template>
    <ul
      class="mention-list max-h-48 overflow-auto bg-white border border-gray-300 rounded"
      @scroll.passive="handleScroll"
      ref="list"
    >
      <li
        v-for="user in users"
        :key="user.id"
        @click="$emit('select', user)"
        class="px-2 py-1 hover:bg-gray-200 cursor-pointer"
      >
        {{ user.login }}
      </li>
      <li v-if="!users.length" class="px-2 py-1 text-gray-500">
        Cargando...
      </li>
    </ul>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const props = defineProps({
    users: {
      type: Array as () => { id: number; login: string }[],
      required: true,
    },
  });
  
  const emit = defineEmits<{
    (e: 'select', user: { id: number; login: string }): void;
    (e: 'scroll-end'): void;
  }>();
  
  const list = ref<HTMLElement|null>(null);
  
  function handleScroll() {
    if (!list.value) return;
    const { scrollTop, clientHeight, scrollHeight } = list.value;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      emit('scroll-end');
    }
  }
  </script>
  