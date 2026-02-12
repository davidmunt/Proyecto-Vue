<template>
  <div class="home-container">
    <h1>¿Está su vehículo afectado?</h1>
    <p>Compruebe si puede iniciar una reclamación por el Cártel de Coches.</p>

    <div class="checker-card">
      <label for="year-check">Año de compra del vehículo:</label>
      <input id="year-check" type="number" v-model="year" placeholder="Ej: 2008" />

      <button @click="checkAffected" class="btn-primary">Verificar</button>

      <div v-if="isAffected !== null" class="result-message">
        <p v-if="isAffected" class="success">
          ✅ Su vehículo podría estar afectado. Puede proceder al registro.
          <router-link to="/registro-cliente">Comenzar Registro</router-link>
        </p>
        <p v-else class="error">❌ Lo sentimos, según el año indicado, su vehículo no entra en el periodo del cártel.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const year = ref("");
const isAffected = ref(null);

const checkAffected = () => {
  if (year.value >= 2006 && year.value <= 2013) {
    isAffected.value = true;
  } else {
    isAffected.value = false;
  }
};
</script>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}
.checker-card {
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.success {
  color: green;
  font-weight: bold;
}
.error {
  color: red;
}
</style>
