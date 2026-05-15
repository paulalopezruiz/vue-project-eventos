<template>
  <div class="container mt-4">
    <h1>Editar evento</h1>

    <div v-if="loading" class="text-light">
      Cargando evento...
    </div>

    <form v-else class="card shadow-sm p-4 mt-3" @submit.prevent="guardar">
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
          <select v-model.number="form.categoria" class="form-select" required>
            <option disabled value="">Selecciona una categoría</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
              {{ cat.nombre }}
            </option>
          </select>
        </div>

      </div>

      <p v-if="error" class="text-danger mt-3">{{ error }}</p>

      <div class="mt-4 d-flex gap-2">
        <button class="btn btn-primary" :disabled="saving">
          {{ saving ? "Guardando..." : "Guardar cambios" }}
        </button>

        <router-link :to="`/eventos/${route.params.id}`" class="btn btn-outline-secondary">
          Cancelar
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiGetEvento, apiGetCategorias, apiUpdateEvento } from "@/services/api.js";

const route = useRoute();
const router = useRouter();

const categorias = ref([]);
const loading = ref(true);
const saving = ref(false);
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
  try {
    const id = route.params.id;

    const evento = await apiGetEvento(id);
    categorias.value = await apiGetCategorias();

    form.value = {
      codigo_evento: evento.codigo_evento,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      hora_inicio: evento.hora_inicio?.slice(0, 5),
      hora_fin: evento.hora_fin?.slice(0, 5),
      ubicacion: evento.ubicacion,
      aforo_maximo: evento.aforo_maximo,
      estado: evento.estado,
      categoria: evento.categoria?.id || "",
    };
  } catch (e) {
    error.value = "No se pudo cargar el evento.";
    console.error(e);
  } finally {
    loading.value = false;
  }
});

async function guardar() {
  saving.value = true;
  error.value = "";

  try {
    const eventoActualizado = await apiUpdateEvento(route.params.id, form.value);
    router.push(`/eventos/${eventoActualizado.id}`);
  } catch (e) {
    error.value = "No se pudo actualizar el evento. Revisa los datos.";
    console.error(e);
  } finally {
    saving.value = false;
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

.text-muted {
  color: #d1d5db !important;
}
</style>
