<!-- src/components/ConversationThread.vue -->
<template>
    <div class="flex flex-col space-y-4">
        <div class="flex justify-end">
            <UserMessageItem :message="thread" />
        </div>
        <div class="flex justify-start">
            <AgentMessageItem :thread="thread" />
        </div>
    </div>
</template>
  
<script setup>
    import AgentMessageItem from '@/components/ChatModule/Message/Agent/Item.vue';
    import UserMessageItem from '@/components/ChatModule/Message/User/Item.vue';
    
    defineProps({
        thread: {
        type: Object,
        required: true
        }
    });
</script>
  