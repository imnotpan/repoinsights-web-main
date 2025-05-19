import { 
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  unref,
} from 'vue'

export function useMention({
  editorRef,
  triggerChar,
  fetchItemsFn,
  clearItemsFn,
  getItemsFn,
  renderTokenFn,
  getContextId,
  textRef,
}) {

  const show      = ref(false);
  const items     = ref([]);
  const query     = ref('');
  let timer       = null;
  let activeRange = null;
  const position  = ref({ x: 0, y: 0 }); 
  let firstOpen   = true;

  function clearResults() {
    clearItemsFn()
    show.value    = false
    query.value   = ''
    firstOpen     = true   
  }

  async function fetchItems(queryText = '') {
    items.value = []
    await fetchItemsFn(queryText, getContextId())
    items.value = getItemsFn()
    return getItemsFn()
  }

  function renderToken(item) {
    return renderTokenFn(item)
  }

function selectItem(item) {
  if (!activeRange) return;
  console.log("SELECT ITEM")

  const html = renderTokenFn(item);
  const frag = activeRange.createContextualFragment(html);
  const nodes = Array.from(frag.childNodes);  

  activeRange.deleteContents();
  activeRange.insertNode(frag);

  const lastNode = nodes[nodes.length - 1];
  const newRange = document.createRange();
  newRange.setStartAfter(lastNode);
  newRange.collapse(true);

  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(newRange);

  clearResults();
  activeRange = null;
}


function handleInput() {
  const editor = unref(editorRef);
  const sel = window.getSelection();
  if (!sel?.rangeCount || !editor) {
    clearResults();
    return;
  }

  const origRange = sel.getRangeAt(0);
  const node = origRange.startContainer;
  const offset = origRange.startOffset;

  if (node.nodeType !== Node.TEXT_NODE) {
    clearResults();
    return;
  }

  const textBeforeCaret = node.textContent.slice(0, offset);
  const idx = textBeforeCaret.lastIndexOf(triggerChar);
  if (idx === -1) {
    clearResults();
    return;
  }

  const fragment = textBeforeCaret.slice(idx + 1);
  if (fragment.includes('  ')) {
    clearResults();
    return;
  }

  query.value = fragment;
  if (firstOpen) {
    const caretRange = origRange.cloneRange();
    caretRange.collapse(false);
    const rect = caretRange.getClientRects()[0];
    if (rect) {
      const editorEl   = unref(editorRef);
      const editorRect = editorEl.getBoundingClientRect();
      const x = rect.left - editorRect.left;
      const bottom = editorRect.bottom - rect.top;

      // guardamos x y bottom
      position.value = { x, bottom };
    }
  firstOpen = false;
}
  show.value  = true;
  
  clearTimeout(timer);
  fetchItems(fragment);

  const r = origRange.cloneRange();
  r.setStart(node, idx);
  activeRange = r;
}



function insertAtCursor(editor, content) {
  editor.focus();
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  const txt = range.toString();
  console.log(`»${txt}« (${txt.length} caracteres)`);

  sel.removeAllRanges();

  let node;
  if (typeof content === 'string') {
    if (content.trim().startsWith('<')) {
      node = range.createContextualFragment(content);
    } else {
      node = document.createTextNode(content);
    }
  } else {
    node = content;
  }

  range.insertNode(node);
  const last = node.nodeType === 11 
    ? node.lastChild
    : node;
    
  if (last) {
    range.setStartAfter(last);
    range.collapse(true);
    sel.addRange(range);
  }
}

  onMounted(() => {
    const el = unref(editorRef)
    el?.addEventListener('input', handleInput)

    const clickOutside = e => {
      if (!unref(editorRef)?.contains(e.target)) {
        clearResults()
      }
    }
    document.addEventListener('click', clickOutside)
    el.__clickOutside = clickOutside
  })

  onBeforeUnmount(() => {
    const el = unref(editorRef)
    el?.removeEventListener('input', handleInput)
    if (el?.__clickOutside) {
      document.removeEventListener('click', el.__clickOutside)
      delete el.__clickOutside
    }
    clearTimeout(timer)
  })

  watch(textRef, fullText => {
    const match = fullText.match(new RegExp(`\\${triggerChar}([^\\s]*)$`))
    if (!match) clearResults()
    else query.value = match[1]
  })

  return {
    items: items,
    show: show,
    position: position,
    internalFetch: fetchItems,
    internalClear: clearResults,
    internalRender: renderToken,
    selectItem: selectItem
  }
}