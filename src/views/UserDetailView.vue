<template>
  <div class="container mt-4" v-if="usuario">

    <h1>{{ usuario.nombre }} {{ usuario.apellidos }}</h1>
    <p class="text-muted">{{ usuario.email }} · {{ usuario.telefono }}</p>

    <h3 class="mt-4">Histórico de inscripciones</h3>

    <table class="table table-hover mt-3">
      <thead>
        <tr>
          <th>Evento</th>
          <th>Fecha inscripción</th>
          <th>Estado</th>
          <th>Asistencia</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ins in historico" :key="ins.codigo">
          <td>{{ nombreEvento(ins.evento_id) }}</td>
          <td>{{ ins.fecha_inscripcion }}</td>
          <td>{{ ins.estado }}</td>
          <td>{{ ins.asistencia_confirmada ? 'Sí' : 'No' }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { getUsers, getInscriptions, getEvents } from '@/mockData.js';

const route = useRoute();

const usuario = getUsers().find(u => u.dni === route.params.dni);
const historico = getInscriptions().filter(i => i.usuario_dni === route.params.dni);

function nombreEvento(id) {
  const ev = getEvents().find(e => e.id === id);
  return ev ? ev.titulo : 'Desconocido';
}
</script>
