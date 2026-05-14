<template>
  <div class="container mt-4">
    <h1>Inscripciones</h1>

    <div v-if="loading" class="text-center py-4">
      Cargando inscripciones...
    </div>

    <table v-else class="table table-hover mt-3">
      <thead>
        <tr>
          <th>Código</th>
          <th>Usuario</th>
          <th>Evento</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Asistencia</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ins in lista" :key="ins.id">
          <td>{{ ins.codigo_inscripcion }}</td>
          <td>{{ ins.usuario.nombre }} {{ ins.usuario.apellidos }}</td>
          <td>{{ ins.evento.titulo }}</td>
          <td>{{ ins.fecha_inscripcion }}</td>
          <td>{{ ins.estado }}</td>
          <td>{{ ins.confirmacion_asistencia ? 'Sí' : 'No' }}</td>
        </tr>
        <tr v-if="lista.length === 0">
          <td colspan="6" class="text-center text-muted py-4">
            No hay inscripciones registradas.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiGetEventos, apiGetInscripcionesEvento } from '@/services/api.js';

const loading = ref(true);
const lista = ref([]);

onMounted(async () => {
  loading.value = true;
  const eventos = await apiGetEventos();
  const acumulado = [];

  for (const ev of eventos) {
    const inscripciones = await apiGetInscripcionesEvento(ev.id);
    for (const ins of inscripciones) {
      acumulado.push(ins);
    }
  }

  lista.value = acumulado;
  loading.value = false;
});
</script>
