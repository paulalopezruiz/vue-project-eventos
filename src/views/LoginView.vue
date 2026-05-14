<template>
  <div class="container d-flex justify-content-center align-items-center" style="min-height: 80vh;">
    <div class="card shadow-sm p-4" style="width: 380px;">
      <h2 class="text-center mb-4">Iniciar sesión</h2>

      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="form-label">Usuario</label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            placeholder="Introduce tu usuario"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Introduce tu contraseña"
            required
          />
        </div>

        <p v-if="error" class="text-danger small">{{ error }}</p>

        <button class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? "Entrando..." : "Acceder" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const auth = useAuthStore();

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function onSubmit() {
  loading.value = true;
  error.value = "";

  try {
    await auth.login(username.value, password.value);
    router.push("/"); // Va al dashboard
  } catch (e) {
    error.value = e.message || "Error al iniciar sesión";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.card {
  border-radius: 12px;
}
</style>
