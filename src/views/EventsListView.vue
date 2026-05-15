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

        <tr v-if="eventos.length === 0">
          <td colspan="6" class="text-center">
            No hay eventos registrados.
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
import { useAuthStore } from "@/stores/auth.js";

const store = useEventosStore();
const auth = useAuthStore();

const { items: eventos, loading } = storeToRefs(store);

onMounted(() => {
  store.fetchAll();
});
</script>

<style scoped>
.eventos-page {
  color: white;
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
