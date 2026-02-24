<template>
  <div class="list-clients-container">
    <div v-if="clientsStore.loading" class="loading-state">
      <p>Cargando base de datos de clientes...</p>
    </div>

    <div v-else-if="clients.length === 0" class="empty-state">
      <p>No hay clientes registrados en el sistema.</p>
    </div>

    <div v-else class="table-responsive">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>DNI</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id">
            <td>
              <div class="user-cell">
                <img :src="client.image || 'https://ui-avatars.com/api/?name=' + client.username" class="mini-avatar" />
                <strong>{{ client.username }}</strong>
              </div>
            </td>
            <td>{{ client.dni }}</td>
            <td>{{ client.email }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(client.estado)">
                {{ client.estado }}
              </span>
            </td>
            <td>
              <button @click="$emit('select-client', client)" class="btn-detail">Ver Expediente</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useClientsStore } from "../../store/users";

const emit = defineEmits(["select-client"]);
const clientsStore = useClientsStore();

const clients = computed(() => clientsStore.clients);

onMounted(() => {
  clientsStore.getAllClients();
});

// Lógica de colores para los estados
const getStatusClass = (status) => {
  switch (status) {
    case "pendiente":
      return "status-pending";
    case "en trámite":
      return "status-progress";
    case "resuelto":
      return "status-success";
    case "rechazado":
      return "status-danger";
    default:
      return "";
  }
};
</script>

<style scoped>
.list-clients-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  background-color: #f8fafc;
  padding: 1.2rem 1rem;
  color: #475569;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
}

.admin-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
  vertical-align: middle;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.mini-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

/* Estilos de los Badges de Estado */
.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
} /* Naranja/Amarillo */
.status-progress {
  background-color: #e0f2fe;
  color: #075985;
} /* Azul */
.status-success {
  background-color: #dcfce7;
  color: #166534;
} /* Verde */
.status-danger {
  background-color: #fee2e2;
  color: #991b1b;
} /* Rojo */

.btn-detail {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-detail:hover {
  background-color: #3aa876;
}

.loading-state,
.empty-state {
  padding: 3rem;
  text-align: center;
  color: #64748b;
}
</style>
