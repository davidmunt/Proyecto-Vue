<template>
  <div class="vehicles-page">
    <div class="header-section">
      <h1>Gestión de Mis Vehículos</h1>
    </div>

    <transition name="fade" mode="out-in">
      <div :key="viewMode">
        <div v-if="viewMode === 'list'">
          <div class="actions-bar">
            <ButtonPrimary text="+ Añadir Vehículo" @click="openCreate" class="btn-add" />
          </div>

          <ListVehicles @edit="openEdit" />
        </div>

        <div v-else>
          <UpdateCreateVehicle :editData="vehicleToEdit" @cancel="viewMode = 'list'" @saved="viewMode = 'list'" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ListVehicles from "../components/vehicles/ListVehicles.vue";
import UpdateCreateVehicle from "../components/vehicles/UpdateCreateVehicle.vue";
import ButtonPrimary from "../components/reutilizables/ButtonPrimary.vue";

const viewMode = ref("list");
const vehicleToEdit = ref(null);

const openCreate = () => {
  vehicleToEdit.value = null;
  viewMode.value = "form";
};

const openEdit = (vehicle) => {
  vehicleToEdit.value = vehicle;
  viewMode.value = "form";
};
</script>

<style scoped>
.vehicles-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header-section {
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--border);
  padding-bottom: 1rem;
}

.actions-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.btn-add {
  max-width: 250px;
}

/* Animación de cambio de vista */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
