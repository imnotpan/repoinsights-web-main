<template>
    <div class="min-h-screen md:p-8 flex flex-col justify-between">
        <header class="flex justify-between items-center mb-5">
            <div class="flex items-center space-x-2">
                <img
                    src="@/assets/images/superset/logo.svg"
                    alt="Superset Logo"
                    class="w-12 h-12"
                />
                <span class="text-xl font-bold text-gray-800"
                    >Apache Superset</span
                >
            </div>
        </header>

        <!-- Main Content -->
        <main
            class="flex-grow flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
        >
            <!-- Left Side - Info -->
            <div class="max-w-md text-center md:text-left">
                <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Potencia tus datos
                </h1>
                <p class="text-lg text-gray-600 mb-6">
                    Herramienta de BI donde podrás utilizar toda la información
                    de los repositorios públicos para crear dashboards
                    impactantes.
                </p>

                <router-link
                    :to="{ name: 'Tutorial' }"
                    class="px-6 py-3 btn-primary text-white rounded-full hover:bg-blue-700 transition-colors inline-flex items-center group"
                >
                    Realizar tutorial
                    <Icon
                        :icon="'heroicons:arrow-right'"
                        class="ml-2 text-white h-4 w-4 group-hover:translate-x-1 transition-transform"
                    />
                </router-link>
            </div>

            <!-- Right Side - Card-->
            <div
                class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6"
            >
                <h2
                    class="text-2xl font-semibold text-center text-gray-800 mb-6"
                >
                    Acceso a Superset
                </h2>

                <div class="space-y-4">
                    <div v-if="metabaseURL" class="my-4">
                        <!-- Usuario -->
                        <div class="mb-4">
                            <label
                                class="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Usuario
                            </label>
                            <div
                                class="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200"
                            >
                                <span class="text-gray-800">{{
                                    metabase.name
                                }}</span>
                                <Icon
                                    :icon="
                                        copied
                                            ? 'mdi:clipboard-check'
                                            : 'mdi:clipboard-text'
                                    "
                                    class="ml-2 text-blue-500 cursor-pointer hover:text-blue-700"
                                    @click="copyToClipboard(metabase.name)"
                                />
                            </div>
                        </div>

                        <!-- Contraseña -->
                        <div class="mb-4">
                            <label
                                class="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Contraseña
                            </label>
                            <div class="flex items-center">
                                <Icon
                                    :icon="'mdi:email'"
                                    class="text-blue-500 mr-2 w-5 h-5"
                                />
                                <span class="text-sm text-gray-600">{{
                                    metabase.pass
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-3 pt-4">
                    <a
                        :href="metabaseURL"
                        class="w-full px-4 py-2 btn-primary text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                        Ir a Superset
                        <!-- <HeroIconArrowUpRight class="ml-2 h-4 w-4" /> -->
                        <Icon
                            :icon="'heroicons:arrow-up-right'"
                            class="ml-2 text-white h-4 w-4 group-hover:translate-x-1 transition-transform"
                        />
                    </a>
                    <a
                        href="https://superset.apache.org/docs/intro"
                        class="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                    >
                        Documentación oficial
                        <!-- <HeroIconBookOpen class="ml-2 h-4 w-4" /> -->
                        <Icon
                            :icon="'heroicons:book-open'"
                            class="ml-2 text-blue-600 h-4 w-4 group-hover:translate-x-1 transition-transform"
                        />
                    </a>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import Button from "@/components/Button";
import Card from "@/components/Card";
import { useUserStore } from "@/store/user";
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { useToast } from "vue-toastification";

const userStore = useUserStore();
const toast = useToast();

const metabaseURL = ref(null);
const copied = ref(false);

const metabase = {
    name: userStore.user.email,
    pass: "Si no la has creado, hazlo ingresando en Realizar Tutorial",
};

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
        () => {
            console.log(`Texto copiado al portapapeles: ${text}`);
            toast.success("Texto copiado al portapapeles");
            copied.value = true;
        },
        (err) => {
            console.error("Error al copiar el texto al portapapeles: ", err);
        }
    );
};

(async () => {
    try {
        const { data } = await userStore.getMetabaseURL();
        metabaseURL.value = data.url;
    } catch (error) {
        console.log(error);
    }
})();
</script>
