<template>
  <div class="container mt-4 usuario-page">
    <h1>Editar usuario</h1>

    <div v-if="loadingDatos" class="text-center py-4">
      Cargando usuario...
    </div>

    <UserForm
      v-else
      :usuario-inicial="usuario"
      :loading="loading"
      :error="error"
      texto-boton="Guardar cambios"
      @guardar="guardarUsuario"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import UserForm from "@/components/UserForm.vue";
import { apiGetUsuarios, apiUpdateUsuario } from "@/services/api.js";

const route = useRoute();
const router = useRouter();

const usuario = ref(null);
const loadingDatos = ref(true);
const loading = ref(false);
const error = ref("");

onMounted(async () => {
  try {
    const usuarios = await apiGetUsuarios();
    usuario.value = usuarios.find((u) => u.dni === route.params.dni) || null;

    if (!usuario.value) {
      error.value = "No se encontró el usuario.";
    }
  } catch (e) {
    console.error(e);
    error.value = "No se pudo cargar el usuario.";
  } finally {
    loadingDatos.value = false;
  }
});

async function guardarUsuario(datosUsuario) {
  loading.value = true;
  error.value = "";

  try {
    const usuarioActualizado = await apiUpdateUsuario(route.params.dni, datosUsuario);
    router.push(`/usuarios/${usuarioActualizado.dni}`);
  } catch (e) {
    console.error(e);
    error.value = "No se pudo actualizar el usuario. Revisa DNI, email o campos duplicados.";
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
