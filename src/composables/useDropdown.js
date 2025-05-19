// composables/useDropdown.js
import { ref, onBeforeUnmount, nextTick, unref } from 'vue'

export function useDropdown({ editorRef = null, widthPx = 256 }) {
  const listRef = ref(null)
  const dropdownStyle = ref({
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: typeof widthPx === 'number' ? `${widthPx}px` : widthPx
  })

  let clickOutsideHandler

  function updatePosition() {
    const el = listRef.value
    const editor = editorRef ? unref(editorRef) : null
    if (!el) return

    el.style.width = dropdownStyle.value.width
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) return
    const range = sel.getRangeAt(0).cloneRange()
    range.collapse(true)
    const rect = range.getClientRects()[0]
    if (!rect) return

    const w = el.clientWidth
    const h = el.clientHeight
    dropdownStyle.value.top = `${rect.top - h - 8}px`
    dropdownStyle.value.left = `${rect.left - w / 2}px`
    dropdownStyle.value.position = 'fixed'
  }

  function registerClickOutside(handler) {
    clickOutsideHandler = e => {
      const editor = editorRef ? unref(editorRef) : null
      if ((editor && !editor.contains(e.target)) && !listRef.value?.contains(e.target)) {
        handler()
      }
    }
    document.addEventListener('click', clickOutsideHandler)
  }

  function unregisterClickOutside() {
    document.removeEventListener('click', clickOutsideHandler)
  }

  onBeforeUnmount(() => {
    unregisterClickOutside()
  })

  return { listRef, dropdownStyle, updatePosition, registerClickOutside, unregisterClickOutside }
}
