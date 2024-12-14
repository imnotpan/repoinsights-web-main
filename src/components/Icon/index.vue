<template>
  <span
  :class="`
    ${className}
    `"
  >
    <Icon :icon="icon" />
  </span>
</template>
<script>
import { Icon } from '@iconify/vue';
export default {
  components: {
    Icon,
  },
  props: {
    icon: {
      type: String,
      default: 'heroicons-outline:home',
    },
    className: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang=""></style>
