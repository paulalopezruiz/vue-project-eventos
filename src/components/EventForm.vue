<template>
  <form class="card shadow-sm p-4 mt-3" @submit.prevent="enviarFormulario">
    <div class="row g-3">
      <div class="col-md-4">
        <label class="form-label">Código</label>
        <input
          v-model="form.codigo_evento"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-8">
        <label class="form-label">Título</label>
        <input
          v-model="form.titulo"
          class="form-control"
          required
        />
      </div>

      <div class="col-12">
        <label class="form-label">Descripción</label>
        <textarea
          v-model="form.descripcion"
          class="form-control"
          rows="3"
          required
        ></textarea>
      </div>

      <div class="col-md-4">
        <label class="form-label">Fecha</label>
        <input
          v-model="form.fecha"
          type="date"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-4">
        <label class="form-label">Hora inicio</label>
        <input
          v-model="form.hora_inicio"
          type="time"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-4">
        <label class="form-label">Hora fin</label>
        <input
          v-model="form.hora_fin"
          type="time"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-8">
        <label class="form-label">Ubicación</label>
        <input
          v-model="form.ubicacion"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-4">
        <label class="form-label">Aforo máximo</label>
        <input
          v-model.number="form.aforo_maximo"
          type="number"
          min="1"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-6">
        <label class="form-label">Estado</label>
        <select v-model="form.estado" class="form-select" required>
          <option value="ABIERTO">Abierto</option>
          <option value="CERRADO">Cerrado</option>
          <option value="CANCELADO">Cancelado</option>
          <option value="FINALIZADO">Finalizado</option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label">Categoría</label>
        <select v-model.number="form.categoria" class="form-select" required>
          <option disabled value="">Selecciona una categoría</option>

          <option
            v-for="cat in categorias"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.nombre }}
          </option>
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

      <router-link to="/eventos" class="btn btn-outline-secondary">
        Cancelar
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  eventoInicial: {
    type: Object,
    default: null,
  },
  categorias: {
    type: Array,
    required: true,
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
    default: "Guardar evento",
  },
});

const emit = defineEmits(["guardar"]);

const form = reactive({
  codigo_evento: "",
  titulo: "",
  descripcion: "",
  fecha: "",
  hora_inicio: "",
  hora_fin: "",
  ubicacion: "",
  aforo_maximo: 1,
  estado: "ABIERTO",
  categoria: "",
});

watch(
  () => props.eventoInicial,
  (evento) => {
    if (evento) {
      form.codigo_evento = evento.codigo_evento || "";
      form.titulo = evento.titulo || "";
      form.descripcion = evento.descripcion || "";
      form.fecha = evento.fecha || "";
      form.hora_inicio = evento.hora_inicio?.slice(0, 5) || "";
      form.hora_fin = evento.hora_fin?.slice(0, 5) || "";
      form.ubicacion = evento.ubicacion || "";
      form.aforo_maximo = evento.aforo_maximo || 1;
      form.estado = evento.estado || "ABIERTO";
      form.categoria = evento.categoria?.id || evento.categoria || "";
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
