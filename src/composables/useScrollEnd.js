import { onMounted, onBeforeUnmount } from 'vue'

export function useScrollEnd(listRef, callback, threshold = 10) {
    // Implementación INFINITE-SCROLL para cargar contenido en dropdown
  const handler = () => {
    const el = listRef.value
    if (!el) return
    const { scrollTop, clientHeight, scrollHeight } = el
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      callback()
    }
  }

  onMounted(() => {
    listRef.value?.addEventListener('scroll', handler, { passive: true })
  })
  onBeforeUnmount(() => {
    listRef.value?.removeEventListener('scroll', handler)
  })
}
