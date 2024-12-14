import { useUserStore } from "@/store/user"; // Importa useUserStore
import axiosClient from "@/plugins/axios";

export default async function auth({ next }) {
    const userStore = useUserStore(); // Crea una instancia de userStore

    if (userStore.token) {
        /*
        if (userStore.favoriteProjects.length === 0) {
            await userStore.getFavoriteProjects();
        }
        */
        return next();
    }
    return next({ name: "Login" });
}

/**
 * en src -> views -> index.vue
 *             <!--
      <Card className="col-span-12 relative" v-if="userStore.favoriteProjects.projects.length > 0">
        <div class="flex justify-between mb-4 overflow-auto">
          <h4 class="text-sm">Tus Proyectos seleccionados ({{ userStore.favoriteProjects.projects.length }})</h4>
          <router-link class="text-xs font-semibold text-slate-900" :to="{ name: 'Explorar proyectos' }">
            Ver todos los proyectos
          </router-link>
        </div>
        <CompareProjects />
      </Card>
      -->
 */
