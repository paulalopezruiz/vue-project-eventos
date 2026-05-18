<template>
  <table class="table table-hover">
    <thead>
      <tr>
        <th>Código</th>
        <th>Usuario</th>
        <th>Fecha inscripción</th>
        <th>Estado</th>
        <th>Asistencia</th>
        <th v-if="isAdmin">Acciones</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="ins in inscripciones" :key="ins.id">
        <td>{{ ins.codigo_inscripcion }}</td>
        <td>{{ ins.usuario.nombre }} {{ ins.usuario.apellidos }}</td>
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
            {{ ins.confirmacion_asistencia ? 'Sí' : 'No' }}
          </span>

          <button
            v-if="isAdmin && ins.estado !== 'CANCELADA'"
            class="btn btn-outline-primary btn-sm ms-2"
            @click="emit('cambiar-asistencia', ins)"
          >
            {{ ins.confirmacion_asistencia ? 'Quitar' : 'Marcar' }}
          </button>
        </td>

        <td v-if="isAdmin">
          <button
            v-if="ins.estado !== 'CANCELADA'"
            class="btn btn-outline-danger btn-sm"
            @click="emit('cancelar', ins)"
          >
            Cancelar
          </button>

          <span v-else class="text-muted small">
            Cancelada
          </span>
        </td>
      </tr>

      <tr v-if="inscripciones.length === 0">
        <td colspan="6" class="text-center text-muted py-4">
          No hay inscripciones para este evento.
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
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'cancelar',
  'cambiar-asistencia',
]);
</script>
