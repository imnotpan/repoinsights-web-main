<template>
    <div v-if="!loadingData" class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div v-if="notFound.value">
            <h1 class="text-2xl font-bold text-center">Ha ocurrido un error</h1>
            <p class="text-center">{{ notFound.msg }}</p>
        </div>
        <template v-else>
            <Summary v-if="!summary.loading" :data="summary.data" />
            <Card v-if="project" v-bind="projectData">
                <div>
                    <h1 class="text-3xl font-bold mb-4">{{ project.name }}</h1>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div>
                                <h2 class="text-sm font-medium text-gray-500">
                                    Dueño
                                </h2>
                                <p class="text-lg">{{ project.owner_name }}</p>
                            </div>
                            <div>
                                <h2 class="text-sm font-medium text-gray-500">
                                    Descripción
                                </h2>
                                <p class="text-lg">{{ project.description }}</p>
                            </div>
                            <div>
                                <h2 class="text-sm font-medium text-gray-500">
                                    URL
                                </h2>
                                <a
                                    :href="project.html_url"
                                    target="_blank"
                                    class="text-lg text-blue-600 hover:underline"
                                >
                                    {{ calculateHTMLUrl(project) }}
                                </a>
                            </div>
                            <div>
                                <h2 class="text-sm font-medium text-gray-500">
                                    Visibilidad
                                </h2>
                                <p class="text-lg">
                                    {{
                                        project.private ? "Privado" : "Público"
                                    }}
                                </p>
                            </div>
                            <div>
                                <h2 class="text-sm font-medium text-gray-500">
                                    Lenguaje
                                </h2>
                                <p class="text-lg">{{ project.language }}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div
                                class="bg-gray-50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                            >
                                <div class="flex items-start justify-between">
                                    <div>
                                        <h2
                                            class="text-sm font-medium text-gray-500"
                                        >
                                            Fecha de creación
                                        </h2>
                                        <p class="text-lg font-semibold mt-1">
                                            {{
                                                toLocalDate(project.created_at)
                                            }}
                                        </p>
                                        <p class="text-sm text-gray-500 mt-1">
                                            {{ timeAgo(project.created_at) }}
                                            años atrás
                                        </p>
                                    </div>
                                    <Calendar class="h-5 w-5 text-blue-500" />
                                </div>
                                <div class="mt-4 pt-4 border-t border-gray-100">
                                    <div
                                        class="flex items-center justify-between text-sm"
                                    >
                                        <span class="text-gray-500"
                                            >Commits totales</span
                                        >
                                        <span class="font-medium">
                                            {{
                                                projectData.extraInfoProjects[0].total_commits.toLocaleString(
                                                    "es-ES"
                                                )
                                            }}
                                        </span>
                                    </div>
                                    <div
                                        class="flex items-center justify-between text-sm mt-2"
                                    >
                                        <span class="text-gray-500"
                                            >Origen geográfico</span
                                        >
                                        <span class="font-medium">
                                            {{
                                                projectData.extraInfoProjects[0]
                                                    .owner_location
                                                    ? projectData
                                                          .extraInfoProjects[0]
                                                          .owner_location
                                                    : "Sin información"
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="bg-gray-50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                            >
                                <div class="flex items-start justify-between">
                                    <div>
                                        <h2
                                            class="text-sm font-medium text-gray-500"
                                        >
                                            Última actualización
                                        </h2>
                                        <p class="text-lg font-semibold mt-1">
                                            {{
                                                toLocalDate(
                                                    project.last_extraction_date
                                                )
                                            }}
                                        </p>
                                        <p class="text-sm text-gray-500 mt-1">
                                            {{
                                                timeAgo(
                                                    project.last_extraction_date
                                                )
                                            }}
                                            años atrás
                                        </p>
                                    </div>
                                    <Clock class="h-5 w-5 text-green-500" />
                                </div>
                                <div class="mt-4 pt-4 border-t border-gray-100">
                                    <div
                                        class="flex items-center justify-between text-sm"
                                    >
                                        <span class="text-gray-500"
                                            >Último commit</span
                                        >
                                        <span class="font-medium">
                                            {{
                                                projectData.extraInfoProjects[0]
                                                    .last_commit_date
                                                    ? toLocalDate(
                                                          projectData
                                                              .extraInfoProjects[0]
                                                              .last_commit_date
                                                      )
                                                    : "Sin información"
                                            }}
                                        </span>
                                    </div>
                                    <div
                                        class="flex items-center justify-between text-sm mt-2"
                                    >
                                        <span class="text-gray-500"
                                            >Último issue abierto</span
                                        >
                                        <span class="font-medium">
                                            {{
                                                projectData.extraInfoProjects[0]
                                                    .last_issue_opened_date
                                                    ? toLocalDate(
                                                          projectData
                                                              .extraInfoProjects[0]
                                                              .last_issue_opened_date
                                                      )
                                                    : "Sin información"
                                            }}
                                        </span>
                                    </div>
                                    <div
                                        class="flex items-center justify-between text-sm mt-2"
                                    >
                                        <span class="text-gray-500"
                                            >Última PR abierta</span
                                        >
                                        <span class="font-medium">
                                            {{
                                                projectData.extraInfoProjects[0]
                                                    .last_pr_opened_date
                                                    ? toLocalDate(
                                                          projectData
                                                              .extraInfoProjects[0]
                                                              .last_pr_opened_date
                                                      )
                                                    : "Sin información"
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <!-- Developer Rankings Section -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-bold mb-6">Top Contribuidores</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div
                        v-for="(contributor, index) in topContributors"
                        :key="contributor.committer_id"
                        class="bg-gray-50 rounded-lg p-6 relative"
                    >
                        <div
                            class="absolute -top-4 left-1/2 transform -translate-x-1/2"
                        >
                            <Medal
                                v-if="index === 0"
                                class="w-9 h-9 text-yellow-400"
                            />
                            <Medal
                                v-else-if="index === 1"
                                class="w-8 h-8 text-gray-400"
                            />
                            <Medal v-else class="w-7 h-7 text-amber-700" />
                        </div>
                        <div class="text-center pt-4">
                            <img
                                :src="getAvatar(contributor.user_login)"
                                :alt="`Avatar of ${contributor.user_login}`"
                                class="w-20 h-20 mx-auto mb-4 rounded-full"
                            />
                            <h3 class="font-bold text-xl mb-2">
                                {{ contributor.user_login }}
                            </h3>
                            <p class="text-gray-600">
                                {{ contributor.contributions_per_dev }} commits
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
    <!-- Activity Heatmap Placeholder -->
    <div class="bg-white rounded-lg shadow-md p-6 my-4">
        <h3 class="text-xl font-bold mb-4">Actividad del Repositorio</h3>
        <p class="text-gray-600 mb-4">Contribuciones durante el último año</p>

        <div class="flex flex-wrap justify-center gap-4 p-2">
            <div
                v-for="year in years"
                :key="year"
                class="transform transition-all duration-300 hover:scale-105"
            >
                <button
                    @click="selectYear(year)"
                    :class="[
                        'year-button px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out',
                        'focus:outline-none focus:ring-4 focus:ring-blue-300',
                        'hover:shadow-lg',
                        year === selectedYear
                            ? 'bg-blue-700 text-white hover:bg-blue-800'
                            : 'bg-blue-500 text-white hover:bg-blue-600',
                    ]"
                >
                    {{ year }}
                </button>
            </div>
        </div>

        <div
            id="heatmap-container"
            class="flex justify-center w-full h-auto mx-auto"
        ></div>
    </div>

    <Tabs :dashboards="dashboards" />
</template>

<script setup>
import { onMounted, ref, computed, watchEffect } from "vue";
import { useExploreStore } from "@/store/exploreProject";
import {axiosClient} from "@/plugins/axios";

import Tabs from "@/components/Dashboard/Tabs.vue";
import Card from "@/components/Card/index.vue";
import Summary from "@/components/Summary/index.vue";
import SimpleLoader from "@/components/Loader/simpleLoader.vue";
import { Medal, Calendar, Clock } from "lucide-vue-next";
import * as d3 from "d3";

function getAvatar(username) {
    return `https://api.dicebear.com/6.x/identicon/svg?seed=${username}`;
}

function timeAgo(date) {
    const now = new Date();
    const createdDate = new Date(date);
    const diffInMs = now - createdDate;
    const diffInYears = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));
    return diffInYears;
}

let store = useExploreStore();
const project = ref(null);
const dashboards = ref([]);

const summary = ref({
    loading: true,
    data: [],
});
const notFound = ref({
    value: false,
    msg: "",
});
const loadingData = ref(true);

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});

