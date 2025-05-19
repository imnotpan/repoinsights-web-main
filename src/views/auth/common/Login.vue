<template>
    <a :href="loginUrl"
        class="inline-flex items-center min-h-40px font-sans text-base text-white bg-gray-800 dark:bg-gray-900 dark:text-gray-300 py-2 pl-0 pr-3 mb-4">
        <svg height="18" viewBox="0 0 16 16" width="40px" style="fill:white;">
            <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
                1.08.58 1.23.82.72 1.21 1.87.87
                2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12
                0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08
                2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0
                .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        Sign in with GitHub
    </a>
    <div class="separator"> o </div>

    <div class="mt-4">
        <form @submit.prevent="onSubmit" class="space-y-4">
            <Textinput 
                type="text" 
                placeholder="Usuario"
                v-model="loginForm.username" />
            <Textinput 
                type="password" 
                placeholder="Contraseña" 
                v-model="loginForm.password" />
            <div class="text-right">
                <Button 
                    text="Login" 
                    :isDisabled="loginForm.username.trim() === '' || loginForm.password.trim() === ''"
                    btnClass="btn-dark px-4 py-2 text-sm font-regular" />
            </div>
        </form>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { onMounted, watch } from 'vue';
import { ref } from 'vue';
import {axiosClient} from '@/plugins/axios';

import Textinput from "@/components/Textinput";
import Button from "@/components/Button";



const toast = useToast();
const router = useRouter();
const loginUrl = ref('')
const validForm = ref(false)
const loginForm = ref({
    username: '',
    password: ''
})

const onSubmit = async () => {
    if (loginForm.value.username.trim() === '' || loginForm.value.password.trim() === '') {
        toast.error('Por favor, complete todos los campos')
        return
    }
    try {
        const response = await axiosClient.post('/api/social/login/', {
            username: loginForm.value.username,
            password: loginForm.value.password
        })

        console.log(response.data)
        router.push({ name: 'AuthCallback',
            query: {
                token: 
                response.data.token,
                user: response.data.user
            }
     })
    }
    catch (error) {
        console.log(error)
        toast.error('Usuario o contraseña incorrectos')
        loginForm.value.password = ''
    }
}

onMounted(async () => {
    try {
        const response = await axiosClient.get('/api/social/login/github/')
        console.log(response.data)
        loginUrl.value = response.data.auth_url
    }
    catch (error) {
        console.log(error)
        toast.error('Something went wrong')
    }
});

</script>


<style scoped>
.separator {
    display: flex;
    align-items: center;
    text-align: center;
    color: #a0aec0
}

.separator::before,
.separator::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
}

.separator:not(:empty)::before {
    margin-right: .25em;
}

.separator:not(:empty)::after {
    margin-left: .25em;
}
</style>
