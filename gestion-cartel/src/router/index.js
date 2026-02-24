import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/registro-cliente",
    name: "RegistroCliente",
    component: () => import("../views/RegistroCliente.vue"),
  },
  {
    path: "/registro-vehiculo",
    name: "RegistroVehiculo",
    component: () => import("../views/RegistroVehiculo.vue"),
    meta: { requiresAuth: true, role: "cliente" },
  },
  {
    path: "/admin",
    name: "AdminPanel",
    component: () => import("../views/AdminPanel.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiredRole = to.meta.role;
  if (!requiresAuth) {
    next();
    return;
  }
  if (!authStore.user) {
    next({ name: "Home" });
    return;
  }
  if (requiredRole === "admin" && authStore.user.user_type !== "admin") {
    next({ name: "Home" });
  } else if (requiredRole === "cliente" && authStore.user.user_type === "admin") {
    next({ name: "AdminPanel" });
  } else {
    next();
  }
});

export default router;
