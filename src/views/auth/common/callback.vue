<template>
  <pageLoader />
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/store/user'; 
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';


import pageLoader from '@/components/Loader/pageLoader.vue';

onMounted(async () => {
  const userStore = useUserStore(); 
  const toast = useToast(); 
  const router = useRouter();

  const params = {};
  new URLSearchParams(window.location.search).forEach((value, name) => {
    console.log(name, value);
    params[name] = value;
  });


  if ( params.error ) {
    toast.error(params.error);
    window.location.href = '/';
  }

  if ( params.token ) {
    console.log(params.token);
    const user = JSON.parse(params.user)
    const token = params.token
    userStore.setToken(token);
    userStore.setUser(user);
    router.push({ name: 'Layout' });
  }

  else{
    toast.error('Invalid token');
    window.location.href = '/';
  }

});
</script>
