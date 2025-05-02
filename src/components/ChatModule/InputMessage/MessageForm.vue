<template>
    <div class="relative mb-4 flex flex-col">
      
      <!-- 1) Mostrar ReplyPreview si existe mensaje al que se responde -->
      <ReplyPreview
        v-if="replyMessage"
        :reply="replyMessage"
        @clear="clearReply"
      />
  
      <div class="bg-white p-4 rounded-xl">
        <!-- Editor con menciones integrado -->
        <MessageEditor
          ref="editorComponent"
          :isEditable="hasSelectedProject"
          @input="onInput"
          @keydown="onKeyDown"
        />
  
        <!-- Parte inferior del mensaje -->
        <div class="w-full flex mt-4">
          <div class="w-full flex h-full space-x-2">
            <ProjectSearch />
            <ConnectionStatus />
          </div>
          <div class="ml-auto">
            <SendButton 
              :hasSelectedProject="hasSelectedProject" 
              :hasContent="hasContent"
              @send="handleSend"
            />
          </div>
        </div>
      </div>
  
      <div class="text-[11px] text-gray-400 w-[50%] mx-auto text-center">
        El agente puede cometer errores...
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useProjectStore } from '@/store/projectStore';
  import { useMessageStore } from '@/store/messageStore';
  import { useMessageRepliesStore } from '@/store/replyStore';
  
  import MessageEditor from '@/components/ChatModule/InputMessage/MessageEditor.vue';
  import ProjectSearch from '@/components/ChatModule/InputMessage/Tools/ProjectSearch.vue';
  import ConnectionStatus from '@/components/ChatModule/InputMessage/Tools/ConnectionStatus.vue';
  import SendButton from '@/components/ChatModule/InputMessage/SendButton.vue';
  import ReplyPreview from '@/components/ChatModule/InputMessage/Tools/ReplyPreview.vue';
  
  const editorComponent = ref(null);
  const projectStore = useProjectStore();
  const messageStore = useMessageStore();
  const replyStore = useMessageRepliesStore();
  
  const messageText = ref('');
  
  const replyMessage = computed(() => {
    if (!replyStore.threadId) return null;
    return messageStore.conversationThreads.find(
      (thread) => thread.id === replyStore.threadId
    );
  });
  
  // Método para limpiar la respuesta (invocado desde "Cancelar" en ReplyPreview)
  function clearReply() {
    replyStore.clearReply();
  }
  
  // Lógica para enviar mensaje o respuesta
  const handleSend = async () => {
    if (!hasSelectedProject.value || !hasContent.value) return;
  
    try {
      // 1) Obtenemos el contenido HTML del editor
      const rawHTML = editorComponent.value.getContent();
      const finalMessage = transformMentions(rawHTML);
  
      // 2) Enviar el mensaje utilizando sendMessage, integrando reply_to_id si existe.
      await messageStore.sendMessage(
        finalMessage,
        projectStore.selectedProject?.id,
        replyStore.replyToId 
      );
  
      // Si se envió una respuesta, se limpia el estado de reply
      if (replyStore.replyToId) {
        replyStore.clearReply();
      }
  
      // 3) Limpiar el editor
      if (editorComponent.value) {
        editorComponent.value.clearEditor();
      }
      messageText.value = '';
  
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    }
  };
  
  // Funciones de manejo del editor
  function onInput(text) {
    messageText.value = text;
  }
  
  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }
  
  const hasSelectedProject = computed(() => projectStore.selectedProject !== null);
  const hasContent = computed(() => {
    const txt = messageText.value.trim();
    return txt !== '' && txt !== 'Escribe tu pregunta aquí';
  });
  
  /**
   * Función que transforma las menciones:
   * Reemplaza elementos con clase 'mention-token' por su valor de mención.
   */
  function transformMentions(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
  
    doc.querySelectorAll('.mention-token').forEach(span => {
      const mentionValue = span.getAttribute('data-mention') || span.textContent;
      const textNode = document.createTextNode(mentionValue);
      span.parentNode?.replaceChild(textNode, span);
    });
  
    return doc.body.innerHTML;
  }
  </script>
  