<template>
  <div class="py-1">
    <div class="pb-1 pt-4">
      <span class="font-medium text-xs">{{ filterData.title }}</span>
    </div>
    <div class="options">
      <button v-for="option in options" :key="option.name" :class="['opt text-left', isOptionSelected(option) ? 'selected' : '']"
        @click="toggleOption(option)">
        <span>{{ option.name }}</span>
        <span>{{ option.count }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';

const emit = defineEmits(['filterClicked']);
const props = defineProps({
  filterData: {
    type: Object,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  selectionMode: {
    type: String,
    default: 'single',
    validator: (value) => {
      return value === 'single' || value === 'multiple';
    }
  }
});

const selectedOptions = ref([]);

const isOptionSelected = (option) => {
  if (props.selectionMode === 'single') {
    return selectedOptions.value === option.name;
  } else {
    return selectedOptions.value.includes(option.name);
  }
};

const toggleOption = (option) => {
  if (props.selectionMode === 'single') {
    if (selectedOptions.value === option.name) {
      selectedOptions.value = '';
    } else {
      selectedOptions.value = option.name;
    }
  } else {
    if (selectedOptions.value.includes(option.name)) {
      selectedOptions.value = selectedOptions.value.filter((name) => name !== option.name);
    } else {
      selectedOptions.value = [...selectedOptions.value, option.name];
    }
  }

  updateUrlParams();
  emit('filterClicked');
};

const updateUrlParams = () => {
  const filter = props.filterData.key
  const searchParams = new URLSearchParams(window.location.search);

  if (props.selectionMode === 'single') {
    if (selectedOptions.value.length === 0) {
      searchParams.delete(filter);
    } else {
      searchParams.set(filter, selectedOptions.value);
    }
  } else {
    if (selectedOptions.value.length === 0) {
      searchParams.delete(filter);
    } else {
      searchParams.set(filter, selectedOptions.value.join(','));
    }
  }

  const baseUrl = window.location.origin + window.location.pathname;
  const newUrl = `${baseUrl}?${searchParams.toString()}`;

  window.history.pushState(null, null, newUrl);
};

const cleanFilters = () => {
  selectedOptions.value = [];
  updateUrlParams();
};

onMounted(() => {
  const filter = props.filterData.key;
  const searchParams = new URLSearchParams(window.location.search);
  const selectedOptionsFromUrl = searchParams.get(filter);

  if (props.selectionMode === 'single') {
    selectedOptions.value = selectedOptionsFromUrl || '';
  } else {
    selectedOptions.value = selectedOptionsFromUrl ? selectedOptionsFromUrl.split(',') : [];
  }
});


defineExpose({
  cleanFilters
})

</script>

<style scoped lang="scss">
.options {
  button {
    border-radius: 0.375rem;
    padding: 0.2rem 0.5rem;
    transition: all 0.01s ease-in-out;
    border: 1px solid transparent;
    cursor: pointer;

    &:hover {
      border-color: #4669fa;
    }

    &.selected {
      background-color: #EDF0FF;
      border-color: #4669fa;
    }
  }

  .opt {
    font-size: 0.75rem;
    font-weight: 600;
    color: #4b5563;
    margin-top: 0.2rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
