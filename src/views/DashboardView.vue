<template>
  <div class="container mt-4">

    <h1 class="mb-4">Panel de control</h1>

    <div class="row g-3">

      <div class="col-md-3">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <h5>Total eventos</h5>
            <h2>{{ eventos.length }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <h5>Usuarios registrados</h5>
            <h2>{{ usuarios.length }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <h5>Inscripciones</h5>
            <h2>{{ inscripciones.length }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <h5>Eventos con plazas</h5>
            <h2>{{ eventosConPlazas }}</h2>
          </div>
        </div>
      </div>

    </div>

    <h3 class="mt-5">Próximos eventos</h3>

    <table class="table table-hover mt-3">
      <thead>
        <tr>
          <th>Título</th>
          <th>Fecha</th>
          <th>Plazas</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ev in proximos" :key="ev.id">
          <td>{{ ev.titulo }}</td>
          <td>{{ ev.fecha }}</td>
          <td>{{ plazasDisponibles(ev.id) }}</td>
          <td>
            <router-link :to="`/eventos/${ev.id}`" class="btn btn-primary btn-sm">
              Ver
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script setup>
import { getEvents, getUsers, getInscriptions } from '@/mockData.js';

const eventos = getEvents();
const usuarios = getUsers();
const inscripciones = getInscriptions();

const proximos = eventos.slice(0, 5);

function plazasDisponibles(id) {
  const ev = eventos.find(e => e.id === id);
  const confirmadas = inscripciones.filter(i => i.evento_id === id && i.estado === 'CONFIRMADA').length;
  return ev.aforo_maximo - confirmadas;
}

const eventosConPlazas = eventos.filter(e => plazasDisponibles(e.id) > 0).length;
</script>
