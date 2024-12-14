<template>
    <div class="container mx-auto px-4 max-w-4xl md:px-0">
        <img src="@/assets/images/github/logo-black.svg" class="m-auto my-5" width="80" />
        <div class="relative">
            <div className="text-center w-3/4 m-auto">
                <Card bodyClass="p-10 w-fit m-auto">
                    <h1 class="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block mb-2">
                        Agrega un repositorio que te interese</h1>
                    <p class="text-sm text-slate-600">Si existe un proyecto que te interesa analizar, ingresa
                        su URL</p>
                    <input 
                        type="url" 
                        autofocus
                        class="border border-slate-400 p-2 rounded-lg w- my-6 mt-8 w-full active:border-slate-800 focus:border-slate-800 focus:outline-none"
                        placeholder="https://github.com/memcached/memcached"
                        @keyup.enter="addRepository"
                        v-model="repositoryURL"
                    />
                </Card>
            </div>
        </div>
    </div>
</template>
        

<script setup>
import Card from "@/components/Card";
import { ref } from "vue";
import axiosClient from '@/plugins/axios';
import { useToast } from 'vue-toastification';


const toast = useToast();
const repositoryURL = ref(null)

const addRepository = async () => {
    try {
        const {data}  = await axiosClient.post('/api/github/contribute/', {
            url: repositoryURL.value
        })
        console.log(data)
        toast.success('Repositorio agregado correctamente')
    } catch (error) {
        console.log(error)
        toast.error(error.response.data.error)
    }
    repositoryURL.value = null
    
}

</script>