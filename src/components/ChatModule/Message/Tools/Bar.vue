<!-- src/components/ChatModule/Thread/Bar.vue -->
<template>
    <div class="p-2 w-[70%] relative overflow-visible flex">
      <LikeButton :messageId="thread.id" :in_rag="thread.in_rag" />
      <ReplyButton
        :responseId="thread.response?.id"
        :messageId="thread.id"
      />
      <CopyButton :text="thread.response?.content || ''" />
      <ChartButton :thread="thread" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, onMounted } from 'vue'
  import type { PropType } from 'vue'
  import LikeButton from '@/components/ChatModule/Message/Tools/LikeButton.vue'
  import ReplyButton from '@/components/ChatModule/Message/Tools/ReplyButton.vue'
  import CopyButton from '@/components/ChatModule/Message/Tools/CopyButton.vue'
  import ChartButton from '@/components/ChatModule/Message/Tools/ChartButton.vue'

  interface Thread {
    id: number
    in_rag: boolean
    response: { id: number; content: string } | null
  }
  
  const props = defineProps({
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  })

  onMounted(() => {
    console.log(props.thread)
  })
  </script>
  