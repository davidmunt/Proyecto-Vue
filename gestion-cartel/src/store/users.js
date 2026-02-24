import { defineStore } from "pinia";
import api from "../api/axios";

export const useClientsStore = defineStore("clients", {
  state: () => ({
    clients: [],
    loading: false,
  }),

  actions: {
    async getAllClients() {
      this.loading = true;
      try {
        const response = await api.get("/admin/clientes");
        this.clients = response.data.clientes;
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || "Error al cargar clientes" };
      } finally {
        this.loading = false;
      }
    },

    async updateClientState(clientId, newState) {
      this.loading = true;
      try {
        const response = await api.put(`/admin/clientes/${clientId}/estado`, { estado: newState });
        const index = this.clients.findIndex((c) => c.id === clientId);
        if (index !== -1) this.clients[index].estado = newState;

        return { success: true, message: response.data.message };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || "Error al actualizar" };
      } finally {
        this.loading = false;
      }
    },
  },
});
