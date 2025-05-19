// src/stores/userStore.js
import { defineStore } from 'pinia';
import {axiosNLP} from '@/plugins/axios.js';


export const useUserStore = defineStore('users', {
  state: () => ({
    participants: [],
    offset: 0,
    pageSize: 50,
    query: '',
    hasMore: true,
  }),
  actions: {
    async searchUsers(query, project_id) {
      this.query   = query;
      this.offset  = 0;
      this.hasMore = true;
      this.participants = [];
      await this._loadPage(project_id);
    },
    async fetchMore(project_id) {
      if (!this.hasMore) return;
      await this._loadPage(project_id);
    },
    async _loadPage(project_id) {
        console.trace('➡️ Llamada a _loadPage');

      const params = {
        project_id,
        limit: this.pageSize,
        offset: this.offset,
        query: this.query,   // siempre lo incluimos
      };
      try {
        const { data } = await axiosNLP.get('/core/users/search', { params });
        console.log("VALOR DE SEARCH " + data)
        const list = data; // array de {id,login}
        this.hasMore = list.length === this.pageSize;
        this.participants = this.participants.concat(list);
        this.offset += list.length;
      } catch (e) {
        console.error('Error cargando participantes:', e);
      }
    },
    clearParticipants() {
      this.participants = [];
      this.offset       = 0;
      this.query        = '';
      this.hasMore      = true;
    },
  },
});
