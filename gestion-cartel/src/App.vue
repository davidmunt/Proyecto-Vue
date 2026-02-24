<script setup>
import { computed } from "vue";
import { useAuthStore } from "./store/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<template>
  <div class="app-wrapper">
    <header class="main-header">
      <div class="header-container">
        <router-link to="/" class="brand-link">
          <h1 class="brand">Cártel Coches</h1>
        </router-link>

        <nav class="main-nav">
          <div class="nav-links-start">
            <router-link to="/" class="nav-link">Inicio</router-link>
          </div>

          <div v-if="!isAuthenticated" class="auth-group">
            <router-link to="/registro-cliente" class="login-btn"> Autenticarse </router-link>
          </div>

          <div v-else class="user-group">
            <router-link v-if="authStore.isAdmin" to="/admin" class="nav-link">Panel Admin</router-link>
            <router-link to="/registro-vehiculo" class="nav-link">Mis Vehículos</router-link>

            <div class="user-profile">
              <div class="user-info">
                <span class="username">{{ user?.username || "Usuario" }}</span>
                <span class="role-tag">{{ authStore.isAdmin ? "Administrador" : "Afectado" }}</span>
              </div>
              <img
                :src="'https://ui-avatars.com/api/?background=42b883&color=fff&bold=true&name=' + (user?.username || 'U')"
                alt="Perfil"
                class="avatar"
              />
              <button @click="handleLogout" class="logout-btn">Salir</button>
            </div>
          </div>
        </nav>
      </div>
    </header>

    <main class="content-area">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="main-footer">
      <p>&copy; 2026 - Proyecto 2º DAW - Gestión de Afectados Cártel de Coches</p>
    </footer>
  </div>
</template>

<style>
:root {
  --primary: #42b883;
  --primary-dark: #3aa876;
  --secondary: #35495e;
  --dark: #2c3e50;
  --light-bg: #f8fafc;
  --border: #e2e8f0;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Inter", sans-serif;
  background-color: var(--light-bg);
  color: var(--dark);
}

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0.8rem 0;
}

.header-container {
  display: flex;
  align-items: center;
  padding: 0 5%; /* Usa porcentajes para que respire en pantallas grandes */
}

.brand-link {
  text-decoration: none;
  margin-right: 4rem;
}
.brand {
  font-size: 1.6rem;
  margin: 0;
  color: var(--secondary);
  font-weight: 800;
}
.brand span {
  color: var(--primary);
  font-weight: 400;
}

.main-nav {
  display: flex;
  align-items: center;
  flex: 1; /* Ocupa el espacio para empujar el resto a la derecha */
}

.nav-links-start {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: var(--secondary);
  font-weight: 600;
  font-size: 0.95rem;
}

.nav-link:hover,
.router-link-active {
  color: var(--primary);
}

.auth-group,
.user-group {
  margin-left: auto; /* MAGIA: Empuja estos elementos a la derecha */
  display: flex;
  align-items: center;
  gap: 2rem;
}

.login-btn {
  text-decoration: none;
  background-color: var(--dark);
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.2s;
}

.login-btn:hover {
  background-color: var(--secondary);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: #f1f5f9;
  padding: 0.5rem 0.5rem 0.5rem 1.2rem;
  border-radius: 50px;
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: right;
}
.username {
  font-weight: 700;
  font-size: 0.9rem;
}
.role-tag {
  font-size: 0.7rem;
  color: var(--primary-dark);
  font-weight: 800;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid white;
}

.logout-btn {
  background: white;
  border: 1px solid #fee2e2;
  color: #ef4444;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 700;
}

.logout-btn:hover {
  background: #ef4444;
  color: white;
}

.content-area {
  flex: 1;
}

.main-footer {
  background: white;
  border-top: 1px solid var(--border);
  padding: 2rem;
  text-align: center;
  color: #64748b;
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
