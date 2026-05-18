<template>
  <div class="container mt-4 eventos-page">

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="text-light">Eventos</h1>

      <router-link
        v-if="auth.userRole === 'ADMIN'"
        to="/eventos/crear"
        class="btn btn-success"
      >
        Crear evento
      </router-link>
    </div>

    <div class="card mb-4 filtros-card">
      <div class="card-body">
        <h5 class="card-title">Filtros</h5>

        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Estado</label>
            <select v-model="filtroEstado" class="form-select">
              <option value="">Todos</option>
              <option value="ABIERTO">Abierto</option>
              <option value="CERRADO">Cerrado</option>
              <option value="CANCELADO">Cancelado</option>
              <option value="FINALIZADO">Finalizado</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label">Categoría</label>
            <select v-model="filtroCategoria" class="form-select">
              <option value="">Todas</option>
              <option
                v-for="cat in categorias"
                :key="cat.id"
                :value="cat.nombre"
              >
                {{ cat.nombre }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label">Fecha</label>
            <input v-model="filtroFecha" type="date" class="form-control" />
          </div>
        </div>

        <button class="btn btn-outline-light btn-sm mt-3" @click="limpiarFiltros">
          Limpiar filtros
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5 text-light">
      Cargando eventos...
    </div>

    <table v-else class="table eventos-table align-middle">
      <thead>
        <tr>
          <th>Código</th>
          <th>Título</th>
          <th>Fecha</th>
          <th>Categoría</th>
          <th>Estado</th>
          <th>Aforo</th>
          <th>Plazas disponibles</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="ev in eventosFiltrados" :key="ev.id">
          <td>{{ ev.codigo_evento }}</td>
          <td>{{ ev.titulo }}</td>
          <td>{{ ev.fecha }}</td>
          <td>{{ ev.categoria?.nombre }}</td>
          <td>
            <span
              class="badge"
              :class="{
                'bg-success': ev.estado === 'ABIERTO',
                'bg-secondary': ev.estado === 'CERRADO',
                'bg-danger': ev.estado === 'CANCELADO',
                'bg-primary': ev.estado === 'FINALIZADO'
              }"
            >
              {{ ev.estado }}
            </span>
          </td>
          <td>{{ ev.aforo_ocupado }} / {{ ev.aforo_maximo }}</td>
          <td>
            <span
              class="badge"
              :class="{
                'bg-danger': ev.plazas_disponibles <= 0,
                'bg-warning': ev.plazas_disponibles > 0 && ev.plazas_disponibles <= 5,
                'bg-success': ev.plazas_disponibles > 5
              }"
            >
              {{ ev.plazas_disponibles }}
            </span>
          </td>
          <td class="text-end">
            <router-link :to="`/eventos/${ev.id}`" class="btn btn-primary btn-sm">
              Ver
            </router-link>
          </td>
        </tr>

        <tr v-if="eventosFiltrados.length === 0">
          <td colspan="8" class="text-center">
            No hay eventos que coincidan con los filtros.
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useEventosStore } from "@/stores/eventos.js";
import { useAuthStore } from "@/stores/auth.js";
import { apiGetCategorias } from "@/services/api.js";

const store = useEventosStore();
const auth = useAuthStore();

const { items: eventos, loading } = storeToRefs(store);

const categorias = ref([]);

const filtroEstado = ref("");
const filtroCategoria = ref("");
const filtroFecha = ref("");

onMounted(async () => {
  await store.fetchAll();
  categorias.value = await apiGetCategorias();
});

const eventosFiltrados = computed(() => {
  return eventos.value.filter((ev) => {
    const coincideEstado =
      !filtroEstado.value || ev.estado === filtroEstado.value;

    const coincideCategoria =
      !filtroCategoria.value || ev.categoria?.nombre === filtroCategoria.value;

    const coincideFecha =
      !filtroFecha.value || ev.fecha === filtroFecha.value;

    return coincideEstado && coincideCategoria && coincideFecha;
  });
});

function limpiarFiltros() {
  filtroEstado.value = "";
  filtroCategoria.value = "";
  filtroFecha.value = "";
}
</script>

<style scoped>
.eventos-page {
  color: white;
}

.filtros-card {
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

.eventos-table {
  background-color: #111827;
  color: white !important;
}

.eventos-table th,
.eventos-table td {
  color: white !important;
  background-color: #111827 !important;
  border-color: #374151 !important;
}

.eventos-table tbody tr:hover td {
  background-color: #1f2937 !important;
}
</style>
