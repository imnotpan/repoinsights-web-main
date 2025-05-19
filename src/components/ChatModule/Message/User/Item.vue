<template>
  <div class="mb-4">
    <ReplyPreview
      v-if="replyMessage"
      :content="replyMessage.response.content"
      @clear="clearReply" />

    <div class="max-w-md p-4 rounded shadow bg-blue-200">
      <p
        class="text-sm whitespace-pre-wrap break-words"
        v-html="renderedContent"
      ></p>
    </div>
  </div>
</template>

  
  
  <script setup>
  
  import { computed } from 'vue';
  import ReplyPreview from '@/components/ChatModule/Message/User/Reply.vue';
  import { useMessageStore } from '@/store/messageStore';
  
  const messageStore = useMessageStore();
  const mentionConfigs = [
  {
    type: 'user',
    field: 'login',
    dataAttrId: 'data-user-id',
    bgColor: 'blue',
    textColor: 'blue',
    display: login => `@${login}`,
  },
  {
    type: 'metric',
    field: 'name',
    dataAttrId: 'data-metric-id',
    bgColor: 'green',
    textColor: 'green',
    display: name => name,
  },
  {
    type: 'project',
    field: 'name',
    dataAttrId: 'data-project-id',
    bgColor: 'purple',
    textColor: 'purple',
    display: name => name,
  },
]
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
    return foundMessage;
  });
  
  function applyMention(content, { type, field, dataAttrId, bgColor, textColor, display }) {
    // Captura cualquier contenido entre paréntesis y procesa luego
    const re = new RegExp(
      `${type}:\\(([^\\)]*)\\)`, // Toma todo lo que hay entre los paréntesis
      'g'
    );
    return content.replace(re, (fullMatch, inside) => {
      // Busca los campos con regex separadas (permitiendo cualquier orden)
      const idMatch = inside.match(/id:\s*([0-9]+)/);
      const fieldMatch = inside.match(new RegExp(`${field}:\\s*([^,]+)`));
      if (!idMatch || !fieldMatch) return fullMatch; // No matchea, retorna igual

      const id = idMatch[1];
      const label = fieldMatch[1].trim();
      const mentionCode = `${type}:(id:${id},${field}:${label})`;

      // ¡Si quieres puedes cambiar esto por <a> o <span> según type aquí!
      return `<span
        class="mention-token bg-${bgColor}-100 text-${textColor}-800 rounded px-1 mx-0.5"
        contenteditable="false"
        ${dataAttrId}="${id}"
        data-mention="${mentionCode}"
      >${display(label)}</span>`;
    });
  }


  const renderedContent = computed(() => {
    const raw = props.message.content || ''
    return mentionConfigs.reduce(
      (html, cfg) => applyMention(html, cfg),
      raw
    )
  })
    
  const clearReply = () => {
    console.log('Clear reply');
  };
  </script>
  