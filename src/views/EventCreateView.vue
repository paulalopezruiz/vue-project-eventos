<template>
  <div class="container mt-4">
    <h1>Crear evento</h1>

    <form class="card shadow-sm p-4 mt-3" @submit.prevent="guardar">
      <div class="row g-3">

        <div class="col-md-4">
          <label class="form-label">Código</label>
          <input v-model="form.codigo_evento" class="form-control" required />
        </div>

        <div class="col-md-8">
          <label class="form-label">Título</label>
          <input v-model="form.titulo" class="form-control" required />
        </div>

        <div class="col-12">
          <label class="form-label">Descripción</label>
          <textarea v-model="form.descripcion" class="form-control" rows="3" required></textarea>
        </div>

        <div class="col-md-4">
          <label class="form-label">Fecha</label>
          <input v-model="form.fecha" type="date" class="form-control" required />
        </div>

        <div class="col-md-4">
          <label class="form-label">Hora inicio</label>
          <input v-model="form.hora_inicio" type="time" class="form-control" required />
        </div>

        <div class="col-md-4">
          <label class="form-label">Hora fin</label>
          <input v-model="form.hora_fin" type="time" class="form-control" required />
        </div>

        <div class="col-md-8">
          <label class="form-label">Ubicación</label>
          <input v-model="form.ubicacion" class="form-control" required />
        </div>

        <div class="col-md-4">
          <label class="form-label">Aforo máximo</label>
          <input v-model.number="form.aforo_maximo" type="number" min="1" class="form-control" required />
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

          <select
            v-model.number="form.categoria"
            class="form-select categoria-select"
            required
          >
            <option disabled value="">Selecciona una categoría</option>

            <option
              v-for="cat in categorias"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.nombre }}
            </option>
          </select>

          <p class="mt-2 small text-muted">
            Categorías cargadas: {{ categorias.length }}
          </p>
        </div>

      </div>

      <p v-if="error" class="text-danger mt-3">{{ error }}</p>

      <div class="mt-4 d-flex gap-2">
        <button class="btn btn-primary" :disabled="loading">
          {{ loading ? "Guardando..." : "Guardar evento" }}
        </button>

        <router-link to="/eventos" class="btn btn-outline-secondary">
          Cancelar
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { apiCreateEvento, apiGetCategorias } from "@/services/api.js";

const router = useRouter();

const categorias = ref([]);
const loading = ref(false);
const error = ref("");

const form = ref({
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

onMounted(async () => {
  const data = await apiGetCategorias();
  console.log("Categorías recibidas:", data);
  categorias.value = data;
});

async function guardar() {
  loading.value = true;
  error.value = "";

  try {
    const nuevoEvento = await apiCreateEvento(form.value);
    router.push(`/eventos/${nuevoEvento.id}`);
  } catch (e) {
    error.value = "No se pudo crear el evento. Revisa los datos.";
    console.error(e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.container {
  color: white;
}

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

.form-control::placeholder {
  color: #666 !important;
}

.categoria-select {
  color: purple !important;
  background-color: white !important;
  border: 2px solid purple !important;
}

.categoria-select option {
  color: purple !important;
  background-color: white !important;
}

.text-muted {
  color: #d1d5db !important;
}
</style>
