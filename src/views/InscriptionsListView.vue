<template>
  <div class="container mt-4">

    <h1>Inscripciones</h1>

    <table class="table table-hover mt-3">
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
        <tr v-for="ins in lista" :key="ins.codigo">
          <td>{{ ins.codigo }}</td>
          <td>{{ ins.usuario }}</td>
          <td>{{ ins.evento }}</td>
          <td>{{ ins.fecha_inscripcion }}</td>
          <td>{{ ins.estado }}</td>
          <td>{{ ins.asistencia_confirmada ? 'Sí' : 'No' }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script setup>
import { getUsers, getEvents, getInscriptions } from '@/mockData.js';

const usuarios = getUsers();
const eventos = getEvents();

const lista = getInscriptions().map(ins => {
  const u = usuarios.find(x => x.dni === ins.usuario_dni);
  const e = eventos.find(x => x.id === ins.evento_id);
  return {
    ...ins,
    usuario: u ? `${u.nombre} ${u.apellidos}` : 'Desconocido',
    evento: e ? e.titulo : 'Evento no encontrado',
  };
});
</script>
