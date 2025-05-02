// src/stores/replyStore.js
import { defineStore } from 'pinia';

export const useMessageRepliesStore = defineStore('replyStore', {
  state: () => ({
    replyToId: null,
    threadId: null
  }),
  actions: {
    setReplyTo(messageId, threadId) {
      this.replyToId = messageId;
      this.threadId = threadId
      console.log("SET REPLYID: ", this.replyToId)
    },
    clearReply() {
      this.replyToId = null;
      this.threadId = null;
    }
  }
});
