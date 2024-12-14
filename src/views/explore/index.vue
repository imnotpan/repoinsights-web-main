<template>
    <div class="2xl:container mx-auto px-4 max-w-screen-xl">
        <h1 class="mb-8 text-2xl text-center">Repositorios destacados</h1>
        <div class="featured grid grid-cols-12 gap-4 pb-5 lg:w-3/4 mx-auto">
            <div v-if="store.loading.featured" v-for="index in 3" :key="index" class="col-span-4">
                <SkeletonLoader :number=1 :vertical=true :height=226 />
            </div>
            <template v-else v-for="featuredProject in store.featuredProjects" :key="featuredProject.id">
                <FeaturedCard :project=featuredProject @selectedProject="updateUserProjects" />
            </template>
        </div>
        <div class="grid grid-cols-12 gap-10 pt-5 border-t">
            <div class="col-span-3 z-auto self-start top-20">
                <Card className="lg:!h-fit min-h-screen" bodyClass="p-2 relative">
                    <div class="py-3 border-b flex justify-between mr-2 relative">
                        <p class="font-medium">Filtros</p>
                        <div v-if="store.activeFilters" @click="cleanFilters"
                            class="group border border-red-700 py-1 px-2 text-xs cursor-pointer transition-colors duration-200 ease-in-out hover:bg-red-50 rounded">
                            <span class="text-red-700  transition-all duration-200 ease-in-out">Limpiar
                                filtros</span>
                        </div>
                    </div>
                    <div v-if="store.loading.filters" class="w-full m-auto">
                        <SkeletonLoader :height=25 :number=10 class="mt-4" />
                    </div>
                    <template v-else>
                        <Filter ref="userFilter" :filterData="store.projectFilters.user.info"
                            :options="store.projectFilters.user.data" @filterClicked="handleFilterClicked" />
                        <Filter ref="langFilter" :filterData=store.projectFilters.langs.info
                            :options="store.projectFilters.langs.data" selectionMode="multiple"
                            @filterClicked="handleFilterClicked" />
                        <Filter ref="commitFilter" :filterData=store.projectFilters.commit.info
                            :options="store.projectFilters.commit.data" @filterClicked="handleFilterClicked" />
                    </template>
                </Card>
            </div>
            <div class="col-span-8">
                <div class="flex justify-between">
                    <SearchBar placeholder="Buscar repositorios..." @search="store.searchProjects" />
                    <div class="flex gap-2 relative">
                        <SortSelector :options="store.sortFilters" @change="handleChangeSortFilter"
                            @changeOrder="handleSortOrder" :selectedOption=store.sortActiveFilter
                            :loading=store.loading.sort />
                    </div>
                </div>
                <p class="text-right py-2"><span class="font-medium">{{ store.projects.total }}</span> repositorios</p>

                <template v-if="store.loading.projects">
                    <SkeletonLoader :height=160 className="p-6 my-5" :number=10 />
                </template>
                <template v-else v-for="project in store.projects.data" key="project.id">
                    <ProjectCard :project="project" @selectedProject="updateUserProjects" />
                </template>
            </div>
        </div>
    </div>
</template>
  
<script setup>

import { ref, onMounted, computed } from "vue";

import Card from "@/components/Card";
import SkeletonLoader from "@/components/Skeleton/index";
import Icon from "@/components/Icon";

import SearchBar from "@/components/Explore/SearchBar";
import ProjectCard from "@/components/Explore/ProjectCard";
import FeaturedCard from "@/components/Explore/FeaturedCard";
import Filter from "@/components/Explore/Filter";

import SortSelector from "@/components/Select/SortSelector";
import ButtonWithHelp from "@/components/Button/ButtonWithHelp.vue";

import { useToast } from 'vue-toastification';
import { useExploreStore } from "@/store/exploreProject";
import { tooltip } from "leaflet";

const toast = useToast();
let store = useExploreStore();

const userFilter = ref(null);
const langFilter = ref(null);
const commitFilter = ref(null);

const handleFilterClicked = async () => {
    await store.loadData()
}

const updateUserProjects = async (project) => {
    const msgs = {
        add: "Repositorio agregado correctamente",
        remove: "Repositorio removido correctamente"
    }
    const msg = project.selected ? msgs.add : msgs.remove
    try {
        await store.updateUserProject(project)
        toast.success(msg)
        const params = store.getUrlParams()
        await store.getFilters(params)
    }
    catch (error) {
        toast.error("Ocurrió un error al actualizar los repositorios del usuario")
    }
}

const cleanFilters = async () => {
    userFilter.value.cleanFilters();
    langFilter.value.cleanFilters();
    commitFilter.value.cleanFilters();
    await store.loadData()
};

const handleChangeSortFilter = async (option) => {
    const selectedSortOption = option ? option.id : null
    store.sortByFilter(store.projects.data, selectedSortOption);
}

const handleSortOrder = async (order) => {
    store.sortDirection = order
    store.sortByOrder(order)
}

onMounted(async () => {
    await Promise.all([store.loadData(), store.getFeaturedProjects()])
});

</script>
