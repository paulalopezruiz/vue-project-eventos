<template>
  <div class="container mt-4 inscripciones-page">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Inscripciones</h1>

      <router-link to="/eventos" class="btn btn-outline-secondary">
        Ver eventos
      </router-link>
    </div>

    <div class="card filtros-card mb-4">
      <div class="card-body">
        <h5 class="card-title">Filtros</h5>

        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Estado</label>
            <select v-model="filtroEstado" class="form-select">
              <option value="">Todos</option>
              <option value="CONFIRMADA">Confirmada</option>
              <option value="LISTA_ESPERA">Lista de espera</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label">Asistencia</label>
            <select v-model="filtroAsistencia" class="form-select">
              <option value="">Todas</option>
              <option value="SI">Sí asistió</option>
              <option value="NO">No asistió</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label">Evento</label>
            <select v-model="filtroEvento" class="form-select">
              <option value="">Todos</option>
              <option v-for="ev in eventos" :key="ev.id" :value="ev.titulo">
                {{ ev.titulo }}
              </option>
            </select>
          </div>
        </div>

        <button class="btn btn-outline-light btn-sm mt-3" @click="limpiarFiltros">
          Limpiar filtros
        </button>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card resumen-card">
          <div class="card-body text-center">
            <h6>Total</h6>
            <h2>{{ lista.length }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card resumen-card">
          <div class="card-body text-center">
            <h6>Confirmadas</h6>
            <h2>{{ totalConfirmadas }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card resumen-card">
          <div class="card-body text-center">
            <h6>Lista espera</h6>
            <h2>{{ totalEspera }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card resumen-card">
          <div class="card-body text-center">
            <h6>Asistencias</h6>
            <h2>{{ totalAsistencias }}</h2>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-4">
      Cargando inscripciones...
    </div>

    <InscripcionesGeneralTable
      v-else
      :inscripciones="inscripcionesFiltradas"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

import {
  apiGetEventos,
  apiGetInscripcionesEvento,
} from '@/services/api.js';

import InscripcionesGeneralTable from '@/components/InscripcionesGeneralTable.vue';

const loading = ref(true);
const eventos = ref([]);
const lista = ref([]);

const filtroEstado = ref("");
const filtroAsistencia = ref("");
const filtroEvento = ref("");

onMounted(async () => {
  await cargarInscripciones();
});

async function cargarInscripciones() {
  loading.value = true;

  try {
    eventos.value = await apiGetEventos();

    const acumulado = [];

    for (const ev of eventos.value) {
      const inscripcionesEvento = await apiGetInscripcionesEvento(ev.id);

      for (const ins of inscripcionesEvento) {
        acumulado.push(ins);
      }
    }

    lista.value = acumulado;
  } catch (e) {
    console.error(e);
    alert("No se pudieron cargar las inscripciones.");
  } finally {
    loading.value = false;
  }
}

const inscripcionesFiltradas = computed(() => {
  return lista.value.filter((ins) => {
    const coincideEstado =
      !filtroEstado.value || ins.estado === filtroEstado.value;

    const coincideAsistencia =
      !filtroAsistencia.value ||
      (filtroAsistencia.value === "SI" && ins.confirmacion_asistencia) ||
      (filtroAsistencia.value === "NO" && !ins.confirmacion_asistencia);

    const coincideEvento =
      !filtroEvento.value || ins.evento.titulo === filtroEvento.value;

    return coincideEstado && coincideAsistencia && coincideEvento;
  });
});

const totalConfirmadas = computed(() => {
  return lista.value.filter(ins => ins.estado === "CONFIRMADA").length;
});

const totalEspera = computed(() => {
  return lista.value.filter(ins => ins.estado === "LISTA_ESPERA").length;
});

const totalAsistencias = computed(() => {
  return lista.value.filter(ins => ins.confirmacion_asistencia).length;
});

function limpiarFiltros() {
  filtroEstado.value = "";
  filtroAsistencia.value = "";
  filtroEvento.value = "";
}
</script>

<style scoped>
.inscripciones-page {
  color: white;
}

.filtros-card,
.resumen-card {
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