const topContributors = ref([]);
const extraInfoProjects = ref([]);

const projectData = ref({
    project,
    extraInfoProjects,
});

const heatmapData = ref([]);
const selectedYear = ref(null);

const years = computed(() => {
    const uniqueYears = Array.from(
        new Set(
            heatmapData.value.map((item) => item.commit_date.substring(0, 4))
        )
    );
    return uniqueYears.sort();
});

const selectYear = (year) => {
    selectedYear.value = year;
    renderHeatmap();
};

watchEffect(() => {
    if (years.value.length > 0 && !selectedYear.value) {
        selectYear(years.value[0]);
    }
});

const getDashboard = async () => {
    const url = window.location.href;
    const match = url.match(/\/explore\/(\d+)/);

    if (match && match[1]) {
        dashboards.value = parseInt(match[1], 10);
    } else {
        console.error("No se encontró un ID de proyecto en la URL");
    }

    /* const { data } = await axiosClient.post(
        "/api/metabase/public/dashboards/single/",
        { params: { id: props.id } }
    );
    dashboards.value = data.dashboards; */
};

const getSummary = async () => {
    const { data } = await axiosClient.get("/api/repoinsights/summary");
    summary.value.data = data;
    summary.value.loading = false;
};

const toLocalDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const calculateHTMLUrl = (project) => {
    const url = project.url;
    const urlParts = url.split("/");
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];
    const htmlUrl = "https://github.com/" + owner + "/" + repo;
    project.html_url = htmlUrl;
    return htmlUrl;
};

