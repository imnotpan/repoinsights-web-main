<template>
    <div class="h-full w-full">
        <TabGroup>
            <TabList class="mb-4 mt-7 flex gap-2">
                <Tab
                    v-slot="{ selected }"
                    as="template"
                    v-for="(item, i) in tabsSuperset"
                    :key="i"
                    @click="changeDashboard(i)"
                >
                    <button
                        :class="[
                            selected
                                ? 'text-white bg-primary-500 '
                                : 'text-slate-500 bg-white dark:bg-slate-700 dark:text-slate-300',
                        ]"
                        class="text-sm font-medium last:mb-0 capitalize ring-0 foucs:ring-0 focus:outline-none px-6 rounded-md py-2 transition duration-150"
                    >
                        {{ item.name }}
                    </button>
                </Tab>
            </TabList>

            <div class="relative w-full h-full">
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
                            Estamos cargando la información...
                        </div>
                    </div>
                </div>

                <div v-for="(item, i) in tabsSuperset" :key="i">
                    <div
                        v-show="i === selectedIndex"
                        :id="item.mountPoint"
                        class="h-full w-full"
                    >
                        <iframe
                            :src="iframeUrls[item.mountPoint]"
                            class="w-full h-full"
                            sandbox="allow-same-origin allow-scripts allow-presentation allow-downloads allow-forms allow-popups"
                        ></iframe>
                    </div>
                </div>
            </div>
        </TabGroup>
    </div>
</template>

<script setup>
import axios from "axios";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import { ref } from "vue";

const supersetUrl = "http://localhost:8088";
const supersetApiUrl = supersetUrl + "/api/v1/security";

const projectId = ref(null);
const url = window.location.href;
const match = url.match(/\/explore\/(\d+)/);

if (match && match[1]) {
    projectId.value = parseInt(match[1], 10);
} else {
    console.error("No se encontró un ID de proyecto en la URL");
}

// Tabs con diferentes IDs de dashboard
const tabsSuperset = ref([
    {
        name: "Análisis general",
        mountPoint: `dashboard-general`,
        dashboardId: "8e13626e-0b8f-48d8-abb6-115e0ef528e0",
        idProyecto: projectId.value,
    },
    {
        name: "Issues",
        mountPoint: `dashboard-issues`,
        dashboardId: "3a7859ba-afce-407d-9464-29eb4c0559cf",
        idProyecto: projectId.value,
    },
    {
        name: "Pull Requests",
        mountPoint: `dashboard-prs`,
        dashboardId: "49c66678-14ee-40bb-a07b-85d0262dfe9a",
        idProyecto: projectId.value,
    },
]);

const selectedIndex = ref(0);
const loading = ref(false); // Estado para mostrar el loader
const iframeUrls = ref({}); // Para almacenar las URLs generadas

// Cambiar el dashboard activo
async function changeDashboard(index) {
    selectedIndex.value = index;
    const selectedTab = tabsSuperset.value[index];

    if (!iframeUrls.value[selectedTab.mountPoint]) {
        loading.value = true;

        try {
            await getToken(
                selectedTab.mountPoint,
                selectedTab.dashboardId,
                selectedTab.idProyecto
            );
        } catch (error) {
            console.error("Error al cargar el dashboard:", error);
        } finally {
            loading.value = false;
        }
    }
}

// Función para obtener el token y renderizar el dashboard
async function getToken(idDashboard, dashboardId, idProyecto) {
    const login_body = {
        password: import.meta.env.VITE_SUPERSET_PASSWORD,
        provider: "db",
        refresh: true,
        username: import.meta.env.VITE_SUPERSET_USERNAME,
    };
    const login_headers = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const { data } = await axios.post(
        supersetApiUrl + "/login",
        login_body,
        login_headers
    );
    const access_token = data["access_token"];

    const guest_token_body = JSON.stringify({
        resources: [
            {
                type: "dashboard",
                id: dashboardId,
            },
        ],
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
            Authorization: "Bearer " + access_token,
        },
    };

    const { data: tokenData } = await axios.post(
        supersetApiUrl + "/guest_token/",
        guest_token_body,
        guest_token_headers
    );

    // Esperar a que el elemento exista en el DOM
    const element = await waitForElement(`#${idDashboard}`);

    embedDashboard({
        id: dashboardId,
        supersetDomain: supersetUrl,
        mountPoint: element,
        fetchGuestToken: () => tokenData["token"],
        dashboardUiConfig: {
            filters: {
                expanded: true,
            },
            urlParams: {
                standalone: 3,
                project_id: `${idProyecto}`,
            },
        },
    });
}

// Función para esperar a que un elemento esté en el DOM
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const interval = 100;
        const maxAttempts = timeout / interval;
        let attempts = 0;

        const checkExist = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkExist);
                resolve(element);
            } else if (++attempts >= maxAttempts) {
                clearInterval(checkExist);
                reject(new Error(`Elemento ${selector} no encontrado`));
            }
        }, interval);
    });
}

// Cargar el primer dashboard al montar el componente
changeDashboard(selectedIndex.value);
</script>

<style>
iframe {
    width: 100%;
    height: 100vh;
    border: none;
    border-radius: 1rem;
}
</style>
