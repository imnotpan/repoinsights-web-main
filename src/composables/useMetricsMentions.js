// src/composables/useMetricMentions.js
import { ref, computed, watch, onUnmounted } from 'vue'
import { useMetricStore } from '@/store/metricsStore'

export function useMetricMentions(editorRef) {
  const metricStore   = useMetricStore()
  const showDropdown  = ref(false)
  const metricQuery   = ref(null)
  let debounceTimer   = null

  const items = computed(() => {
    const seen = new Set()
    return metricStore.metrics.filter(m => {
      if (seen.has(m.id)) return false
      seen.add(m.id)
      return true
    })
  })

  watch(metricQuery, (q) => {
    metricStore.clear()
    clearTimeout(debounceTimer)

    if (q == null) {
      showDropdown.value = false
      return
    }

    debounceTimer = setTimeout(async () => {
      await metricStore.searchMetrics(q)
      showDropdown.value = true
    }, 300)
  })

  function onInput() {
    const txt = editorRef.value?.textContent || ''
    const m   = /\/(.+)$/.exec(txt)   
    // Validación de más de un espacio
    if (!m) {
      metricQuery.value = null
      return
    }
    const q = m[1]                       
    const spaceCount = (q.match(/ /g) || []).length
  
    if (spaceCount > 1) {
      metricQuery.value = null
    } else {
      metricQuery.value = q
      showDropdown.value = true        
    }
  }
  

  function onScrollEnd() {
    if (!showDropdown.value) return
    metricStore.fetchMore()
  }

  function selectMetric(metric) {
    const editor = editorRef.value
    if (!editor) return

    let html = editor.innerHTML.replace(/\/.*$/, '')

    // Inyectamos directamente el token con la sintaxis completa
    const payload = `metric:(id:${metric.id},name:${metric.name})`
    html += `<span
               class="mention-token bg-green-100 text-green-800 rounded px-1 mx-0.5"
               contenteditable="false"
               data-metric-id="${metric.id}"
               data-mention="${payload}">
               ${metric.name}
             </span>&nbsp;`

    editor.innerHTML = html

    // Poner el cursor al final
    const range = document.createRange()
    range.selectNodeContents(editor)
    range.collapse(false)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)

    showDropdown.value = false
    metricQuery.value = null
    metricStore.clear()
  }

  onUnmounted(() => clearTimeout(debounceTimer))

  return {
    showDropdown,
    items,
    onInput,
    onScrollEnd,
    selectMetric
  }
}
