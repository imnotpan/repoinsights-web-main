// stores/processStore.js
import { defineStore } from 'pinia';
import { axiosNLP } from '@/plugins/axios.js';

export const useProcessStore = defineStore('process', {
  state: () => ({
    processMap: {}, 
  }),
  actions: {
    async fetchProcessSteps(messageId) {
      if (this.processMap[messageId]) return; 

      try {
        const response = await axiosNLP.get(`/core/chat/message/${messageId}/process`, {
          params: { message_id: messageId },
        });
        console.log(response.data)
        this.processMap[messageId] = response.data.process;
      } catch (error) {
        console.error('Error al obtener procesos:', error);
      }
    },
  },
});
