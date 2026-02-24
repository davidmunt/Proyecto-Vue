import { defineStore } from "pinia";
import api from "../api/axios";

export const useVehiclesStore = defineStore("vehicles", {
  state: () => ({
    cantVehicles: 0,
    vehicles: {},
    loading: false,
  }),

  actions: {
    async getVehicles(userId) {
      this.loading = true;
      try {
        const response = await api.get(`/vehiculos/usuario/${userId}`);
        this.vehicles = response.data.vehiculos || {};
        this.cantVehicles = response.data.count || 0;
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || "Error al cargar" };
      } finally {
        this.loading = false;
      }
    },

    async createVehicle(payload, userId) {
      this.loading = true;
      try {
        await api.post("/vehiculos", payload);
        await this.getVehicles(userId);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.message };
      } finally {
        this.loading = false;
      }
    },

    async updateVehicle(idVehicle, payload, userId) {
      this.loading = true;
      try {
        await api.put(`/vehiculos/${idVehicle}`, payload);
        await this.getVehicles(userId);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.message };
      } finally {
        this.loading = false;
      }
    },

    async deleteVehicle(idVehicle, userId) {
      this.loading = true;
      try {
        await api.delete(`/vehiculos/${idVehicle}`);
        await this.getVehicles(userId);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || "Error al eliminar" };
      } finally {
        this.loading = false;
      }
    },
  },
});
