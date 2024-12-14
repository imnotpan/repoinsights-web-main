<template>
    <div class="container mx-auto px-4 max-w-screen-xl md:px-0 relative">
        <h2 class="text-2xl mb-10">Bienvenido {{ username }} 👋</h2>
        <div class="grid grid-cols-12 gap-y-10 md:gap-10">
            <CardHome
                title="Agrega tu repositorio personal"
                subtitle="Privado o público"
                buttonText="Agregar"
                routeName="Agregar proyecto personal"
                :icon="Lock"
                :buttonIcon="Plus"
            />
            <CardHome
                title="Explorar repositorios"
                subtitle="Públicos"
                buttonText="Ir"
                routeName="Explorar proyectos"
                :icon="Globe"
                :buttonIcon="ArrowRight"
            />
            <CardHome
                title="Comparar repositorios"
                subtitle="Privado o público"
                buttonText="Ir"
                routeName="dashboard"
                :icon="GitCompare"
                :buttonIcon="ArrowRight"
            />
            <CardHome
                title="Explorar repositorios en 3D"
                subtitle="Privado o público"
                buttonText="Ir"
                routeName="Explorar repositorios en 3D"
                :icon="Box"
                :buttonIcon="ArrowRight"
            />
            <CardHome
                title="Probar la herramienta de BI"
                subtitle="Con datos de prueba"
                buttonText="¡Vamos!"
                routeName="superset"
                :icon="ChartArea"
                :buttonIcon="ArrowRight"
            />
        </div>
        <div>
            <!-- Botón flotante -->
            <button
                @click="showModal = true"
                ref="tooltipBtn"
                class="fixed bottom-5 right-5 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
            >
                <icon-info class="w-5 h-5" />
                Glosario de métricas
            </button>
        </div>

        <!-- Modal para el glosario -->
        <Modal
            :activeModal="showModal"
            @close="showModal = false"
            title="Glosario de métricas"
            class="w-[90%] h-[90%]"
            :scrollContent="false"
            :disableBackdrop="false"
            :showHeader="false"
            sizeClass="max-w-6xl"
        >
            <Glossary />
        </Modal>
    </div>
</template>

<script setup>
import CardHome from "@/components/Card/Home/index.vue";
import Modal from "@/components/Modal/index.vue";
import Glossary from "@/components/Glossary/index.vue";
import { useUserStore } from "@/store/user";
import {
    Info as IconInfo,
    Lock,
    Plus,
    Globe,
    ArrowRight,
    GitCompare,
    Box,
    ChartArea,
} from "lucide-vue-next";
import { onMounted, ref } from "vue";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/animations/scale-extreme.css";

const userStore = useUserStore();
const username = userStore.user?.name;

const showModal = ref(false);

const tooltipBtn = ref(null);

onMounted(() => {
    tippy(tooltipBtn.value, {
        content: `
            <div class="text-center">
                <p class="font-bold">¿Tienes dudas sobre las métricas?</p>
                <p>¡Consulta aquí!</p>
            </div>
        `,
        allowHTML: true,
        placement: "top",
        animation: "scale-extreme",
        theme: "light",
    });
});
</script>
