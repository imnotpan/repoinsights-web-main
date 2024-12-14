<template>
  <div class="flex items-center justify-center rounded-full" :class="[ratingColors[rating].bg, size]">
    <span class="leading-none" :class="[ratingColors[rating].text, text]">
      {{ rating }}
    </span>
  </div>
</template>
  
<script setup>
import { ratingColors } from '@/constant/filter';

const props = defineProps({
  rating: {
    type: String,
    default: '',
  },
  size: {
    type: String,
  },
  text: {
    type: String,
  }
});
</script>
  