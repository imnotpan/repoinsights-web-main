import auth from "@/middleware/auth";
import login from "@/views/auth/login/index.vue";
import guest from "@/middleware/guest";

const routes = [
    {
        path: "/",
        name: "Login",
        component: login,
        meta: {
            middleware: [guest],
        },
    },

    {
        path: "/auth/callback",
        name: "AuthCallback",
        component: () => import("@/views/auth/common/callback.vue"),
    },
    {
        path: "/app",
        name: "Layout",
        redirect: "/app/home",
        component: () => import("@/Layout/index.vue"),
        meta: {
            middleware: [auth],
            groupParent: "app",
        },
        children: [
            {
                path: "home",
                name: "home",
                component: () => import("@/views/index.vue"),
                meta: {
                    hide: true,
                },
            },
            {
                path: "dashboard",
                name: "dashboard",
                component: () => import("@/views/dashboard/publics.vue"),
            },
            {
                path: "my-dashboard",
                name: "my-dashboard",
                component: () => import("@/views/dashboard/customs.vue"),
                meta: {
                    hide: true,
                },
            },
            {
                path: "metabase",
                name: "metabase",
                component: () => import("@/views/metabase/index.vue"),
                meta: {
                    hide: true,
                },
            },
            {
                path: "add-project",
                name: "Agregar proyecto personal",
                component: () => import("@/views/home/project/index.vue"),
            },
            {
                path: "explore",
                name: "Explorar proyectos",
                component: () => import("@/views/explore/index.vue"),
            },
            {
                path: "explore/:id",
                name: "Proyecto",
                component: () => import("@/views/explore/project.vue"),
                props: true,
                meta: {
                    hide: true,
                },
            },
            {
                path: "contribuir",
                name: "contribuir",
                component: () => import("@/views/contribute/index.vue"),
            },
            {
                path: "superset",
                name: "superset",
                component: () => import("@/views/superset/index.vue"),
                meta: {
                    hide: true,
                },
            },
            {
                path: "superset/tutorial",
                name: "Tutorial",
                component: () => import("@/views/superset/Tutorial.vue"),
                meta: {
                    hide: true,
                },
            },
            {
                path: "3d",
                name: "Explorar repositorios en 3D",
                component: () => import("@/views/3d/index.vue"),
            },
        ],
    },
];

export default routes;
