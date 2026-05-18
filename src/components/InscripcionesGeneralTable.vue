<template>
  <table class="table inscripciones-table table-hover align-middle">
    <thead>
      <tr>
        <th>Código</th>
        <th>Usuario</th>
        <th>Evento</th>
        <th>Fecha inscripción</th>
        <th>Estado</th>
        <th>Asistencia</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="ins in inscripciones" :key="ins.id">
        <td>{{ ins.codigo_inscripcion }}</td>

        <td>
          <strong>{{ ins.usuario.nombre }} {{ ins.usuario.apellidos }}</strong>
          <div class="small text-muted">
            {{ ins.usuario.dni }}
          </div>
        </td>

        <td>
          <strong>{{ ins.evento.titulo }}</strong>
          <div class="small text-muted">
            {{ ins.evento.fecha }} · {{ ins.evento.ubicacion }}
          </div>
        </td>

        <td>{{ ins.fecha_inscripcion }}</td>

        <td>
          <span
            class="badge"
            :class="{
              'bg-success': ins.estado === 'CONFIRMADA',
              'bg-warning': ins.estado === 'LISTA_ESPERA',
              'bg-danger': ins.estado === 'CANCELADA'
            }"
          >
            {{ ins.estado }}
          </span>
        </td>

        <td>
          <span
            class="badge"
            :class="ins.confirmacion_asistencia ? 'bg-success' : 'bg-secondary'"
          >
            {{ ins.confirmacion_asistencia ? 'Sí asistió' : 'No asistió' }}
          </span>
        </td>
      </tr>

      <tr v-if="inscripciones.length === 0">
        <td colspan="6" class="text-center text-muted py-4">
          No hay inscripciones que coincidan con los filtros.
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  inscripciones: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.inscripciones-table {
  background-color: #111827;
  color: white !important;
}

.inscripciones-table th,
.inscripciones-table td {
  color: white !important;
  background-color: #111827 !important;
  border-color: #374151 !important;
}

.inscripciones-table tbody tr:hover td {
  background-color: #1f2937 !important;
}

.text-muted {
  color: #d1d5db !important;
}
</style>
