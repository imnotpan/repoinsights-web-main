// src/stores/projects.js

import { defineStore } from 'pinia';
import { axiosNLP } from '@/plugins/axios.js';

export const useProjectStore = defineStore('projects', {
  state: () => ({
    searchResults: [],
    selectedProject: null,
    isLoading: false,
    error: null,
  }),
  actions: {
    async searchProjects(query, limit = 10) {
      console.log("BUSQUEDAA")
      this.searchResults = [];

      this.isLoading = true;
      this.error = null;

      try {
        const { data } = await axiosNLP.get('/core/projects/search', {
          params: {
            query,
            limit,
          },
        });
        console.log("HOLAA: " + data)
        this.searchResults = Array.isArray(data) ? data : data.projects || [];
      } catch (err) {
        console.error('Error al buscar proyectos:', err);
        this.error = err.response?.data?.detail || err.message;
        this.searchResults = [];
      } finally {
        this.isLoading = false;
      }
    },

    clearSearchResults() {
      this.searchResults = [];
    },

    setSelectedProject(project) {
      this.selectedProject = project;
    },

    clearSelectedProject() {
      this.selectedProject = null;
    },

    resetStore() {
      this.searchResults = [];
      this.selectedProject = null;
      this.isLoading = false;
      this.error = null;
    },
  },
});
