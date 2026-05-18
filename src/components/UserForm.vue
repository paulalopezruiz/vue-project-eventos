<template>
  <form class="card shadow-sm p-4 mt-3" @submit.prevent="enviarFormulario">
    <div class="row g-3">

      <div class="col-md-4">
        <label class="form-label">DNI</label>
        <input
          v-model="form.dni"
          class="form-control"
          maxlength="9"
          required
        />
      </div>

      <div class="col-md-4">
        <label class="form-label">Nombre</label>
        <input
          v-model="form.nombre"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-4">
        <label class="form-label">Apellidos</label>
        <input
          v-model="form.apellidos"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-6">
        <label class="form-label">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-3">
        <label class="form-label">Teléfono</label>
        <input
          v-model="form.telefono"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-3">
        <label class="form-label">Tipo de usuario</label>
        <select v-model="form.tipo_usuario" class="form-select" required>
          <option disabled value="">Selecciona un tipo</option>
          <option value="ALUMNO">Alumno</option>
          <option value="PROFESOR">Profesor</option>
          <option value="INVITADO">Invitado</option>
          <option value="OTRO">Otro</option>
        </select>
      </div>

    </div>

    <p v-if="error" class="text-danger mt-3">
      {{ error }}
    </p>

    <div class="mt-4 d-flex gap-2">
      <button class="btn btn-primary" :disabled="loading">
        {{ loading ? "Guardando..." : textoBoton }}
      </button>

      <router-link to="/usuarios" class="btn btn-outline-secondary">
        Cancelar
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  usuarioInicial: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  textoBoton: {
    type: String,
    default: "Guardar usuario",
  },
});

const emit = defineEmits(["guardar"]);

const form = reactive({
  dni: "",
  nombre: "",
  apellidos: "",
  email: "",
  telefono: "",
  tipo_usuario: "",
});

watch(
  () => props.usuarioInicial,
  (usuario) => {
    if (usuario) {
      form.dni = usuario.dni || "";
      form.nombre = usuario.nombre || "";
      form.apellidos = usuario.apellidos || "";
      form.email = usuario.email || "";
      form.telefono = usuario.telefono || "";
      form.tipo_usuario = usuario.tipo_usuario || "";
    }
  },
  { immediate: true }
);

function enviarFormulario() {
  emit("guardar", { ...form });
}
</script>

<style scoped>
.card {
  background-color: #111827 !important;
  color: white !important;
  border: 1px solid #374151;
}

.form-label {
  color: white !important;
}

.form-control,
.form-select {
  background-color: white !important;
  color: black !important;
  border: 2px solid #6C63FF !important;
}
</style>
