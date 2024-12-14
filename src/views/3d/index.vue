<template>
    <div class="container mx-auto px-4 max-w-6xl md:px-0">
        <div v-if="serverError" class="w-full text-center">
            <span class="text-xl font-bold dark:text-white text-slate-700"
                >Ha ocurrido un problema...</span
            >
        </div>

        <div v-else>
            <div class="col-span-4 formGroup relative">
                <span class="text-lg font-semibold"
                    >Repositorios disponibles ({{ projects.length }})</span
                >

                <div
                    v-if="selectedProjects.length < 2"
                    class="text-sm text-red-500 mt-2"
                >
                    Por favor, selecciona 2 o más repositorios
                </div>

                <ChipGrid
                    :projects="projects"
                    v-model="selectedProjects"
                    @chipClicked="handleSelectChange"
                />
            </div>

            <!-- Tabs -->
            <TabGroup v-model="selectedTab" @change="handleTabChange">
                <TabList class="my-4 flex gap-2">
                    <Tab
                        class="py-2 px-4 font-medium text-sm last:mb-0 capitalize ring-0 foucs:ring-0 focus:outline-none rounded-md transition duration-150"
                        :class="{
                            'text-white bg-primary-500': selectedTab === 0,
                            'text-slate-500 bg-white': selectedTab !== 0,
                        }"
                    >
                        Commits
                    </Tab>
                    <Tab
                        class="py-2 px-4 font-medium text-sm last:mb-0 capitalize ring-0 foucs:ring-0 focus:outline-none rounded-md transition duration-150"
                        :class="{
                            'text-white bg-primary-500': selectedTab === 1,
                            'text-slate-500 bg-white': selectedTab !== 1,
                        }"
                    >
                        Issues
                    </Tab>
                    <Tab
                        class="py-2 px-4 font-medium text-sm last:mb-0 capitalize ring-0 foucs:ring-0 focus:outline-none rounded-md transition duration-150"
                        :class="{
                            'text-white bg-primary-500': selectedTab === 2,
                            'text-slate-500 bg-white': selectedTab !== 2,
                        }"
                    >
                        Pull Requests
                    </Tab>
                </TabList>
            </TabGroup>

            <!-- Mostrar botones si estamos en la pestaña de Pull Requests -->
            <div v-if="selectedTab === 2">
                <button @click="toggleMerged" class="btn">
                    {{
                        showMerged
                            ? "Ocultar PRs Merged"
                            : "Ver sólo PRs Merged"
                    }}
                </button>
                <button @click="toggleClosed" class="btn">
                    {{
                        showClosed
                            ? "Ocultar PRs Closed"
                            : "Ver sólo PRs Closed"
                    }}
                </button>
                <button @click="resetTraces" class="btn btn-reset">
                    Ver ambas trazas
                </button>
            </div>

            <div v-show="chartData">
                <div id="plotly-3d-chart" class="rounded-md"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axiosClient from "@/plugins/axios";
import Plotly from "plotly.js-dist";
import { onMounted, ref, watch } from "vue";
import { useToast } from "vue-toastification";
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import ChipGrid from "../dashboard/ChipGrid.vue";
import { nextTick } from "vue";

const projects = ref([]);
const selectedProjects = ref([]);
const selectedTab = ref(0);
const serverError = ref(false);
const chartData = ref(null);

const showMerged = ref(true);
const showClosed = ref(true);

const toast = useToast();

// Obtener los datos para el gráfico según la pestaña seleccionada
const fetchDataForChart = async () => {
    try {
        if (selectedProjects.value.length === 0) {
            chartData.value = null;
            return;
        }

        const params = new URLSearchParams();
        selectedProjects.value.forEach((id) =>
            params.append("project_ids", id)
        );

        if (selectedTab.value === 0) {
            const [commitsData] = await Promise.all([
                axiosClient.get("/api/superset/get3dInfo/", { params }),
            ]);
            chartData.value = { commits: commitsData.data };
        } else if (selectedTab.value === 1) {
            const [issuesData] = await Promise.all([
                axiosClient.get("/api/superset/get3dInfoIssues/", { params }),
            ]);
            chartData.value = { issues: issuesData.data };
        } else if (selectedTab.value === 2) {
            const [mergedData, closedData] = await Promise.all([
                axiosClient.get("/api/superset/get3dInfoPRs/", { params }),
                axiosClient.get("/api/superset/get3dInfoPRsClosed/", {
                    params,
                }),
            ]);

            chartData.value = {
                merged: mergedData.data,
                closed: closedData.data,
            };
        }

        await nextTick();
        plot3DChart(chartData.value, selectedTab.value);
    } catch (error) {
        console.error("Error al obtener datos para el gráfico:", error);
        toast.error("Error al cargar los datos del gráfico.");
    }
};

