<template>
  <AutocompleteDropdown
    :editor-ref="editorRef"
    v-model:show="show"
    v-model:items = "items"
    :position="position"
    @select="selectMetric"
    :widthPx="300"
  >
    <template #item="{ item: metric }">
      <li class="px-2 py-1 hover:bg-gray-100 cursor-pointer flex flex-col" >
        <span class="text-sm font-bold">{{ metric.label_es }}</span>
        <small class="text-gray-600 block truncate w-full text-xs">
          {{ metric.description }}
        </small>
      </li>
    </template>
  </AutocompleteDropdown>
</template>

<script setup>
import { toRef, defineEmits } from 'vue'
import { useMetricStore } from '@/store/metricsStore'
import { useMention } from '@/composables/useMention'
import AutocompleteDropdown from '@/components/ChatModule/components/AutocompleteDropdown.vue'

const props = defineProps({
  editorRef:  { type: Object, required: true },
  editorText: { type: String, default: '' }
})

const store = useMetricStore()
const textRef = toRef(props, 'editorText')
const emit = defineEmits(['update:show', 'update:items']);
const {
  show,
  items,
  position,
  selectItem: selectMetric
} = useMention({
  editorRef: props.editorRef,
  triggerChar: '#',
  fetchItemsFn: (q) => store.searchMetrics(q),
  clearItemsFn: () => { store.metrics = [] },
  getItemsFn: () => store.metrics,
  renderTokenFn: m =>
    `<span
       class=\"mention-token bg-green-100 text-green-800 rounded px-1 mx-0.5\"
       contenteditable=\"false\"
       data-metric-id=\"${m.id}\"
       data-mention=\"metric:(id:${m.id},name:${m.name}, table_type:${m.category_type})\"
     >#${m.name}</span>`,
  getContextId: () => true,
  textRef
})


</script>