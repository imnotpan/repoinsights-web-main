import "animate.css";
import "flatpickr/dist/flatpickr.css";
import "simplebar/dist/simplebar.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { createApp } from "vue";
import VueFlatPickr from "vue-flatpickr-component";
import VueGoodTablePlugin from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";
import VueSweetalert2 from "vue-sweetalert2";
import VueTippy from "vue-tippy";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueApexCharts from "vue3-apexcharts";
import VueClickAway from "vue3-click-away";
import App from "./App.vue";
import "./assets/scss/auth.scss";
import "./assets/scss/tailwind.scss";
import router from "./router";
import VCalendar from "v-calendar";
import { createPinia } from 'pinia'
import "v-calendar/dist/style.css";
import { iframeResize } from 'iframe-resizer'

const pinia = createPinia()

// vue use
const app = createApp(App)
    .use(pinia)
    .use(VueSweetalert2)
    .use(Toast, {
        toastClassName: "dashcode-toast",
        bodyClassName: "dashcode-toast-body",
    })
    .use(router)
    .use(VueClickAway)
    .use(VueTippy)
    .use(VueFlatPickr)
    .use(VueGoodTablePlugin)
    .use(VueApexCharts)
    .use(VCalendar)

app.config.globalProperties.$store = {};

const resizeDirective = {
    beforeMount(el, { value = {} }) {
        el.addEventListener('load', () => iframeResize(value, el))
    },
    beforeUnmount(el) {
        el.iFrameResizer.removeListeners();
    }
}

app.directive('resize', resizeDirective)


app.mount("#app");

import { useThemeSettingsStore } from "@/store/themeSettings";
import { useUserStore } from "@/store/user";
const themeSettingsStore = useThemeSettingsStore()
const userStore = useUserStore()

// check localStorage theme for dark light bordered
if (localStorage.theme === "dark") {
    document.body.classList.add("dark");
    themeSettingsStore.theme = "dark";
    themeSettingsStore.isDark = true;
} else {
    document.body.classList.add("light");
    themeSettingsStore.theme = "light";
    themeSettingsStore.isDark = false;
}
if (localStorage.semiDark === "true") {
    document.body.classList.add("semi-dark");
    themeSettingsStore.semidark = true;
    themeSettingsStore.semiDarkTheme = "semi-dark";
} else {
    document.body.classList.add("semi-light");
    themeSettingsStore.semidark = false;
    themeSettingsStore.semiDarkTheme = "semi-light";
}
// check loacl storege for menuLayout
if (localStorage.menuLayout === "horizontal") {
    themeSettingsStore.menuLayout = "horizontal";
} else {
    themeSettingsStore.menuLayout = "vertical";
}

// check skin  for localstorage
if (localStorage.skin === "bordered") {
    themeSettingsStore.skin = "bordered";
    document.body.classList.add("skin--bordered");
} else {
    themeSettingsStore.skin = "default";
    document.body.classList.add("skin--default");
}


if (localStorage.token) {
    userStore.token = localStorage.token;
}

if (localStorage.user) {
    const userData = JSON.parse(localStorage.user);
    userStore.setUser(userData);
}
