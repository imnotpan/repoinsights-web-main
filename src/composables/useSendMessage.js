// composables/useSendMessage.js
import { useMessageStore } from '@/store/messageStore';
import { useProjectStore } from '@/store/projectStore';
import { useMessageRepliesStore } from '@/store/replyStore';

export function useSendMessage(editor) {
  const messageStore = useMessageStore();
  const projectStore = useProjectStore();
  const replyStore = useMessageRepliesStore();

  async function send() {
    if (!projectStore.selectedProject || !editor) return;

    const childNodes = Array.from(editor.childNodes);
    let finalText = '';

    for (const node of childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        finalText += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node;
        if (el.classList.contains('mention-token')) {
          const userId = el.getAttribute('data-user-id');
          const login = el.textContent ? el.textContent.replace('@', '') : '';
          finalText += ` usuario:(id: ${userId}, login: ${login}) `;
        }
        if (el.tagName === 'BR') finalText += '\n';
      }
    }

    const content = finalText.trim();
    const projectId = projectStore.selectedProject ? projectStore.selectedProject.id : null;

    try {
      if (replyStore.replyTo) {
        await replyStore.sendReply(content, 1, projectId);
        replyStore.clearReply();
      } else {
        await messageStore.sendMessage(content, 1, projectId);
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }

    editor.innerHTML = '';
  }

  return {
    send,
  };
}
