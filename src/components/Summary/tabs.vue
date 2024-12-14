<template>
    <div>
        <TabGroup>
            <TabList class="mb-4 mt-7 flex gap-2">
                <Tab
                    v-slot="{ selected }"
                    as="template"
                    v-for="(item, i) in headers"
                    :key="i"
                    @click="selectedIndex = i"
                >
                    <button
                        :class="[
                            selected
                                ? 'text-white bg-primary-500 '
                                : 'text-slate-500 bg-white dark:bg-slate-700 dark:text-slate-300',
                        ]"
                        class="text-sm font-medium last:mb-0 capitalize ring-0 foucs:ring-0 focus:outline-none px-6 rounded-md py-2 transition duration-150"
                    >
                        {{ data[item].title }}
                    </button>
                </Tab>
            </TabList>
            <div>
                <table class="w-full text-sm">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th class="text-left">Métrica</th>
                            <th class="text-left">Promedio</th>
                        </tr>
                    </thead>
                    <tbody
                        class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800"
                    >
                        <tr
                            v-for="metric in data[selectedOption].data"
                            :key="metric.name"
                        >
                            <td class="text-left font-semibold">
                                {{ metric.name }}
                            </td>
                            <td class="text-left">
                                {{ roundValue(metric.value) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </TabGroup>
    </div>
</template>

<script setup>
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import { ref, defineProps, watch } from "vue";

const props = defineProps({
    headers: {
        type: Array,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
});

const selectedIndex = ref(0);
const selectedOption = ref(props.headers[0]);

watch(selectedIndex, (value) => {
    selectedOption.value = props.headers[value];
});

const roundValue = (value) => {
    return Math.round(value * 100) / 100;
};
</script>

<style lang="scss" scoped>
table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;

    th,
    td {
        text-align: left;
        padding: 0.5rem;
    }
}
</style>
