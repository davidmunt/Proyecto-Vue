<template>
  <form @submit.prevent="validateAndSend" class="register-form">
    <h2>Datos del Afectado</h2>

    <InputText id="dni" label="DNI" v-model="formData.dni" placeholder="12345678Z" />
    <p v-if="errors.dni" class="error-msg">{{ errors.dni }}</p>

    <InputText id="username" label="Nombre y Apellidos" v-model="formData.username" placeholder="Ej: Juan Pérez" />

    <InputText id="telefono" label="Teléfono" type="tel" v-model="formData.telefono" placeholder="600123456" />

    <InputText id="email" label="Correo Electrónico" type="email" v-model="formData.email" placeholder="correo@ejemplo.com" />

    <InputText id="password" label="Contraseña" type="password" v-model="formData.password" placeholder="••••••••" />

    <ButtonPrimary text="Registrarte" type="submit" style="margin-top: 1.5rem" />
  </form>
</template>

<script setup>
import { reactive } from "vue";
import InputText from "../reutilizables/InputText.vue";
import ButtonPrimary from "../reutilizables/ButtonPrimary.vue";

const emit = defineEmits(["on-register"]);

const formData = reactive({
  dni: "",
  username: "",
  password: "", // Ahora está aquí centralizado
  telefono: "",
  email: "",
  fechaRegistro: new Date().toLocaleDateString(),
  estado: "pendiente",
});

const errors = reactive({ dni: "" });

const validateAndSend = () => {
  const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;

  if (!dniRegex.test(formData.dni)) {
    errors.dni = "El DNI no tiene un formato válido.";
    return;
  }

  errors.dni = "";
  // Ahora mandas el objeto completo, incluyendo el password al backend
  emit("on-register", { ...formData });
};
</script>

<style scoped>
.error-msg {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}
</style>
