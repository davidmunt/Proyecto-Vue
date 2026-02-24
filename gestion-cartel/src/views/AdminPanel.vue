<template>
  <div class="admin-panel">
    <header class="admin-header">
      <h1>Panel de Control Administrativo</h1>
      <button v-if="viewMode === 'clientData'" @click="viewMode = 'listClients'" class="btn-back">← Volver a la lista</button>
    </header>

    <main class="admin-content">
      <transition name="fade" mode="out-in">
        <ListClients v-if="viewMode === 'listClients'" @select-client="showClientDetail" />

        <ClientData v-else-if="viewMode === 'clientData'" :client="selectedClient" />
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ListClients from "../components/admin/ListClients.vue";
import ClientData from "../components/admin/ClientData.vue";

const viewMode = ref("listClients");
const selectedClient = ref(null);

const showClientDetail = (client) => {
  selectedClient.value = client;
  viewMode.value = "clientData";
};
</script>

<style scoped>
.admin-panel {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 1rem;
}
.btn-back {
  background: #35495e;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
