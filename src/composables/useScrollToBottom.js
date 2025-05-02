import { nextTick } from 'vue'

export function useScrollToBottom(bottomAnchor) {
  const scrollToBottom = async () => {
    // Espera a que se actualice el DOM para que bottomAnchor esté presente
    await nextTick()
    bottomAnchor.value?.scrollIntoView({ behavior: 'smooth' })
  }

  // Por ejemplo, usando debounce para evitar llamadas excesivas
  let timeoutId = null
  const debouncedScrollToBottom = () => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      scrollToBottom()
      timeoutId = null
    }, 100)
  }

  return { scrollToBottom, debouncedScrollToBottom }
}
