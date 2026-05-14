<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">

      <router-link class="navbar-brand" to="/">Panel</router-link>

      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto" v-if="auth.isAuthenticated">

          <li class="nav-item">
            <router-link class="nav-link" to="/eventos">Eventos</router-link>
          </li>

          <li class="nav-item" v-if="auth.userRole === 'ADMIN'">
            <router-link class="nav-link" to="/usuarios">Usuarios</router-link>
          </li>

          <li class="nav-item" v-if="auth.userRole === 'ADMIN'">
            <router-link class="nav-link" to="/inscripciones">Inscripciones</router-link>
          </li>

        </ul>

        <div v-if="auth.isAuthenticated" class="d-flex">
          <span class="navbar-text me-3">
            {{ auth.username }} ({{ auth.userRole }})
          </span>
          <button class="btn btn-outline-light btn-sm" @click="logout">
            Salir
          </button>
        </div>

        <div v-else>
          <router-link class="btn btn-outline-light btn-sm" to="/login">Entrar</router-link>
        </div>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth.js";

const auth = useAuthStore();

function logout() {
  auth.logout();
}
</script>
