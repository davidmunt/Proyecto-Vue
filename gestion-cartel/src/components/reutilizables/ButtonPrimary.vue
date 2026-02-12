<template>
  <button :type="type" class="btn-primary" @click="$emit('click')">
    {{ text }}
  </button>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
  type: { type: String, default: "button" },
});

defineEmits(["click"]);
</script>

<style scoped>
.btn-primary {
  background-color: #42b883;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.1s;
  width: 100%; /* Por defecto ocupa el ancho del contenedor */
}

.btn-primary:hover {
  background-color: #3aa876;
}

.btn-primary:active {
  transform: scale(0.98);
}
</style>
