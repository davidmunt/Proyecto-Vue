<template>
  <form @submit.prevent="handleLogin" class="login-form">
    <InputText id="user" label="Correo Electrónico" v-model="credentials.email" placeholder="usuario@gmail.com" />

    <InputText id="pass" label="Contraseña" type="password" v-model="credentials.password" placeholder="••••••••" />

    <ButtonPrimary text="Autenticarte" type="submit" style="margin-top: 1.5rem" />
  </form>
</template>

<script setup>
import { reactive } from "vue";
import InputText from "../reutilizables/InputText.vue";
import ButtonPrimary from "../reutilizables/ButtonPrimary.vue";

const emit = defineEmits(["on-login"]);

const credentials = reactive({
  email: "", // Antes tenías 'username', ahora coincide con el v-model
  password: "",
});

const handleLogin = () => {
  // Ahora la comprobación funciona porque credentials.email existe
  if (credentials.email && credentials.password) {
    emit("on-login", { ...credentials });
  } else {
    alert("Por favor, rellena todos los campos.");
  }
};
</script>
