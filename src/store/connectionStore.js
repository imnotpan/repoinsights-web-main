// src/stores/connection.js
import { defineStore } from 'pinia';

export const useConnectionStore = defineStore('connection', {
  state: () => ({
    status: "desconectado",
  }),
  actions: {
    setStatus(newStatus) {
      this.status = newStatus;
    },
  },
});
