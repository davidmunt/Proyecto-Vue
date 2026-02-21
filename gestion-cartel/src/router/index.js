import { createRouter, createWebHistory } from "vue-router";

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
  },
  {
    path: "/admin",
    name: "AdminPanel",
    component: () => import("../views/AdminPanel.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
