<template>
  <table class="table historico-table table-hover mt-3 align-middle">
    <thead>
      <tr>
        <th>Evento</th>
        <th>Fecha del evento</th>
        <th>Fecha inscripción</th>
        <th>Estado inscripción</th>
        <th>Asistencia final</th>
        <th>Categoría</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="ins in historico" :key="ins.id">
        <td>
          <strong>{{ ins.evento.titulo }}</strong>
          <div class="small text-muted">
            {{ ins.evento.ubicacion }}
          </div>
        </td>

        <td>{{ ins.evento.fecha }}</td>
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

        <td>{{ ins.evento.categoria?.nombre }}</td>
      </tr>

      <tr v-if="historico.length === 0">
        <td colspan="6" class="text-center text-muted py-4">
          Este usuario no tiene inscripciones.
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  historico: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.historico-table {
  background-color: #111827;
  color: white !important;
}

.historico-table th,
.historico-table td {
  color: white !important;
  background-color: #111827 !important;
  border-color: #374151 !important;
}

.historico-table tbody tr:hover td {
  background-color: #1f2937 !important;
}

.text-muted {
  color: #d1d5db !important;
}
</style>
