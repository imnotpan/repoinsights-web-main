<template>
    <div class="relative h-full bg-gray-100 flex items-center min-w-[200px]">
      <!-- Input de búsqueda -->
      <div v-if="!projectStore.selectedProject" class="w-full">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar proyecto"
          class="w-full p-2 h-[37px] rounded-xl border border-gray focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
  
        <!-- Desplegable de resultados -->
        <ul
          v-if="uniqueProjects.length"
          class="absolute bottom-full mb-2 bg-white border border-gray-300 rounded-lg w-full z-10 left-0 right-0 max-h-60 overflow-auto"
        >
          <li
            v-for="project in uniqueProjects"
            :key="project.id"
            class="p-2 hover:bg-gray-200 cursor-pointer"
            @click="selectProject(project)"
          >
            {{ project.name }} / {{ project.user_login }}
          </li>
        </ul>
      </div>
  
      <!-- Proyecto seleccionado -->
      <div v-else class="w-full h-[37px]">
        <div class="flex items-center w-full h-full p-2 rounded-lg border border-gray-300 bg-white overflow-hidden">
          <span class="truncate flex-grow">
            {{ projectStore.selectedProject.name }} / {{ projectStore.selectedProject.user_login }}
          </span>
          <button 
            @click="removeProject" 
            class="flex-shrink-0 ml-2 text-gray-500 hover:text-red-700 focus:outline-none"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useProjectStore } from '@/store/projectStore';
  
  const projectStore = useProjectStore();
  const searchQuery = ref('');
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let isUserTyping = true;
  
  // Propiedad computada para filtrar proyectos duplicados según su id
  const uniqueProjects = computed(() => {
    const seen = new Set();
    return projectStore.searchResults.filter(project => {
      if (seen.has(project.id)) {
        return false;
      } else {
        seen.add(project.id);
        return true;
      }
    });
  });
  
  watch(searchQuery, (newValue) => {
    // Si ya hay un proyecto seleccionado, no se realiza la búsqueda
    if (projectStore.selectedProject) return;
    
    if (!isUserTyping) return;
  
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  
    // Limpiar resultados antes de realizar la búsqueda
    projectStore.clearSearchResults();
  
    // Si el input está vacío, asegurarse de que no haya un proyecto seleccionado
    if (!newValue.trim()) {
      projectStore.setSelectedProject(null);
      return;
    }
  
    debounceTimer = setTimeout(() => {
      projectStore.searchProjects(newValue);
    }, 500);
  });
  
  const selectProject = (project: any) => {
    isUserTyping = false;
    // Al seleccionar, se limpia el input y se establecen los resultados a vacío
    searchQuery.value = '';
    projectStore.clearSearchResults();
    projectStore.setSelectedProject(project);
    setTimeout(() => (isUserTyping = true), 0);
  };
  
  const removeProject = () => {
    // Al quitar el proyecto, se restablece el input para poder buscar nuevamente
    projectStore.setSelectedProject(null);
    searchQuery.value = '';
  };
  </script>
  
  <style scoped>
  /* Puedes agregar estilos adicionales si es necesario */
  </style>
  