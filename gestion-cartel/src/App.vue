<script setup></script>

<template>
  <header class="main-header">
    <div class="container">
      <h1 class="brand">Cártel Coches <span>España</span></h1>

      <nav class="main-nav">
        <router-link to="/" class="nav-link">Inicio</router-link>
        <router-link to="/registro-cliente" class="nav-link">Reclamar</router-link>
        <router-link to="/admin" class="nav-link admin-btn">Panel Admin</router-link>
      </nav>
    </div>
  </header>

  <main class="content-area">
    <div class="container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </main>

  <footer class="main-footer">
    <p>&copy; 2026 - Proyecto DAW - Gestión de Afectados Cártel de Coches</p>
  </footer>
</template>

<style>
/* Estilos globales básicos para que se vea bien desde el principio */
:root {
  --primary: #42b883;
  --secondary: #35495e;
  --dark: #2c3e50;
  --light: #f8f9fa;
}

body {
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: var(--dark);
  background-color: #f0f2f5;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.main-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  margin: 0;
  font-size: 1.5rem;
  color: var(--secondary);
}

.brand span {
  color: var(--primary);
  font-weight: 300;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--dark);
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.nav-link:hover,
.router-link-active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.admin-btn {
  background-color: var(--secondary);
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
}

.admin-btn:hover {
  background-color: var(--dark);
}

.content-area {
  padding: 2rem 0;
  min-height: calc(100vh - 160px);
}

.main-footer {
  text-align: center;
  padding: 1.5rem;
  background: var(--secondary);
  color: white;
  font-size: 0.9rem;
}

/* Animación simple de transición entre páginas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
