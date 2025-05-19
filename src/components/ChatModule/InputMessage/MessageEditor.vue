<template>
  <div class="relative">
    <UserMentionDropdown 
      v-if="editor"
      :editor-ref="editor"
      :editor-text="text"/>
    <MetricsMentionDropdown 
      v-if="editor"
      :editor-ref="editor"
      :editor-text="text"/>
    <ProjectsMentionDropdown 
      v-if="editor"
      :editor-ref="editor"
      :editor-text="text"/>
  <div
    ref="editor"
    class="editor-contenteditable min-h-[40px] p-2 outline-none focus:shadow-none relative"
    :class="{ 'empty': text.trim() === '' }"
    :contenteditable="isEditable"
    :data-placeholder="placeholder"
    @input="handleInput"
    @keydown="handleKeyDown"
    @paste="handlePaste"
  />
  </div>
</template>

<script setup>
import { defineProps, defineExpose, defineEmits, watch } from 'vue'
import { useEditorContent } from '@/composables/useEditorContent'
import UserMentionDropdown from './Mentions/UserMentionDropdown.vue'
import MetricsMentionDropdown from './Mentions/MetricsMentionDropdown.vue'
import ProjectsMentionDropdown from './Mentions/ProjectsMentionDropdown.vue'

const props = defineProps({
  isEditable: { type: Boolean, default: true },
  placeholder: { type: String, default: 'Escribe tu pregunta aquí' }
})
const emit = defineEmits(['update:text', 'submit'])

const {
  editor,
  text,
  handleInput,
  handleKeyDown,
  handlePaste,
  clear,
  getHTML
} = useEditorContent({ emit })

watch(text, val => emit('update:text', val))

defineExpose({
  clearEditor: clear,
  getContent: getHTML
})
</script>

<style scoped>
.editor-contenteditable.empty::before {
  content: attr(data-placeholder);
  position: absolute;
  pointer-events: none;
  color: #aaa;
  opacity: 0.8;
}

.editor-contenteditable {
  white-space: pre-wrap;
  word-break: break-word;

}
</style>