// Función que maneja el cambio de selección de proyectos en el ChipGrid
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

    await fetchDataForChart();
};

const handleTabChange = (tab) => {
    selectedTab.value = tab;
    fetchDataForChart();
};

// Función para mostrar/ocultar la traza de PRs merged
const toggleMerged = () => {
    showMerged.value = !showMerged.value;
    updateGraph();
};

// Función para mostrar/ocultar la traza de PRs closed
const toggleClosed = () => {
    showClosed.value = !showClosed.value;
    updateGraph();
};

// Función para resetear y mostrar ambas trazas
const resetTraces = () => {
    showMerged.value = true;
    showClosed.value = true;
    updateGraph();
};

// Generar el gráfico 3D
const plot3DChart = (data, metric) => {
    const chartDiv = document.getElementById("plotly-3d-chart");
    if (!chartDiv) {
        console.error("El elemento 'plotly-3d-chart' no existe en el DOM.");
        return;
    }

    if (chartDiv) {
        Plotly.purge(chartDiv);
        chartDiv.innerHTML = "";
    }

    let fechasUnicas = [];
    let proyectosUnicos = [];
    let traces = [];

    if (metric === 0) {
        const fechas = data.commits.data.map((item) =>
            new Date(item.commit_date).getFullYear()
        );
        fechasUnicas = [...new Set(fechas)];
        proyectosUnicos = [
            ...new Set(
                data.commits.data.map(
                    (item) => item.project_name || `Proyecto ${item.project_id}`
                )
            ),
        ];
    } else if (metric === 1) {
        const fechas = data.issues.data.map((item) =>
            new Date(item.issue_date).getFullYear()
        );
        fechasUnicas = [...new Set(fechas)];
        proyectosUnicos = [
            ...new Set(
                data.issues.data.map(
                    (item) => item.project_name || `Proyecto ${item.project_id}`
                )
            ),
        ];
    } else if (metric === 2) {
        const mergedFechas = data.merged.data.map((item) =>
            new Date(item.pr_merged_date).getFullYear()
        );
        const closedFechas = data.closed.data.map((item) =>
            new Date(item.pr_closed_date).getFullYear()
        );
        fechasUnicas = [...new Set([...mergedFechas, ...closedFechas])];

        proyectosUnicos = [
            ...new Set(
                [...data.merged.data, ...data.closed.data].map(
                    (item) => item.project_name || `Proyecto ${item.project_id}`
                )
            ),
        ];
    }

    if (fechasUnicas.length === 0 || proyectosUnicos.length === 0) {
        console.error("Fechas únicas o proyectos únicos están vacíos.");
        return;
    }

    const ZMerged = proyectosUnicos.map(() =>
        Array(fechasUnicas.length).fill(0)
    );
    const ZClosed = proyectosUnicos.map(() =>
        Array(fechasUnicas.length).fill(0)
    );

    if (metric === 2) {
        data.merged.data.forEach((item) => {
            const fecha = new Date(item.pr_merged_date);
            const fechaYear = fecha.getFullYear();
            const fechaIndex = fechasUnicas.indexOf(fechaYear);
            const proyectoIndex = proyectosUnicos.indexOf(
                item.project_name || `Proyecto ${item.project_id}`
            );
            const valor = item.pr_merged_on_date;

            if (fechaIndex !== -1 && proyectoIndex !== -1) {
                ZMerged[proyectoIndex][fechaIndex] += valor || 0;
            }
        });

        data.closed.data.forEach((item) => {
            const fecha = new Date(item.pr_closed_date);
            const fechaYear = fecha.getFullYear();
            const fechaIndex = fechasUnicas.indexOf(fechaYear);
            const proyectoIndex = proyectosUnicos.indexOf(
                item.project_name || `Proyecto ${item.project_id}`
            );
            const valor = item.pr_closed_on_date;

            if (fechaIndex !== -1 && proyectoIndex !== -1) {
                ZClosed[proyectoIndex][fechaIndex] += valor || 0;
            }
        });

        const traceMerged = {
            x: fechasUnicas,
            y: proyectosUnicos,
            z: ZMerged,
            type: "surface",
            name: "Merged",
            hovertemplate:
                "Año: %{x}<br>Proyecto: %{y}<br>Merged: %{z}<extra></extra>",
            colorscale: "Viridis",
            colorbar: {
                title: "Número de PR Merged",
                x: 1.05,
                y: 0.5,
                len: 1,
                thickness: 20,
            },
        };

        const traceClosed = {
            x: fechasUnicas,
            y: proyectosUnicos,
            z: ZClosed,
            type: "surface",
            name: "Closed",
            hovertemplate:
                "Año: %{x}<br>Proyecto: %{y}<br>Closed: %{z}<extra></extra>",
            colorscale: "Electric",
            colorbar: {
                title: "Número de PR Closed",
                x: 1.3,
                y: 0.5,
                len: 1,
                thickness: 20,
            },
        };

        traces = [traceMerged, traceClosed];
    } else if (metric === 0) {
        const Z = proyectosUnicos.map(() => Array(fechasUnicas.length).fill(0));

        const dataKey = "commits_on_date";
        const dateKey = "commit_date";

        data.commits.data.forEach((item) => {
            const fecha = item[dateKey];
            const valor = item[dataKey];

            if (!fecha) {
                console.warn("Fecha no encontrada para item:", item);
                return;
            }

            const fechaYear = new Date(fecha).getFullYear();
            if (isNaN(fechaYear)) {
                console.warn("Fecha inválida:", fecha);
                return;
            }

            const fechaIndex = fechasUnicas.indexOf(fechaYear);
            const proyectoIndex = proyectosUnicos.indexOf(
                item.project_name || `Proyecto ${item.project_id}`
            );

            if (fechaIndex !== -1 && proyectoIndex !== -1) {
                Z[proyectoIndex][fechaIndex] += Number(valor) || 0;
            }
        });

        const trace = {
            x: fechasUnicas,
            y: proyectosUnicos,
            z: Z,
            type: "surface",
            hovertemplate:
                "Año: %{x}<br>Proyecto: %{y}<br>Commits: %{z}<extra></extra>",
            colorscale: "Viridis",
            colorbar: {
                title: "Número de Commits",
            },
        };

        traces = [trace];
    } else if (metric === 1) {
        const Z = proyectosUnicos.map(() => Array(fechasUnicas.length).fill(0));

        const dataKey = "issues_on_date";
        const dateKey = "issue_date";

        data.issues.data.forEach((item) => {
            const fecha = item[dateKey];
            const valor = item[dataKey];

            if (!fecha) {
                console.warn("Fecha no encontrada para item:", item);
                return;
            }

            const fechaYear = new Date(fecha).getFullYear();
            if (isNaN(fechaYear)) {
                console.warn("Fecha inválida:", fecha);
                return;
            }

            const fechaIndex = fechasUnicas.indexOf(fechaYear);
            const proyectoIndex = proyectosUnicos.indexOf(
                item.project_name || `Proyecto ${item.project_id}`
            );

            if (fechaIndex !== -1 && proyectoIndex !== -1) {
                Z[proyectoIndex][fechaIndex] += parseInt(valor) || 0;
            }
        });

        const trace = {
            x: fechasUnicas,
            y: proyectosUnicos,
            z: Z,
            type: "surface",
            hovertemplate:
                "Año: %{x}<br>Proyecto: %{y}<br>Issues: %{z}<extra></extra>",
            colorscale: "Viridis",
            colorbar: {
                title: "Número de Issues",
            },
        };

        traces = [trace];
    }

    try {
        const layout = {
            title:
                metric === 0
                    ? "Gráfico 3D - Commits"
                    : metric === 1
                    ? "Gráfico 3D - Issues"
                    : "Gráfico 3D - Pull Requests (Merged vs Closed)",
            scene: {
                xaxis: { title: "Años" },
                yaxis: { title: "Proyectos" },
                zaxis: { title: "Cantidad" },
            },
            autosize: true,
        };

        Plotly.newPlot(chartDiv, traces, layout);
    } catch (error) {
        console.error("Error al generar el gráfico con Plotly:", error);
    }
};

