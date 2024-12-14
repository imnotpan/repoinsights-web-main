<template>
  <div
    :class="`mobile-sidebar bg-white dark:bg-slate-800  ${
      this.$store.themeSettingsStore.theme === 'bordered'
        ? 'border border-gray-5002'
        : 'shadow-base'
    }   `"
  >
    <div class="logo-segment flex justify-between items-center px-4 py-6">
      <span
        class="cursor-pointer text-slate-900 dark:text-white text-2xl"
        @click="toggleMsidebar"
        ><Icon icon="heroicons:x-mark"
      /></span>
    </div>

    <div class="sidebar-menu px-4 h-[calc(100%-100px)]" data-simplebar>
      <Navmenu :items="menuItems"  />
      <SubMenu />

    </div>
  </div>
</template>
<script>
import { Icon } from "@iconify/vue";
import { defineComponent } from "vue";
import { menuItems } from "../../constant/data";
import Navmenu from "./Navmenu";
import SubMenu from "./SubMenu.vue";
import { useThemeSettingsStore } from "@/store/themeSettings";

const themeSettingsStore = useThemeSettingsStore();

export default defineComponent({
  components: {
    Icon,
    Navmenu,
    SubMenu,
  },
  data() {
    return {
      menuItems,
      openClass: "w-[248px]",
      closeClass: "w-[72px] close_sidebar",
    };
  },
  methods: {
    toggleMsidebar() {
      themeSettingsStore.toggleMsidebar()
    },
  },
});
</script>
<style lang="scss" scoped>
.mobile-sidebar {
  @apply fixed ltr:left-0 rtl:right-0 top-0   h-full   z-[9999]  w-[280px];
}
</style>
