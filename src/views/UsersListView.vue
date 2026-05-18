<template>
  <div class="container mt-4 usuarios-page">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Usuarios</h1>

      <router-link to="/usuarios/crear" class="btn btn-success">
        Crear usuario
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-4">
      Cargando usuarios...
    </div>

    <table v-else class="table usuarios-table table-hover align-middle">
      <thead>
        <tr>
          <th>DNI</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Tipo</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="u in usuarios" :key="u.id">
          <td>{{ u.dni }}</td>
          <td>{{ u.nombre }} {{ u.apellidos }}</td>
          <td>{{ u.email }}</td>
          <td>
            <span class="badge bg-primary">
              {{ u.tipo_usuario }}
            </span>
          </td>
          <td class="text-end">
            <router-link :to="`/usuarios/${u.dni}`" class="btn btn-outline-primary btn-sm">
              Detalle
            </router-link>
          </td>
        </tr>

        <tr v-if="usuarios.length === 0">
          <td colspan="5" class="text-center text-muted py-4">
            No hay usuarios registrados.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUsuariosStore } from '@/stores/usuarios.js';

const usuariosStore = useUsuariosStore();
const { items: usuarios, loading } = storeToRefs(usuariosStore);

onMounted(() => {
  usuariosStore.fetchAll();
});
</script>

<style scoped>
.usuarios-page {
  color: white;
}

.usuarios-table {
  background-color: #111827;
  color: white !important;
}

.usuarios-table th,
.usuarios-table td {
  color: white !important;
  background-color: #111827 !important;
  border-color: #374151 !important;
}

.usuarios-table tbody tr:hover td {
  background-color: #1f2937 !important;
}

.text-muted {
  color: #d1d5db !important;
}
</style>