onMounted(async () => {
    try {
        project.value = await store.getProject(props.id);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            notFound.value.value = true;
            notFound.value.msg =
                "No tienes permisos para acceder a este proyecto o no existe.";
            loadingData.value = false;
            return;
        } else {
            notFound.value.value = true;
            notFound.value.msg =
                "Ocurrió un error al cargar la información del repositorio.";
        }
        console.log(error);
    }
    await getDashboard();
    console.log("aqui: ", dashboards.value);
    await getSummary();
    await getTopContributors(props.id);
    await getHeatmap(props.id);
    renderHeatmap();
    await getExtraInfo(props.id);
    loadingData.value = false;
});

const getTopContributors = async (projectId) => {
    try {
        const { data } = await axiosClient.get(
            "/api/superset/getTopContributors/",
            {
                params: { project_id: projectId },
            }
        );
        topContributors.value = data.data;
    } catch (error) {
        console.error("Error fetching top contributors:", error);
    }
};

const getHeatmap = async (projectId) => {
    try {
        const response = await axiosClient.get("/api/superset/getHeatmap/", {
            params: { project_id: projectId },
        });
        if (response.data && response.data.data) {
            heatmapData.value = response.data.data;
            console.log("Heatmap data assigned:", heatmapData.value);
        } else {
            console.error("Unexpected response structure:", response.data);
        }
    } catch (error) {
        console.error("Error fetching heatmap data:", error);
    }
};

