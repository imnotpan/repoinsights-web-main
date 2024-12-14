<template>
  <ul>
    <li v-for="(item, i) in items" :key="i" :class="`
      ${item.child ? 'item-has-children' : ''}
          ${activeSubmenu === i ? 'open' : ''}
          ${this.$route.name === item.link ? 'menu-item-active' : ''}
      `" class="single-sidebar-menu">

      <router-link :to="{ name: item.link }" class="menu-link gap-1" v-if="!item.child && !item.isHeadr">
        <span class="menu-icon" v-if="item.icon">
          <Icon :icon="item.icon" />
        </span>
        <div class="text-box" v-if="item.title">{{ item.title }}</div>
      </router-link>

      <div v-else-if="item.isHeadr && !item.child" class="menulabel">
        {{ item.title }}
      </div>
    </li>
  </ul>
  
</template>
<script>
import { useRouter } from "vue-router";
import Icon from "../Icon";
export default {
  components: {
    Icon,
  },

  data() {
    return {
      activeSubmenu: null,
    };
  },

  props: {
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    items: { type: Array, required: true },
    childrenLinks: { type: Array, default: null },
  },

  methods: {
    beforeEnter(element) {
      requestAnimationFrame(() => {
        if (!element.style.height) {
          element.style.height = "0px";
        }

        element.style.display = null;
      });
    },
    enter(element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.height = `${element.scrollHeight}px`;
        });
      });
    },
    afterEnter(element) {
      element.style.height = null;
    },
    beforeLeave(element) {
      requestAnimationFrame(() => {
        if (!element.style.height) {
          element.style.height = `${element.offsetHeight}px`;
        }
      });
    },
    leave(element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.height = "0px";
        });
      });
    },
    afterLeave(element) {
      element.style.height = null;
    },
    toggleSubmenu(index) {
      if (this.activeSubmenu === index) {
        this.activeSubmenu = null;
      } else {
        this.activeSubmenu = index;
      }
    },
  },

  watch: {
    $route() {
      if (this.$store.themeSettingsStore.mobielSidebar) {
        this.$store.themeSettingsStore.mobielSidebar = false;
      }

      this.items.map((item) => {
        if (item.link === this.$route.name) {
          this.activeSubmenu = null;
        }
      });
    },
  },

  created() {
    const router = useRouter();
    this.items.map((item, i) => {
      item.child?.map((ci) => {
        if (ci.childlink === router.currentRoute.value.name) {
          this.activeSubmenu = i;
        }
      });
    });
  },
  // update if route chnage then activesubmenu null

  updated() { },
};
</script>
<style lang="scss">
.submenu_enter-active,
.submenu_leave-active {
  overflow: hidden;
  transition: all 0.34s linear;
}

.not-collapsed .has-icon {
  transition: all 0.34s linear;
}

.not-collapsed .has-icon {
  @apply transform rotate-180;
}

// single sidebar menu css
.single-sidebar-menu {
  @apply relative;

  .menulabel {
    @apply text-slate-800 dark:text-slate-300 text-xs font-semibold uppercase mb-4 mt-4;
  }

  >.menu-link {
    @apply flex text-slate-600 font-medium dark:text-slate-300 text-sm capitalize px-[10px] py-3 rounded-[4px] cursor-pointer;
  }

  .menu-icon {
    @apply icon-box inline-flex items-center text-slate-600 dark:text-slate-300 text-lg ltr:mr-3 rtl:ml-3;
  }
}

// menu item has chilren
.item-has-children {
  .menu-arrow {
    @apply h-5 w-5 text-base text-slate-300 bg-slate-100 dark:bg-[#334155] dark:text-slate-300 rounded-full flex justify-center items-center;
  }
}

// close sidebar css
.close_sidebar .menulabel {
  @apply hidden;
}

.close_sidebar:not(.sidebar-hovered) {
  .menu-arrow {
    @apply hidden;
  }

  .single-sidebar-menu {
    .text-box {
      @apply absolute left-full ml-5 w-[180px] top-0 px-4 py-3 bg-white shadow-dropdown rounded-[4px] dark:bg-slate-800 z-[999] invisible opacity-0 transition-all duration-150;
    }

    &:hover {
      .text-box {
        @apply visible opacity-100;
      }
    }
  }

  .item-has-children {
    .text-box {
      @apply hidden;
    }

    >ul {
      @apply ml-4 absolute left-full top-0 w-[230px] bg-white shadow-dropdown rounded-[4px] dark:bg-slate-800 z-[999] px-4 pt-3 transition-all duration-150 invisible opacity-0;
      display: block !important;
    }

    &:hover {
      >ul {
        @apply visible opacity-100;
      }
    }
  }
}

// active menu
.item-has-children {
  .parent_active {
    @apply bg-secondary-500 bg-opacity-20;

    .icon-box,
    .menu-icon,
    .text-box {
      @apply text-slate-700 dark:text-slate-200;
    }

    .menu-arrow {
      @apply bg-secondary-500 text-slate-600 text-opacity-70 bg-opacity-30 dark:text-white;
    }
  }
}

.menu-item-active {
  .menu-link {
    @apply bg-slate-800 dark:bg-slate-700;

    .icon-box,
    .menu-icon,
    .text-box {
      @apply text-white dark:text-slate-300;
    }
  }
}
</style>
