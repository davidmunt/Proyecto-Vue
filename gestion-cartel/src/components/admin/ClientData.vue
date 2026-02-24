<template>
  <div class="client-data-container">
    <div class="info-card">
      <h2>Expediente de: {{ client.username }}</h2>
      <div class="details-grid">
        <p><strong>DNI:</strong> {{ client.dni }}</p>
        <p><strong>Email:</strong> {{ client.email }}</p>

        <div class="state-selector">
          <label><strong>Estado de la Reclamación:</strong></label>
          <select v-model="currentState" @change="updateState" :disabled="loading" class="select-admin">
            <option v-for="st in estados" :key="st" :value="st">{{ st.toUpperCase() }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="vehicles-section">
      <h3>Vehículos del Cliente</h3>
      <ListVehicles :adminMode="true" :userId="client.id" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useClientsStore } from "../../store/users";
import ListVehicles from "../vehicles/ListVehicles.vue";

const props = defineProps({
  client: { type: Object, required: true },
});

const clientsStore = useClientsStore();
const currentState = ref(props.client.estado);
const loading = ref(false);

const estados = ["pendiente", "en trámite", "resuelto", "rechazado"];

const updateState = async () => {
  loading.value = true;
  const result = await clientsStore.updateClientState(props.client.id, currentState.value);
  if (!result.success) {
    alert(result.error);
    currentState.value = props.client.estado; // Revertir si falla
  }
  loading.value = false;
};
</script>

<style scoped>
.info-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  align-items: center;
}
.select-admin {
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  font-weight: bold;
}
.vehicles-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #eee;
}
</style>
