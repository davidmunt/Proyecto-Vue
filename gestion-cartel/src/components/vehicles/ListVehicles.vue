<template>
  <div class="list-container">
    <div v-if="vehiclesStore.loading" class="loading">Cargando vehículos...</div>

    <div v-else-if="!vehicles || vehicles.length === 0" class="empty-state">
      <p>{{ adminMode ? "Este usuario no tiene vehículos registrados." : "No tienes vehículos registrados..." }}</p>
    </div>

    <table v-else class="vehicle-table">
      <thead>
        <tr>
          <th>Matrícula</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th v-if="!adminMode">Acciones</th>
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

          <td v-if="!adminMode" class="actions">
            <button @click="$emit('edit', v)" class="btn-edit">Editar</button>
            <button @click="handleDelete(v._id)" class="btn-delete">Eliminar</button>
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

// Definimos las props para controlar el comportamiento
const props = defineProps({
  adminMode: { type: Boolean, default: false },
  userId: { type: String, default: null },
});

const emit = defineEmits(["edit"]);
const vehiclesStore = useVehiclesStore();
const authStore = useAuthStore();

const vehicles = computed(() => vehiclesStore.vehicles);

onMounted(() => {
  // Si venimos de Admin, usamos la prop userId. Si es Cliente, el ID del authStore.
  const idACargar = props.adminMode ? props.userId : authStore.user?.id;

  if (idACargar) {
    vehiclesStore.getVehicles(idACargar);
  }
});

const handleDelete = async (id) => {
  if (confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
    // Usamos el ID correspondiente para refrescar la lista tras borrar
    const idARefrescar = props.adminMode ? props.userId : authStore.user?.id;
    await vehiclesStore.deleteVehicle(id, idARefrescar);
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
