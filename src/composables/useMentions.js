// src/composables/useMentions.js
import { ref, computed, watch, onUnmounted } from 'vue';
import { useUserStore } from '@/store/userSearch';
import { useProjectStore } from '@/store/projectStore';

export function useMentions(editorRef) {
  const userStore    = useUserStore();
  const projectStore = useProjectStore();

  const showDropdown = ref(false);
  const mentionQuery = ref(null);
  let debounceTimer  = null;

  const projectId = computed(() => projectStore.selectedProject?.id);
  const pageSize  = userStore.pageSize;

  const usersToShow = computed(() => {
    const seen = new Set();
    return userStore.participants.filter(u => {
      if (seen.has(u.id)) return false;
      seen.add(u.id);
      return true;
    });
  });

  // Abrir solo al cambiar mentionQuery
  watch(mentionQuery, (q) => {
    userStore.clearParticipants();
    showDropdown.value = false;

    const pid = projectId.value;
    if (pid == null || q == null) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      userStore.searchUsers(q, pid);
      showDropdown.value = true;
    }, 300);
  });

  // Scroll al fondo para paginar
  function onScrollEnd() {
    if (!showDropdown.value) return;
    const pid = projectId.value;
    if (!pid) return;
    userStore.fetchMore(pid);
  }

  // Detectar '@' y texto siguiente
  function onInput() {
    const txt = editorRef.value?.textContent || '';
    const match = /@(\S*)$/.exec(txt);
    mentionQuery.value = match ? match[1] : null;
  }

  // Reemplazar '@xxx' por <span> de mención
  function selectMentionUser(user) {
    const editor = editorRef.value;
    if (!editor) return;
    // elimina '@texto' final
    let html = editor.innerHTML.replace(/@(\S*)$/, '');
    // añade el span + espacio
    html += `<span class="mention-token bg-blue-100 text-blue-800 rounded px-1 mx-0.5" contenteditable="false" data-user-id="${user.id}" data-mention="usr:(id:${user.id},login:${user.login})">@${user.login}</span>&nbsp;`;
    editor.innerHTML = html;
    // posicionar cursor al final
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    showDropdown.value = false;
    mentionQuery.value = null;
    userStore.clearParticipants();
  }

  onUnmounted(() => clearTimeout(debounceTimer));

  return {
    showMentionDropdown: showDropdown,
    uniqueUserResults:   usersToShow,
    onInput,
    selectMentionUser,
    onScrollEnd,
  };
}
