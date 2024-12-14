<template>
    <div class="container mx-auto p-4 max-w-4xl md:px-0">
        <div class="flex flex-row justify-center items-center gap-2 mb-8">
            <div v-for="letter in startLetters" :key="letter"
                class="cursor-pointer p-3 bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm rounded-md inline-block leading-none"
                :class="{ '!bg-slate-800 text-white': selectedLetter === letter }" @click="filterByLetter(letter)">
                {{ letter }}
            </div>
        </div>

        <div class="overflow-x-auto m-auto">
            <table class="rounded-md text-sm bg-gray-200">
                <thead class="justify-between">
                    <tr class="">
                        <th class="px-4 py-2">
                            <span class="text-slate-900">Nombre</span>
                        </th>
                        <th class="px-8 py-2">
                            <span class="text-slate-900">Descripción</span>
                        </th>
                        <th class="px-8 py-2">
                            <span class="text-slate-900">Objetivo</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-gray-200">
                    <tr class="bg-white border-2 border-gray-200 hover:bg-gray-100"
                    v-for="metric in filteredMetrics" :key="metric.nombre">
                        <td class="px-4 py-2 font-semibold">{{ metric.nombre }}</td>
                        <td class="px-8 py-2">{{ metric.descripcion }}</td>
                        <td class="px-8 py-2">{{ metric.objetivo }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';


const metrics = ref([
    {
        "nombre": "Hero project",
        "descripcion": "Repositorio donde el 80% de los commits es realizado por el 20% de los desarrolladores.",
        "objetivo": "El objetivo es que el conocimiento no esté en ciertos desarrolladores."
    },
    {
        "nombre": "Días contribuidos",
        "descripcion": "Porcentaje de días que se han realizado commits.",
        "objetivo": "Acercarse al 100% de días contribuidos."
    },
    {
        "nombre": "Commits en los últimos 90 días",
        "descripcion": "Cuantos commits se han realizado en los últimos 90 días desde la fecha de extracción.",
        "objetivo": "Nos indica la actividad reciente del repositorio."
    },
    {
        "nombre": "Dispersión del equipo de trabajo",
        "descripcion": "Devs que contribuyen el 80% de los commits dividido en el total de desarrolladores.",
        "objetivo": "El objetivo es acercarnos a 1. Lo que implica que el repositorio depende de una cantidad mayor de desarrolladores."
    },
    {
        "nombre": "Tiempo en merge",
        "descripcion": "Tiempo en incorporar los cambios de una pull request.",
        "unidad": "Horas",
        "objetivo": "El objetivo es disminuir los tiempos en tomar la decisión, como indicador de agilidad."
    },
    {
        "nombre": "Tiempo en cerrar",
        "descripcion": "Tiempo en cerrar sin incorporar una pull request.",
        "unidad": "Horas",
        "objetivo": "El objetivo es disminuir los tiempos en cerrar las pull requests."
    },
    {
        "nombre": "Tasa de PRs abiertas respecto a las cerradas",
        "descripcion": "Numero de PR abiertas vs cerradas.",
        "unidad": "Valor entre 0 y 1"
    },
    {
        "nombre": "Commits promedio por PR",
        "descripcion": "Numero de commits que incluye una PR.",
        "unidad": "Conteo",
        "objetivo": "A mayor valor, mayor es la probabilidad de introducir errores."
    },
    {
        "nombre": "Tiempo en cerrar issues",
        "descripcion": "Tiempo en horas en cerrar una incidencia.",
        "unidad": "Horas",
        "objetivo": "El objetivo es disminuir los tiempos de cierre de incidencias."
    },
    {
        "nombre": "Tiempo en primera respuesta",
        "descripcion": "Tiempo en primera respuesta a una incidencia",
        "unidad": "Horas",
        "objetivo": "El objetivo es disminuir los tiempos de la primera respuesta a los incidentes."
    },
    {
        "nombre": "Tiempo en resolver",
        "descripcion": "Tiempo en que la incidencia fue marcada como cerrada.",
        "unidad": "Horas",
        "objetivo": "El objetivo es disminuir los tiempos en cerrar las incidencias."
    },
    {
        "nombre": "Issues cerrados por día",
        "descripcion": "Numero de incidencias cerradas por día",
        "unidad": "Conteo"
    },
    {
        "nombre": "Issues asignados a cada desarrollador",
        "descripcion": "Numero de incidencias asignadas a cada desarrollador",
        "unidad": "Conteo",
        "objetivo": "El objetivo es caracterizar a los desarrolladores más importantes en la resolución de incidencias."
    },
    {
        "nombre": "Número de comentarios por Issues",
        "descripcion": "Numero de comentarios que tiene una incidencia",
        "unidad": "Conteo",
        "objetivo": "Indicador de cuanta discusión existe en el proceso de resolución de una incidencia"
    },
    {
        "nombre": "Tiempo entre issues",
        "descripcion": "Número de incidencias dividido en el tiempo de existencia del repositorio",
        "unidad": "Horas",
        "objetivo": "El objetivo es aumentar el tiempo entre cada incidencia como indicador de confiabilidad"
    },
    {
        "nombre": "Bus factor",
        "descripcion": "Porcentaje de contribuciones del desarrollador",
        "unidad": "Porcentaje",
        "objetivo": "El objetivo que todos los desarrolladores tengan un porcentaje de contribuciones similar"
    },
    {
        "nombre": "Commits por dev",
        "descripcion": "Numero de commits por desarrollador",
        "unidad": "Conteo",
        "objetivo": "El objetivo es aumentar el número de commits por desarrollador"
    },
    {
        "nombre": "Issues por dev",
        "descripcion": "Numero de issues asignados por cada desarrollador",
        "unidad": "Conteo",
        "objetivo": "El objetivo puede ser aumentar el número de issues asignados a cada desarrollador."
    },
    {
        "nombre": "PRs por dev",
        "descripcion": "Numero de pull requests abiertas por el desarrollador",
        "unidad": "Conteo",
        "objetivo": "El objetivo es aumentar el número de pull requests creadas por desarrollador"
    }

].sort((a, b) => a.nombre.localeCompare(b.nombre)));

const filteredMetrics = ref(metrics.value);
const selectedLetter = ref(todos);

const todos = "Todas";

const startLetters = computed(() => {
    const letters = metrics.value.map(metric => metric.nombre[0]);
    const sorted = [...new Set(letters)].sort();
    sorted.push(todos);
    return sorted;
})

const filterByLetter = (letter) => {
    selectedLetter.value = letter;

    if (letter === todos) {
        filteredMetrics.value = metrics.value;
        return;
    }

    filteredMetrics.value = metrics.value.filter(metric => metric.nombre[0] === letter);
}

</script>


<style scoped lang="scss">
table {
    td:first-child {
        width: 10%;
    }
}
</style>