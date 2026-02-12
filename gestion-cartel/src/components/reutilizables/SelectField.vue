<template>
  <div class="select-group">
    <label :for="id" class="label">{{ label }}</label>
    <select :id="id" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" class="base-select">
      <option value="" disabled selected>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  id: { type: String, required: true },
  placeholder: { type: String, default: "Seleccione una opción" },
  // Esperamos un array de objetos: [{ value: 'SEAT', label: 'Seat' }, ...]
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.select-group {
  margin-bottom: 1rem;
  text-align: left;
}
.label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}
.base-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
}
.base-select:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 2px rgba(66, 184, 131, 0.2);
}
</style>
