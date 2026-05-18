<template>
  <div class="container mt-4 usuario-page">
    <h1>Crear usuario</h1>

    <UserForm
      :loading="loading"
      :error="error"
      texto-boton="Crear usuario"
      @guardar="guardarUsuario"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import UserForm from "@/components/UserForm.vue";
import { apiCreateUsuario } from "@/services/api.js";

const router = useRouter();

const loading = ref(false);
const error = ref("");

async function guardarUsuario(datosUsuario) {
  loading.value = true;
  error.value = "";

  try {
    const nuevoUsuario = await apiCreateUsuario(datosUsuario);
    router.push(`/usuarios/${nuevoUsuario.dni}`);
  } catch (e) {
    console.error(e);
    error.value = "No se pudo crear el usuario. Revisa DNI, email o campos duplicados.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.usuario-page {
  color: white;
}
</style>
