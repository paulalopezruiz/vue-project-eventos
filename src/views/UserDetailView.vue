<template>
  <div class="container mt-4" v-if="usuario">
    <h1>{{ usuario.nombre }} {{ usuario.apellidos }}</h1>
    <p class="text-muted">{{ usuario.email }} · {{ usuario.telefono }}</p>

    <h3 class="mt-4">Histórico de inscripciones</h3>

    <div v-if="loading" class="text-center py-4">
      Cargando histórico...
    </div>

    <table v-else class="table table-hover mt-3">
      <thead>
        <tr>
          <th>Evento</th>
          <th>Fecha inscripción</th>
          <th>Estado</th>
          <th>Asistencia</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ins in historico" :key="ins.id">
          <td>{{ ins.evento.titulo }}</td>
          <td>{{ ins.fecha_inscripcion }}</td>
          <td>{{ ins.estado }}</td>
          <td>{{ ins.confirmacion_asistencia ? 'Sí' : 'No' }}</td>
        </tr>
        <tr v-if="historico.length === 0">
          <td colspan="4" class="text-center text-muted py-4">
            Este usuario no tiene inscripciones.
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="container mt-4">
    Cargando usuario...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUsuariosStore } from '@/stores/usuarios.js';
import { apiGetEventos, apiGetInscripcionesEvento } from '@/services/api.js';

const route = useRoute();
const usuariosStore = useUsuariosStore();
const { items: usuarios } = storeToRefs(usuariosStore);

const usuario = ref(null);
const historico = ref([]);
const loading = ref(true);

onMounted(async () => {
  if (usuarios.value.length === 0) {
    await usuariosStore.fetchAll();
  }

  usuario.value = usuarios.value.find(u => u.dni === route.params.dni) || null;

  const eventos = await apiGetEventos();
  const acumulado = [];

  for (const ev of eventos) {
    const inscripciones = await apiGetInscripcionesEvento(ev.id);
    for (const ins of inscripciones) {
      if (ins.usuario.dni === route.params.dni) {
        acumulado.push(ins);
      }
    }
  }

  historico.value = acumulado;
  loading.value = false;
});
</script>
