<template>
  <div class="container mt-4" v-if="evento">
    <h1>{{ evento.titulo }}</h1>
    <p class="text-muted">{{ evento.descripcion }}</p>

    <div class="row mt-4">
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5>Información</h5>
            <p><strong>Código:</strong> {{ evento.codigo_evento }}</p>
            <p><strong>Fecha:</strong> {{ evento.fecha }}</p>
            <p><strong>Hora:</strong> {{ evento.hora_inicio }} - {{ evento.hora_fin }}</p>
            <p><strong>Ubicación:</strong> {{ evento.ubicacion }}</p>
            <p><strong>Categoría:</strong> {{ evento.categoria?.nombre }}</p>
            <p><strong>Aforo máximo:</strong> {{ evento.aforo_maximo }}</p>
            <p><strong>Estado:</strong> {{ evento.estado }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="mb-0">Inscripciones</h3>
        </div>

        <div v-if="loadingInscripciones" class="text-center py-4">
          Cargando inscripciones...
        </div>

        <table v-else class="table table-hover">
          <thead>
            <tr>
              <th>Código</th>
              <th>Usuario</th>
              <th>Fecha inscripción</th>
              <th>Estado</th>
              <th>Asistencia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ins in inscripciones" :key="ins.id">
              <td>{{ ins.codigo_inscripcion }}</td>
              <td>{{ ins.usuario.nombre }} {{ ins.usuario.apellidos }}</td>
              <td>{{ ins.fecha_inscripcion }}</td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'bg-success': ins.estado === 'CONFIRMADA',
                    'bg-warning': ins.estado === 'ESPERA',
                    'bg-danger': ins.estado === 'CANCELADA'
                  }"
                >
                  {{ ins.estado }}
                </span>
              </td>
              <td>{{ ins.confirmacion_asistencia ? 'Sí' : 'No' }}</td>
            </tr>
            <tr v-if="inscripciones.length === 0">
              <td colspan="5" class="text-center text-muted py-4">
                No hay inscripciones para este evento.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-else class="container mt-4">
    Cargando evento...
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useEventosStore } from '@/stores/eventos.js';
import { useInscripcionesStore } from '@/stores/inscripciones.js';

const route = useRoute();

const eventosStore = useEventosStore();
const inscripcionesStore = useInscripcionesStore();

const { selected: evento, loading: loadingEvento } = storeToRefs(eventosStore);
const { items: inscripciones, loading: loadingInscripciones } = storeToRefs(inscripcionesStore);

onMounted(async () => {
  const id = Number(route.params.id);
  await eventosStore.fetchOne(id);
  await inscripcionesStore.fetchByEvento(id);
});
</script>
