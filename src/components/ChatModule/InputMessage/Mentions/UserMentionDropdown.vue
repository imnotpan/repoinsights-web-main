<template class="z-[9999]">
  <AutocompleteDropdown
    :editor-ref="editorRef"
    v-model:show="show"
    v-model:items = "items"
    :position="position"
    @select="selectItem"
    :widthPx="300"
  >
    <template #item="{ item: user }">
      <li
        @click="selectItem(user)"
        class="px-2 py-1 hover:bg-gray-200 cursor-pointer"
      >
        {{ user.login }}
      </li>
    </template>
  </AutocompleteDropdown>
</template>

<script setup>
import { defineProps, toRef } from 'vue'
import AutocompleteDropdown from '@/components/ChatModule/components/AutocompleteDropdown.vue'
import { useUserStore } from '@/store/userSearch'
import { useProjectStore } from '@/store/projectStore'
import { useMention } from '@/composables/useMention'

const props = defineProps({
  editorRef:  { type: [Object, Function], required: true, default: null },
  editorText: { type: String, default: '' }
})
const textRef = toRef(props, 'editorText')

const userStore    = useUserStore()
const projectStore = useProjectStore()
const emit = defineEmits(['update:show', 'update:items']);

const {
  show,
  items,
  position,
  selectItem
} = useMention({
  editorRef:    props.editorRef,
  triggerChar:  '@',
  fetchItemsFn: (q, pid) => userStore.searchUsers(q, pid),
  clearItemsFn: ()    =>{ userStore.participants = [] },
  getItemsFn:   ()    => userStore.participants,
  renderTokenFn: user =>
    `<span class="mention-token bg-blue-100 text-blue-800 rounded px-1 mx-0.5" contenteditable="false" data-user-id="${user.id}" data-mention="user:(id:${user.id},login:${user.login})">@${user.login}</span>`,
  getContextId: ()    => projectStore.selectedProject?.id,
  textRef
})
</script>
