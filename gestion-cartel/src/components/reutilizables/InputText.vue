<template>
  <div class="input-group">
    <label :for="id" class="label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="base-input"
    />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  type: { type: String, default: "text" },
  placeholder: String,
  id: { type: String, required: true },
});
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.input-group {
  margin-bottom: 1rem;
  text-align: left;
}
.label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.base-input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
