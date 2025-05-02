<template>
    <div class="mb-4">
      <!-- Se renderiza ReplyPreview solo si existe el mensaje de reply -->
      <ReplyPreview
        v-if="replyMessage"
        :content="replyMessage.response.content"
        @clear="clearReply" />
  
      <div class="max-w-md p-4 rounded shadow bg-blue-200">
        <p class="text-sm whitespace-normal break-words" v-html="renderedContent"></p>
      </div>
    </div>
  </template>
  
  
  
  <script setup>
  import { computed } from 'vue';
  import ReplyPreview from '@/components/ChatModule/Message/User/Reply.vue';
  import { useMessageStore } from '@/store/messageStore';
  
  const messageStore = useMessageStore();
  
  const props = defineProps({
    message: {
      type: Object,
      required: true
    }
  });
  
  // Computed para determinar el mensaje de reply
  const replyMessage = computed(() => {
    let foundMessage = null;
    
    if (props.message.reply_to_id) {
        foundMessage = messageStore.conversationThreads.find(msg => {
            return msg.response && msg.response.id === props.message.reply_to_id;
        }) || null;
    }
    console.log(messageStore.conversationThreads)
    console.log("MESSAGE ID: ", props.message.id)
    return foundMessage;
  });
  
  // Computed para transformar el contenido del mensaje
  const renderedContent = computed(() => {
    let content = props.message.content || '';
    return content.replace(
      /usr:\(id:\s*(\d+),\s*login:\s*([^)]+)\)/g,
      (match, id, login) => {
        return `<span class="mention-token bg-blue-100 text-blue-800 rounded px-1 mx-0.5" contenteditable="false">@${login}</span>`;
      }
    );
  });
  
  // Función para limpiar el reply (puedes adaptarla a tus necesidades)
  const clearReply = () => {
    console.log('Clear reply');
  };
  </script>
  