// Actualizar gráfico para PRs
const updateGraph = () => {
    const chartDiv = document.getElementById("plotly-3d-chart");
    if (chartDiv) {
        Plotly.purge(chartDiv);
        chartDiv.innerHTML = "";
    }

    let fechasUnicas = [];
    let proyectosUnicos = [];
    let traces = [];

    const data = chartData.value;

    if (!data) {
        console.error("No hay datos disponibles para actualizar el gráfico.");
        return;
    }

    if (selectedTab.value === 2) {
        if (data.merged && data.merged.data) {
            data.merged.data.forEach((item) => {
                const fecha = new Date(item.pr_merged_date);
                const fechaYear = fecha.getFullYear();

                if (!fechasUnicas.includes(fechaYear)) {
                    fechasUnicas.push(fechaYear);
                }

                if (!proyectosUnicos.includes(item.project_name)) {
                    proyectosUnicos.push(item.project_name);
                }
            });
        }

        if (data.closed && data.closed.data) {
            data.closed.data.forEach((item) => {
                const fecha = new Date(item.pr_closed_date);
                const fechaYear = fecha.getFullYear();

                if (!fechasUnicas.includes(fechaYear)) {
                    fechasUnicas.push(fechaYear);
                }

                if (!proyectosUnicos.includes(item.project_name)) {
                    proyectosUnicos.push(item.project_name);
                }
            });
        }

        const ZMerged = proyectosUnicos.map(() =>
            Array(fechasUnicas.length).fill(0)
        );
        const ZClosed = proyectosUnicos.map(() =>
            Array(fechasUnicas.length).fill(0)
        );

        if (showMerged.value && data.merged) {
            data.merged.data.forEach((item) => {
                const fecha = new Date(item.pr_merged_date);
                const fechaYear = fecha.getFullYear();
                const fechaIndex = fechasUnicas.indexOf(fechaYear);
                const proyectoIndex = proyectosUnicos.indexOf(
                    item.project_name
                );

                if (fechaIndex !== -1 && proyectoIndex !== -1) {
                    ZMerged[proyectoIndex][fechaIndex] +=
                        item.pr_merged_on_date || 0;
                }
            });

            if (
                showMerged.value &&
                ZMerged.some((row) => row.some((val) => val > 0))
            ) {
                const traceMerged = {
                    x: fechasUnicas,
                    y: proyectosUnicos,
                    z: ZMerged,
                    type: "surface",
                    name: "Merged",
                    hovertemplate:
                        "Año: %{x}<br>Proyecto: %{y}<br>Merged: %{z}<extra></extra>",
                    colorscale: "Viridis",
                    colorbar: {
                        title: "Número de PR Merged",
                        x: 1.05,
                        y: 0.5,
                        len: 1,
                        thickness: 20,
                    },
                };
                traces.push(traceMerged);
            }
        }

        if (showClosed.value && data.closed) {
            data.closed.data.forEach((item) => {
                const fecha = new Date(item.pr_closed_date);
                const fechaYear = fecha.getFullYear();
                const fechaIndex = fechasUnicas.indexOf(fechaYear);
                const proyectoIndex = proyectosUnicos.indexOf(
                    item.project_name
                );

                if (fechaIndex !== -1 && proyectoIndex !== -1) {
                    ZClosed[proyectoIndex][fechaIndex] +=
                        item.pr_closed_on_date || 0;
                }
            });

            if (
                showClosed.value &&
                ZClosed.some((row) => row.some((val) => val > 0))
            ) {
                const traceClosed = {
                    x: fechasUnicas,
                    y: proyectosUnicos,
                    z: ZClosed,
                    type: "surface",
                    name: "Closed",
                    hovertemplate:
                        "Año: %{x}<br>Proyecto: %{y}<br>Closed: %{z}<extra></extra>",
                    colorscale: "Electric",
                    colorbar: {
                        title: "Número de PR Closed",
                        x: 1.3,
                        y: 0.5,
                        len: 1,
                        thickness: 20,
                    },
                };
                traces.push(traceClosed);
            }
        }
    }

    if (traces.length === 0) {
        console.warn("No se encontraron datos para mostrar en el gráfico.");
        return;
    }

    const layout = {
        title: "Gráfico 3D - Pull Requests (Merged vs Closed)",
        scene: {
            xaxis: { title: "Años" },
            yaxis: { title: "Proyectos" },
            zaxis: { title: "Cantidad" },
        },
        autosize: true,
    };

    Plotly.newPlot(chartDiv, traces, layout);
};

