<template>
    <div class="loginwrapper">
        <div class="lg-inner-column">
            <div class="left-column relative z-[1]">
                <div class="ml-4 max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
                    <h4>
                        Analiza el proceso de tu
                        <span
                            class="text-slate-800 dark:text-slate-400 font-bold"
                            >repositorio</span
                        >
                    </h4>
                </div>
                <div
                    class="absolute left-0 2xl:bottom-[-160px] bottom-[-80px] h-full w-full z-[-1]"
                >
                    <img
                        :src="sideImg"
                        alt=""
                        class="h-full w-full object-contain"
                    />
                </div>
            </div>
            <div class="right-column relative">
                <div class="h-full flex flex-col dark:bg-slate-800">
                    <div
                        class="auth-box m-auto flex flex-col justify-center py-20 w-8/12"
                    >
                        <div class="text-left 2xl:mb-10 mb-4">
                            <h4 class="text-slate-500 !mb-1 !leading-0">
                                ¡Bienvenido!
                            </h4>
                            <p class="mb-8">
                                Inicia sesión o registrate para comenzar a
                                analizar el proceso de desarrollo de
                                repositorios de software
                            </p>
                            <Login />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import logoWhite from "@/assets/images/logo/logo-white.svg";
import logo from "@/assets/images/logo/logo.svg";
import sideImg from "@/assets/images/auth/ils1.svg";
import Login from "../common/Login.vue";
import Card from "@/components/Card/index.vue";

export default {
    data() {
        return {
            logoWhite,
            logo,
            sideImg,
        };
    },
    components: {
        Login,
    },
};
</script>
<style lang="scss"></style>
