<template>
  <div class="container mt-4">

    <h1 class="mb-4">Panel de control</h1>

    <div v-if="loadingEventos || loadingUsuarios || loadingInscripciones" class="text-center py-5">
      Cargando datos...
    </div>

    <div v-else>
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
              <h2>{{ totalInscripciones }}</h2>
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ev in proximos" :key="ev.id">
            <td>{{ ev.titulo }}</td>
            <td>{{ ev.fecha }}</td>
            <td>
              <router-link :to="`/eventos/${ev.id}`" class="btn btn-primary btn-sm">
                Ver
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>

    </div>

  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { storeToRefs } from "pinia";

import { useEventosStore } from "@/stores/eventos.js";
import { useUsuariosStore } from "@/stores/usuarios.js";
import { useInscripcionesStore } from "@/stores/inscripciones.js";

const eventosStore = useEventosStore();
const usuariosStore = useUsuariosStore();
const inscripcionesStore = useInscripcionesStore();

const { items: eventos, loading: loadingEventos } = storeToRefs(eventosStore);
const { items: usuarios, loading: loadingUsuarios } = storeToRefs(usuariosStore);
const { items: inscripciones, loading: loadingInscripciones } = storeToRefs(inscripcionesStore);

onMounted(async () => {
  await eventosStore.fetchAll();
  await usuariosStore.fetchAll();
  // Para dashboard, cargamos inscripciones del primer evento
  if (eventos.value.length > 0) {
    await inscripcionesStore.fetchByEvento(eventos.value[0].id);
  }
});

const totalInscripciones = computed(() => inscripciones.value.length);

const proximos = computed(() => eventos.value.slice(0, 5));
</script>