// Obtener proyectos favoritos
const getProjects = async () => {
    try {
        const { data } = await axiosClient.get(
            "/api/repoinsights/projects/favorites/",
            {
                params: {
                    metrics: false,
                },
            }
        );
        projects.value = data.projects;
        selectedProjects.value = data.projects
            .filter((item) => item.selected)
            .map((item) => item.id);

        fetchDataForChart();
    } catch (error) {
        toast.error(
            "Ha ocurrido un error al cargar los proyectos, intenta más tarde."
        );
        serverError.value = true;
    }
};

// Escuchar cambios
watch(selectedTab, (newValue) => {
    fetchDataForChart();
});

// Montar
onMounted(async () => {
    selectedTab.value = 0;
    await getProjects();
});
</script>

<style scoped>
#plotly-3d-chart {
    width: 100%;
    height: 600px;
}

.btn {
    padding: 5px 10px;
    border-radius: 5px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 2px solid transparent;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #007bff;
    color: white;
}

.btn:hover {
    background-color: #0056b3;
    border-color: #0056b3;
    transform: translateY(-2px);
}

.btn:active {
    background-color: #004085;
    transform: translateY(0);
}

.btn-reset {
    background-color: #ffc107;
    border-color: #ffc107;
    color: white;
}

.btn-reset:hover {
    background-color: #e0a800;
    border-color: #e0a800;
}

.btn-reset:active {
    background-color: #c69500;
}
</style>
