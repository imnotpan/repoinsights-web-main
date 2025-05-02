<!-- src/components/ChatModule/Message/Tools/ReplyButton.vue -->
<template>
    <div class="relative group">
      <span
        class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
      >
        Responder mensaje
      </span>
      <button
        @click="handleReply"
        class="hover:bg-gray-200 rounded-md w-8 h-8 flex items-center justify-center transition-all duration-300 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="gray"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M10.296 6.889L4.833 11.18a.5.5 0 0 0 0 .786l5.463 4.292a.5.5 0 0 0 .801-.482l-.355-1.955c5.016-1.204 7.108 1.494 7.914 3.235c.118.254.614.205.64-.073c.645-7.201-4.082-8.244-8.57-7.567l.371-2.046a.5.5 0 0 0-.8-.483"
          />
        </svg>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue'
  import { useMessageRepliesStore } from '@/store/replyStore'
  
  const props = defineProps({
    messageId:    { type: Number, required: true },
    responseId:   { type: Number, required: false, default: 0 }
  })
  
  const replyStore = useMessageRepliesStore()
  
  function handleReply() {
    replyStore.setReplyTo(props.responseId, props.messageId)
  }
  </script>
  