<template>
  <section class="page-container">
    <div class="form-card">
      <header class="form-header">
        <h1>{{ isLogin ? "Iniciar Sesión" : "Crear Cuenta" }}</h1>
        <p class="subtitle">
          {{ isLogin ? "Introduce tus credenciales para acceder." : "Regístrate para gestionar tus reclamaciones." }}
        </p>
      </header>

      <div class="form-content">
        <Login v-if="isLogin" @on-login="handleLogin" />
        <Register v-else @on-register="handleRegister" />
      </div>

      <div class="toggle-container">
        <p>
          {{ isLogin ? "¿Aún no tienes cuenta?" : "¿Ya estás registrado?" }}
          <button @click="isLogin = !isLogin" class="btn-toggle">
            {{ isLogin ? "Regístrate aquí" : "Inicia sesión" }}
          </button>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";
import Register from "../components/auth/Register.vue";
import Login from "../components/auth/Login.vue";

const router = useRouter();
const authStore = useAuthStore();
const isLogin = ref(true);

const handleLogin = async (credentials) => {
  const result = await authStore.login(credentials);

  if (result.success) {
    const type = authStore.user?.user_type;

    if (type === "admin") {
      router.push("/admin");
    } else {
      router.push("/registro-vehiculo");
    }
  } else {
    alert(result.error || "Error al iniciar sesión");
  }
};

// Caso 2: El usuario decide Registrarse
const handleRegister = async (userData) => {
  const result = await authStore.register(userData);

  if (result.success) {
    const type = authStore.user?.user_type;

    if (type === "admin") {
      router.push("/admin");
    } else {
      router.push("/registro-vehiculo");
    }
  } else {
    alert(result.error || "Error al registrarse");
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background-color: #f4f7f6;
  min-height: 80vh;
}

.form-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.toggle-container {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  text-align: center;
  font-size: 0.9rem;
}

.btn-toggle {
  background: none;
  border: none;
  color: #42b883;
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  margin-left: 0.3rem;
}

.info-footer {
  margin-top: 2rem;
  font-size: 0.75rem;
  color: #bdc3c7;
  text-align: center;
}
</style>
