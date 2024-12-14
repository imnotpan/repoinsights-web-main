<template>
  <div class="relative">
    <component :is="link ? 'a' : 'button'" :href="link"
      class="block m-auto h-full bg-white cursor-pointer px-2 rounded-md border border-gray-300" @mouseover="showTooltip = true"
      @mouseleave="showTooltip = false">
      <Icon v-if="icon" :icon="icon" class="text-2xl" />
      <span v-if="text" class="">{{ text }}</span>
    </component>
    <transition name="fade">
      <div v-if="showTooltip"
        class="z-10 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white px-2 py-1 rounded text-sm !w-[200px]">
        {{ msg }}
      </div>
    </transition>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
import Icon from '@/components/Icon';

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  msg: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
});

const showTooltip = ref(false);
</script>
  
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
  