<template>
  <AutocompleteDropdown
    :editor-ref="editorRef"
    v-model:show="show"
    v-model:items = "items"
    :position="position"
    @select="selectItem"
    :widthPx="300"
  >
    <template #item="{ item: project }">
      <li class="px-2 py-1 hover:bg-gray-100 cursor-pointer flex flex-col" >
        <div class="w-full flex justify-between items-center">
          <span class="text-sm font-bold text-left">
            {{ project.name }}
          </span>
          <span class="text-sm font-bold text-right bg-gray bg-rounded-xl">
            {{ project.user_login }}
          </span>
        </div>
        <small
          class="text-gray-600 block truncate w-full text-xs"
          :title="project.description"
        >
          {{ project.description }}
        </small>
      </li>
    </template>
  </AutocompleteDropdown>
</template>

<script setup>
import { defineProps, toRef } from 'vue'
import AutocompleteDropdown from '@/components/ChatModule/components/AutocompleteDropdown.vue'
import { useProjectStore } from '@/store/projectStore'
import { useMention } from '@/composables/useMention'

const props = defineProps({
  editorRef:  { type: Object, required: true, default: null },
  editorText: { type: String, default: '' }
})

const projectStore = useProjectStore()
const textRef = toRef(props, 'editorText')
const emit = defineEmits(['update:show', 'update:items']);

const {
  show,
  items,
  position,
  selectItem
} = useMention({
  editorRef:    props.editorRef,
  triggerChar:  '%',
  fetchItemsFn: (q) => projectStore.searchProjects(q),
  clearItemsFn: () => projectStore.clearSearchResults(),
  getItemsFn:   () => projectStore.searchResults,
  renderTokenFn: project =>
    `<span
       class=\"mention-token bg-purple-100 text-purple-800 rounded px-1 mx-0.5\"
       contenteditable=\"false\"
       data-project-id=\"${project.id}\"
       data-mention=\"project:(id:${project.id},name:${project.name})\"
     >%${project.name}</span>`,
  getContextId: () => true,
  textRef
})
</script>