const renderHeatmap = () => {
    let data = heatmapData.value;

    if (selectedYear.value) {
        data = data.filter(
            (item) => item.commit_date.substring(0, 4) === selectedYear.value
        );
    }

    data = data.map((item) => ({
        group: item.commit_date.substring(8, 10), // Día
        variable: item.commit_date.substring(0, 7), // Año y mes
        value: item.commits_on_date,
    }));

    const groups = Array.from(new Set(data.map((d) => d.group))).sort(
        (a, b) => a - b
    );
    const variables = Array.from(new Set(data.map((d) => d.variable))).sort();

    const margin = { top: 50, right: 25, bottom: 110, left: 32 };
    const containerWidth =
        document.querySelector("#heatmap-container").clientWidth;
    const containerHeight = 300;

    const boxSize = Math.min(
        Math.max(
            (containerWidth - margin.left - margin.right) / groups.length,
            15
        ),
        30
    );

    const width = boxSize * groups.length + margin.left + margin.right;
    const height = boxSize * variables.length + margin.top + margin.bottom;

    d3.select("#heatmap-container").html("");

    const svg = d3
        .select("#heatmap-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3
        .scaleBand()
        .range([0, boxSize * groups.length])
        .domain(groups)
        .padding(0.1);

    const y = d3
        .scaleBand()
        .range([0, boxSize * variables.length])
        .domain(variables)
        .padding(0.1);

    const color = d3
        .scaleSequential()
        .interpolator(d3.interpolateYlGnBu)
        .domain([0, d3.max(data, (d) => d.value)]);

    // Eje X
    svg.append("g")
        .attr("transform", `translate(0, ${y.range()[1] + 10})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .attr("font-size", "12px");

    // Eje Y
    svg.append("g")
        .call(
            d3
                .axisLeft(y)
                .tickSize(0)
                .tickFormat((d) =>
                    new Date(`${d}-02`)
                        .toLocaleString("es-ES", { month: "short" })
                        .replace(/^\w/, (c) => c.toUpperCase())
                )
        )
        .selectAll("text")
        .attr("font-size", "14px");

    svg.selectAll()
        .data(data, (d) => d.group + ":" + d.variable)
        .join("rect")
        .attr("x", (d) => x(d.group))
        .attr("y", (d) => y(d.variable))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", (d) => color(d.value))
        .style("stroke-width", 2)
        .style("stroke", "#ffffff")
        .style("opacity", 0.9);

    // Leyenda
    const legendWidth = 200;
    const legendHeight = 20;
    const legendMarginTop = 20;

    const legend = svg
        .append("g")
        .attr(
            "transform",
            `translate(${(width - legendWidth) / 2}, ${
                height - margin.bottom + legendMarginTop
            })`
        )
        .style("pointer-events", "none");

    const defs = svg.append("defs");
    const linearGradient = defs
        .append("linearGradient")
        .attr("id", "legend-gradient");

    linearGradient
        .selectAll("stop")
        .data(
            d3.range(0, 1.01, 0.2).map((t) => ({
                offset: `${t * 100}%`,
                color: d3.interpolateYlGnBu(t),
            }))
        )
        .join("stop")
        .attr("offset", (d) => d.offset)
        .attr("stop-color", (d) => d.color);

    legend
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legend-gradient)")
        .style("stroke", "black")
        .style("stroke-width", 1);

    const legendScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .range([0, legendWidth]);

    legend
        .append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(d3.axisBottom(legendScale).ticks(5).tickSize(5))
        .select(".domain")
        .remove();

    legend
        .append("text")
        .attr("x", -60)
        .attr("y", -5)
        .attr("text-anchor", "start")
        .attr("font-size", "12px")
        .text("Menos contribuciones");

    legend
        .append("text")
        .attr("x", legendWidth + 60)
        .attr("y", -5)
        .attr("text-anchor", "end")
        .attr("font-size", "12px")
        .text("Más contribuciones");

    // Tooltip
    const tooltip = d3
        .select("#heatmap-container")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "fixed");

    svg.selectAll("rect")
        .on("mouseover", (event, d) => {
            tooltip.style("opacity", 1);
            d3.select(event.currentTarget)
                .style("stroke", "black")
                .style("opacity", 1);
        })
        .on("mousemove", (event, d) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const tooltipWidth = tooltip.node().offsetWidth;
            const tooltipHeight = tooltip.node().offsetHeight;

            // Coordenadas iniciales
            let xPos = rect.left + rect.width / 2 + 30;
            let yPos = rect.top + rect.height / 2 - 60;

            // Ajustes para bordes
            if (xPos + tooltipWidth > window.innerWidth) {
                xPos = rect.left - tooltipWidth - 30;
            }
            if (yPos < 0) {
                yPos = rect.top + rect.height + 10;
            }

            tooltip
                .html(
                    `Fecha: ${d.variable}-${d.group} <br> Commits: ${d.value}`
                )
                .style("left", `${xPos}px`)
                .style("top", `${yPos}px`);
        })
        .on("mouseleave", (event) => {
            tooltip.style("opacity", 0);
            d3.select(event.currentTarget)
                .style("stroke", "#ffffff")
                .style("opacity", 0.9);
        });
};

const getExtraInfo = async (projectId) => {
    try {
        const { data } = await axiosClient.get("/api/superset/getExtraInfo/", {
            params: { project_id: projectId },
        });
        extraInfoProjects.value = data.data;
    } catch (error) {
        console.error("Error fetching top contributors:", error);
    }
};
</script>

<style scoped lang="scss">
table {
    th {
        width: 20% !important;
        padding-right: 0.5rem !important;
    }

    td {
        padding: 0.25rem 0 !important;
    }
}

#heatmap-container {
    overflow-x: auto;
    white-space: nowrap;
}

#heatmap-container .tooltip {
    position: absolute;
    text-align: center;
    width: auto;
    padding: 8px;
    font-size: 12px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    pointer-events: none;
    z-index: 10;
}

rect:hover {
    stroke: black;
    stroke-width: 2;
}
</style>
