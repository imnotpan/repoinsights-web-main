// composables/useEditor.js
import { ref } from 'vue';

export function useEditor() {
  const editor = ref(null);

  function placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  return {
    editor,
    placeCaretAtEnd,
  };
}
