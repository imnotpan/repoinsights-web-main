<template>
  <div class="relative h-full flex items-center min-w-[200px] group ">
    <!-- Input de búsqueda y resultados -->
    <div v-if="!projectStore.selectedProject" class="w-full">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar proyecto"
        class="w-full p-2 h-[37px] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div
        class="flex items-center w-full h-full p-2 rounded-lg border border-gray-300 bg-white overflow-hidden"
      >
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

// Computed de proyectos únicos
const uniqueProjects = computed(() => {
  const seen = new Set();
  return projectStore.searchResults.filter(project => {
    if (seen.has(project.id)) return false;
    seen.add(project.id);
    return true;
  });
});

// Watch para búsquedas
watch(searchQuery, (newValue) => {
  if (projectStore.selectedProject) return;
  if (!isUserTyping) return;
  if (debounceTimer) clearTimeout(debounceTimer);

  projectStore.clearSearchResults();
  if (!newValue.trim()) {
    projectStore.setSelectedProject(null);
    return;
  }

  debounceTimer = setTimeout(() => {
    projectStore.searchProjects(newValue);
  }, 500);
});

// Seleccionar proyecto
const selectProject = (project: any) => {
  isUserTyping = false;
  searchQuery.value = '';
  projectStore.clearSearchResults();
  projectStore.setSelectedProject(project);
  setTimeout(() => (isUserTyping = true), 0);
};

// Quitar proyecto
const removeProject = () => {
  projectStore.setSelectedProject(null);
  searchQuery.value = '';
};
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
