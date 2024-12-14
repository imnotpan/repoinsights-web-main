<template>
    <div class="table-container">

        <table class="w-full table-fixed">
            <thead>
                <tr>
                    <th class="text-xs font-semibold text-slate-900"></th>
                    <th class="text-xs font-semibold text-slate-900"></th>
                    <th v-for="metric in userStore.favoriteProjects.metrics" class="text-xs font-semibold text-slate-900">{{
                        metric.name }}</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(project, index) in userStore.favoriteProjects.projects">
                    <tr class="border-b cursor-pointer hover:bg-slate-100 transition-colors duration-300"
                        @click="() => $router.push({ name: 'Proyecto', params: { id: project.id } })">
                        <td class="p-2 text-center">
                            <span class="px-2 py-1 bg-slate-900 text-white leading-none rounded text-xs text-center">{{
                                indexPlusOne(index) }}</span>
                        </td>

                        <td class="p-2">
                            <p class="text-base font-semibold leading-none capitalize">{{ project.name }}</p>
                            <p class="text-xs leading-none">{{ project.owner_name }}</p>
                        </td>

                        <template v-for="rating in project.rating">
                            <td class="p-2 text-center" :class="getRatingColor(rating.rating)">
                                <span class="text-xs font-semibold text-slate-900">{{ round(rating.value) }}</span>
                            </td>
                        </template>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script setup>

import { useUserStore } from "@/store/user";
import { ratingColors } from '@/constant/filter';


const userStore = useUserStore();

const indexPlusOne = (index) => index + 1;
const round = (value) => value ? Math.round(value * 100) / 100 : ''
const getRatingColor = (rating) => {
    return rating ? ratingColors[rating].bg : ''
}

</script>

<style lang="scss" scoped>
table {
    @apply bg-white;

    th {
        @apply px-4 text-center text-sm;
    }

    th,
    td {
        @apply border border-gray-200;
    }

    th:first-child,
    td:first-child {
        @apply w-1/12;
    }

    th:nth-child(2),
    td:nth-child(2) {
        @apply w-2/12
    }
}

.table-container {
    overflow-x: auto;
}

/* Responsive styling */
@media screen and (max-width: 768px) {
    table {
        min-width: 600px;

        th,
        td {
            @apply p-2;
        }

        th:first-child,
        td:first-child {
            @apply w-auto;
        }

        th:nth-child(2),
        td:nth-child(2) {
            @apply w-auto
        }
    }
}</style>
