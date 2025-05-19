<template>
  <div class="relative mb-4 flex flex-col">
    <ReplyPreview
      v-if="replyThread"
      :reply="replyThread"
      @clear="replyStore.clearReply"
    />

    <div class="bg-white p-4 rounded-xl">
    <MessageEditor
      ref="messageEditorRef"
      v-model:text="messageText"
      :isEditable="hasProject"
      :placeholder="editorPlaceholder"
      @submit="handleSend"
    />

      <div class="w-full flex mt-4">
        <div class="w-full flex h-full space-x-2">
          <ProjectSearch />
          <ConnectionStatus />
          <InfoTooltip />
          <DeleteChatButton/>
        </div>
        <div class="ml-auto">
          <SendButton
            :hasSelectedProject="hasProject"
            :hasContent="hasContent"
            @send="handleSend"
          />
        </div>
      </div>
    </div>

    <p class="text-[11px] text-gray-400 w-[1/2] mx-auto text-center">
      El agente puede cometer errores...
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useProjectStore } from '@/store/projectStore';
import { useMessageStore } from '@/store/messageStore';
import { useMessageRepliesStore } from '@/store/replyStore';

import MessageEditor from '@/components/ChatModule/InputMessage/MessageEditor.vue';
import ProjectSearch  from '@/components/ChatModule/InputMessage/Tools/ProjectSearch.vue';
import ConnectionStatus from '@/components/ChatModule/InputMessage/Tools/ConnectionStatus.vue';
import SendButton    from '@/components/ChatModule/InputMessage/SendButton.vue';
import ReplyPreview  from '@/components/ChatModule/InputMessage/Tools/ReplyPreview.vue';
import InfoTooltip from '@/components/ChatModule/InputMessage/Tools/InfoTooltip.vue';
import DeleteChatButton from '@/components/ChatModule/InputMessage/Tools/DeleteChatButton.vue';

// stores
const projectStore = useProjectStore();
const messageStore = useMessageStore();
const replyStore   = useMessageRepliesStore();

// estado local
const messageText = ref('');
// 2) Declaramos el ref para exponer el API del editor
const messageEditorRef = ref(null);

const replyThread = computed(() => {
  return (
    messageStore.conversationThreads.find(
      t => t.id === replyStore.threadId
    ) || null
  );
});

const editorPlaceholder = computed(() =>
  hasProject.value ? 'Escribe tu pregunta aquí' : 'No hay proyecto seleccionado'
);

const hasProject = computed(() =>
  projectStore.selectedProject !== null
);

const hasContent = computed(() => {
  const t = messageText.value.trim();
  return t !== '' && t !== 'Escribe tu pregunta aquí';
});

async function handleSend() {
  if (!hasProject.value || !hasContent.value) return;
  try {
    const rawHtml = (await messageEditorRef.value.getContent()) || '';

    const container = document.createElement('div');
    container.innerHTML = rawHtml;

    container.querySelectorAll('span[data-mention]').forEach(span => {
      const mentionCode = span.getAttribute('data-mention');
      const textNode = document.createTextNode(mentionCode + ' ');
      span.replaceWith(textNode);
    });

    const content = container.textContent.trim();
    await messageStore.sendMessage(
      content,
      projectStore.selectedProject.id,
      replyStore.replyToId
    );

    replyStore.clearReply();
    messageEditorRef.value.clearEditor();
    messageText.value = '';
  } catch (err) {
    console.error('Error al enviar mensaje:', err);
  }
}
</script>
