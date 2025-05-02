<!-- src/components/ChatModule/InputMessage/MessageEditor.vue -->
<template>
    <MentionDropdown
    v-if="showMentionDropdown && uniqueUserResults.length"
    :users="uniqueUserResults"
    @select="selectMentionUser"
    @scroll-end="onScrollEnd"
  />
    <div
      ref="editor"
      class="editor"
      :contenteditable="isEditable"
      :data-placeholder="placeholder"
      @input="handleInput"
      @keydown="handleKeyDown"
      @paste="handlePaste"
    ></div>
  

  
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits, defineExpose } from 'vue';
  import MentionDropdown from '@/components/ChatModule/InputMessage/Tools/MentionDropdown.vue';
  import { useMentions } from '@/composables/useMentions';
  
  const props = defineProps({
    isEditable: { type: Boolean, default: true },
    placeholder: { type: String, default: 'Escribe tu pregunta aquí' },
  });
  const emit = defineEmits(['input', 'keydown'])
  
  const editor = ref<HTMLDivElement | null>(null);
  
  const {
    showMentionDropdown,
    uniqueUserResults,
    onInput,
    selectMentionUser,
    onScrollEnd
  } = useMentions(editor);
  
  function handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain') || '';
    document.execCommand('insertText', false, text);
  }
  
  function handleInput(e: InputEvent) {
    onInput();
    emit('input', editor.value?.textContent || '');
  }
  
  function handleKeyDown(e: KeyboardEvent) {
    emit('keydown', e);
  }
  
  // Funciones expuestas al padre
  function clearEditor() {
    if (editor.value) editor.value.innerHTML = '';
  }
  function getContent() {
    return editor.value ? editor.value.innerHTML : '';
  }
  defineExpose({ clearEditor, getContent });
  </script>
  
  <style scoped>
  .editor {
    min-height: 40px;
    padding: 0.5rem;
    outline: none;
  }
  .editor:focus {
    outline: none;
    box-shadow: none;
  }
  .editor:empty::before {
    content: attr(data-placeholder);
    color: #aaa;
    pointer-events: none;
  }
  </style>
  