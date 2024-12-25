<template>
    <div class="min-h-screen flex flex-col items-center justify-center">
        <header class="mb-8 text-center">
            <h1 class="text-4xl font-bold text-blue-600">
                Tutorial de Superset
            </h1>
            <p class="text-lg text-gray-700 mt-2">
                Aprende a utilizar Apache Superset con datasets y dashboards de
                ejemplo.
            </p>
        </header>

        <main class="bg-white p-6 rounded-lg shadow-lg w-full space-y-6">
            <!-- Stepper visual -->
            <Stepper :steps="steps" :current-step="currentStep" />

            <!-- Paso 1: Crear Usuario -->
            <div v-if="currentStep === 0">
                <h2 class="text-xl font-semibold">Paso 1: Crear Usuario</h2>
                <p class="text-gray-700 mt-2">
                    Bienvenido al tutorial. Para comenzar, por favor crea tu
                    usuario y completa todos los campos en blanco.
                </p>
                <form @submit.prevent="createUser" class="mt-4 space-y-4">
                    <div class="space-y-2">
                        <label class="block font-semibold"
                            >Nombre de Usuario</label
                        >
                        <input
                            v-model="formData.username"
                            type="text"
                            class="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="block font-semibold"
                            >Email (recomiendo utilizar el mismo de tu cuenta
                            actual)</label
                        >
                        <input
                            v-model="formData.email"
                            type="email"
                            class="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="block font-semibold">Nombre</label>
                        <input
                            v-model="formData.firstName"
                            type="text"
                            class="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="block font-semibold">Apellido</label>
                        <input
                            v-model="formData.lastName"
                            type="text"
                            class="border rounded w-full p-2"
                            required
                        />
                    </div>

                    <div class="space-y-2 relative">
                        <label class="block font-semibold">Contraseña</label>
                        <input
                            v-model="formData.password"
                            :type="showPassword ? 'text' : 'password'"
                            class="border rounded w-full p-2"
                            required
                        />
                        <button
                            id="buttonShow"
                            type="button"
                            @click="togglePasswordVisibility"
                            class="absolute inset-y-0 right-3 flex items-center text-gray-500"
                        >
                            <span v-if="showPassword"><EyeOff /></span>
                            <span v-else><Eye /></span>
                        </button>
                    </div>

                    <button
                        :disabled="!isFormComplete"
                        type="submit"
                        class="px-4 py-2 mt-4 bg-green-500 text-white rounded hover:bg-green-700"
                    >
                        Crear mi usuario
                    </button>
                </form>
            </div>

            <!-- Paso 2: Realizar Tutorial -->
            <div v-if="currentStep === 1">
                <h2 class="text-xl font-semibold">Paso 2: Realizar Tutorial</h2>
                <div class="my-2 text-md font-normal text-gray-500">
                    Ahora, con tu usuario creado inicia sesión y ya puedes
                    comenzar a explorar las funciones de Superset con los datos
                    de ejemplo que se proporcionan.
                </div>
                <iframe
                    :src="`${supersetUrl}/login/`"
                    class="w-full h-screen border rounded"
                ></iframe>
                <div class="mt-4 flex justify-between">
                    <button
                        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        @click="openModal"
                    >
                        Salir del tutorial
                    </button>
                </div>
            </div>
        </main>
        <!-- Modal de confirmación -->
        <TransitionRoot v-if="isModalOpen" as="Fragment" show>
            <Dialog
                as="div"
                class="fixed inset-0 z-10 overflow-y-auto"
                @close="closeModal"
            >
                <div
                    class="fixed inset-0"
                    aria-hidden="true"
                    style="background-color: rgba(0, 0, 0, 0.4)"
                />

                <div class="fixed inset-0 flex items-center justify-center p-4">
                    <div
                        class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:align-middle sm:max-w-lg sm:w-full"
                    >
                        <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <DialogTitle
                                as="h3"
                                class="text-lg font-medium leading-6 text-gray-900"
                            >
                                Confirmación
                            </DialogTitle>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">
                                    ¿Estás seguro que deseas salir del tutorial?
                                    Perderás el progreso no guardado.
                                </p>
                            </div>
                        </div>
                        <div
                            class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                        >
                            <button
                                type="button"
                                class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                @click="confirmQuit"
                            >
                                Salir
                            </button>
                            <button
                                type="button"
                                class="inline-flex justify-center px-4 py-2 mt-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                @click="closeModal"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>

<script setup>
import { Eye, EyeOff } from "lucide-vue-next";
import { computed, ref } from "vue";
import axios from "axios";
import Stepper from "@/components/Stepper/Stepper.vue";
import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionRoot,
} from "@headlessui/vue";

const currentStep = ref(0);
const steps = ["Crear Usuario", "Realizar Tutorial"];

const formData = ref({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
});

const supersetUrl = "http://localhost:8088";
const supersetApiUrl = `${supersetUrl}/api/v1/security`;
let accessToken = "";

const showPassword = ref(false);

const isFormComplete = computed(() => {
    return (
        formData.value.username &&
        formData.value.email &&
        formData.value.firstName &&
        formData.value.lastName &&
        formData.value.password
    );
});

const createUser = async () => {
    try {
        await getAccessToken();
        const response = await axios.post(
            `${supersetApiUrl}/users/`,
            {
                username: formData.value.username,
                email: formData.value.email,
                first_name: formData.value.firstName,
                last_name: formData.value.lastName,
                password: formData.value.password,
                active: true,
                roles: [4],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        console.log("Usuario creado exitosamente:", response.data);
        nextStep();
    } catch (error) {
        console.error("Error al crear usuario:", error);
    }
};

const getAccessToken = async () => {
    try {
        const loginBody = {
            username: "tutorial_user",
            password: "12345678",
            provider: "db",
            refresh: true,
        };

        const response = await axios.post(
            `${supersetApiUrl}/login`,
            loginBody,
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        accessToken = response.data.access_token;
    } catch (error) {
        console.error("Error al obtener el token de acceso:", error);
    }
};

const nextStep = () => {
    currentStep.value++;
};

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

// Modal state
const isModalOpen = ref(false);
const openModal = () => {
    isModalOpen.value = true;
};
const closeModal = () => {
    isModalOpen.value = false;
};
const confirmQuit = () => {
    // Redirecciona al usuario a /app/home
    window.location.href = "/app/home";
};
</script>

<style>
iframe {
    width: 100%;
    height: 100%;
}

#buttonShow {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    top: 25%;
}
</style>
