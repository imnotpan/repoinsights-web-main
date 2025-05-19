// composables/useEditorContent.js
import { ref } from 'vue';

export function useEditorContent({ emit }) {
  const editor = ref(null);
  const text = ref('');

  // Cada input, recalcula text desde innerText
  function handleInput() {
    text.value = getText();
  }

  //  Manejo de tecla Enter
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        e.preventDefault();

        const sel = window.getSelection();
        if (!sel?.rangeCount) return;
        const range = sel.getRangeAt(0);

        range.deleteContents();
        range.collapse(false);  

        const nl = document.createTextNode(' \n');
        range.insertNode(nl);

        range.setStartAfter(nl);
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);

        handleInput();
        return;
      } else {
        e.preventDefault();
        emit('submit');
      }
    }
  }

  // Pegado plano
  function handlePaste(e) {
    e.preventDefault();
    const plain = e.clipboardData.getData('text/plain') || '';
    insertTextAtCursor(plain);
    text.value = getText();
  }

  //  Inserta texto cualquiera en cursor
  function insertTextAtCursor(t) {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(t));
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // Limpia el editor
  function clear() {
    if (editor.value) editor.value.innerHTML = '';
    text.value = '';
  }

  // Devuelve el HTML
  function getHTML() {
    return editor.value?.innerHTML || '';
  }

  // Devuelve el texto puro con '\n' gracias a innerText
  function getText() {
    if (!editor.value) return '';
    return editor.value.innerText.replace(/\u200B/g, '');
  }

  return {
    editor,
    text,
    handleInput,
    handleKeyDown,
    handlePaste,
    clear,
    getHTML,
    getText,
  };
}
