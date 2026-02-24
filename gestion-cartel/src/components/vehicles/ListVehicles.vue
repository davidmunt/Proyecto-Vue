<template>
  <div class="list-container">
    <div v-if="vehiclesStore.loading" class="loading">Cargando vehículos...</div>

    <div v-else-if="vehicles.length === 0" class="empty-state">
      <p>No tienes vehículos registrados. ¡Añade el primero!</p>
    </div>

    <table v-else class="vehicle-table">
      <thead>
        <tr>
          <th>Matrícula</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in vehicles" :key="v._id">
          <td>
            <strong>{{ v.matricula }}</strong>
          </td>
          <td>{{ v.marca }}</td>
          <td>{{ v.modelo }}</td>
          <td>{{ v.anyo_matriculacion }}</td>
          <td class="actions">
            <button @click="$emit('edit', v)" class="btn-edit">Editar</button>
            <button @click="confirmDelete(v._id)" class="btn-delete">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useVehiclesStore } from "../../store/vehicles";
import { useAuthStore } from "../../store/auth";

const vehiclesStore = useVehiclesStore();
const authStore = useAuthStore();

const vehicles = computed(() => vehiclesStore.vehicles);

onMounted(() => {
  if (authStore.user?.id) {
    vehiclesStore.getVehicles(authStore.user.id);
  }
});

const confirmDelete = async (id) => {
  if (confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
    await vehiclesStore.deleteVehicle(id, authStore.user.id);
  }
};
</script>

<style scoped>
.vehicle-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}
th {
  background: #f8fafc;
  color: var(--secondary);
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.btn-edit {
  color: var(--primary);
  border: none;
  background: none;
  cursor: pointer;
  font-weight: bold;
}
.btn-delete {
  color: #ef4444;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: bold;
}
</style>
