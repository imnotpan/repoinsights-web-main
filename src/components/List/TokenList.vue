<template>
    <div>
        <div class="relative" v-if="tokens.length > 0">
            <vue-good-table :columns="tokensColumns" :rows="tokens" />
            <div class="text-center mt-10">
                <p class="font-light">No has agregado tokens personales...</p>
                <button class="btn-outline-warning px-2 py-3 rounded-sm" @click="toggleModal">Agregar token
                    personal</button>
            </div>
        </div>

    </div>

    <Modal title="Token personal de GitHub" :activeModal="show" @close="show = false">
        <!-- <div class="flex justify-start gap-3">
                    <button class="btn-dark px-6 py-2 rounded-md">GitHub</button>
                    <button disabled class="px-6 py-2 rounded-md">GitLab</button>
                    <button disabled class="px-6 py-2 rounded-md">BitBucket</button>
                </div> -->
        <p>No sabes como obtenerlo? <span><a
                    href="https://docs.github.com/es/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
                    target="_blank">Instrucciones</a></span></p>
        <form @submit.prevent="onSubmit" class="space-y-4 mt-4">
            <Textinput type="text" placeholder="Ingresa tu token de acceso" name="token" v-model="token" :error="tokenError"
                :msgTooltip=true />
            <div class="text-right mt-2">
                <Button text="Agregar" btnClass="btn-dark "></Button>
            </div>
        </form>
    </Modal>
</template>

<script setup>
import Textinput from "@/components/Textinput";
import Button from "@/components/Button";
import { useField, useForm } from "vee-validate"
import * as yup from "yup";
import { onMounted, ref } from "vue";   
import { useUserStore } from "@/store/user";
import Icon from "@/components/Icon";

</script>