import { defineStore } from "pinia";
import api from "../api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("auth_token") || null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.user_type === "admin",
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      try {
        const response = await api.post("/user/login", { user: credentials });

        const userData = response.data.user;
        this.token = userData.token;
        this.user = userData;

        localStorage.setItem("auth_token", this.token);
        return { success: true };
      } catch (error) {
        console.error("Error en login:", error);
        return { success: false, error: error.response?.data?.message || "Error al conectar" };
      } finally {
        this.loading = false;
      }
    },

    async register(credentials) {
      this.loading = true;
      try {
        const response = await api.post("/user/register", { user: credentials });

        const userData = response.data.user;
        this.token = userData.token;
        this.user = userData;

        localStorage.setItem("auth_token", this.token);
        return { success: true };
      } catch (error) {
        console.error("Error en register:", error);
        return { success: false, error: error.response?.data?.message || "Error al conectar" };
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("auth_token");
    },
  },
});
