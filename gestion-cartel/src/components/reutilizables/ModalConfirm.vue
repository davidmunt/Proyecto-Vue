<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-card" role="alertdialog" aria-modal="true">
      <h3>Confirmación</h3>
      <p>{{ message }}</p>

      <div class="modal-buttons">
        <button class="btn-cancel" @click="onAction(false)">Cancelar</button>
        <button class="btn-confirm" @click="onAction(true)">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: { type: String, default: "¿Estás seguro de realizar esta acción?" },
});

const emit = defineEmits(["confirm-result"]);

const onAction = (result) => {
  // Emitimos 'true' si confirma, 'false' si cancela
  emit("confirm-result", result);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.btn-confirm {
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
