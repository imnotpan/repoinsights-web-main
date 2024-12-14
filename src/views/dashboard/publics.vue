<template>
    <div class="container mx-auto px-4 max-w-6xl md:px-0">
        <div v-if="serverError" class="w-full text-center">
            <span class="text-xl font-bold dark:text-white text-slate-700">
                Ha ocurrido un problema...
            </span>
        </div>

        <div v-else>
            <div class="col-span-4 formGroup relative">
                <span class="text-lg font-semibold">
                    Repositorios disponibles ({{ projects.length }})
                </span>
                <ChipGrid
                    :projects="projects"
                    v-model="selectedProjects"
                    @chipClicked="handleSelectChange"
                />
            </div>

            <div class="relative w-full h-full mt-8">
                <div v-if="loading">
                    <div
                        class="h-screen w-full absolute top-0 left-0 flex flex-col items-center justify-center bg-white rounded-lg mb-4"
                    >
                        <div
                            class="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary-500"
                        ></div>
                        <div
                            class="text-xl font-semibold ml-4 text-primary-500"
                        >
                            Cargando el dashboard...
                        </div>
                    </div>
                </div>
                <div id="dashboard-container" class="w-full h-full"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import axiosClient from "@/plugins/axios";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { onMounted, ref, watch } from "vue";
import { useToast } from "vue-toastification";

import ChipGrid from "./ChipGrid.vue";

const supersetUrl = "http://localhost:8088";
const supersetApiUrl = `${supersetUrl}/api/v1/security`;
const dashboardId = "abf07b39-dfe7-4c9e-8738-2cd4088793f4";

const projects = ref([]);
const selectedProjects = ref([]);
const loading = ref(false);
const serverError = ref(false);
const toast = useToast();

const getProjects = async () => {
    try {
        const { data } = await axiosClient.get(
            "/api/repoinsights/projects/favorites/",
            {
                params: { metrics: false },
            }
        );
        projects.value = data.projects;
        selectedProjects.value = data.projects
            .filter((item) => item.selected)
            .map((item) => item.id);
    } catch (error) {
        toast.error(
            "Ha ocurrido un error al cargar los repositorios, por favor intenta más tarde"
        );
        serverError.value = true;
    }
};

const loadDashboard = async () => {
    console.log("Proyectos seleccionados:", selectedProjects.value);
    if (
        !Array.isArray(selectedProjects.value) ||
        selectedProjects.value.length === 0
    ) {
        console.warn(
            "No hay proyectos seleccionados o el formato no es válido."
        );
        return;
    }

    if (!selectedProjects.value.length) {
        console.warn("No hay proyectos seleccionados.");
        return;
    }

    loading.value = true;

    try {
        // Login to Superset and get access token
        const login_body = {
            password: "admin",
            provider: "db",
            refresh: true,
            username: "admin",
        };
        const login_headers = {
            headers: { "Content-Type": "application/json" },
        };

        const { data: loginData } = await axios.post(
            `${supersetApiUrl}/login`,
            login_body,
            login_headers
        );
        const access_token = loginData["access_token"];

        // Get guest token
        const guest_token_body = JSON.stringify({
            resources: [{ type: "dashboard", id: dashboardId }],
            rls: [],
            user: {
                username: "myAppUser",
                first_name: "MyApp User",
                last_name: "MyApp User",
            },
        });

        const guest_token_headers = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        };

        const { data: tokenData } = await axios.post(
            `${supersetApiUrl}/guest_token/`,
            guest_token_body,
            guest_token_headers
        );

        // Embed dashboard
        embedDashboard({
            id: dashboardId,
            supersetDomain: supersetUrl,
            mountPoint: document.getElementById("dashboard-container"),
            fetchGuestToken: () => tokenData.token,
            dashboardUiConfig: {
                filters: { expanded: true },
                urlParams: {
                    standalone: 3,
                    project_id: selectedProjects.value.join(","),
                },
            },
        });
    } catch (error) {
        toast.error("Error al cargar el dashboard, intenta más tarde");
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const handleSelectChange = async (response) => {
    const { project, selected } = response;

    if (selected) {
        selectedProjects.value.push(project.id);
    } else {
        const index = selectedProjects.value.findIndex(
            (id) => id === project.id
        );
        if (index !== -1) {
            selectedProjects.value.splice(index, 1);
        }
    }

    await loadDashboard();
};
watch(selectedProjects, (newValue) => {
    loadDashboard();
});

onMounted(async () => {
    await getProjects();
});
</script>

<style>
#dashboard-container {
    width: 100%;
    height: 80vh;
    border: none;
    border-radius: 1rem;
}

iframe {
    width: 100%;
    height: 100%;
}
</style>
