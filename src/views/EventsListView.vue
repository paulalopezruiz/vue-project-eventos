<template>
  <div class="container mt-4">
    <h1>Eventos</h1>

    <div v-if="loading" class="text-center py-5">
      Cargando eventos...
    </div>

    <table v-else class="table table-hover">
      <thead>
        <tr>
          <th>Código</th>
          <th>Título</th>
          <th>Fecha</th>
          <th>Categoría</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="ev in eventos" :key="ev.id">
          <td>{{ ev.codigo_evento }}</td>
          <td>{{ ev.titulo }}</td>
          <td>{{ ev.fecha }}</td>
          <td>{{ ev.categoria?.nombre }}</td>
          <td>{{ ev.estado }}</td>
          <td class="text-end">
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
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useEventosStore } from "@/stores/eventos.js";

const store = useEventosStore();
const { items: eventos, loading } = storeToRefs(store);

onMounted(() => {
  store.fetchAll();
});
</script>
